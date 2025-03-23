"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
} from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import { Input } from "@progress/kendo-react-inputs";
import {
  Badge,
  BadgeContainer,
  Loader,
} from "@progress/kendo-react-indicators";
import KLoader from "@/app/components/loader/KLoader";

interface Client {
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
}

interface Account {
  id: string;
  clientId: string;
  accountNumber: string;
  accountDescription: string;
  accountPurpose: {
    id: string;
    name: string;
  };
  accountPurposeId: string;
  chapter: string | null;
  cheques: string | null;
  client: Client & {
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  creditApplications: any[];
  credits: any[];
  currency: {
    id: string;
    code: string;
    name: string;
  };
  currencyId: string;
  currentBalance: number;
  kycDetails: string | null;
  kycValidated: boolean;
  magneticCards: string | null;
  observation: string | null;
  openedAt: string;
  otherAccountPurposes: string | null;
  status: string;
}

export default function AccountsDashboardPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetch("/api/accounts", { next: { revalidate: 0 } })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error retrieving accounts");
        }
        return res.json();
      })
      .then((data) => {
        setAccounts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error retrieving accounts");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <KLoader />;
  }

  if (error) {
    return (
      <div style={{ maxWidth: "800px", margin: "auto", marginTop: "32px" }}>
        <div
          style={{
            padding: "32px",
            textAlign: "center",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h4>Oops!</h4>
          <p style={{ color: "red", marginBottom: "16px" }}>{error}</p>
          <p>Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  const getStatusBadgeColor = (
    status: string
  ):
    | "inherit"
    | "base"
    | "success"
    | "error"
    | "primary"
    | "secondary"
    | "tertiary"
    | "info"
    | "warning"
    | "dark"
    | "light"
    | "inverse"
    | null
    | undefined => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "DELETED":
        return "error";
      case "ARCHIVED":
        return "base";
      case "SUSPENDED":
        return "warning";
      default:
        return "base";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Active";
      case "DELETED":
        return "Deleted";
      case "ARCHIVED":
        return "Archived";
      case "SUSPENDED":
        return "Suspended";
      default:
        return status;
    }
  };

  const getFullName = (client: Client) => {
    if (client.type === "PHYSICAL" && client.personPhysical) {
      let name = `${client.personPhysical.lastName || ""} ${
        client.personPhysical.middleName || ""
      } ${client.personPhysical.firstName || ""}`.trim();
      if (
        client.personPhysical.maidenName &&
        client.personPhysical.maidenName !== client.personPhysical.lastName
      ) {
        name += ` (maiden ${client.personPhysical.maidenName})`;
      }
      return name;
    } else if (client.type === "MORAL" && client.personMoral) {
      return client.personMoral.companyName || "";
    }
    return "Unknown User";
  };

  const filteredAccounts = accounts.filter((account) => {
    const query = searchQuery.toLowerCase();
    return (
      account.accountNumber.toLowerCase().includes(query) ||
      getFullName(account.client).toLowerCase().includes(query) ||
      (account.accountPurpose?.name &&
        account.accountPurpose.name.toLowerCase().includes(query)) ||
      (account.currency?.code &&
        account.currency.code.toLowerCase().includes(query))
    );
  });

  return (
    <div style={{ maxWidth: "800px", margin: "auto", marginTop: "32px" }}>
      <div
        style={{
          padding: "32px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h4 style={{ marginBottom: "24px" }}>Bank Accounts</h4>

        <div style={{ marginBottom: "16px" }}>
          <Input
            type="text"
            placeholder="Search for an account..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(String(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ display: "grid", gap: "16px" }}>
          {filteredAccounts.map((account) => (
            <Card key={account.id} style={{ borderRadius: "8px" }}>
              <Badge
                position={"inside"}
                fillMode={"outline"}
                themeColor={getStatusBadgeColor(account.status)}
                style={{
                  padding: "8px 12px",
                }}
              >
                {formatStatus(account.status)}
              </Badge>
              <CardBody>
                <CardTitle>
                  <BadgeContainer>
                    <span
                      style={{
                        textDecoration: "underline",
                        color: "inherit",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        router.push(
                          `/dashboard/clients/${account.client.id}/${account.client.type}`
                        )
                      }
                    >
                      {getFullName(account.client)}
                    </span>

                    <Badge
                      align={{ vertical: "top", horizontal: "end" }}
                      position={"edge"}
                      rounded={"full"}
                      themeColor={account.kycValidated ? "success" : "error"}
                      size={"small"}
                      style={{ padding: "4px", opacity: 0.8 }}
                    >
                      {account.kycValidated
                        ? "KYC Verified"
                        : "KYC Not Verified"}
                    </Badge>
                  </BadgeContainer>
                </CardTitle>
                <CardSubtitle style={{ marginBottom: "8px" }}>
                  {account.accountNumber} - {account.accountPurpose?.name} -{" "}
                  {account.currency?.code}
                </CardSubtitle>
                <div style={{ marginBottom: "8px" }}>
                  <span>
                    Balance: {account.currentBalance.toLocaleString("en-US")}
                  </span>
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <span>
                    Opened on:{" "}
                    {account.openedAt
                      ? new Date(account.openedAt).toLocaleDateString()
                      : "Not provided"}
                  </span>
                </div>
                {account.accountDescription && (
                  <div style={{ marginBottom: "8px" }}>
                    <span>Description: {account.accountDescription}</span>
                  </div>
                )}
                <div
                  style={{
                    marginTop: "16px",
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <Button
                    fillMode="outline"
                    themeColor="primary"
                    onClick={() =>
                      router.push(`/dashboard/accounts/${account.id}/edit`)
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    themeColor="primary"
                    onClick={() =>
                      router.push(`/dashboard/accounts/${account.id}`)
                    }
                  >
                    Details
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
