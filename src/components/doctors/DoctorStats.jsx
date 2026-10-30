import { SimpleGrid } from "@mantine/core";
import { Stethoscope, UserCheck, UserX } from "lucide-react";
import StatCard from "../ui/StatCard";

export default function DoctorStats({ doctors = [] }) {
    const active = doctors.filter((doctor) => doctor.is_active).length;
    const inactive = doctors.length - active;

    return (
        <SimpleGrid cols={{ base: 1, xs: 3 }} spacing="md">
            <StatCard title="Total doctors" value={doctors.length} icon={<Stethoscope size={21} />} description="Registered profiles" />
            <StatCard title="Active doctors" value={active} icon={<UserCheck size={21} />} color="teal" description="Can receive bookings" />
            <StatCard title="Inactive doctors" value={inactive} icon={<UserX size={21} />} color="orange" description="Not accepting bookings" />
        </SimpleGrid>
    );
}
