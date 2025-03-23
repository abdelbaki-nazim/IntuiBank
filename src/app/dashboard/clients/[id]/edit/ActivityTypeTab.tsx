"use client";

import React from "react";
import {
  DropDownList,
  DropDownListChangeEvent,
} from "@progress/kendo-react-dropdowns";
import { FieldRenderProps } from "@progress/kendo-react-form";
import { Field } from "@progress/kendo-react-form";
import { Typography } from "@progress/kendo-react-common";
import { ActivityType } from "@/../types/models";

interface ActivityTypeTabProps {
  formRenderProps: any; 
}

const required = (value: any) => (value ? "" : "Required");

export const ActivityTypeTab: React.FC<ActivityTypeTabProps> = ({
  formRenderProps,
}) => {

  if (formRenderProps.valueGetter("type") !== "PHYSICAL") return null;
  return (
    <div style={{ padding: "16px" }}>
      <Typography.h5>Activity Type</Typography.h5>
      <Field
        name="personPhysical.activityType"
        component={ControlledDropDown}
        data={[
          { text: "Individual", value: ActivityType.INDIVIDUAL },
          { text: "Professional", value: ActivityType.PROFESSIONAL },
        ]}
        textField="text"
        dataItemKey="value"
        label="Select Activity Type"
        validator={required}
        onChange={(e: any) =>
          formRenderProps.onChange("personPhysical.activityType", {
            value: e.target.value,
          })
        }
      />
    </div>
  );
};

const ControlledDropDown = (fieldRenderProps: FieldRenderProps) => {
  const {
    data,
    value,
    onChange,
    label,
    textField,
    dataItemKey,
    name,
    validationMessage,
    touched,
    modified,
    visited,
    valid,
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
        onChange={(e: DropDownListChangeEvent) =>
          onChange({ target: { name, value: e.value } })
        }
        textField={textField}
        dataItemKey={dataItemKey}
        {...others}
      />
    </div>
  );
};
