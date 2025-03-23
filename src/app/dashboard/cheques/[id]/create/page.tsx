"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Form,
  Field,
  FormElement,
  FormRenderProps,
  FieldRenderProps,
} from "@progress/kendo-react-form";
import { Input, TextArea } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import { Error as KendoError } from "@progress/kendo-react-labels";
import { Card } from "@progress/kendo-react-layout";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";

const TextInput = (fieldRenderProps: FieldRenderProps) => {
  const { validationMessage, visited, ...others } = fieldRenderProps;
  return (
    <div>
      <Input {...others} />
      {visited && validationMessage && (
        <KendoError>{validationMessage}</KendoError>
      )}
    </div>
  );
};

const TextAreaInput = (fieldRenderProps: FieldRenderProps) => {
  const { validationMessage, visited, ...others } = fieldRenderProps;
  return (
    <div>
      <TextArea {...others} />
      {visited && validationMessage && (
        <KendoError>{validationMessage}</KendoError>
      )}
    </div>
  );
};

const DropDownInput = (
  fieldRenderProps: FieldRenderProps & {
    data: any[];
    textField: string;
    dataItemKey: string;
  }
) => {
  const {
    validationMessage,
    visited,
    data,
    textField,
    dataItemKey,
    onChange,
    value,
    ...others
  } = fieldRenderProps;
  const selectedItem = data.find((item) => item.value === value) || null;
  return (
    <div>
      <DropDownList
        data={data}
        textField={textField}
        dataItemKey={dataItemKey}
        value={selectedItem}
        onChange={(e) => onChange(e.value ? e.value.value : "")}
        {...others}
      />
      {visited && validationMessage && (
        <KendoError>{validationMessage}</KendoError>
      )}
    </div>
  );
};

const requiredValidator = (value: any) =>
  value ? "" : "This field is required.";

const CreateChequePage = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const initialValues = {
    chequeNumber: "",
    requestDate: "",
    issuedAt: "",
    deliveryDate: "",
    receptionDate: "",
    expirationDate: "",
    observation: "",
  };

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleCloseToast = () => setToast((prev) => ({ ...prev, open: false }));

  const handleSubmit = async (dataItem: any) => {
    if (!dataItem.chequeNumber.trim() || !dataItem.requestDate.trim()) {
      setToast({
        open: true,
        message:
          "Please fill in the required fields (Cheque Number and Request Date).",
        severity: "error",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/cheques/${id}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chequeNumber: dataItem.chequeNumber,
          requestDate: dataItem.requestDate
            ? new Date(dataItem.requestDate)
            : null,
          issuedAt: dataItem.issuedAt ? new Date(dataItem.issuedAt) : null,
          deliveryDate: dataItem.deliveryDate
            ? new Date(dataItem.deliveryDate)
            : null,
          receptionDate: dataItem.receptionDate
            ? new Date(dataItem.receptionDate)
            : null,
          expirationDate: dataItem.expirationDate
            ? new Date(dataItem.expirationDate)
            : null,
          observation: dataItem.observation,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error creating cheque");
      }
      setToast({
        open: true,
        message: "Cheque created successfully",
        severity: "success",
      });
      setTimeout(() => router.push("/dashboard/cheques"), 2000);
    } catch (err: any) {
      setToast({ open: true, message: err.message, severity: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ margin: "1rem" }}>
      <Card style={{ padding: "20px" }}>
        <Form
          initialValues={initialValues}
          onSubmit={handleSubmit}
          render={(formRenderProps: FormRenderProps) => (
            <FormElement style={{ maxWidth: 650 }}>
              <fieldset className="k-form-fieldset">
                <legend
                  className="k-form-legend"
                  style={{ textTransform: "lowercase" }}
                >
                  create cheque for account {id}
                </legend>
                <div style={{ marginBottom: "1rem" }}>
                  <Field
                    name="chequeNumber"
                    component={TextInput}
                    label="Cheque Number *"
                    validator={requiredValidator}
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <Field
                    name="requestDate"
                    component={TextInput}
                    label="Request Date *"
                    type="date"
                    validator={requiredValidator}
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <Field
                    name="issuedAt"
                    component={TextInput}
                    label="Issued Date"
                    type="date"
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <Field
                    name="deliveryDate"
                    component={TextInput}
                    label="Delivery Date"
                    type="date"
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <Field
                    name="receptionDate"
                    component={TextInput}
                    label="Reception Date"
                    type="date"
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <Field
                    name="expirationDate"
                    component={TextInput}
                    label="Expiration Date"
                    type="date"
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <Field
                    name="observation"
                    component={TextAreaInput}
                    label="Observation"
                  />
                </div>
              </fieldset>
              <div
                className="k-form-buttons"
                style={{ marginTop: "1rem", textAlign: "center" }}
              >
                <Button
                  fillMode="outline"
                  onClick={() => router.push("/dashboard/cheques")}
                >
                  back
                </Button>
                <Button
                  type="submit"
                  themeColor="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Cheque"}
                </Button>
              </div>
            </FormElement>
          )}
        />
      </Card>
      <NotificationGroup
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {toast.open && (
          <Notification
            type={{ style: toast.severity, icon: true }}
            closable={true}
            onClose={handleCloseToast}
          >
            {toast.message}
          </Notification>
        )}
      </NotificationGroup>
    </div>
  );
};

export default CreateChequePage;
