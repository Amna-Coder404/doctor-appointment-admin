import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./index.css";

import App from "./App";

const theme = createTheme({
    primaryColor: "teal",
    defaultRadius: "md",
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    headings: {
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        fontWeight: "700",
    },
    components: {
        Button: {
            defaultProps: {
                radius: "md",
            },
        },
        Paper: {
            defaultProps: {
                radius: "lg",
            },
        },
        TextInput: {
            defaultProps: {
                size: "md",
            },
        },
        Select: {
            defaultProps: {
                size: "md",
            },
        },
    },
});

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <MantineProvider theme={theme} defaultColorScheme="light">
            <Notifications position="top-right" />
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </MantineProvider>
    </React.StrictMode>
);
