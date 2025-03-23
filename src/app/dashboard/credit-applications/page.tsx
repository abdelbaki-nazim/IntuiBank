"use client";
import React, { useEffect, useState, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@progress/kendo-react-layout";
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";
import { SvgIcon, Typography } from "@progress/kendo-react-common";
import { clipboardIcon } from "@progress/kendo-svg-icons";
import { InputChangeEvent } from "@progress/kendo-react-inputs";
import { getFullName } from "../../../../lib/getFullName";
import KLoader from "@/app/components/loader/KLoader";

interface PersonPhysical {
  id: string;
  civility: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  maidenName?: string;
  clientId: string;
}

interface PersonMoral {
  id: string;
  companyName: string;
}

interface Client {
  id: string;
  type: "PHYSICAL" | "MORAL";
  status: string;
  personMoral: PersonMoral | null;
  personPhysical: PersonPhysical | null;
}

interface Account {
  id: string;
  accountNumber: string;
  client: Client;
}

interface CreditApplication {
  id: string;
  creditTypeAbbrev?: string;
  receptionDate?: string;
  approvedDate?: string;
  creditCode?: string;
  solicitedAmount?: number;
  status: string;
  account: Account;
}

const getStatusChip = (status: string) => {
  let color: "success" | "error" | "warning" | "base" = "warning";
  let label = "pending";
  switch (status) {
    case "APPROVED":
      color = "success";
      label = "approved";
      break;
    case "REJECTED":
      color = "error";
      label = "rejected";
      break;
    case "INITIATED":
      color = "warning";
      label = "initiated";
      break;
    case "CANCELED":
      color = "base";
      label = "canceled";
      break;
    default:
      color = "warning";
      label = "pending";
  }
  return (
    <Button
      themeColor={color}
      fillMode="outline"
      disabled
      style={{ textTransform: "lowercase", fontSize: "0.8rem" }}
    >
      {label}
    </Button>
  );
};

export default function CreditApplicationsList() {
  const router = useRouter();
  const [applications, setApplications] = useState<CreditApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/credit-applications", { next: { revalidate: 0 } })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setError(data.message);
        } else {
          setApplications(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching credit applications:", err);
        setError("Error fetching credit applications.");
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (e: InputChangeEvent) => {
    setSearchTerm(e.value);
  };

  const filteredApplications = applications.filter((app) => {
    const client = app.account && app.account.client;
    const clientName = client ? getFullName(client) : "";
    return clientName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <KLoader />;
  }

  return (
    <div style={{ marginTop: "2rem", padding: "1rem" }}>
      <Card
        style={{
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <Typography.h4
            style={{
              textTransform: "lowercase",
              display: "flex",
              alignItems: "center",
            }}
          >
            <SvgIcon icon={clipboardIcon} size="large" />
            credit applications
          </Typography.h4>
          <Input
            placeholder="search by client name"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ maxWidth: "300px" }}
          />
        </div>
        {filteredApplications.length === 0 ? (
          <Typography.p
            style={{ textTransform: "lowercase", textAlign: "center" }}
          >
            no applications match your search.
          </Typography.p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {filteredApplications.map((app) => (
              <Card
                key={app.id}
                style={{
                  padding: "1rem",
                  borderRadius: "8px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography.h5 style={{ textTransform: "lowercase" }}>
                    application {app.creditTypeAbbrev || "-"}
                  </Typography.h5>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Button
                      themeColor="primary"
                      onClick={() =>
                        router.push(`/dashboard/credit-applications/${app.id}`)
                      }
                      style={{ textTransform: "lowercase" }}
                    >
                      details
                    </Button>
                    <Button
                      fillMode="outline"
                      themeColor="primary"
                      onClick={() =>
                        router.push(
                          `/dashboard/credit-applications/${app.id}/edit`
                        )
                      }
                      style={{ textTransform: "lowercase" }}
                    >
                      edit
                    </Button>
                  </div>
                </div>
                <div style={{ marginTop: "0.5rem" }}>
                  <Typography.p style={{ textTransform: "lowercase" }}>
                    <strong>client:</strong>{" "}
                    {app.account && app.account.client ? (
                      <a
                        href={`/dashboard/clients/${app.account.client.id}/${app.account.client.type}`}
                        style={{
                          textDecoration: "none",
                          color: "#1976d2",
                          textTransform: "lowercase",
                        }}
                      >
                        {getFullName(app.account.client)}
                      </a>
                    ) : (
                      "unknown"
                    )}
                  </Typography.p>
                  <Typography.p style={{ textTransform: "lowercase" }}>
                    <strong>request date:</strong>{" "}
                    {app.receptionDate
                      ? new Date(app.receptionDate).toLocaleDateString()
                      : "-"}
                  </Typography.p>
                  {app.approvedDate && (
                    <Typography.p style={{ textTransform: "lowercase" }}>
                      <strong>approved date:</strong>{" "}
                      {new Date(app.approvedDate).toLocaleDateString()}
                    </Typography.p>
                  )}
                  <Typography.p style={{ textTransform: "lowercase" }}>
                    <strong>code:</strong> {app.creditCode || "-"}
                  </Typography.p>
                </div>
                <div
                  style={{
                    marginTop: "0.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography.p style={{ textTransform: "lowercase" }}>
                    <strong>amount:</strong>{" "}
                    {app.solicitedAmount
                      ? app.solicitedAmount.toLocaleString("en-US")
                      : "-"}
                  </Typography.p>
                  {getStatusChip(app.status)}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
      <NotificationGroup
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {error && (
          <Notification type={{ style: "error", icon: true }} closable={false}>
            {error}
          </Notification>
        )}
      </NotificationGroup>
    </div>
  );
}
