"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@progress/kendo-react-layout";
import { Input } from "@progress/kendo-react-inputs";
import { Button, Chip } from "@progress/kendo-react-buttons";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";
import { Typography } from "@progress/kendo-react-common";
import MagneticCardStatsChart from "./MagneticCardStatsChart";
import { getFullName } from "../../../../lib/getFullName";
import KLoader from "@/app/components/loader/KLoader";

export interface MagneticCard {
  id: string;
  civility: string;
  status: string;
  cardNumber: string;
  cardHolderName: string;
  observation?: string;
  cardType: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
  account: {
    client: {
      id: string;
      type: "PHYSICAL" | "MORAL";
      status: string;
      personMoral: {
        id: string;
        companyName: string;
      } | null;
      personPhysical: {
        id: string;
        firstName: string;
        lastName: string;
        middleName?: string;
        maidenName?: string;
      } | null;
    };
  };
}

function getChipProps(status: string): {
  label: string;
  color: "error" | "info" | "success" | "warning" | "base";
} {
  switch (status) {
    case "ACTIVE":
      return { label: "active", color: "success" };
    case "INACTIVE":
      return { label: "inactive", color: "base" };
    case "BLOCKED":
      return { label: "blocked", color: "error" };
    case "EXPIRED":
      return { label: "expired", color: "warning" };
    case "LOST":
      return { label: "lost", color: "warning" };
    case "STOLEN":
      return { label: "stolen", color: "error" };
    case "PENDING":
      return { label: "pending", color: "info" };
    default:
      return { label: status.toLowerCase(), color: "base" };
  }
}

function civilityEnglishNames(civility: string): string {
  const civilityMap: Record<string, string> = {
    MR: "mr.",
    MRS: "mrs.",
    MS: "ms.",
    MISS: "miss",
    DR: "dr.",
    PROF: "prof.",
    MAITRE: "maître",
  };

  return civilityMap[civility] || "";
}

export default function MagneticCardsDashboardPage() {
  const [cards, setCards] = useState<MagneticCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/magnetic-card", { next: { revalidate: 0 } })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Magnetic cards not found");
          } else {
            throw new Error(`Error fetching magnetic cards: ${res.status}`);
          }
        }
        return res.json();
      })
      .then((data) => {
        setCards(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <KLoader />;
  }

  if (error) {
    return (
      <div style={{ marginTop: "16px" }}>
        <NotificationGroup
          style={{
            position: "relative",
            margin: "0 auto",
            width: "100%",
            textAlign: "center",
          }}
        >
          <Notification type={{ style: "error", icon: true }}>
            {error}
          </Notification>
        </NotificationGroup>
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div style={{ margin: "16px", textAlign: "center" }}>
        <Typography.h5 style={{ textTransform: "lowercase" }}>
          Card not found.
        </Typography.h5>
        <Button
          themeColor="primary"
          onClick={() => router.push("/dashboard/magnetic-cards")}
        >
          Back to List
        </Button>
      </div>
    );
  }

  const filteredCards =
    Array.isArray(cards) && cards.length > 0
      ? cards.filter((card) => {
          const lowerSearch = searchQuery.toLowerCase();
          const cardNumberMatch = card.cardNumber
            .toLowerCase()
            .includes(lowerSearch);
          const cardHolderMatch =
            card.cardHolderName?.toLowerCase().includes(lowerSearch) || false;
          const accountHolder = card.account?.client
            ? getFullName(card.account.client)
            : "";
          const accountHolderMatch = accountHolder
            .toLowerCase()
            .includes(lowerSearch);
          return cardNumberMatch || cardHolderMatch || accountHolderMatch;
        })
      : [];

  return (
    <div style={{ margin: "16px" }}>
      <Card style={{ padding: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Typography.h4
            style={{ textTransform: "lowercase", fontWeight: 600 }}
          >
            magnetic cards
          </Typography.h4>
          <Input
            placeholder="search by card number, cardholder or account"
            value={searchQuery}
            onChange={(e) => setSearchQuery(String(e.target.value))}
            style={{ width: "300px" }}
          />
        </div>
        <MagneticCardStatsChart />
        <Typography.h6 style={{ textTransform: "lowercase", margin: "16px 0" }}>
          magnetic cards list
        </Typography.h6>
        {filteredCards.length === 0 ? (
          <Typography.p
            style={{ textTransform: "lowercase", textAlign: "center" }}
          >
            no cards to display.
          </Typography.p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {filteredCards.map((card: MagneticCard) => (
              <Card
                key={card.id}
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  borderRadius: "8px",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <Typography.h5 style={{ textTransform: "lowercase" }}>
                    n° {card.cardNumber}
                  </Typography.h5>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Chip
                      text={getChipProps(card.status).label}
                      themeColor={getChipProps(card.status).color}
                      size="small"
                      style={{ textTransform: "lowercase" }}
                      disabled
                    />
                    <Chip
                      text={
                        card.cardType?.name
                          ? card.cardType.name.toLowerCase()
                          : "n/a"
                      }
                      fillMode="outline"
                      themeColor="info"
                      size="small"
                      disabled
                    />
                  </div>
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <Typography.p style={{ textTransform: "lowercase" }}>
                    <strong>cardholder name:</strong>{" "}
                    {`${civilityEnglishNames(card.civility)} ${
                      card.cardHolderName || "n/a"
                    }`}
                  </Typography.p>
                  <Typography.p style={{ textTransform: "lowercase" }}>
                    <strong>observation:</strong>{" "}
                    {card.observation ? card.observation : "none"}
                  </Typography.p>
                  <Typography.p style={{ textTransform: "lowercase" }}>
                    <strong>account holder:</strong>{" "}
                    {card.account?.client ? (
                      <span
                        style={{
                          textDecoration: "underline",
                          color: "#1976d2",
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          router.push(
                            `/dashboard/clients/${card.account.client.id}/${card.account.client.type}`
                          )
                        }
                      >
                        {getFullName(card.account.client) || "unknown user"}
                      </span>
                    ) : (
                      "n/a"
                    )}
                  </Typography.p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    fillMode="outline"
                    size="small"
                    onClick={() =>
                      router.push(`/dashboard/magnetic-cards/${card.id}/edit`)
                    }
                  >
                    edit
                  </Button>
                  <Button
                    size="small"
                    themeColor="primary"
                    onClick={() =>
                      router.push(`/dashboard/magnetic-cards/${card.id}`)
                    }
                  >
                    details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
