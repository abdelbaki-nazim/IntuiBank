"use client";

import React from "react";
import { Field, FieldRenderProps } from "@progress/kendo-react-form";
import {
  Input,
  Checkbox,
  CheckboxChangeEvent,
} from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Typography } from "@progress/kendo-react-common";
import { ClientType, Civility } from "@/../types/models";
import { ClientFormData } from "./types";

interface CredentialsTabProps {
  formData: ClientFormData;
  onFieldChange: (
    section:
      | "client"
      | "personPhysical"
      | "personMoral"
      | "identity"
      | "activity"
  ) => (e: any) => void;
  onCheckboxChange: (section: "personPhysical") => (e: any) => void;
}

const required = (value: any) => (value ? "" : "Required");

const ControlledInput = (fieldRenderProps: FieldRenderProps) => {
  const { value, validationMessage, type, ...others } = fieldRenderProps;
  let formattedValue = value;

  if (type === "date") {
    if (value) {
      formattedValue =
        typeof value === "string"
          ? value.split("T")[0]
          : value instanceof Date
          ? value.toISOString().split("T")[0]
          : "";
    } else {
      formattedValue = "";
    }
  }

  return (
    <Input
      {...others}
      type={type}
      value={formattedValue == null ? "" : formattedValue}
      validationMessage={validationMessage || undefined}
    />
  );
};

const ControlledDropDown = (fieldRenderProps: FieldRenderProps) => {
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

const ControlledCheckbox = (fieldRenderProps: FieldRenderProps) => {
  const {
    value,
    onChange,
    name,
    label,
    validationMessage,
    touched,
    modified,
    visited,
    valid,
    ...others
  } = fieldRenderProps;

  return (
    <Checkbox
      {...others}
      value={value != null ? Boolean(value) : false}
      onChange={(e: CheckboxChangeEvent) =>
        onChange({ target: { name, value: e.value } })
      }
    >
      {label}
    </Checkbox>
  );
};

export const CredentialsTab: React.FC<CredentialsTabProps> = ({
  formData,
  onFieldChange,
  onCheckboxChange,
}) => {
  if (formData.type !== ClientType.PHYSICAL) return null;
  const physical = formData.personPhysical || {};
  return (
    <div
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <Typography.h5>Credentials (Personal Information)</Typography.h5>
      <Field
        name="personPhysical.civility"
        component={ControlledDropDown}
        data={[
          { text: "Mr.", value: Civility.MR },
          { text: "Mrs.", value: Civility.MRS },
          { text: "Ms.", value: Civility.MS },
          { text: "Miss", value: Civility.MISS },
          { text: "Dr.", value: Civility.DR },
          { text: "Prof.", value: Civility.PROF },
          { text: "Maitre", value: Civility.MAITRE },
        ]}
        textField="text"
        dataItemKey="value"
        label="Civility"
        validator={required}
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.firstName"
        component={ControlledInput}
        label="First Name"
        validator={required}
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.middleName"
        component={ControlledInput}
        label="Middle Name"
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.lastName"
        component={ControlledInput}
        label="Last Name"
        validator={required}
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.maidenName"
        component={ControlledInput}
        label="Maiden Name"
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.birthDate"
        component={ControlledInput}
        type="date"
        label="Birth Date"
        validator={required}
        format="yyyy-MM-dd"
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.presumed"
        component={ControlledCheckbox}
        label="Presumed"
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.birthPlace"
        component={ControlledInput}
        label="Birth Place"
        validator={required}
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.gender"
        component={ControlledInput}
        label="Gender"
        validator={required}
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.birtCertificateNumber"
        component={ControlledInput}
        label="Birth Certificate Number"
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.countryOfBirth"
        component={ControlledInput}
        label="Country of Birth"
        validator={required}
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.nationalityOrigin"
        component={ControlledInput}
        label="Nationality (Origin)"
        validator={required}
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.nationalityAcquisition"
        component={ControlledInput}
        label="Nationality (Acquisition)"
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.maritalStatus"
        component={ControlledInput}
        label="Marital Status"
        validator={required}
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.spouseLastName"
        component={ControlledInput}
        label="Spouse Last Name"
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.spouseFirstName"
        component={ControlledInput}
        label="Spouse First Name"
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.motherMaidenName"
        component={ControlledInput}
        label="Mother's Maiden Name"
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.motherFirstName"
        component={ControlledInput}
        label="Mother's First Name"
        validator={required}
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.fatherFirstName"
        component={ControlledInput}
        label="Father's First Name"
        validator={required}
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.personalAddress"
        component={ControlledInput}
        label="Personal Address"
        validator={required}
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.postalCode"
        component={ControlledInput}
        label="Postal Code"
        validator={required}
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.city"
        component={ControlledInput}
        label="City"
        validator={required}
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.stateDepartment"
        component={ControlledInput}
        label="State/Department"
        validator={required}
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.country"
        component={ControlledInput}
        label="Country"
        validator={required}
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.landlinePhone"
        component={ControlledInput}
        label="Landline Phone"
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.personalMobilePhone"
        component={ControlledInput}
        label="Mobile Phone"
        validator={required}
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.personalFax"
        component={ControlledInput}
        label="Personal Fax"
        onChange={onFieldChange("personPhysical")}
      />
      <Field
        name="personPhysical.personalEmail"
        component={ControlledInput}
        label="Email"
        validator={required}
        onChange={onFieldChange("personPhysical")}
      />
    </div>
  );
};
