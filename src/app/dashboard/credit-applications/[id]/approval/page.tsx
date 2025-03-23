"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PanelBar, PanelBarItem } from "@progress/kendo-react-layout";
import { Loader } from "@progress/kendo-react-indicators";
import {
  NotificationGroup,
  Notification,
} from "@progress/kendo-react-notification";
import CreditDetailsForm from "./components/CreditDetailsForm";
import GuaranteeForm from "./components/GuaranteeForm";
import FinancingForm from "./components/FinancingForm";
import AmortizationForm from "./components/AmortizationForm";
import KLoader from "@/app/components/loader/KLoader";
import { Typography } from "@progress/kendo-react-common";

interface StatusData {
  creditDetails: { exists: boolean; data: any };
  guarantee: { exists: boolean; data: any };
  financing: { exists: boolean; data: any };
  amortization: { exists: boolean; data: any };
}

type Step = "creditDetails" | "guarantee" | "financing" | "amortization";

const defaultStatusData: StatusData = {
  creditDetails: { exists: false, data: {} },
  guarantee: { exists: false, data: {} },
  financing: { exists: false, data: {} },
  amortization: { exists: false, data: {} },
};

export default function MultiStepsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [statusData, setStatusData] = useState<StatusData>(defaultStatusData);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"error" | "success">(
    "error"
  );
  const [activeStep, setActiveStep] = useState<Step>("creditDetails");

  const [creditType, setCreditType] = useState("");
  const [creditTypeId, setCreditTypeId] = useState("");

  const [submittingSteps, setSubmittingSteps] = useState<{
    [key in Step]: boolean;
  }>({
    creditDetails: false,
    guarantee: false,
    financing: false,
    amortization: false,
  });

  useEffect(() => {
    async function fetchStatus() {
      try {
        const response = await fetch(`/api/credit-applications/${id}/status`);
        if (!response.ok) {
          throw new Error("Error fetching status");
        }
        const data = await response.json();

        const safeData: StatusData = {
          creditDetails: data?.creditDetails || defaultStatusData.creditDetails,
          guarantee: data?.guarantee || defaultStatusData.guarantee,
          financing: data?.financing || defaultStatusData.financing,
          amortization: data?.amortization || defaultStatusData.amortization,
        };

        setStatusData(safeData);
        setCreditType(data?.CreditApplication?.data?.creditType?.name || "");
        setCreditTypeId(data?.CreditApplication?.data?.creditType?.id || "");

        if (!safeData.creditDetails.exists) {
          setActiveStep("creditDetails");
        } else if (!safeData.guarantee.exists) {
          setActiveStep("guarantee");
        } else if (!safeData.financing.exists) {
          setActiveStep("financing");
        } else if (!safeData.amortization.exists) {
          setActiveStep("amortization");
        } else {
          router.push(`/dashboard/credit-applications/${id}/summary`);
        }
      } catch (error) {
        console.error(error);
        setStatusError("Error fetching data");
        setToastMessage("Error fetching data");
        setToastSeverity("error");
        setToastOpen(true);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, [id, router]);

  const handleStepFinish = async (step: Step, payload: any) => {
    setSubmittingSteps((prev) => ({ ...prev, [step]: true }));

    let endpoint = "";
    switch (step) {
      case "creditDetails":
        endpoint = `/api/credit-applications/${id}/credit-details`;
        break;
      case "guarantee":
        endpoint = `/api/credit-applications/${id}/guarantee`;
        break;
      case "financing":
        endpoint = `/api/credit-applications/${id}/financing`;
        break;
      case "amortization":
        endpoint = `/api/credit-applications/${id}/amortization`;
        break;
      default:
        break;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Error saving ${step}`);
      }

      setToastMessage(`${step} saved successfully`);
      setToastSeverity("success");
      setToastOpen(true);

      if (step !== "amortization") {
        const statusRes = await fetch(`/api/credit-applications/${id}/status`);
        const status = await statusRes.json();
        setStatusData(status || defaultStatusData);
      }

      if (step === "creditDetails") {
        setActiveStep("guarantee");
      } else if (step === "guarantee") {
        setActiveStep("financing");
      } else if (step === "financing") {
        setActiveStep("amortization");
      } else if (step === "amortization") {
        router.push(`/dashboard/credit-applications/${id}/summary`);
      }
    } catch (error) {
      console.error(error);
      try {
        const statusRes = await fetch(`/api/credit-applications/${id}/status`);
        const status = await statusRes.json();
        setStatusData(status || defaultStatusData);
      } catch (err) {
        console.error("Error refreshing status", err);
      }
      setToastMessage(`Error saving ${step}`);
      setToastSeverity("error");
      setToastOpen(true);
    } finally {
      setSubmittingSteps((prev) => ({ ...prev, [step]: false }));
    }
  };

  if (loading) {
    return <KLoader />;
  }

  if (statusError) {
    return (
      <div style={{ padding: "1rem", textAlign: "center", color: "red" }}>
        <Typography.h6>{statusError}</Typography.h6>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h4 style={{ marginBottom: "1rem" }}>Credit Application Process</h4>
      <PanelBar expandMode="single">
        <PanelBarItem
          expanded={activeStep === "creditDetails"}
          title={`Credit Details ${
            statusData?.creditDetails?.exists ? "✔" : ""
          }`}
        >
          <CreditDetailsForm
            creditType={creditType}
            creditTypeId={creditTypeId}
            initialData={statusData?.creditDetails?.data}
            onFinish={(data) => handleStepFinish("creditDetails", data)}
            disabled={statusData?.creditDetails?.exists}
            isSubmitting={submittingSteps.creditDetails}
            active={activeStep === "creditDetails"}
          />
        </PanelBarItem>

        <PanelBarItem
          expanded={activeStep === "guarantee"}
          title={`Guarantees ${statusData.guarantee.exists ? "✔" : ""}`}
        >
          <GuaranteeForm
            initialData={statusData.guarantee.data}
            onFinish={(data) => handleStepFinish("guarantee", data)}
            disabled={statusData.guarantee.exists}
            isSubmitting={submittingSteps.guarantee}
            active={activeStep === "guarantee"}
          />
        </PanelBarItem>

        <PanelBarItem
          expanded={activeStep === "financing"}
          title={`Financing ${statusData.financing.exists ? "✔" : ""}`}
        >
          <FinancingForm
            initialData={statusData.financing.data}
            onFinish={(data) => handleStepFinish("financing", data)}
            disabled={statusData.financing.exists}
            isSubmitting={submittingSteps.financing}
            active={activeStep === "financing"}
          />
        </PanelBarItem>

        <PanelBarItem
          expanded={activeStep === "amortization"}
          title={`Amortization ${statusData.amortization.exists ? "✔" : ""}`}
        >
          <AmortizationForm
            creditDetails={
              statusData?.creditDetails?.data || {
                approvedAmount: 0,
                termInMonths: 0,
                interestRate: 0,
              }
            }
            onFinish={(data) => handleStepFinish("amortization", data)}
            disabled={statusData.amortization.exists}
            isSubmitting={submittingSteps.amortization}
            active={activeStep === "amortization"}
          />
        </PanelBarItem>
      </PanelBar>

      {toastOpen && (
        <NotificationGroup
          style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
          }}
        >
          <Notification
            closable
            type={{
              style: toastSeverity === "error" ? "error" : "success",
              icon: true,
            }}
            onClose={() => setToastOpen(false)}
          >
            {toastMessage}
          </Notification>
        </NotificationGroup>
      )}
    </div>
  );
}
