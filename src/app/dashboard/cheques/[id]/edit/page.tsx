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
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Input, TextArea } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { Error as KendoError } from "@progress/kendo-react-labels";
import { Card } from "@progress/kendo-react-layout";
import { Loader } from "@progress/kendo-react-indicators";
import { Notification, NotificationGroup } from "@progress/kendo-react-notification";
import { Typography } from "@progress/kendo-react-common";

const TextInput = (fieldRenderProps: FieldRenderProps & { label?: string }) => {
  const { validationMessage, visited, label, value, onChange, onFocus, onBlur, ...others } = fieldRenderProps;
  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && (
        <label style={{ display: "block", marginBottom: "0.5rem", textTransform: "lowercase" }}>
          {label}
        </label>
      )}
      <Input
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        {...others}
      />
      {visited && validationMessage && (
        <KendoError>{validationMessage}</KendoError>
      )}
    </div>
  );
};

const TextAreaInput = (fieldRenderProps: FieldRenderProps & { label?: string; rows?: number }) => {
  const { validationMessage, visited, label, value, onChange, onFocus, onBlur, rows, ...others } = fieldRenderProps;
  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && (
        <label style={{ display: "block", marginBottom: "0.5rem", textTransform: "lowercase" }}>
          {label}
        </label>
      )}
      <TextArea
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        rows={rows}
        {...others}
      />
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
  const { validationMessage, visited, data, textField, dataItemKey, onChange, value, ...others } = fieldRenderProps;
  const selectedItem = data.find((item) => item.value === value) || null;
  return (
    <div style={{ marginBottom: "1rem" }}>
      {others.label && (
        <label style={{ display: "block", marginBottom: "0.5rem", textTransform: "lowercase" }}>
          {others.label}
        </label>
      )}
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

const requiredValidator = (value: any) => (value ? "" : "This field is required.");

const EditChequePage = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  
  const [initialValues, setInitialValues] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  
  const handleCloseToast = () =>
    setToast((prev) => ({ ...prev, open: false }));
  
  useEffect(() => {
    fetch(`/api/cheques/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setInitialValues({
          chequeNumber: data.chequeNumber || "",
          requestDate: data.requestDate ? data.requestDate.split("T")[0] : "",
          issuedAt: data.issuedAt ? data.issuedAt.split("T")[0] : "",
          deliveryDate: data.deliveryDate ? data.deliveryDate.split("T")[0] : "",
          receptionDate: data.receptionDate ? data.receptionDate.split("T")[0] : "",
          expirationDate: data.expirationDate ? data.expirationDate.split("T")[0] : "",
          observation: data.observation || "",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cheque:", error);
        setLoading(false);
      });
  }, [id]);
  
  const handleSubmit = async (dataItem: any) => {
    if (!dataItem.chequeNumber.trim() || !dataItem.requestDate.trim()) {
      setToast({
        open: true,
        message: "Please fill in the required fields (Cheque Number and Request Date).",
        severity: "error",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        chequeNumber: dataItem.chequeNumber,
        requestDate: dataItem.requestDate ? new Date(dataItem.requestDate) : null,
        issuedAt: dataItem.issuedAt ? new Date(dataItem.issuedAt) : null,
        deliveryDate: dataItem.deliveryDate ? new Date(dataItem.deliveryDate) : null,
        receptionDate: dataItem.receptionDate ? new Date(dataItem.receptionDate) : null,
        expirationDate: dataItem.expirationDate ? new Date(dataItem.expirationDate) : null,
        observation: dataItem.observation || null,
      };
      const res = await fetch(`/api/cheques/${id}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error updating cheque");
      }
      setToast({
        open: true,
        message: "Cheque updated successfully",
        severity: "success",
      });
      setTimeout(() => router.push(`/dashboard/cheques/${id}`), 2000);
    } catch (error: any) {
      setToast({ open: true, message: error.message, severity: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading || !initialValues) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <Loader size="large" />
      </div>
    );
  }
  
  return (
    <div style={{ margin: "1rem" }}>
      <Card style={{ padding: "20px" }}>
        <Typography.h4 style={{ textTransform: "lowercase", marginBottom: "1rem" }}>
          edit cheque
        </Typography.h4>
        <Form
          initialValues={initialValues}
          onSubmit={handleSubmit}
          render={(formRenderProps: FormRenderProps) => (
            <FormElement style={{ maxWidth: 650 }}>
              <fieldset className="k-form-fieldset">
                <legend className="k-form-legend" style={{ textTransform: "lowercase" }}>
                  edit cheque
                </legend>
                <Field
                  name="chequeNumber"
                  component={TextInput}
                  label="cheque number *"
                  validator={requiredValidator}
                />
                <Field
                  name="requestDate"
                  component={TextInput}
                  label="request date *"
                  type="date"
                  validator={requiredValidator}
                />
                <Field
                  name="issuedAt"
                  component={TextInput}
                  label="issued date"
                  type="date"
                />
                <Field
                  name="deliveryDate"
                  component={TextInput}
                  label="delivery date"
                  type="date"
                />
                <Field
                  name="receptionDate"
                  component={TextInput}
                  label="reception date"
                  type="date"
                />
                <Field
                  name="expirationDate"
                  component={TextInput}
                  label="expiration date *"
                  type="date"
                />
                <Field
                  name="observation"
                  component={TextAreaInput}
                  label="observation"
                  rows={3}
                />
              </fieldset>
              <div className="k-form-buttons" style={{ marginTop: "1rem", textAlign: "center" }}>
                <Button fillMode="outline" onClick={() => router.push(`/dashboard/cheques/${id}`)}>
                  back
                </Button>
                <Button type="submit" themeColor="primary" disabled={isSubmitting}>
                  {isSubmitting ? "updating..." : "update cheque"}
                </Button>
              </div>
            </FormElement>
          )}
        />
      </Card>
      <NotificationGroup style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)" }}>
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

export default EditChequePage;
