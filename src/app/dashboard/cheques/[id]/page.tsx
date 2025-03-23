"use client";
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, PanelBar, PanelBarItem } from "@progress/kendo-react-layout";
import { Loader } from "@progress/kendo-react-indicators";
import { Button } from "@progress/kendo-react-buttons";
import { SvgIcon, Typography } from "@progress/kendo-react-common";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";
import {
  walletSolidIcon,
  calendarIcon,
  userIcon,
} from "@progress/kendo-svg-icons";
import { getFullName } from "../../../../../lib/getFullName";
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

export interface Cheque {
  id: string;
  accountId: string;
  chequeNumber: string;
  requestDate: string;
  issuedAt: string | null;
  deliveryDate: string | null;
  receptionDate: string | null;
  expirationDate: string | null;
  observation: string | null;
  createdAt: string;
  updatedAt: string;
  account: Account;
}

const formatDate = (dateStr: string | null | undefined): string =>
  dateStr ? new Date(dateStr).toLocaleDateString() : "N/A";

export default function ChequeDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [cheque, setCheque] = useState<Cheque | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/cheques/${id}`)
      .then((res) => res.json())
      .then((data: Cheque) => {
        setCheque(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cheque:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <KLoader />;
  }

  if (!cheque) {
    return (
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <Typography.h6>cheque not found</Typography.h6>
      </div>
    );
  }

  return (
    <div style={{ margin: "1rem" }}>
      <Card style={{ padding: "20px" }}>
        <Typography.h4 style={{ marginBottom: "1rem" }}>
          cheque details
        </Typography.h4>

        <PanelBar>
          <PanelBarItem
            title={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <SvgIcon icon={walletSolidIcon} size="medium" />
                <Typography.h6 style={{ margin: 0 }}>
                  cheque information
                </Typography.h6>
              </div>
            }
            expanded={true}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                padding: 12,
              }}
            >
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p>
                  <strong>cheque number:</strong> {cheque.chequeNumber}
                </Typography.p>
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p>
                  <strong>cheque id:</strong> {cheque.id}
                </Typography.p>
              </div>
            </div>
          </PanelBarItem>

          <PanelBarItem
            title={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <SvgIcon icon={calendarIcon} size="medium" />
                <Typography.h6 style={{ margin: 0 }}>
                  important dates
                </Typography.h6>
              </div>
            }
            expanded={true}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                padding: 12,
              }}
            >
              {[
                { label: "request date", date: cheque.requestDate },
                { label: "issued date", date: cheque.issuedAt },
                { label: "delivery date", date: cheque.deliveryDate },
                { label: "reception date", date: cheque.receptionDate },
                { label: "expiration date", date: cheque.expirationDate },
                { label: "created on", date: cheque.createdAt },
                { label: "updated on", date: cheque.updatedAt },
              ].map((item) => (
                <div key={item.label} style={{ flex: "1 1 45%" }}>
                  <Typography.p>
                    <strong>{item.label}:</strong> {formatDate(item.date)}
                  </Typography.p>
                </div>
              ))}
            </div>
          </PanelBarItem>

          <PanelBarItem
            title={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <SvgIcon icon={userIcon} size="medium" />
                <Typography.h6 style={{ margin: 0 }}>
                  account information
                </Typography.h6>
              </div>
            }
            expanded={true}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                padding: 12,
              }}
            >
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p>
                  <strong>account number:</strong>{" "}
                  {cheque.account.accountNumber}
                </Typography.p>
              </div>
              <div style={{ flex: "1 1 100%" }}>
                <Typography.p>
                  <strong>client:</strong>{" "}
                  <a
                    href={`/dashboard/clients/${cheque.account.client.id}/${cheque.account.client.type}`}
                    style={{ textDecoration: "none", color: "#1976d2" }}
                  >
                    {cheque.account.client.personMoral
                      ? cheque.account.client.personMoral.companyName
                      : cheque.account.client.personPhysical
                      ? getFullName(cheque.account.client)
                      : "n/a"}
                  </a>
                </Typography.p>
              </div>
            </div>
          </PanelBarItem>

          <PanelBarItem
            title={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Typography.h6 style={{ margin: 0 }}>
                  observations
                </Typography.h6>
              </div>
            }
            expanded={true}
          >
            <div
              style={{
                padding: 12,
              }}
            >
              <Typography.p>
                {cheque.observation || "no observations"}
              </Typography.p>
            </div>
          </PanelBarItem>
        </PanelBar>

        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <Button
            fillMode="outline"
            onClick={() => router.push(`/dashboard/cheques`)}
            size="small"
          >
            back
          </Button>
          <Button
            onClick={() => router.push(`/dashboard/cheques/${cheque.id}/edit`)}
            themeColor="primary"
            size="small"
          >
            edit
          </Button>
        </div>
      </Card>
      <NotificationGroup
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {/* I will set it after */}
      </NotificationGroup>
    </div>
  );
}
