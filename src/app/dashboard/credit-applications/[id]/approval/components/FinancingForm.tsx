"use client";

import React, { useState } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { Input, NumericTextBox, TextArea } from "@progress/kendo-react-inputs";

export interface FinancingData {
  type: string;
  value: number;
  order: number;
  observation?: string;
}

interface FinancingFormProps {
  initialData?: FinancingData[] | null;
  onFinish: (data: FinancingData[]) => void;
  disabled?: boolean;
  active?: boolean;
  isSubmitting?: boolean;
}

export default function FinancingListForm({
  initialData,
  onFinish,
  disabled,
  active,
  isSubmitting,
}: FinancingFormProps) {
  const safeInitialData = initialData || [];

  const [financings, setFinancings] = useState<FinancingData[]>(
    safeInitialData.length
      ? safeInitialData
      : [
          {
            type: "",
            value: 0,
            order: 1,
            observation: "",
          },
        ]
  );

  const handleChange = (
    index: number,
    field: keyof FinancingData,
    value: any
  ) => {
    const updated = [...financings];
    updated[index] = { ...updated[index], [field]: value };
    setFinancings(updated);
  };

  const addFinancing = () => {
    setFinancings([
      ...financings,
      { type: "", value: 0, order: financings.length + 1, observation: "" },
    ]);
  };

  const removeFinancing = (index: number) => {
    const updated = financings.filter((_, i) => i !== index);
    updated.forEach((item, i) => (item.order = i + 1));
    setFinancings(updated);
  };

  const handleFinish = () => {
    onFinish(financings);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h5>Financing Information</h5>
      {financings.map((financing, index) => (
        <div
          key={index}
          style={{
            marginBottom: "16px",
            padding: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              alignItems: "center",
            }}
          >
            <div style={{ flex: "1 1 45%" }}>
              <label style={{ display: "block", marginBottom: "4px" }}>
                Financing Type
              </label>
              <Input
                value={financing.type}
                onChange={(e) => handleChange(index, "type", e.target.value)}
                disabled={disabled}
              />
            </div>
            <div style={{ flex: "1 1 45%" }}>
              <label style={{ display: "block", marginBottom: "4px" }}>
                Value
              </label>
              <NumericTextBox
                value={financing.value}
                onChange={(e) => handleChange(index, "value", e.value)}
                disabled={disabled}
              />
            </div>
            <div style={{ flex: "1 1 45%" }}>
              <label style={{ display: "block", marginBottom: "4px" }}>
                Order
              </label>
              <NumericTextBox
                value={financing.order}
                onChange={(e) => handleChange(index, "order", e.value)}
                disabled={disabled}
              />
            </div>
            <div style={{ flex: "1 1 45%" }}>
              <label style={{ display: "block", marginBottom: "4px" }}>
                Observation
              </label>
              <TextArea
                value={financing.observation}
                onChange={(e) => handleChange(index, "observation", e.value)}
                rows={3}
                disabled={disabled}
              />
            </div>
            {!disabled && financings.length > 1 && (
              <div style={{ flex: "1 1 100%", textAlign: "right" }}>
                <Button
                  onClick={() => removeFinancing(index)}
                  fillMode={"flat"}
                  style={{ color: "red" }}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
      {active && !disabled && (
        <>
          <div style={{ textAlign: "right", marginBottom: "16px" }}>
            <Button onClick={addFinancing} fillMode={"outline"}>
              Add Financing
            </Button>
          </div>
          <div style={{ textAlign: "right" }}>
            <Button
              disabled={isSubmitting}
              onClick={handleFinish}
              themeColor={"primary"}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
