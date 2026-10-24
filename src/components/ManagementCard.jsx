
import React from 'react'
import {
    Badge,
    Card,
    Skeleton,
    ThemeIcon,
} from "@mantine/core";
import { Link } from "react-router-dom";

import {
    Activity,
    CalendarDays,
    Stethoscope,
    Users,
    ArrowUpRight,
    Clock,
} from "lucide-react";
const ManagementCard = ({ icon, title, description, target }) => {
    return (
        <Card
            component={Link}
            to={target}
            className="management-card"
            padding="lg"
            radius="lg"
            withBorder
        >
            <ThemeIcon
                className="management-icon"
                size={46}
                radius="md"
                variant="light"
                color="violet"
            >
                {icon}
            </ThemeIcon>

            <h3>{title}</h3>
            <p>{description}</p>

            <span className="card-link">
                Open section <ArrowUpRight size={16} />
            </span>
        </Card>
    )
}

export default ManagementCard
