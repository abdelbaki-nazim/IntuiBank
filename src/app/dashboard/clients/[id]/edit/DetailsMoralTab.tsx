"use client";

import React from "react";
import { Field, FieldRenderProps } from "@progress/kendo-react-form";
import { Input } from "@progress/kendo-react-inputs";
import { Typography } from "@progress/kendo-react-common";
import { ClientFormData } from "./types";

interface DetailsMoralTabProps {
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

const required = (value: any) => (value ? "" : "Required");

const ControlledInput = (fieldRenderProps: FieldRenderProps) => {
  const { value, validationMessage, ...others } = fieldRenderProps;
  return (
    <Input
      {...others}
      value={value == null ? "" : value}
      validationMessage={validationMessage || undefined}
    />
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
  if (value != null) {
    if (typeof value === "string") {
      dateValue = value ? value.split("T")[0] : "";
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
        value={dateValue || ""}
        onChange={(e) => onChange({ target: { name, value: e.target.value } })}
        {...others}
      />
      {visited && validationMessage && (
        <div className="k-form-error">{validationMessage}</div>
      )}
    </div>
  );
};

export const DetailsMoralTab: React.FC<DetailsMoralTabProps> = ({
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
      <Typography.h5>Company Information</Typography.h5>
      <Field
        name="personMoral.firstName"
        component={ControlledInput}
        label="Contact First Name"
        onChange={onFieldChange("personMoral")}
      />
      <Field
        name="personMoral.middleName"
        component={ControlledInput}
        label="Contact Middle Name"
        onChange={onFieldChange("personMoral")}
      />
      <Field
        name="personMoral.lastName"
        component={ControlledInput}
        label="Contact Last Name"
        onChange={onFieldChange("personMoral")}
      />
      <Field
        name="personMoral.maidenName"
        component={ControlledInput}
        label="Contact Maiden Name"
        onChange={onFieldChange("personMoral")}
      />
      <Field
        name="personMoral.companyName"
        component={ControlledInput}
        label="Company Name"
        validator={required}
        onChange={onFieldChange("personMoral")}
      />
      <Field
        name="personMoral.denomination"
        component={ControlledInput}
        label="Denomination"
        onChange={onFieldChange("personMoral")}
      />
      <Field
        name="personMoral.legalForm"
        component={ControlledInput}
        label="Legal Form"
        validator={required}
        onChange={onFieldChange("personMoral")}
      />
      <Field
        name="personMoral.businessActivity"
        component={ControlledInput}
        label="Business Activity"
        validator={required}
        onChange={onFieldChange("personMoral")}
      />
      <Field
        name="personMoral.capital"
        component={ControlledInput}
        label="Capital"
        validator={required}
        onChange={onFieldChange("personMoral")}
      />
      <Field
        name="personMoral.workforce"
        component={ControlledInput}
        type="number"
        label="Workforce"
        onChange={onFieldChange("personMoral")}
      />
      <Field
        name="personMoral.headquartersAddress"
        component={ControlledInput}
        label="Headquarters Address"
        validator={required}
        onChange={onFieldChange("personMoral")}
      />
      <Field
        name="personMoral.postalCode"
        component={ControlledInput}
        label="Postal Code"
        validator={required}
        onChange={onFieldChange("personMoral")}
      />
      <Field
        name="personMoral.city"
        component={ControlledInput}
        label="City"
        validator={required}
        onChange={onFieldChange("personMoral")}
      />
      <Field
        name="personMoral.stateDepartment"
        component={ControlledInput}
        label="State/Department"
        validator={required}
        onChange={onFieldChange("personMoral")}
      />
      <Field
        name="personMoral.taxIdentificationNumber"
        component={ControlledInput}
        label="Tax Identification Number"
        onChange={onFieldChange("personMoral")}
      />
      <Field
        name="personMoral.statisticalIdentificationNumber"
        component={ControlledInput}
        label="Statistical Identification Number"
        onChange={onFieldChange("personMoral")}
      />
      <Field
        name="personMoral.businessCreationDate"
        component={DateInput}
        type="date"
        label="Business Creation Date"
        validator={required}
        format="yyyy-MM-dd"
        onChange={onFieldChange("personMoral")}
      />
      <Field
        name="personMoral.annualRevenue"
        component={ControlledInput}
        type="number"
        label="Annual Revenue"
        onChange={onFieldChange("personMoral")}
      />
      <Field
        name="personMoral.professionalPhone"
        component={ControlledInput}
        label="Professional Phone"
        validator={required}
        onChange={onFieldChange("personMoral")}
      />
      <Field
        name="personMoral.professionalEmail"
        component={ControlledInput}
        label="Professional Email"
        validator={required}
        onChange={onFieldChange("personMoral")}
      />
    </div>
  );
};
