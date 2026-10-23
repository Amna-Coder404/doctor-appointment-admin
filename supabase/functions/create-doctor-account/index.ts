
import { createClient } from "npm:@supabase/supabase-js@2";

const siteUrl = Deno.env.get("SITE_URL") ?? "http://localhost:5173";

const corsHeaders = {
    "Access-Control-Allow-Origin": siteUrl,
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const respond = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

function errorMessage(error: unknown): string {
    if (error && typeof error === "object") {
        const value = error as Record<string, unknown>;
        return String(value.message ?? value.details ?? value.error ?? "Unknown error");
    }
    return error instanceof Error ? error.message : String(error);
}

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    if (req.method !== "POST") {
        return respond({ error: "Method not allowed." }, 405);
    }

    const url = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!url || !anonKey || !serviceKey) {
        return respond({ error: "Supabase server configuration is incomplete." }, 500);
    }

    const authorization = req.headers.get("Authorization");
    if (!authorization?.startsWith("Bearer ")) {
        return respond({ error: "Please log in as admin again." }, 401);
    }

    const admin = createClient(url, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });

    const callerClient = createClient(url, anonKey, {
        global: { headers: { Authorization: authorization } },
        auth: { autoRefreshToken: false, persistSession: false },
    });

    try {
        const { data: { user: caller }, error: callerError } =
            await callerClient.auth.getUser();

        if (callerError || !caller) {
            return respond({ error: "Your session is invalid. Log in again." }, 401);
        }

        const { data: adminProfile, error: adminProfileError } = await admin
            .from("profiles")
            .select("role")
            .eq("id", caller.id)
            .maybeSingle();

        if (adminProfileError || adminProfile?.role !== "admin") {
            return respond({ error: "Only admins can create doctor accounts." }, 403);
        }

        const body = await req.json();
        const doctor = body?.doctor;

        const fullName = String(doctor?.full_name ?? "").trim();
        const email = String(doctor?.email ?? "").trim().toLowerCase();
        const specialization = String(doctor?.specialization ?? "").trim();

        if (!fullName || !email || !specialization) {
            return respond({
                error: "Name, email, and specialization are required.",
            }, 400);
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return respond({ error: "Enter a valid email address." }, 400);
        }

        const experience = Number(doctor.experience_years ?? 0);
        const fee = Number(doctor.consultation_fee ?? 0);

        if (!Number.isInteger(experience) || experience < 0 ||
            !Number.isFinite(fee) || fee < 0) {
            return respond({ error: "Experience or consultation fee is invalid." }, 400);
        }

        // Look for an Auth user left behind by an earlier failed attempt.
        let authUser = null;
        for (let page = 1; page <= 10; page++) {
            const { data, error } = await admin.auth.admin.listUsers({
                page,
                perPage: 100,
            });
            if (error) throw error;

            authUser = data.users.find(
                (user) => user.email?.toLowerCase() === email
            ) ?? null;

            if (authUser || data.users.length < 100) break;
        }

        let invitationSent = false;

        if (!authUser) {
            const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
                redirectTo: `${siteUrl.replace(/\/$/, "")}/reset-password`,
                data: { full_name: fullName },
            });

            if (error) throw error;
            authUser = data.user;
            invitationSent = true;
        }

        if (!authUser) {
            throw new Error("Supabase did not return the doctor Auth user.");
        }

        const userId = authUser.id;

        // An Auth trigger may already have created this profile.
        const { error: profileUpsertError } = await admin
            .from("profiles")
            .upsert(
                {
                    id: userId,
                    email,
                    full_name: fullName,
                    role: "doctor",
                },
                { onConflict: "id" }
            );

        if (profileUpsertError) throw profileUpsertError;

        const doctorRecord = {
            full_name: fullName,
            specialization,
            qualification: doctor.qualification || null,
            experience_years: experience,
            consultation_fee: fee,
            bio: doctor.bio || null,
            profile_image_url: doctor.profile_image_url || null,
            phone: doctor.phone || null,
            clinic_name: doctor.clinic_name || null,
            clinic_address: doctor.clinic_address || null,
            is_active: true,
            user_id: userId,
        };

        // Make retries safe if a doctor row was created by an earlier attempt.
        const { data: existingDoctor, error: lookupError } = await admin
            .from("doctors")
            .select("id")
            .eq("user_id", userId)
            .maybeSingle();

        if (lookupError) throw lookupError;

        let createdDoctor;
        if (existingDoctor) {
            const { data, error } = await admin
                .from("doctors")
                .update(doctorRecord)
                .eq("id", existingDoctor.id)
                .select("*")
                .single();

            if (error) throw error;
            createdDoctor = data;
        } else {
            const { data, error } = await admin
                .from("doctors")
                .insert(doctorRecord)
                .select("*")
                .single();

            if (error) throw error;
            createdDoctor = data;
        }

        return respond({
            message: invitationSent
                ? "Doctor account created. Invitation email sent."
                : "Doctor record saved for the existing Auth user. No new invitation was sent.",
            doctor: createdDoctor,
            invitationSent,
        });
    } catch (error) {
        // Keep the Auth user: deleting it can invalidate an email already sent.
        console.error("Create doctor account failed:", error);
        return respond({ error: errorMessage(error) }, 400);
    }
});
