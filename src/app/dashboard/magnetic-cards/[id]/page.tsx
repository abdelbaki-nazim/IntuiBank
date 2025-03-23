"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, PanelBar, PanelBarItem } from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import { SvgIcon, Typography } from "@progress/kendo-react-common";
import {
  walletSolidIcon,
  calendarIcon,
  mapMarkerIcon,
  userIcon,
} from "@progress/kendo-svg-icons";
import KLoader from "@/app/components/loader/KLoader";

interface CardType {
  name: string;
}

interface PersonPhysical {
  id: string;
  civility: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  maidenName?: string | null;
  clientId: string;
}

interface PersonMoral {
  companyName: string;
}

interface Client {
  id: string;
  type: "PHYSICAL" | "MORAL";
  personMoral?: PersonMoral | null;
  personPhysical?: PersonPhysical | null;
}

interface Account {
  id: string;
  clientId: string;
  accountNumber: string;
  client: Client;
}

export interface MagneticCard {
  id: string;
  accountId: string;
  cardNumber: string;
  cardHolderName: string;
  cvv: string;
  status: string;
  civility: string;
  requestDate: string;
  issuedAt: string | null;
  deliveryDate: string | null;
  receptionDate: string | null;
  expirationDate: string;
  address: string | null;
  wilaya: string | null;
  commune: string | null;
  postalCode: string | null;
  deliveryMethod: string;
  creationOrRenewal: string;
  pinCodeReceived: string | null;
  pinCodeReceptionDate: string | null;
  pinCodeDeliveryDate: string | null;
  otpCodeReceived: string | null;
  otpCodeReceptionDate: string | null;
  otpCodeDeliveryDate: string | null;
  observation: string | null;
  createdAt: string;
  updatedAt: string;
  cardTypeId: string;
  cardType: CardType;
  account: Account;
}

const formatDate = (dateStr: string | null | undefined): string =>
  dateStr ? new Date(dateStr).toLocaleDateString() : "n/a";

const civilityEnglishNames = (civility: string): string => {
  const map: Record<string, string> = {
    MR: "mr.",
    MRS: "mrs.",
    MS: "ms.",
    MISS: "miss",
    DR: "dr.",
    PROF: "prof.",
    MAITRE: "maître",
  };
  return map[civility] || "";
};

export default function MagneticCardDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [card, setCard] = useState<MagneticCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/magnetic-card/${id}`)
      .then((res) => res.json())
      .then((data: MagneticCard) => {
        setCard(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching card:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <KLoader />;
  }

  if (!card || !card.id) {
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

  return (
    <div style={{ margin: "1rem" }}>
      <Card style={{ padding: "20px" }}>
        <Typography.h4 style={{ textTransform: "lowercase", fontWeight: 600 }}>
          magnetic card details
        </Typography.h4>

        <PanelBar>
          <PanelBarItem
            title={
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  textTransform: "lowercase",
                }}
              >
                <SvgIcon
                  icon={walletSolidIcon}
                  size="medium"
                  style={{ marginRight: 8 }}
                />
                card information
              </span>
            }
            expanded={true}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                padding: 12,
              }}
            >
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  <strong>card number:</strong> {card.cardNumber}
                </Typography.p>
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  <strong>cardholder name:</strong>{" "}
                  {`${civilityEnglishNames(card.civility)} ${
                    card.cardHolderName
                  }`}
                </Typography.p>
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  <strong>cvv:</strong> {card.cvv || "n/a"}
                </Typography.p>
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  <strong>status:</strong> {(card?.status && card.status.toLowerCase() )?? ""}
                </Typography.p>
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  <strong>card type:</strong> {card.cardType?.name || "n/a"}
                </Typography.p>
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  <strong>card id:</strong> {card.id}
                </Typography.p>
              </div>
            </div>
          </PanelBarItem>

          <PanelBarItem
            title={
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  textTransform: "lowercase",
                }}
              >
                <SvgIcon
                  icon={calendarIcon}
                  size="medium"
                  style={{ marginRight: 8 }}
                />
                important dates
              </span>
            }
            expanded={true}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                padding: 12,
              }}
            >
              {[
                { label: "request date", date: card.requestDate },
                { label: "issued date", date: card.issuedAt },
                { label: "delivery date", date: card.deliveryDate },
                { label: "reception date", date: card.receptionDate },
                { label: "expiration date", date: card.expirationDate },
              ].map((item) => (
                <div key={item.label} style={{ flex: "1 1 45%" }}>
                  <Typography.p style={{ textTransform: "lowercase" }}>
                    <strong>{item.label}:</strong> {formatDate(item.date)}
                  </Typography.p>
                </div>
              ))}
            </div>
          </PanelBarItem>

          <PanelBarItem
            title={
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  textTransform: "lowercase",
                }}
              >
                <SvgIcon
                  icon={walletSolidIcon}
                  size="medium"
                  style={{ marginRight: 8 }}
                />
                pin and otp codes
              </span>
            }
            expanded={true}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                padding: 12,
              }}
            >
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  <strong>pin code received:</strong>{" "}
                  {card.pinCodeReceived || "n/a"}
                </Typography.p>
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  <strong>pin reception date:</strong>{" "}
                  {formatDate(card.pinCodeReceptionDate)}
                </Typography.p>
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  <strong>pin delivery date:</strong>{" "}
                  {formatDate(card.pinCodeDeliveryDate)}
                </Typography.p>
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  <strong>otp code received:</strong>{" "}
                  {card.otpCodeReceived || "n/a"}
                </Typography.p>
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  <strong>otp reception date:</strong>{" "}
                  {formatDate(card.otpCodeReceptionDate)}
                </Typography.p>
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  <strong>otp delivery date:</strong>{" "}
                  {formatDate(card.otpCodeDeliveryDate)}
                </Typography.p>
              </div>
            </div>
          </PanelBarItem>

          <PanelBarItem
            title={
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  textTransform: "lowercase",
                }}
              >
                <SvgIcon
                  icon={mapMarkerIcon}
                  size="medium"
                  style={{ marginRight: 8 }}
                />
                address and delivery
              </span>
            }
            expanded={true}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                padding: 12,
              }}
            >
              {[
                { label: "address", value: card.address },
                { label: "wilaya", value: card.wilaya },
                { label: "commune", value: card.commune },
                { label: "postal code", value: card.postalCode },
                { label: "delivery method", value: card.deliveryMethod },
                { label: "creation or renewal", value: card.creationOrRenewal },
              ].map((item) => (
                <div key={item.label} style={{ flex: "1 1 45%" }}>
                  <Typography.p style={{ textTransform: "lowercase" }}>
                    <strong>{item.label}:</strong> {item.value || "n/a"}
                  </Typography.p>
                </div>
              ))}
            </div>
          </PanelBarItem>

          <PanelBarItem
            title={
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  textTransform: "lowercase",
                }}
              >
                <SvgIcon
                  icon={walletSolidIcon}
                  size="medium"
                  style={{ marginRight: 8 }}
                />
                account information
              </span>
            }
            expanded={true}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                padding: 12,
              }}
            >
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  <strong>account id:</strong> {card.account.id}
                </Typography.p>
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  <strong>account number:</strong> {card.account.accountNumber}
                </Typography.p>
              </div>
              <div style={{ flex: "1 1 100%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  <strong>client:</strong>{" "}
                  {card.account.client.personMoral
                    ? card.account.client.personMoral.companyName
                    : card.account.client.personPhysical
                    ? `${card.account.client.personPhysical.firstName} ${card.account.client.personPhysical.lastName}`
                    : "n/a"}
                </Typography.p>
              </div>
            </div>
          </PanelBarItem>

          <PanelBarItem
            title={
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  textTransform: "lowercase",
                }}
              >
                <SvgIcon
                  icon={userIcon}
                  size="medium"
                  style={{ marginRight: 8 }}
                />
                cardholder and observations
              </span>
            }
            expanded={true}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                padding: 12,
              }}
            >
              <div style={{ flex: "1 1 100%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  <strong>account holder:</strong>{" "}
                  {card.account?.client ? (
                    <span
                      style={{
                        textDecoration: "underline",
                        color: "#1976d2",
                        fontWeight: 500,
                        cursor: "pointer",
                        textTransform: "lowercase",
                      }}
                      onClick={() =>
                        router.push(
                          `/dashboard/clients/${card.account.client.id}/${card.account.client.type}`
                        )
                      }
                    >
                      {card.account.client.personMoral
                        ? card.account.client.personMoral.companyName
                        : card.account.client.personPhysical
                        ? `${card.account.client.personPhysical.firstName} ${card.account.client.personPhysical.lastName}`
                        : "unknown user"}
                    </span>
                  ) : (
                    "n/a"
                  )}
                </Typography.p>
              </div>
              <div style={{ flex: "1 1 100%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  <strong>observation:</strong> {card.observation || "none"}
                </Typography.p>
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  <strong>created on:</strong> {formatDate(card.createdAt)}
                </Typography.p>
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  <strong>updated on:</strong> {formatDate(card.updatedAt)}
                </Typography.p>
              </div>
            </div>
          </PanelBarItem>
        </PanelBar>

        <div
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <Button
            fillMode="outline"
            onClick={() => router.push(`/dashboard/magnetic-cards`)}
          >
            back
          </Button>
          <Button
            onClick={() => router.push(`/dashboard/magnetic-cards/${id}/edit`)}
            themeColor="primary"
          >
            edit
          </Button>
        </div>
      </Card>
    </div>
  );
}
