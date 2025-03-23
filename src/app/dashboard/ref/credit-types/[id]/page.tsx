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
  });
};

export default function CreditTypeDetail() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [creditType, setCreditType] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/credit-types/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setCreditType(data);
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
            onClick={() => router.push("/dashboard/ref/credit-types")}
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

  if (!creditType) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <Typography.p>No credit type found.</Typography.p>
        <Button
          onClick={() => router.push("/dashboard/ref/credit-types")}
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
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                fontSize: "60px",
                color: "#1976d2",
                marginBottom: "1rem",
              }}
            >
              📜
            </div>
            <Typography.h4 style={{ marginBottom: "1rem" }}>
              {creditType.name}
            </Typography.h4>
            <span
              style={{
                display: "inline-block",
                padding: "4px 8px",
                border: "1px solid #1976d2",
                borderRadius: "16px",
                fontSize: "0.875rem",
                color: "#1976d2",
              }}
            >
              Credit Type
            </span>
          </div>

          <hr style={{ margin: "1rem 0" }} />

          <div style={{ marginBottom: "1rem" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: "0.5rem" }}>
                <strong>Name: </strong> {creditType.name}
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                <strong>Description: </strong>
                {creditType.description || "No description provided"}
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                <strong>Creation Date: </strong>{" "}
                {formatDate(creditType.createdAt)}
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                <strong>Last Modified: </strong>{" "}
                {formatDate(creditType.updatedAt)}
              </li>
            </ul>
          </div>

          <hr style={{ margin: "1rem 0" }} />

          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
          >
            <Button
              onClick={() => router.push("/dashboard/ref/credit-types")}
              themeColor="primary"
              fillMode="outline"
            >
              Back
            </Button>
            <Button
              onClick={() =>
                router.push(`/dashboard/ref/credit-types/${id}/edit`)
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
