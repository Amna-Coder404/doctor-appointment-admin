import { ArrowUpRight } from "lucide-react";
import { Card, Group, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { Link } from "react-router-dom";

export default function ManagementCard({
    icon,
    title,
    description,
    target,
    color = "teal",
}) {
    return (
        <Card
            component={Link}
            to={target}
            withBorder
            radius="lg"
            padding="lg"
            h="100%"
            style={{
                color: "inherit",
                textDecoration: "none",
                transition: "transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease",
            }}
            onMouseEnter={(event) => {
                event.currentTarget.style.transform = "translateY(-3px)";
                event.currentTarget.style.borderColor = "var(--mantine-color-teal-4)";
                event.currentTarget.style.boxShadow = "var(--mantine-shadow-md)";
            }}
            onMouseLeave={(event) => {
                event.currentTarget.style.transform = "none";
                event.currentTarget.style.borderColor = "var(--mantine-color-default-border)";
                event.currentTarget.style.boxShadow = "none";
            }}
        >
            <Stack gap="md" h="100%">
                <Group justify="space-between">
                    <ThemeIcon size={46} radius="md" color={color} variant="light">
                        {icon}
                    </ThemeIcon>
                    <ArrowUpRight size={19} color="var(--mantine-color-dimmed)" />
                </Group>
                <Stack gap={6} style={{ flex: 1 }}>
                    <Title order={4}>{title}</Title>
                    <Text size="sm" c="dimmed" lh={1.6}>{description}</Text>
                </Stack>
                <Text size="sm" fw={700} c="teal">Open section <span aria-hidden="true">→</span></Text>
            </Stack>
        </Card>
    );
}
