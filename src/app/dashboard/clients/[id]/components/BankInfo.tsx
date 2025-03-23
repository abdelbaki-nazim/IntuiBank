"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@progress/kendo-react-buttons";
import { Badge, BadgeContainer } from "@progress/kendo-react-indicators";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardSubtitle,
} from "@progress/kendo-react-layout";
import { PanelBar, PanelBarItem } from "@progress/kendo-react-layout";
import { Icon, SvgIcon } from "@progress/kendo-react-common";
import {
  pencilIcon,
  kpiStatusHoldIcon,
  clockIcon,
  checkCircleIcon,
  cancelCircleIcon,
} from "@progress/kendo-svg-icons";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

interface BankInfoProps {
  accounts: any[];
  userId: string;
}

export default function BankInfo({ accounts, userId }: BankInfoProps) {
  const router = useRouter();
  return (
    <div style={{ padding: "16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "16px 0",
        }}
      >
        <BadgeContainer>
          <h5 style={{ display: "flex", alignItems: "center" }}>
            <Icon
              name="wallet-solid"
              style={{ marginRight: "8px", color: "#007bff" }}
            />
            Bank Accounts{" "}
          </h5>
          <Badge rounded={"full"} size={"small"} themeColor="error">
            {accounts.length}
          </Badge>
        </BadgeContainer>

        <Button
          themeColor={"tertiary"}
          onClick={() => router.push(`/dashboard/accounts/${userId}/create`)}
        >
          Add Account
        </Button>
      </div>

      {accounts && accounts.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {accounts.map((account: any) => (
            <Card
              key={account.id}
              style={{
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              <CardHeader>
                <div>
                  <CardTitle>
                    {account.accountPurpose?.name || "Bank Account"}
                  </CardTitle>
                  <CardSubtitle>{account.currency?.code}</CardSubtitle>
                </div>
                <div>
                  <Button
                    fillMode="outline"
                    themeColor="primary"
                    onClick={() =>
                      router.push(`/dashboard/accounts/${account.id}/edit`)
                    }
                  >
                    <SvgIcon icon={pencilIcon} />{" "}
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <p>
                  <strong>Account Number:</strong> {account.accountNumber}
                </p>
                <p>
                  <strong>Current Balance:</strong>{" "}
                  {account.currentBalance.toLocaleString("en-US")}
                </p>
                <hr style={{ margin: "16px 0" }} />

                <PanelBar>
                  <PanelBarItem
                    title={
                      <span>
                        Magnetic Card{" "}
                        <Badge
                          rounded={"full"}
                          themeColor="info"
                          style={{ marginLeft: "8px" }}
                        >
                          {account.magneticCards ? 1 : 0}
                        </Badge>
                      </span>
                    }
                  >
                    {account.magneticCards ? (
                      <div style={{ padding: "8px" }}>
                        <p>
                          <strong>Card Number:</strong>{" "}
                          {account.magneticCards.cardNumber}
                        </p>
                        <p>
                          <strong>Cardholder Name:</strong>{" "}
                          {account.magneticCards.cardHolderName ||
                            "Not defined"}
                        </p>
                        <p>
                          <strong>Expiration Date:</strong>{" "}
                          {account.magneticCards.expirationDate
                            ? formatDate(account.magneticCards.expirationDate)
                            : "Not defined"}
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          {account.magneticCards.status}
                        </p>
                        <p>
                          <strong>Card Type:</strong>{" "}
                          {account.magneticCards.cardType?.name ||
                            "Not defined"}
                        </p>
                        <Button
                          fillMode={"flat"}
                          startIcon={<SvgIcon icon={pencilIcon} />}
                          onClick={() =>
                            router.push(
                              `/dashboard/magnetic-cards/${account.magneticCards.id}/edit`
                            )
                          }
                          style={{ marginTop: "8px" }}
                        >
                          Edit
                        </Button>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px",
                        }}
                      >
                        <p>No information available</p>
                        <Button
                          themeColor={"base"}
                          onClick={() =>
                            router.push(
                              `/dashboard/magnetic-cards/${account.id}/create`
                            )
                          }
                        >
                          Create a Card
                        </Button>
                      </div>
                    )}
                  </PanelBarItem>

                  <PanelBarItem
                    title={
                      <span>
                        Checkbook{" "}
                        <Badge
                          rounded={"full"}
                          themeColor="info"
                          style={{ marginLeft: "8px" }}
                        >
                          {account.cheques ? 1 : 0}
                        </Badge>
                      </span>
                    }
                  >
                    {account.cheques ? (
                      <div style={{ padding: "8px" }}>
                        <p>
                          <strong>Cheque Number:</strong>{" "}
                          {account.cheques.chequeNumber}
                        </p>
                        <p>
                          <strong>Issue Date:</strong>{" "}
                          {formatDate(account.cheques.issueDate)}
                        </p>
                        <Button
                          startIcon={<SvgIcon icon={pencilIcon} />}
                          style={{ marginTop: "8px" }}
                          onClick={() =>
                            router.push(
                              `/dashboard/cheques/${account.cheques.id}/edit`
                            )
                          }
                        >
                          Edit
                        </Button>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px",
                        }}
                      >
                        <p>No information available</p>
                        <Button
                          themeColor={"base"}
                          onClick={() =>
                            router.push(
                              `/dashboard/cheques/${account.id}/create`
                            )
                          }
                        >
                          Create Checkbook
                        </Button>
                      </div>
                    )}
                  </PanelBarItem>

                  <PanelBarItem
                    title={
                      <span>
                        Credit Applications{" "}
                        <Badge
                          rounded={"full"}
                          themeColor="info"
                          style={{ marginLeft: "8px" }}
                        >
                          {(account.creditApplications &&
                            account.creditApplications.filter(
                              (app: any) => app.status !== "APPROVED"
                            ).length) ||
                            0}
                        </Badge>
                      </span>
                    }
                  >
                    {account.creditApplications &&
                    account.creditApplications.length > 0 ? (
                      <div style={{ padding: "8px" }}>
                        {account.creditApplications.map((creditApp: any) => {
                          const isApproved = creditApp.status === "APPROVED";
                          let buttonStyle = {};
                          let statusLabel = "";
                          let statusIcon = null;
                          if (isApproved) {
                            buttonStyle = {
                              backgroundColor: "#28a745",
                              color: "#fff",
                            };
                            statusLabel = "Approved";
                            statusIcon = <SvgIcon icon={checkCircleIcon} />;
                          } else if (creditApp.status === "PENDING") {
                            buttonStyle = {
                              backgroundColor: "#ffc107",
                              color: "#fff",
                            };
                            statusLabel = "Pending";
                            statusIcon = <SvgIcon icon={clockIcon} />;
                          } else {
                            buttonStyle = {
                              backgroundColor: "#dc3545",
                              color: "#fff",
                            };
                            statusLabel = "Not Approved";
                            statusIcon = <SvgIcon icon={cancelCircleIcon} />;
                          }

                          return (
                            <Button
                              key={creditApp.id}
                              fillMode={"outline"}
                              style={{ marginBottom: "8px", ...buttonStyle }}
                              startIcon={statusIcon}
                              onClick={() =>
                                router.push(
                                  `/dashboard/credit-applications/${creditApp.id}`
                                )
                              }
                            >
                              {creditApp.creditType} -{" "}
                              {creditApp.creditTypeAbbrev} ({statusLabel})
                            </Button>
                          );
                        })}
                        <hr style={{ margin: "16px 0" }} />
                        <Button
                          themeColor={"base"}
                          onClick={() =>
                            router.push(
                              `/dashboard/credit-applications/${account.id}/create?userId=${userId}`
                            )
                          }
                        >
                          Add Credit Application
                        </Button>
                      </div>
                    ) : (
                      <div style={{ padding: "8px" }}>
                        <Button
                          themeColor={"base"}
                          onClick={() =>
                            router.push(
                              `/dashboard/credit-applications/${account.id}/create?userId=${userId}`
                            )
                          }
                        >
                          Add Credit Application
                        </Button>
                      </div>
                    )}
                  </PanelBarItem>

                  <PanelBarItem
                    title={
                      <span>
                        Credits{" "}
                        <Badge
                          rounded={"full"}
                          themeColor="info"
                          style={{ marginLeft: "8px" }}
                        >
                          {(account.creditApplications &&
                            account.creditApplications.filter(
                              (app: any) => app.status === "APPROVED"
                            ).length) ||
                            0}
                        </Badge>
                      </span>
                    }
                  >
                    {account.creditApplications &&
                    account.creditApplications.length > 0 ? (
                      <div style={{ padding: "8px" }}>
                        {account.creditApplications.map((app: any) =>
                          app.credits ? (
                            <div
                              key={app.credits.id}
                              style={{
                                border: "1px solid #ccc",
                                padding: "8px",
                                marginBottom: "8px",
                                borderRadius: "4px",
                              }}
                            >
                              <h6 style={{ color: "#007bff" }}>
                                Credit #{app.credits.creditNumber}
                              </h6>
                              <hr style={{ marginBottom: "8px" }} />
                              <div style={{ marginLeft: "8px" }}>
                                <p>
                                  <strong>Start Date:</strong>{" "}
                                  {formatDate(app.credits.startDate)}
                                </p>
                                <p>
                                  <strong>End Date:</strong>{" "}
                                  {formatDate(app.credits.endDate)}
                                </p>
                                <p>
                                  <strong>Term:</strong>{" "}
                                  {app.credits.termInMonths} months
                                </p>
                                <p>
                                  <strong>Interest Rate:</strong>{" "}
                                  {app.credits.interestRate}%
                                </p>
                              </div>
                            </div>
                          ) : null
                        )}
                      </div>
                    ) : (
                      <p>No associated credit.</p>
                    )}
                  </PanelBarItem>
                </PanelBar>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <p>No account found.</p>
      )}
    </div>
  );
}
