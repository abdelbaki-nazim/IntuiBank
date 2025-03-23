"use client";

import React from "react";
import { Field, FieldRenderProps } from "@progress/kendo-react-form";
import { Input } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Typography } from "@progress/kendo-react-common";
import { DocumentType } from "@/../types/models";
import { ClientFormData } from "./types";

const CustomDropDownInput = (fieldRenderProps: FieldRenderProps) => {
  const {
    data,
    value,
    onChange,
    validationMessage,
    visited,
    label,
    textField,
    dataItemKey,
    name,
    ...others
  } = fieldRenderProps;

  const mappedValue =
    typeof value === "string"
      ? data.find((item: any) => item.value === value)
      : value;

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label className="k-form-label">{label}</label>
      <DropDownList
        data={data}
        value={mappedValue}
        onChange={(e) => onChange({ target: { name, value: e.value } })}
        textField={textField}
        dataItemKey={dataItemKey}
        {...others}
      />
      {visited && validationMessage && (
        <div className="k-form-error">{validationMessage}</div>
      )}
    </div>
  );
};

const DateInput = (fieldRenderProps: FieldRenderProps) => {
  const {
    value,
    onChange,
    validationMessage,
    visited,
    label,
    id,
    name,
    ...others
  } = fieldRenderProps;
  let dateValue = "";
  if (value) {
    if (typeof value === "string") {
      dateValue = value.split("T")[0];
    } else if (value instanceof Date) {
      dateValue = value.toISOString().split("T")[0];
    }
  }
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label htmlFor={id} className="k-form-label">
        {label}
      </label>
      <Input
        type="date"
        id={id}
        value={dateValue}
        onChange={(e) => onChange({ target: { name, value: e.target.value } })}
        {...others}
      />
      {visited && validationMessage && (
        <div className="k-form-error">{validationMessage}</div>
      )}
    </div>
  );
};

interface IdentityTabProps {
  formData: ClientFormData;
  onFieldChange: (
    section:
      | "client"
      | "personPhysical"
      | "personMoral"
      | "identity"
      | "activity"
  ) => (e: any) => void;
}

export const IdentityTab: React.FC<IdentityTabProps> = ({
  formData,
  onFieldChange,
}) => {
  return (
    <div
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <Typography.h5>Identity Document</Typography.h5>
      <Field
        name="identityDocuments[0].documentType"
        component={CustomDropDownInput}
        data={[
          { text: "CNIBE", value: DocumentType.CNIBE },
          { text: "Passport", value: DocumentType.PASSEPORT },
          { text: "Driver License", value: DocumentType.PERMIS_CONDUIRE },
          { text: "Voter Card", value: DocumentType.CARTE_ELECTEUR },
          { text: "Consular Card", value: DocumentType.CARTE_CONSULAIRE },
        ]}
        textField="text"
        dataItemKey="value"
        label="Document Type"
        onChange={onFieldChange("identity")}
      />
      <Field
        name="identityDocuments[0].documentNumber"
        component={Input}
        label="Document Number"
        onChange={onFieldChange("identity")}
      />
      <Field
        name="identityDocuments[0].issueDate"
        component={DateInput}
        label="Issue Date"
        onChange={onFieldChange("identity")}
      />
      <Field
        name="identityDocuments[0].issuedBy"
        component={Input}
        label="Issued By"
        onChange={onFieldChange("identity")}
      />
    </div>
  );
};
