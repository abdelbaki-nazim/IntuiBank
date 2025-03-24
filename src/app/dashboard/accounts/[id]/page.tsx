"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@progress/kendo-react-layout";
import { Loader } from "@progress/kendo-react-indicators";
import { Button, Chip } from "@progress/kendo-react-buttons";
import { SvgIcon, Typography } from "@progress/kendo-react-common";
import { PanelBar, PanelBarItem } from "@progress/kendo-react-layout";
import KLoader from "@/app/components/loader/KLoader";
import { hyperlinkOpenIcon } from "@progress/kendo-svg-icons";

interface PersonPhysical {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  maidenName?: string;
}

interface Client {
  id: string;
  type: "PHYSICAL" | "MORAL";
  status: string;
  personMoral: {
    id: string;
    companyName: string;
  } | null;
  personPhysical: PersonPhysical | null;
}

interface AccountPurpose {
  name: string;
}

interface Currency {
  name: string;
}

interface Count {
  creditApplications: number;
  credits: number;
  magneticCards: number;
  cheques: number;
}

interface Account {
  id: string;
  clientId: string;
  accountNumber: string;
  accountDescription: string;
  accountPurposeId: string;
  otherAccountPurposes: string | null;
  openedAt: string;
  chapter: string | null;
  currencyId: string;
  currentBalance: number;
  status: string;
  deletedAt: string | null;
  kycDetails: any;
  kycValidated: boolean;
  observation: string | null;
  createdAt: string;
  updatedAt: string;
  client: Client;
  accountPurpose: AccountPurpose;
  currency: Currency;
  _count: Count;
}

const displayValue = (value: any) =>
  value === null || value === "" ? "N/A" : value;

export default function AccountDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/accounts/${id}`, { next: { revalidate: 0 } })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error loading account.");
        }
        return res.json();
      })
      .then((data) => {
        setAccount(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "An error occurred.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <KLoader />;
  }

  if (error) {
    return (
      <div
        style={{ maxWidth: "600px", margin: "40px auto", textAlign: "center" }}
      >
        <Card style={{ padding: "20px" }}>
          <Typography.h6 style={{ color: "red" }}>{error}</Typography.h6>
          <Button
            fillMode={"outline"}
            onClick={() => router.push(`/dashboard/accounts`)}
            style={{ marginTop: "16px" }}
          >
            Back
          </Button>
        </Card>
      </div>
    );
  }

  if (!account) {
    return (
      <div
        style={{ maxWidth: "600px", margin: "40px auto", textAlign: "center" }}
      >
        <Typography.h6 style={{ color: "red" }}>
          Account not found
        </Typography.h6>
      </div>
    );
  }

  return (
    <div
      style={{ maxWidth: "800px", margin: "40px auto", marginBottom: "64px" }}
    >
      <Card style={{ padding: "20px" }}>
        <Typography.h4 style={{ marginBottom: "20px" }}>
          Account Details
        </Typography.h4>

        <PanelBar>
          <PanelBarItem title="Account Information" expanded={true}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                padding: 12,
              }}
            >
              <div style={{ flex: "1 1 45%" }}>
                <Typography.h6>Account Number:</Typography.h6>
                <Typography.p>
                  {displayValue(account.accountNumber)}
                </Typography.p>
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.h6>Description:</Typography.h6>
                <Typography.p>
                  {displayValue(account.accountDescription)}
                </Typography.p>
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.h6>Account Type:</Typography.h6>
                <Typography.p>
                  {account.accountPurpose?.name
                    ? account.accountPurpose.name
                    : "N/A"}
                </Typography.p>
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.h6>Balance:</Typography.h6>
                <Typography.p>
                  {account.currentBalance
                    ? account.currentBalance.toLocaleString("en-US")
                    : "N/A"}
                </Typography.p>
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.h6>Opened On:</Typography.h6>
                <Typography.p>
                  {account.openedAt
                    ? new Date(account.openedAt).toLocaleDateString()
                    : "N/A"}
                </Typography.p>
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.h6>Status:</Typography.h6>
                {displayValue(account.status)}
              </div>
            </div>
          </PanelBarItem>

          <PanelBarItem title="Financial Information" expanded={true}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                padding: 12,
              }}
            >
              <div>
                <Typography.h6>Currency:</Typography.h6>
                {account.currency?.name ? account.currency.name : "N/A"}
              </div>
              <div>
                <Typography.h6 style={{ marginBottom: "8px" }}>
                  Statistics:
                </Typography.h6>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  <Chip
                    text={`Credit Applications: ${displayValue(
                      account._count.creditApplications
                    )}`}
                    fillMode="outline"
                    themeColor="base"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      router.push("/dashboard/credit-applications")
                    }
                  />
                  <Chip
                    text={`Credits: ${displayValue(account._count.credits)}`}
                    fillMode="outline"
                    themeColor="base"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      router.push("/dashboard/credit-applications")
                    }
                  />
                  <Chip
                    text={`Magnetic Cards: ${displayValue(
                      account._count.magneticCards
                    )}`}
                    fillMode="outline"
                    themeColor="base"
                    style={{ cursor: "pointer" }}
                    onClick={() => router.push("/dashboard/magnetic-cards")}
                  />
                  <Chip
                    text={`Cheques: ${displayValue(account._count.cheques)}`}
                    fillMode="outline"
                    themeColor="base"
                    style={{ cursor: "pointer" }}
                    onClick={() => router.push("/dashboard/cheques")}
                  />
                </div>
              </div>
            </div>
          </PanelBarItem>

          <PanelBarItem title="Client Information" expanded={true}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                padding: 12,
              }}
            >
              <div style={{ flex: "1 1 100%" }}>
                <Typography.h6>Client ID:</Typography.h6>
                <Typography.p>{displayValue(account.client.id)}</Typography.p>
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.h6>Client Type:</Typography.h6>
                <Typography.p>{displayValue(account.client.type)}</Typography.p>
              </div>
              <div style={{ flex: "1 1 100%" }}>
                <Typography.h6>Client Profile:</Typography.h6>
                <Link
                  href={`/dashboard/clients/${account.client.id}/${account.client.type}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: "none",
                    color: "#1976d2",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {account.client.personPhysical
                    ? `${account.client.personPhysical.firstName} ${account.client.personPhysical.lastName}`
                    : account.client.personMoral?.companyName || "N/A"}
                  <SvgIcon icon={hyperlinkOpenIcon} size="medium" />
                </Link>
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.h6>KYC:</Typography.h6>
                {account.kycValidated ? "KYC Verified" : "KYC Not Verified"}
              </div>
              <div style={{ flex: "1 1 100%" }}>
                <Typography.h6>KYC Details:</Typography.h6>
                <Typography.p>
                  {account.kycDetails
                    ? JSON.stringify(account.kycDetails)
                    : "N/A"}
                </Typography.p>
              </div>
            </div>
          </PanelBarItem>

          <PanelBarItem title="Additional Information" expanded={true}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                padding: 12,
              }}
            >
              <div style={{ flex: "1 1 45%" }}>
                <Typography.h6>Other Account Types:</Typography.h6>
                <Typography.p>
                  {displayValue(account.otherAccountPurposes)}
                </Typography.p>
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.h6>Chapter:</Typography.h6>
                <Typography.p>{displayValue(account.chapter)}</Typography.p>
              </div>
              <div style={{ flex: "1 1 100%" }}>
                <Typography.h6>Observations:</Typography.h6>
                <Typography.p>{displayValue(account.observation)}</Typography.p>
              </div>
            </div>
          </PanelBarItem>

          <PanelBarItem title="Dates and History" expanded={true}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                padding: 12,
              }}
            >
              <div style={{ flex: "1 1 30%" }}>
                <Typography.h6>Created On:</Typography.h6>
                <Typography.p>
                  {account.createdAt
                    ? new Date(account.createdAt).toLocaleDateString()
                    : "N/A"}
                </Typography.p>
              </div>
              <div style={{ flex: "1 1 30%" }}>
                <Typography.h6>Updated On:</Typography.h6>
                <Typography.p>
                  {account.updatedAt
                    ? new Date(account.updatedAt).toLocaleDateString()
                    : "N/A"}
                </Typography.p>
              </div>
              <div style={{ flex: "1 1 30%" }}>
                <Typography.h6>Deleted On:</Typography.h6>
                <Typography.p>{displayValue(account.deletedAt)}</Typography.p>
              </div>
            </div>
          </PanelBarItem>
        </PanelBar>

        <div
          style={{
            marginTop: "24px",
            display: "flex",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <Button
            fillMode={"outline"}
            onClick={() => router.push(`/dashboard/accounts`)}
          >
            Back
          </Button>
          <Button
            onClick={() =>
              router.push(`/dashboard/accounts/${account.id}/edit`)
            }
            themeColor="primary"
          >
            Edit
          </Button>
        </div>
      </Card>
    </div>
  );
}
