"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@progress/kendo-react-buttons";
import {
  Input,
  NumericTextBox,
  Checkbox,
  TextArea,
  TextAreaChangeEvent,
} from "@progress/kendo-react-inputs";
import { DatePicker } from "@progress/kendo-react-dateinputs";

export interface CreditData {
  creditNumber: string;
  creditType: string;
  creditTypeId: string;
  principalAmount: number;
  interestRate: number;
  termInMonths: number;
  startDate: string;
  endDate: string;
  monthlyInstallment: number;
  approvedAmount: number;
  transmissionDate: string;
  accordRecu: boolean;
  accordDate: string;
  deferredMonths: number;
  bonification: number;
  amountInLetter: string;
  secondaryRC: string;
  rcDate: string;
  accountNumber: string;
  clientIdentifier: string;
  authorizationNumber: string;
  authorizationDate: string;
  decisionDate: string;
  scheduledDueDate: string;
  authorizedAmount: number;
  mobilisedAmount: number;
  disbursementDate: string;
  numberOfEffects: number;
  firstDueDate: string;
  lastDueDate: string;
  initialDossier: string;
  dossierNumber: string;
  amendment: string;
  observation: string;
}

interface CreditDetailsFormProps {
  initialData?: Partial<CreditData>;
  onFinish: (data: CreditData) => void;
  disabled?: boolean;
  active?: boolean;
  creditType?: string;
  creditTypeId?: string;
  isSubmitting?: boolean;
}

export default function CreditDetailsForm({
  initialData = {},
  onFinish,
  disabled,
  active,
  creditType,
  creditTypeId,
  isSubmitting,
}: CreditDetailsFormProps) {
  const safeInitialData: Partial<CreditData> = initialData || {};

  const [formData, setFormData] = useState<CreditData>({
    creditNumber: safeInitialData.creditNumber || "",
    creditType: safeInitialData.creditType?.toString() || "",
    creditTypeId: creditTypeId || "",
    principalAmount: safeInitialData.principalAmount || 0,
    interestRate: safeInitialData.interestRate || 0,
    termInMonths: safeInitialData.termInMonths || 0,
    startDate: safeInitialData.startDate || "",
    endDate: safeInitialData.endDate || "",
    monthlyInstallment: safeInitialData.monthlyInstallment || 0,
    approvedAmount: safeInitialData.approvedAmount || 0,
    transmissionDate: safeInitialData.transmissionDate || "",
    accordRecu: safeInitialData.accordRecu || false,
    accordDate: safeInitialData.accordDate || "",
    deferredMonths: safeInitialData.deferredMonths || 0,
    bonification: safeInitialData.bonification || 0,
    amountInLetter: safeInitialData.amountInLetter || "",
    secondaryRC: safeInitialData.secondaryRC || "",
    rcDate: safeInitialData.rcDate || "",
    accountNumber: safeInitialData.accountNumber || "",
    clientIdentifier: safeInitialData.clientIdentifier || "",
    authorizationNumber: safeInitialData.authorizationNumber || "",
    authorizationDate: safeInitialData.authorizationDate || "",
    decisionDate: safeInitialData.decisionDate || "",
    scheduledDueDate: safeInitialData.scheduledDueDate || "",
    authorizedAmount: safeInitialData.authorizedAmount || 0,
    mobilisedAmount: safeInitialData.mobilisedAmount || 0,
    disbursementDate: safeInitialData.disbursementDate || "",
    numberOfEffects: safeInitialData.numberOfEffects || 0,
    firstDueDate: safeInitialData.firstDueDate || "",
    lastDueDate: safeInitialData.lastDueDate || "",
    initialDossier: safeInitialData.initialDossier || "",
    dossierNumber: safeInitialData.dossierNumber || "",
    amendment: safeInitialData.amendment || "",
    observation: safeInitialData.observation || "",
  });

  const handleChange = (field: keyof CreditData) => (event: any) => {
    let value: any;
    if (event.target && event.target.type === "checkbox") {
      value = event.target.checked;
    } else if (event.target && event.target.type === "number") {
      value = Number(event.target.value);
    } else if (event.value !== undefined) {
      value = event.value;
    } else {
      value = event.target.value;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  function calculateMonthlyInstallment(
    principalAmount: number,
    annualInterestRate: number,
    termInMonths: number
  ): string {
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const numerator = principalAmount * monthlyInterestRate;
    const denominator = 1 - Math.pow(1 + monthlyInterestRate, -termInMonths);
    const monthlyInstallment = numerator / denominator;
    return monthlyInstallment.toFixed(3);
  }

  useEffect(() => {
    if (
      formData.principalAmount &&
      formData.interestRate &&
      formData.termInMonths
    ) {
      const installment = parseFloat(
        calculateMonthlyInstallment(
          formData.principalAmount,
          formData.interestRate,
          formData.termInMonths
        )
      );
      setFormData((prev) => ({ ...prev, monthlyInstallment: installment }));
    }
  }, [formData.principalAmount, formData.interestRate, formData.termInMonths]);

  const handleNext = () => {
    onFinish(formData);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h5>Approved Credit Details</h5>

      <h6>General Information</h6>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ flex: "1 1 30%" }}>
          <Input
            label="Credit Number"
            value={formData.creditNumber}
            onChange={handleChange("creditNumber")}
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <Input label="Credit Type" value={creditType} disabled />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <NumericTextBox
            label="Borrowed Amount"
            value={formData.principalAmount}
            onChange={handleChange("principalAmount")}
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <NumericTextBox
            label="Interest Rate (%)"
            value={formData.interestRate}
            onChange={handleChange("interestRate")}
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <NumericTextBox
            label="Credit Term (in months)"
            value={formData.termInMonths}
            onChange={handleChange("termInMonths")}
            disabled={disabled}
          />
        </div>
      </div>

      <h6 style={{ marginTop: "1rem" }}>Timeline</h6>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ flex: "1 1 30%" }}>
          <DatePicker
            label="Start Date"
            format="yyyy-MM-dd"
            value={formData.startDate ? new Date(formData.startDate) : null}
            onChange={(e) =>
              handleChange("startDate")({
                target: {
                  value: e.value ? e.value.toISOString().split("T")[0] : "",
                },
              })
            }
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <DatePicker
            label="End Date"
            format="yyyy-MM-dd"
            value={formData.endDate ? new Date(formData.endDate) : null}
            onChange={(e) =>
              handleChange("endDate")({
                target: {
                  value: e.value ? e.value.toISOString().split("T")[0] : "",
                },
              })
            }
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <NumericTextBox
            label="Monthly Installment"
            value={formData.monthlyInstallment}
            disabled
          />
        </div>
      </div>

      <h6 style={{ marginTop: "1rem" }}>Approval Details</h6>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ flex: "1 1 30%" }}>
          <NumericTextBox
            label="Approved Amount"
            value={formData.approvedAmount}
            onChange={handleChange("approvedAmount")}
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <DatePicker
            label="Transmission Date"
            format="yyyy-MM-dd"
            value={
              formData.transmissionDate
                ? new Date(formData.transmissionDate)
                : null
            }
            onChange={(e) =>
              handleChange("transmissionDate")({
                target: {
                  value: e.value ? e.value.toISOString().split("T")[0] : "",
                },
              })
            }
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%", display: "flex", alignItems: "center" }}>
          <Checkbox
            checked={formData.accordRecu}
            onChange={handleChange("accordRecu")}
            disabled={disabled}
          />
          <label style={{ marginLeft: "0.5rem" }}>Agreement Received</label>
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <DatePicker
            label="Agreement Date"
            format="yyyy-MM-dd"
            value={formData.accordDate ? new Date(formData.accordDate) : null}
            onChange={(e) =>
              handleChange("accordDate")({
                target: {
                  value: e.value ? e.value.toISOString().split("T")[0] : "",
                },
              })
            }
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <NumericTextBox
            label="Deferred (in months)"
            value={formData.deferredMonths}
            onChange={handleChange("deferredMonths")}
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <NumericTextBox
            label="Bonification"
            value={formData.bonification}
            onChange={handleChange("bonification")}
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <Input
            label="Amount in Letters"
            value={formData.amountInLetter}
            onChange={handleChange("amountInLetter")}
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <Input
            label="Secondary RC"
            value={formData.secondaryRC}
            onChange={handleChange("secondaryRC")}
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <DatePicker
            label="RC Date"
            format="yyyy-MM-dd"
            value={formData.rcDate ? new Date(formData.rcDate) : null}
            onChange={(e) =>
              handleChange("rcDate")({
                target: {
                  value: e.value ? e.value.toISOString().split("T")[0] : "",
                },
              })
            }
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <Input
            label="Account Number"
            value={formData.accountNumber}
            onChange={handleChange("accountNumber")}
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <Input
            label="Client Identifier"
            value={formData.clientIdentifier}
            onChange={handleChange("clientIdentifier")}
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <Input
            label="Authorization Number"
            value={formData.authorizationNumber}
            onChange={handleChange("authorizationNumber")}
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <DatePicker
            label="Authorization Date"
            format="yyyy-MM-dd"
            value={
              formData.authorizationDate
                ? new Date(formData.authorizationDate)
                : null
            }
            onChange={(e) =>
              handleChange("authorizationDate")({
                target: {
                  value: e.value ? e.value.toISOString().split("T")[0] : "",
                },
              })
            }
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <DatePicker
            label="Decision Date"
            format="yyyy-MM-dd"
            value={
              formData.decisionDate ? new Date(formData.decisionDate) : null
            }
            onChange={(e) =>
              handleChange("decisionDate")({
                target: {
                  value: e.value ? e.value.toISOString().split("T")[0] : "",
                },
              })
            }
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <DatePicker
            label="Scheduled Due Date"
            format="yyyy-MM-dd"
            value={
              formData.scheduledDueDate
                ? new Date(formData.scheduledDueDate)
                : null
            }
            onChange={(e) =>
              handleChange("scheduledDueDate")({
                target: {
                  value: e.value ? e.value.toISOString().split("T")[0] : "",
                },
              })
            }
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <NumericTextBox
            label="Authorized Amount"
            value={formData.authorizedAmount}
            onChange={handleChange("authorizedAmount")}
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <NumericTextBox
            label="Mobilised Amount"
            value={formData.mobilisedAmount}
            onChange={handleChange("mobilisedAmount")}
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <DatePicker
            label="Disbursement Date"
            format="yyyy-MM-dd"
            value={
              formData.disbursementDate
                ? new Date(formData.disbursementDate)
                : null
            }
            onChange={(e) =>
              handleChange("disbursementDate")({
                target: {
                  value: e.value ? e.value.toISOString().split("T")[0] : "",
                },
              })
            }
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <NumericTextBox
            label="Number of Effects"
            value={formData.numberOfEffects}
            onChange={handleChange("numberOfEffects")}
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <DatePicker
            label="First Due Date"
            format="yyyy-MM-dd"
            value={
              formData.firstDueDate ? new Date(formData.firstDueDate) : null
            }
            onChange={(e) =>
              handleChange("firstDueDate")({
                target: {
                  value: e.value ? e.value.toISOString().split("T")[0] : "",
                },
              })
            }
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <DatePicker
            label="Last Due Date"
            format="yyyy-MM-dd"
            value={formData.lastDueDate ? new Date(formData.lastDueDate) : null}
            onChange={(e) =>
              handleChange("lastDueDate")({
                target: {
                  value: e.value ? e.value.toISOString().split("T")[0] : "",
                },
              })
            }
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <Input
            label="Initial Dossier"
            value={formData.initialDossier}
            onChange={handleChange("initialDossier")}
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <Input
            label="Dossier Number"
            value={formData.dossierNumber}
            onChange={handleChange("dossierNumber")}
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 30%" }}>
          <Input
            label="Amendment"
            value={formData.amendment}
            onChange={handleChange("amendment")}
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 100%" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Observation
          </label>
          <TextArea
            value={formData.observation}
            onChange={(e: TextAreaChangeEvent) =>
              handleChange("observation")(e)
            }
            rows={3}
            disabled={disabled}
          />
        </div>
      </div>

      {active && !disabled && (
        <div style={{ marginTop: "1rem", textAlign: "right" }}>
          <Button
            disabled={isSubmitting}
            themeColor={"primary"}
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
