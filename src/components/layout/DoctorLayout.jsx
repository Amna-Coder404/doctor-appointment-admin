import { useState } from "react";
import {
    Activity,
    CalendarDays,
    Clock3,
    LogOut,
    Stethoscope,
} from "lucide-react";
import {
    Avatar,
    Badge,
    Button,
    Box,
    Burger,
    Divider,
    Drawer,
    Group,
    NavLink as MantineNavLink,
    Paper,
    Stack,
    Text,
    ThemeIcon,
} from "@mantine/core";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const items = [
    { label: "Dashboard", description: "Overview and profile", to: "/doctor/dashboard", icon: Activity, end: true },
    { label: "Appointments", description: "Patient bookings", to: "/doctor/appointments", icon: CalendarDays },
    { label: "My availability", description: "Working hours and leave", to: "/doctor/availability", icon: Clock3 },
];

function DoctorSidebar({ profile, onNavigate, onLogout }) {
    const doctor = profile?.doctor;
    const name = doctor?.full_name || profile?.full_name || "Doctor";
    const avatar = doctor?.profile_image_url || profile?.avatar_url || null;

    return (
        <Stack h="100%" gap="lg" p="md">
            <Group gap="sm" px="xs" py="sm">
                <ThemeIcon size={44} radius="lg" color="teal">
                    <Stethoscope size={23} />
                </ThemeIcon>
                <Box>
                    <Text fw={800} size="lg" c="dark">MediBook</Text>
                    <Text size="xs" c="dimmed">Doctor workspace</Text>
                </Box>
            </Group>
            <Divider />
            <Stack gap={5}>
                <Text size="xs" fw={700} c="dimmed" px="sm" mb={4} tt="uppercase" lts={1}>
                    Workspace
                </Text>
                {items.map(({ label, description, to, icon: Icon, end }) => (
                    <MantineNavLink
                        key={to}
                        component={NavLink}
                        to={to}
                        end={end}
                        label={label}
                        description={description}
                        leftSection={<Icon size={18} />}
                        onClick={onNavigate}
                        variant="light"
                        color="teal"
                        radius="md"
                    />
                ))}
            </Stack>
            <Box style={{ flex: 1 }} />
            <Divider />
            <Group wrap="nowrap" gap="sm">
                <Avatar src={avatar} color="teal" radius="md">
                    {name.charAt(0).toUpperCase()}
                </Avatar>
                <Box style={{ minWidth: 0, flex: 1 }}>
                    <Text size="sm" fw={700} truncate>{name}</Text>
                    <Text size="xs" c="dimmed" truncate>{doctor?.specialization || "Doctor"}</Text>
                </Box>
                <Badge color="teal" variant="light" size="xs">Doctor</Badge>
            </Group>
            <Button variant="light" color="red" fullWidth leftSection={<LogOut size={16} />} onClick={onLogout}>
                Sign out
            </Button>
        </Stack>
    );
}

export default function DoctorLayout({ profile }) {
    const { logout } = useAuth();
    const [opened, setOpened] = useState(false);
    const location = useLocation();

    const handleLogout = async () => {
        setOpened(false);
        await logout();
    };

    return (
        <Box mih="100vh" bg="#f6f8fa" style={{ display: "flex" }}>
            <Paper
                visibleFrom="md"
                w={264}
                radius={0}
                withBorder
                style={{ position: "sticky", top: 0, height: "100vh", flexShrink: 0 }}
            >
                <DoctorSidebar profile={profile} onLogout={handleLogout} />
            </Paper>

            <Drawer
                opened={opened}
                onClose={() => setOpened(false)}
                title="MediBook"
                size={280}
                padding={0}
                hiddenFrom="md"
            >
                <DoctorSidebar
                    profile={profile}
                    onNavigate={() => setOpened(false)}
                    onLogout={handleLogout}
                />
            </Drawer>

            <Box style={{ minWidth: 0, flex: 1 }}>
                <Paper radius={0} withBorder px={{ base: "md", md: "xl" }} py="sm">
                    <Group justify="space-between">
                        <Group gap="sm">
                            <Burger
                                hiddenFrom="md"
                                opened={opened}
                                onClick={() => setOpened((value) => !value)}
                                size="sm"
                                aria-label="Open navigation"
                            />
                            <Box>
                                <Text size="sm" fw={700}>Doctor workspace</Text>
                                <Text size="xs" c="dimmed">Appointments and clinic schedule</Text>
                            </Box>
                        </Group>
                        <Avatar
                            src={profile?.doctor?.profile_image_url || profile?.avatar_url}
                            color="teal"
                            radius="xl"
                            size="sm"
                        >
                            {(profile?.full_name || "D").charAt(0).toUpperCase()}
                        </Avatar>
                    </Group>
                </Paper>

                <Box
                    component="main"
                    key={location.pathname}
                    maw={1480}
                    mx="auto"
                    p={{ base: "md", sm: "xl", lg: 28 }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
