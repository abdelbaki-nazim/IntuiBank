"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Typography } from "@progress/kendo-react-common";
import { Button } from "@progress/kendo-react-buttons";
import { Loader } from "@progress/kendo-react-indicators";

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function CurrencyDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [currency, setCurrency] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/currencies/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setCurrency(data);
      })
      .catch(() => setError("Error retrieving data"));
  }, [id]);

  if (error) {
    return (
      <div style={{ maxWidth: "768px", margin: "auto", padding: "2rem" }}>
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            borderLeft: "4px solid red",
            backgroundColor: "#fff",
            borderRadius: "8px",
          }}
        >
          <Typography.h5 style={{ color: "red", marginBottom: "1rem" }}>
            Loading Error
          </Typography.h5>
          <Typography.p style={{ color: "#555", marginBottom: "1rem" }}>
            {error}
          </Typography.p>
          <Button
            onClick={() => router.push("/dashboard/ref/currencies")}
            themeColor="primary"
          >
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  if (!currency) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Loader type="converging-spinner" />
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
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "60px",
                color: "#1976d2",
                marginBottom: "1rem",
              }}
            >
              💰
            </div>
            <Typography.h4 style={{ marginBottom: "1rem" }}>
              {currency.name}
            </Typography.h4>
            <span
              style={{
                padding: "4px 8px",
                border: "1px solid",
                borderColor: currency.isActive ? "green" : "red",
                color: currency.isActive ? "green" : "red",
                borderRadius: "16px",
                fontSize: "0.875rem",
              }}
            >
              {currency.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <hr style={{ margin: "1rem 0" }} />

          <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Code: </strong>
              {currency.code}
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Symbol: </strong>
              {currency.symbol || "No symbol provided"}
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Creation Date: </strong>
              {formatDate(currency.createdAt)}
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Last Modified: </strong>
              {formatDate(currency.updatedAt)}
            </li>
          </ul>

          <hr style={{ margin: "1rem 0" }} />

          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
          >
            <Button
              fillMode={"outline"}
              onClick={() => router.push("/dashboard/ref/currencies")}
              themeColor="primary"
            >
              Back
            </Button>
            <Button
              onClick={() =>
                router.push(`/dashboard/ref/currencies/${id}/edit`)
              }
              themeColor="primary"
            >
              Edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
