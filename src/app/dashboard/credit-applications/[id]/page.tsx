"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, PanelBar, PanelBarItem } from "@progress/kendo-react-layout";
import { Loader } from "@progress/kendo-react-indicators";
import { Button } from "@progress/kendo-react-buttons";
import {
  NotificationGroup,
  Notification,
} from "@progress/kendo-react-notification";
import { Typography } from "@progress/kendo-react-common";
import { format } from "date-fns";
import { CreditApplication } from "../../../../../types/models";
import { MessageCard } from "@/app/components/messagecard/MessageCard";
import KLoader from "@/app/components/loader/KLoader";

const FieldCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div
    style={{
      border: "1px solid #eee",
      borderRadius: "4px",
      padding: "8px",
      minWidth: "180px",
      backgroundColor: "#fff",
    }}
  >
    <Typography.p
      style={{ textTransform: "lowercase", fontSize: "0.75rem", color: "#555" }}
    >
      {label.toLowerCase()}
    </Typography.p>
    <Typography.p style={{ marginTop: "0.5rem", textTransform: "lowercase" }}>
      {value}
    </Typography.p>
  </div>
);

export default function CreditApplicationDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [application, setApplication] = useState<CreditApplication | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("info");

  const [actionLoading, setActionLoading] = useState(false);
  const [initiateLoading, setInitiateLoading] = useState(false);

  const openSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/credit-applications/${id}/reject`, {
        method: "POST",
      });
      if (res.ok) {
        openSnackbar("Application rejected", "success");
        router.push("/dashboard/credit-applications");
      } else {
        openSnackbar("Error rejecting application", "error");
      }
    } catch (err: any) {
      openSnackbar("Error rejecting application", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const initiate = async () => {
    setInitiateLoading(true);
    try {
      const res = await fetch(`/api/credit-applications/${id}/initiate`, {
        method: "POST",
      });
      if (res.ok) {
        openSnackbar("Initiation in progress...", "success");
        router.push(`/dashboard/credit-applications/${id}/approval`);
      } else {
        openSnackbar("Error initiating application", "error");
      }
    } catch (err: any) {
      openSnackbar("Error initiating application", "error");
    } finally {
      setInitiateLoading(false);
    }
  };

  useEffect(() => {
    fetch(`/api/credit-applications/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error retrieving credit application");
        return res.json();
      })
      .then((data) => {
        setApplication(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error retrieving data");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <KLoader />;
  }

  if (error) {
    return (
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <Typography.h6 style={{ textTransform: "lowercase", color: "red" }}>
          {error}
        </Typography.h6>
      </div>
    );
  }

  const creditCategory = [
    { label: "Credit Type", value: application?.creditType?.name || "-" },
    { label: "Credit Code", value: application?.creditCode || "-" },
    { label: "Activity", value: application?.activity || "-" },
    { label: "Sector", value: application?.sector || "-" },
  ];

  const projectCategory = [
    { label: "Business Branch", value: application?.activityBranch || "-" },
    { label: "Specific Zone", value: application?.specificZone || "-" },
    { label: "Project Cost", value: application?.projectCost || "-" },
    { label: "Solicited Amount", value: application?.solicitedAmount || "-" },
    {
      label: "Reception Date",
      value: application?.receptionDate
        ? format(new Date(application.receptionDate), "dd MMMM yyyy")
        : "-",
    },
    { label: "Promoter", value: application?.promoter || "-" },
    { label: "PNR", value: application?.pnr || "-" },
    { label: "Status", value: application?.status || "-" },
    { label: "Client Status", value: application?.clientStatus || "-" },
  ];

  const financeCategory = [
    {
      label: "Real Estate to Finance",
      value: application?.realEstateToFinance || "-",
    },
    { label: "Real Estate Value", value: application?.realEstateValue || "-" },
    { label: "Monthly Income", value: application?.monthlyIncome || "-" },
    { label: "Guarantee Income", value: application?.guaranteeIncome || "-" },
    {
      label: "Theoretical Installment",
      value: application?.theoreticalInstallment || "-",
    },
    { label: "Contribution", value: application?.apport || "-" },
  ];

  const AnimatedMessageContainer = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    const [animate, setAnimate] = useState(false);
    useEffect(() => {
      setAnimate(true);
    }, []);

    return (
      <div
        style={{
          position: "fixed",
          bottom: "16px",
          right: "16px",
          zIndex: 1000,
          transition: "transform 1s ease, opacity 1s ease",
          transform: animate ? "translateY(0)" : "translateY(100%)",
          opacity: animate ? 1 : 0,
        }}
      >
        {children}
      </div>
    );
  };

  return (
    <div style={{ margin: "2rem" }}>
      <AnimatedMessageContainer>
        {application && application.status === "PENDING" && (
          <MessageCard
            title="Application Pending"
            message="The credit application is pending review."
            buttonText={initiateLoading ? "loading..." : "initiate approval"}
            type="info"
            onButtonClick={initiate}
          />
        )}
        {application && application.status === "INITIATED" && (
          <MessageCard
            title="Application Initiated"
            message="The credit application has been initiated but not yet finished. Please continue to complete the approval process."
            buttonText="Continue Approval"
            type="info"
            onButtonClick={() =>
              router.push(`/dashboard/credit-applications/${id}/approval`)
            }
          />
        )}
        {application && application.status === "APPROVED" && (
          <MessageCard
            title="Application Approved"
            message="The credit application has been approved."
            buttonText="View Details"
            type="success"
            onButtonClick={() =>
              router.push(`/dashboard/credit-applications/${id}/summary`)
            }
          />
        )}
        {application && application.status === "REJECTED" && (
          <MessageCard
            title="Application Rejected"
            message="The credit application has been rejected."
            buttonText="Back to List"
            type="error"
            onButtonClick={() => router.push("/dashboard/credit-applications")}
          />
        )}
        {application && application.status === "CANCELED" && (
          <MessageCard
            title="Application Canceled"
            message="The credit application has been canceled."
            buttonText="Back to List"
            type="warning"
            onButtonClick={() => router.push("/dashboard/credit-applications")}
          />
        )}
      </AnimatedMessageContainer>

      <Card style={{ padding: "20px", marginBottom: "6rem" }}>
        <div
          style={{
            textAlign: "center",
            backgroundColor: "#f7faff",
            padding: "1rem",
          }}
        >
          <Typography.h4>general information</Typography.h4>
        </div>
        <div style={{ padding: "1rem" }}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <Typography.h6>credit details</Typography.h6>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                {creditCategory.map((field, idx) => (
                  <FieldCard
                    key={idx}
                    label={field.label}
                    value={field.value}
                  />
                ))}
              </div>
            </div>
            <hr style={{ margin: "1rem 0" }} />
            <div>
              <Typography.h6>additional information</Typography.h6>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                {projectCategory.map((field, idx) => (
                  <FieldCard
                    key={idx}
                    label={field.label}
                    value={field.value}
                  />
                ))}
              </div>
            </div>
            <hr style={{ margin: "1rem 0" }} />
            <div>
              <Typography.h6>financial information</Typography.h6>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                {financeCategory.map((field, idx) => (
                  <FieldCard
                    key={idx}
                    label={field.label}
                    value={field.value}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        {application && application.status === "PENDING" && (
          <Button onClick={handleReject} themeColor={"error"}>
            {actionLoading ? "loading..." : "Reject"}
          </Button>
        )}
        <Button
          onClick={() => router.push("/dashboard/credit-applications")}
          fillMode="outline"
          style={{
            marginLeft: "1rem",
          }}
        >
          Back
        </Button>
      </div>
      <NotificationGroup
        style={{
          position: "fixed",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {snackbarOpen && (
          <Notification
            type={{ style: snackbarSeverity, icon: true }}
            closable={true}
            onClose={() => setSnackbarOpen(false)}
          >
            {snackbarMessage}
          </Notification>
        )}
      </NotificationGroup>
    </div>
  );
}
