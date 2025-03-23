"use client";

import React from "react";
import { Field } from "@progress/kendo-react-form";
import { Input } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Typography } from "@progress/kendo-react-common";
import { Error } from "@progress/kendo-react-labels";
import { ClientType, RecordStatus } from "@/../types/models";
import { ClientFormData } from "./types";

interface GeneralTabProps {
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

const clientTypeData = [
  { text: "Physical", value: ClientType.PHYSICAL },
  { text: "Moral", value: ClientType.MORAL },
];

const recordStatusData = [
  { text: "Active", value: RecordStatus.ACTIVE },
  { text: "Deleted", value: RecordStatus.DELETED },
  { text: "Archived", value: RecordStatus.ARCHIVED },
  { text: "Suspended", value: RecordStatus.SUSPENDED },
];

const DropDownInput = (fieldRenderProps: any) => {
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
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};

export const GeneralTab: React.FC<GeneralTabProps> = ({
  formData,
  onFieldChange,
}) => {
  console.log("GeneralTab formData:", formData);
  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 6 }}>
      <Typography.h5>General Information</Typography.h5>
      <Field name="id" component={Input} label="ID" disabled={true} />
      <Field
        name="type"
        component={DropDownInput}
        data={clientTypeData}
        textField="text"
        dataItemKey="value"
        label="Client Type"
        disabled={true}
      />
      <Field
        name="status"
        component={DropDownInput}
        data={recordStatusData}
        textField="text"
        dataItemKey="value"
        label="Status"
        onChange={onFieldChange("client")}
      />
    </div>
  );
};
