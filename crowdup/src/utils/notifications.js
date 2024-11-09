import { showNotification } from "@mantine/notifications";
// import { IconCircleCheck, IconCheckCircle, IconX } from "@tabler/icons-react";
import React from "react";

// Show error notification
export function showError(message) {
  showNotification({
    title: "Error",
    message,
    color: "red",
    // icon: React.createElement(IconAlertCircle, { size: 20 }),
    style: {
      border: "2px solid red",
      padding: "12px",
      borderRadius: "8px",
      backgroundColor: "#fff0f0",
    },
    disallowClose: false,
    autoClose: 5000, // Auto close after 5 seconds
  });
}

// Show success notification
export function showSuccess(message) {
  showNotification({
    title: "Success",
    message,
    color: "green",
    // icon: React.createElement(IconCircleCheck, { size: 20 }),
    style: {
      border: "2px solid green",
      padding: "12px",
      borderRadius: "8px",
      backgroundColor: "#e6f9e6",
    },
    disallowClose: false,
    autoClose: 4000, // Auto close after 4 seconds
  });
}

// Show info notification
export function showInfo(message) {
  showNotification({
    title: "Info",
    message,
    color: "blue",
    // icon: React.createElement(IconX, { size: 20 }),
    style: {
      border: "2px solid blue",
      padding: "12px",
      borderRadius: "8px",
      backgroundColor: "#f0f8ff",
    },
    disallowClose: false,
    autoClose: 5000,
  });
}
