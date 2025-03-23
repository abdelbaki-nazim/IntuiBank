"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import { Input } from "@progress/kendo-react-inputs";
import { Loader } from "@progress/kendo-react-indicators";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";
import { Typography } from "@progress/kendo-react-common";
import Link from "next/link";
import { getFullName } from "../../../../lib/getFullName";
import KLoader from "@/app/components/loader/KLoader";

type ChequesDashboardClientProps = {
  cheques: any[];
  fetchError: string | null;
};

export default function ChequesDashboardClient({
  cheques,
  fetchError,
}: ChequesDashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const filteredCheques = Array.isArray(cheques)
    ? cheques.filter((cheque) => {
        if (typeof cheque.chequeNumber !== "string") return false;
        return cheque.chequeNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      })
    : [];

  if (loading) {
    return <KLoader />;
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <Card style={{ padding: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <Typography.h4 style={{ textTransform: "lowercase" }}>
            cheques
          </Typography.h4>
          <Input
            placeholder="search by cheque number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(String(e.target.value))}
            style={{ maxWidth: "300px" }}
          />
        </div>
        {filteredCheques.length === 0 ? (
          <Typography.p
            style={{ textTransform: "lowercase", textAlign: "center" }}
          >
            no cheques to display.
          </Typography.p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {filteredCheques.map((cheque) => (
              <Card
                key={cheque.id}
                style={{
                  width: "100%",
                  padding: "1rem",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  borderRadius: "8px",
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
                    cheque: {cheque.chequeNumber}
                  </Typography.h5>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Button
                      fillMode="outline"
                      onClick={() =>
                        router.push(`/dashboard/cheques/${cheque.id}/edit`)
                      }
                      size="small"
                    >
                      edit
                    </Button>
                    <Button
                      themeColor="primary"
                      onClick={() =>
                        router.push(`/dashboard/cheques/${cheque.id}`)
                      }
                      size="small"
                    >
                      details
                    </Button>
                  </div>
                </div>
                <div style={{ marginTop: "0.5rem" }}>
                  <Typography.p style={{ textTransform: "lowercase" }}>
                    account: {cheque.account?.accountNumber || "n/a"}
                  </Typography.p>
                  <Typography.p style={{ textTransform: "lowercase" }}>
                    client:{" "}
                    <Link
                      href={`/dashboard/clients/${cheque.account?.client?.id}/${cheque.account?.client?.type}`}
                      style={{ textDecoration: "none", color: "#1976d2" }}
                    >
                      {getFullName(cheque.account?.client)}
                    </Link>
                  </Typography.p>
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
        {fetchError && (
          <Notification type={{ style: "error", icon: true }} closable={true}>
            {fetchError}
          </Notification>
        )}
      </NotificationGroup>
    </div>
  );
}
