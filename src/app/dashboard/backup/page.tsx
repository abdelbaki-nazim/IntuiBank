"use client";

import React, { useState } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { Loader } from "@progress/kendo-react-indicators";
import { Notification } from "@progress/kendo-react-notification";
import { Typography } from "@progress/kendo-react-common";

export default function BackupButton() {
  const [loading, setLoading] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">(
    "success"
  );

  const handleBackup = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/backup", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BACKUP_SECRET}`,
        },
      });
      if (!response.ok) throw new Error("Backup failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "backup.sql";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setNotificationMsg("Backup successful!");
      setNotificationType("success");
    } catch (error) {
      console.error("Backup error", error);
      setNotificationMsg("Backup failed");
      setNotificationType("error");
    } finally {
      setLoading(false);
      setNotificationOpen(true);
    }
  };

  const handleCloseNotification = () => {
    setNotificationOpen(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px", padding: "0 16px" }}>
      <Typography.h4 style={{ marginBottom: "16px" }}>
        Database Backup Download
      </Typography.h4>
      <Typography.p style={{ marginBottom: "16px", color: "#555" }}>
        Click the button below to download a local backup of the database.
        Please note that this backup is saved locally and may not work on
        serverless environments like Vercel.
      </Typography.p>
      <Button
        themeColor= {loading ? "base": "primary"}
        onClick={handleBackup}
        disabled={loading}
        startIcon={loading ? <Loader type="converging-spinner" size="small" /> : null}
      >
        {loading ? "Backup in progress..." : "Backup Database"}
      </Button>
      {notificationOpen && (
        <Notification
          type={{
            style: notificationType === "success" ? "success" : "error",
            icon: true,
          }}
          closable
          onClose={handleCloseNotification}
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {notificationMsg}
        </Notification>
      )}
    </div>
  );
}
