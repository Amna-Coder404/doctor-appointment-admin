
import { Group, Stack, Text, Title } from "@mantine/core";

export default function PageHeader({
    title,
    subtitle,
    action,
    eyebrow,
}) {
    return (
        <Group
            justify="space-between"
            align="center"
            gap="md"
            mb="xl"
        >
            <Stack gap={4}>
                {eyebrow && (
                    <Text
                        size="xs"
                        fw={700}
                        tt="uppercase"
                        c="teal"
                        lts={1}
                    >
                        {eyebrow}
                    </Text>
                )}

                <Title order={1} size="h2">
                    {title}
                </Title>

                {subtitle && (
                    <Text size="sm" c="dimmed">
                        {subtitle}
                    </Text>
                )}
            </Stack>

            {action}
        </Group>
    );
}
