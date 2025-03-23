"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { Input, NumericTextBox, TextArea } from "@progress/kendo-react-inputs";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";

interface GuaranteeType {
  id: string;
  name: string;
}

export interface GuaranteeData {
  guaranteeTypeId: string;
  guaranteeValue: number;
  guaranteeDescription: string;
  expiryDate?: string;
  observation?: string;
}

interface GuaranteeFormProps {
  initialData?: Partial<GuaranteeData>;
  onFinish: (data: GuaranteeData) => void;
  disabled?: boolean;
  active?: boolean;
  isSubmitting?: boolean;
}

export default function GuaranteeForm({
  initialData = {},
  onFinish,
  disabled,
  active,
  isSubmitting,
}: GuaranteeFormProps) {
  const [guaranteeTypeId, setGuaranteeTypeId] = useState<string>(
    initialData?.guaranteeTypeId || ""
  );
  const [guaranteeValue, setGuaranteeValue] = useState<number>(
    initialData?.guaranteeValue ?? 0
  );
  const [guaranteeDescription, setGuaranteeDescription] = useState<string>(
    initialData?.guaranteeDescription || ""
  );
  const [expiryDate, setExpiryDate] = useState<string>(
    initialData?.expiryDate || ""
  );
  const [observation, setObservation] = useState<string>(
    initialData?.observation || ""
  );
  const [guaranteeTypes, setGuaranteeTypes] = useState<GuaranteeType[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetch("/api/guarantee-types")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setGuaranteeTypes(data);
        } else {
          setGuaranteeTypes([]);
        }
      })
      .catch((err) => console.error("Error fetching guarantee types", err));
  }, []);

  const validate = (): boolean => {
    const tempErrors: { [key: string]: string } = {};

    if (!guaranteeTypeId.trim()) {
      tempErrors.guaranteeTypeId = "Guarantee type is required.";
    }
    if (
      guaranteeValue === null ||
      guaranteeValue === undefined ||
      isNaN(guaranteeValue)
    ) {
      tempErrors.guaranteeValue =
        "Guarantee value is required and must be a number.";
    }
    if (!guaranteeDescription.trim()) {
      tempErrors.guaranteeDescription = "Description is required.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleFinish = () => {
    if (!validate()) {
      return;
    }
    const payload: GuaranteeData = {
      guaranteeTypeId,
      guaranteeValue,
      guaranteeDescription,
      expiryDate: expiryDate || undefined,
      observation: observation || undefined,
    };
    onFinish(payload);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h5>Guarantee Information</h5>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ flex: "1 1 45%" }}>
          <label>Guarantee Type</label>
          <DropDownList
            data={guaranteeTypes}
            textField="name"
            dataItemKey="id"
            value={
              guaranteeTypes.find((type) => type.id === guaranteeTypeId) || null
            }
            onChange={(e) => {
              const value = e.value ? e.value.id : "";
              setGuaranteeTypeId(value);
            }}
            disabled={disabled}
          />
          {errors.guaranteeTypeId && (
            <div style={{ color: "red", fontSize: "0.8rem" }}>
              {errors.guaranteeTypeId}
            </div>
          )}
        </div>
        <div style={{ flex: "1 1 45%" }}>
          <label>Guarantee Value</label>
          <NumericTextBox
            value={guaranteeValue}
            onChange={(e) => setGuaranteeValue(Number(e.value ?? 0))}
            disabled={disabled}
          />
          {errors.guaranteeValue && (
            <div style={{ color: "red", fontSize: "0.8rem" }}>
              {errors.guaranteeValue}
            </div>
          )}
        </div>
        <div style={{ flex: "1 1 100%" }}>
          <label>Guarantee Description</label>
          <TextArea
            value={guaranteeDescription}
            onChange={(e) => setGuaranteeDescription(e.value)}
            rows={3}
            disabled={disabled}
          />
          {errors.guaranteeDescription && (
            <div style={{ color: "red", fontSize: "0.8rem" }}>
              {errors.guaranteeDescription}
            </div>
          )}
        </div>
        <div style={{ flex: "1 1 45%" }}>
          <label>Expiry Date</label>
          <DatePicker
            format="yyyy-MM-dd"
            value={expiryDate ? new Date(expiryDate) : null}
            onChange={(e) =>
              setExpiryDate(e.value ? e.value.toISOString().split("T")[0] : "")
            }
            disabled={disabled}
          />
        </div>
        <div style={{ flex: "1 1 45%" }}>
          <label>Observation</label>
          <TextArea
            value={observation}
            onChange={(e) => setObservation(e.value)}
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
            onClick={handleFinish}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
