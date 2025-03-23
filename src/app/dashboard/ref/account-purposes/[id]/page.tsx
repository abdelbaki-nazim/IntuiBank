"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Typography } from "@progress/kendo-react-common";
import { Button } from "@progress/kendo-react-buttons";
import KLoader from "@/app/components/loader/KLoader";

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AccountPurposeDetail() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [purpose, setPurpose] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/account-purposes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setPurpose(data);
        }
      })
      .catch(() => setError("Error retrieving data"))
      .finally(() => setLoading(false));
  }, [id]);

  if (error) {
    return (
      <div style={{ maxWidth: "768px", margin: "auto", padding: "2rem" }}>
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            borderLeft: "4px solid red",
            borderRadius: "8px",
            backgroundColor: "#fff",
          }}
        >
          <Typography.h5 style={{ color: "red", marginBottom: "1rem" }}>
            Loading Error
          </Typography.h5>
          <Typography.p style={{ color: "#555", marginBottom: "1rem" }}>
            {error}
          </Typography.p>
          <Button
            onClick={() => router.push("/dashboard/ref/account-purposes")}
            themeColor="primary"
            fillMode="outline"
          >
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <KLoader />;
  }

  if (!purpose) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <Typography.p>No account purpose found.</Typography.p>
        <Button
          onClick={() => router.push("/dashboard/ref/account-purposes")}
          themeColor="primary"
          fillMode="outline"
        >
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "768px", margin: "auto", padding: "2rem" }}>
      <div
        style={{
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          borderTop: "4px solid #1976d2",
          backgroundColor: "#fff",
        }}
      >
        <Stack spacing={3}>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "60px",
                color: "#1976d2",
                marginBottom: "1rem",
              }}
            >
              🏦
            </div>
            <Typography.h4 style={{ marginBottom: "1rem" }}>
              {purpose.name}
            </Typography.h4>
            <Chip
              label={purpose.isActive ? "Active" : "Inactive"}
              color={purpose.isActive ? "success" : "error"}
              variant="outlined"
              style={{ fontSize: "0.875rem" }}
            />
          </div>

          <Divider style={{ margin: "1rem 0" }} />

          <div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: "0.5rem" }}>
                <strong>Description: </strong>{" "}
                {purpose.description || "No description provided"}
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                <strong>Creation Date: </strong> {formatDate(purpose.createdAt)}
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                <strong>Last Modified: </strong> {formatDate(purpose.updatedAt)}
              </li>
            </ul>
          </div>

          <Divider style={{ margin: "1rem 0" }} />

          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
          >
            <Button
              onClick={() => router.push("/dashboard/ref/account-purposes")}
              themeColor="primary"
              fillMode="outline"
            >
              Back
            </Button>
            <Button
              onClick={() =>
                router.push(`/dashboard/ref/account-purposes/${id}/edit`)
              }
              themeColor="primary"
            >
              Edit
            </Button>
          </div>
        </Stack>
      </div>
    </div>
  );
}

function Stack(props: { children: React.ReactNode; spacing: number }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: `${props.spacing * 8}px`,
      }}
    >
      {props.children}
    </div>
  );
}

function Divider(props: { style?: React.CSSProperties }) {
  return (
    <hr style={{ border: 0, borderTop: "1px solid #e0e0e0", ...props.style }} />
  );
}

function Chip(props: {
  label: string;
  color: "success" | "error";
  variant: "outlined";
  style?: React.CSSProperties;
}) {
  const background =
    props.variant === "outlined"
      ? "transparent"
      : props.color === "success"
      ? "#4caf50"
      : "#f44336";
  const borderColor =
    props.variant === "outlined"
      ? props.color === "success"
        ? "#4caf50"
        : "#f44336"
      : "transparent";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 8px",
        border: `1px solid ${borderColor}`,
        borderRadius: "16px",
        fontSize: "0.875rem",
        color: props.color === "success" ? "#4caf50" : "#f44336",
        background: background,
        ...props.style,
      }}
    >
      {props.label}
    </span>
  );
}
