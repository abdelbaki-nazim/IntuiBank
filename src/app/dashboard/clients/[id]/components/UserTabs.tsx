"use client";

import React from "react";
import { Button } from "@progress/kendo-react-buttons";

export type Tab = "personal" | "bank" | "other";

interface UserTabsProps {
  selectedTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function UserTabs({ selectedTab, onTabChange }: UserTabsProps) {
  const tabStyle = (isSelected: boolean): React.CSSProperties => ({
    transition: "background-color 0.3s ease, color 0.3s ease",
    backgroundColor: isSelected ? "#1976d2" : "transparent", 
    color: isSelected ? "#fff" : "#000",
    borderRadius: "4px",
    padding: "8px 16px",
    cursor: "pointer",
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "16px",
          borderBottom: "1px solid #ccc",
          paddingBottom: "8px",
          marginBottom: "16px",
        }}
      >
        <Button
          style={tabStyle(selectedTab === "personal")}
          onClick={() => onTabChange("personal")}
        >
          Personal Information
        </Button>
        <Button
          style={tabStyle(selectedTab === "bank")}
          onClick={() => onTabChange("bank")}
        >
          Bank Information
        </Button>
        <Button
          style={tabStyle(selectedTab === "other")}
          onClick={() => onTabChange("other")}
        >
          Forms
        </Button>
      </div>
      <hr style={{ border: "none", borderBottom: "1px solid #ccc" }} />
    </>
  );
}
