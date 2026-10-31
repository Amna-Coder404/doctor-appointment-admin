
import { useState } from "react";

import {
    Activity,
    CalendarDays,
    Clock3,
    LayoutDashboard,
    LogOut,
    Stethoscope,
} from "lucide-react";

import {
    Avatar,
    Badge,
    Box,
    Burger,
    Button,
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
import { useNotifications } from "../../hooks/useNotifications";

const items = [
    {
        label: "Dashboard",
        to: "/admin/dashboard",
        icon: LayoutDashboard,
        end: true,
    },
    {
        label: "Doctors",
        to: "/admin/doctors",
        icon: Stethoscope,
    },
    {
        label: "Appointments",
        to: "/admin/appointments",
        icon: CalendarDays,
    },
    {
        label: "Doctor availability",
        to: "/admin/availability",
        icon: Clock3,
    },
];

function SidebarContent({
    profile,
    onNavigate,
    onLogout,
    onAppointmentsClick,
    adminUnreadCount = 0,
}) {
    const name = profile?.full_name || "Administrator";

    return (
        <Stack h="100%" gap="lg" p="md">
            <Group gap="sm" px="xs" py="sm">
                <ThemeIcon size={44} radius="lg" color="teal">
                    <Activity size={23} />
                </ThemeIcon>

                <Box>
                    <Text fw={800} size="lg" c="dark">
                        CareUp
                    </Text>
                    <Text size="xs" c="dimmed">
                        Clinic management
                    </Text>
                </Box>
            </Group>

            <Divider />

            <Stack gap={5}>
                <Text
                    size="xs"
                    fw={700}
                    c="dimmed"
                    px="sm"
                    mb={4}
                    tt="uppercase"
                    lts={1}
                >
                    Workspace
                </Text>

                {items.map(({ label, to, icon: Icon, end }) => (
                    <MantineNavLink
                        key={to}
                        component={NavLink}
                        to={to}
                        end={end}
                        label={label}
                        leftSection={<Icon size={18} />}
                        rightSection={
                            label === "Appointments" && adminUnreadCount > 0 ? (
                                <Badge color="red" variant="filled" size="sm" radius="xl">
                                    {adminUnreadCount > 99 ? "99+" : adminUnreadCount}
                                </Badge>
                            ) : null
                        }
                        onClick={() => {
                            if (to === "/admin/appointments") {
                                onAppointmentsClick?.();
                            }

                            onNavigate?.();
                        }}
                        variant="light"
                        color="teal"
                        radius="md"
                    />
                ))}
            </Stack>

            <Box style={{ flex: 1 }} />

            <Divider />

            <Group wrap="nowrap" gap="sm">
                <Avatar src={profile?.avatar_url} color="teal" radius="md">
                    {name.charAt(0).toUpperCase()}
                </Avatar>

                <Box style={{ minWidth: 0, flex: 1 }}>
                    <Text size="sm" fw={700} truncate>
                        {name}
                    </Text>
                    <Badge color="teal" variant="light" size="xs">
                        Administrator
                    </Badge>
                </Box>
            </Group>

            <Button
                variant="light"
                color="red"
                fullWidth
                leftSection={<LogOut size={16} />}
                onClick={onLogout}
            >
                Sign out
            </Button>
        </Stack>
    );
}

export default function AdminLayout({ profile }) {
    const { logout } = useAuth();
    const [opened, setOpened] = useState(false);
    const location = useLocation();

    const {
        unreadCount: adminUnreadCount,
        markAllAsRead: markAdminNotificationsAsRead,
    } = useNotifications(profile?.id, "admin");

    const handleAppointmentsClick = () => {
        markAdminNotificationsAsRead().catch(console.error);
    };

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
                style={{
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    flexShrink: 0,
                }}
            >
                <SidebarContent
                    profile={profile}
                    adminUnreadCount={adminUnreadCount}
                    onAppointmentsClick={handleAppointmentsClick}
                    onLogout={handleLogout}
                />
            </Paper>

            <Drawer
                opened={opened}
                onClose={() => setOpened(false)}
                title="CareUp"
                size={280}
                padding={0}
                hiddenFrom="md"
            >
                <SidebarContent
                    profile={profile}
                    adminUnreadCount={adminUnreadCount}
                    onAppointmentsClick={handleAppointmentsClick}
                    onNavigate={() => setOpened(false)}
                    onLogout={handleLogout}
                />
            </Drawer>

            <Box style={{ minWidth: 0, flex: 1 }}>
                <Paper
                    radius={0}
                    withBorder
                    px={{ base: "md", md: "xl" }}
                    py="sm"
                >
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
                                <Text size="sm" fw={700}>
                                    Clinic administration
                                </Text>
                                <Text size="xs" c="dimmed">
                                    Manage your healthcare workspace
                                </Text>
                            </Box>
                        </Group>

                        <Group gap="sm">
                            <Badge color="teal" variant="light" visibleFrom="sm">
                                Administrator
                            </Badge>

                            <Avatar
                                src={profile?.avatar_url}
                                color="teal"
                                radius="xl"
                                size="sm"
                            >
                                {(profile?.full_name || "A").charAt(0).toUpperCase()}
                            </Avatar>
                        </Group>
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
