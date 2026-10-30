
import {
    Card as MantineCard,
    Group,
    Skeleton,
    Stack,
    Text,
    ThemeIcon,
} from "@mantine/core";
import { ArrowUpRight } from "lucide-react";

export default function StatCard({
    title,
    value,
    icon,
    color = "teal",
    description = "Live data from Supabase",
    loading = false,
}) {
    return (
        <MantineCard padding="lg" radius="lg" withBorder>
            <Stack gap="md">
                <Group justify="space-between" align="center">
                    <Text size="sm" c="dimmed" fw={600}>
                        {title}
                    </Text>

                    {icon && (
                        <ThemeIcon
                            size={46}
                            radius="md"
                            variant="light"
                            color={color}
                        >
                            {icon}
                        </ThemeIcon>
                    )}
                </Group>

                {loading ? (
                    <Skeleton height={32} width={70} />
                ) : (
                    <Text size="2rem" fw={700} lh={1}>
                        {value ?? 0}
                    </Text>
                )}

                <Group gap={5}>
                    <Text size="xs" c="dimmed">
                        {description}
                    </Text>
                    <ArrowUpRight size={14} color="gray" />
                </Group>
            </Stack>
        </MantineCard>
    );
}
