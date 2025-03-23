"use client";

import React from "react";
import {
  Field,
  FieldRenderProps,
  FormRenderProps,
} from "@progress/kendo-react-form";
import { Input } from "@progress/kendo-react-inputs";
import { Typography } from "@progress/kendo-react-common";
import { ActivityType } from "@/../types/models";

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

interface ActivityTabProps {
  formRenderProps: FormRenderProps;
}

export const ActivityTab: React.FC<ActivityTabProps> = ({
  formRenderProps,
}) => {
  if (formRenderProps.valueGetter("type") !== "PHYSICAL") return null;

  const activity =
    formRenderProps.valueGetter("personPhysical.activities[0]") || {};

  const activityType = formRenderProps.valueGetter(
    "personPhysical.activityType"
  );

  return (
    <div style={{ padding: "16px" }}>
      <Typography.h5>Activity Details</Typography.h5>
      {activityType === ActivityType.INDIVIDUAL && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Field
            name="personPhysical.activities[0].profession"
            component={ControlledInput}
            label="Profession"
            validator={required}
            onChange={(e: any) =>
              formRenderProps.onChange(
                "personPhysical.activities[0].profession",
                {
                  value: e.target.value,
                }
              )
            }
          />
          <Field
            name="personPhysical.activities[0].employer"
            component={ControlledInput}
            label="Employer"
            validator={required}
            onChange={(e: any) =>
              formRenderProps.onChange(
                "personPhysical.activities[0].employer",
                {
                  value: e.target.value,
                }
              )
            }
          />
          <Field
            name="personPhysical.activities[0].monthlyIncome"
            component={ControlledInput}
            type="number"
            label="Monthly Income"
            validator={required}
            onChange={(e: any) =>
              formRenderProps.onChange(
                "personPhysical.activities[0].monthlyIncome",
                {
                  value: Number(e.target.value),
                }
              )
            }
          />
        </div>
      )}
      {activityType === ActivityType.PROFESSIONAL && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Field
            name="personPhysical.activities[0].businessFullName"
            component={ControlledInput}
            label="Full Business Name"
            validator={required}
            onChange={(e: any) =>
              formRenderProps.onChange(
                "personPhysical.activities[0].businessFullName",
                {
                  value: e.target.value,
                }
              )
            }
          />
          <Field
            name="personPhysical.activities[0].businessDenomination"
            component={ControlledInput}
            label="Business Denomination"
            onChange={(e: any) =>
              formRenderProps.onChange(
                "personPhysical.activities[0].businessDenomination",
                {
                  value: e.target.value,
                }
              )
            }
          />
          <Field
            name="personPhysical.activities[0].legalForm"
            component={ControlledInput}
            label="Legal Form"
            validator={required}
            onChange={(e: any) =>
              formRenderProps.onChange(
                "personPhysical.activities[0].legalForm",
                {
                  value: e.target.value,
                }
              )
            }
          />
          <Field
            name="personPhysical.activities[0].businessActivity"
            component={ControlledInput}
            label="Business Activity"
            validator={required}
            onChange={(e: any) =>
              formRenderProps.onChange(
                "personPhysical.activities[0].businessActivity",
                {
                  value: e.target.value,
                }
              )
            }
          />
          <Field
            name="personPhysical.activities[0].capital"
            component={ControlledInput}
            type="number"
            label="Capital"
            validator={required}
            onChange={(e: any) =>
              formRenderProps.onChange("personPhysical.activities[0].capital", {
                value: Number(e.target.value),
              })
            }
          />
          <Field
            name="personPhysical.activities[0].workforce"
            component={ControlledInput}
            type="number"
            label="Workforce"
            onChange={(e: any) =>
              formRenderProps.onChange(
                "personPhysical.activities[0].workforce",
                {
                  value: Number(e.target.value),
                }
              )
            }
          />
          <Field
            name="personPhysical.activities[0].headquartersAddress"
            component={ControlledInput}
            label="Headquarters Address"
            validator={required}
            onChange={(e: any) =>
              formRenderProps.onChange(
                "personPhysical.activities[0].headquartersAddress",
                {
                  value: e.target.value,
                }
              )
            }
          />
          <Field
            name="personPhysical.activities[0].businessPostalCode"
            component={ControlledInput}
            label="Postal Code"
            validator={required}
            onChange={(e: any) =>
              formRenderProps.onChange(
                "personPhysical.activities[0].businessPostalCode",
                {
                  value: e.target.value,
                }
              )
            }
          />
          <Field
            name="personPhysical.activities[0].cityOfBusiness"
            component={ControlledInput}
            label="City"
            validator={required}
            onChange={(e: any) =>
              formRenderProps.onChange(
                "personPhysical.activities[0].cityOfBusiness",
                {
                  value: e.target.value,
                }
              )
            }
          />
          <Field
            name="personPhysical.activities[0].stateDepartment"
            component={ControlledInput}
            label="State/Department"
            validator={required}
            onChange={(e: any) =>
              formRenderProps.onChange(
                "personPhysical.activities[0].stateDepartment",
                {
                  value: e.target.value,
                }
              )
            }
          />
          <Field
            name="personPhysical.activities[0].taxIdentificationNumber"
            component={ControlledInput}
            label="Tax Identification Number"
            onChange={(e: any) =>
              formRenderProps.onChange(
                "personPhysical.activities[0].taxIdentificationNumber",
                {
                  value: e.target.value,
                }
              )
            }
          />
          <Field
            name="personPhysical.activities[0].statisticalIdentificationNumber"
            component={ControlledInput}
            label="Statistical Identification Number"
            onChange={(e: any) =>
              formRenderProps.onChange(
                "personPhysical.activities[0].statisticalIdentificationNumber",
                {
                  value: e.target.value,
                }
              )
            }
          />
          <Field
            name="personPhysical.activities[0].businessCreationDate"
            component={ControlledInput}
            type="date"
            label="Business Creation Date"
            validator={required}
            format="yyyy-MM-dd"
            onChange={(e: any) =>
              formRenderProps.onChange(
                "personPhysical.activities[0].businessCreationDate",
                {
                  value: e.target.value,
                }
              )
            }
          />
          <Field
            name="personPhysical.activities[0].annualRevenue"
            component={ControlledInput}
            type="number"
            label="Annual Revenue"
            onChange={(e: any) =>
              formRenderProps.onChange(
                "personPhysical.activities[0].annualRevenue",
                {
                  value: Number(e.target.value),
                }
              )
            }
          />
          <Field
            name="personPhysical.activities[0].professionalPhone"
            component={ControlledInput}
            label="Professional Phone"
            onChange={(e: any) =>
              formRenderProps.onChange(
                "personPhysical.activities[0].professionalPhone",
                {
                  value: e.target.value,
                }
              )
            }
          />
          <Field
            name="personPhysical.activities[0].professionalMobile"
            component={ControlledInput}
            label="Professional Mobile"
            onChange={(e: any) =>
              formRenderProps.onChange(
                "personPhysical.activities[0].professionalMobile",
                {
                  value: e.target.value,
                }
              )
            }
          />
          <Field
            name="personPhysical.activities[0].professionalFax"
            component={ControlledInput}
            label="Professional Fax"
            onChange={(e: any) =>
              formRenderProps.onChange(
                "personPhysical.activities[0].professionalFax",
                {
                  value: e.target.value,
                }
              )
            }
          />
          <Field
            name="personPhysical.activities[0].professionalEmail"
            component={ControlledInput}
            label="Professional Email"
            validator={required}
            onChange={(e: any) =>
              formRenderProps.onChange(
                "personPhysical.activities[0].professionalEmail",
                {
                  value: e.target.value,
                }
              )
            }
          />
        </div>
      )}
    </div>
  );
};

export default ActivityTab;
