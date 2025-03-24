"use client";

import React, { useState, useEffect } from "react";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";

const LicenseNotification: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("licenseNotificationDismissed");
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem("licenseNotificationDismissed", "true");
  };

  if (!visible) {
    return null;
  }

  return (
    <NotificationGroup
      style={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100000,
      }}
    >
      <Notification
        type={{ style: "warning", icon: true }}
        closable
        onClose={handleClose}
        style={{ padding: "8px 24px" }}
      >
        As today 24/03, the Kendo license still has 24 days left. Feel free to
        try the free trial—you'll get 1 month!
      </Notification>
    </NotificationGroup>
  );
};

export default LicenseNotification;
