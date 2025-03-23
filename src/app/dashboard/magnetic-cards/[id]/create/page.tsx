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
import KLoader from "@/app/components/loader/KLoader";

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

  const selectedItem = data.find((item) => item[dataItemKey] === value);

  return (
    <div>
      <DropDownList
        data={data}
        textField={textField}
        dataItemKey={dataItemKey}
        value={selectedItem}
        onChange={(e) => onChange(e.value ? e.value : "")}
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

const CreateMagneticCardPage = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const initialValues = {
    cardNumber: "",
    cardHolderName: "",
    cvv: "",
    status: "PENDING",
    civility: "",
    requestDate: "",
    issuedAt: "",
    deliveryDate: "",
    receptionDate: "",
    expirationDate: "",
    address: "",
    state: "",
    city: "",
    postalCode: "",
    deliveryMethod: "ENVOI",
    creationOrRenewal: "CREATION",
    pinCodeReceived: "",
    pinCodeReceptionDate: "",
    pinCodeDeliveryDate: "",
    otpCodeReceived: "",
    otpCodeReceptionDate: "",
    otpCodeDeliveryDate: "",
    observation: "",
    cardTypeId: "",
  };

  const [cardTypes, setCardTypes] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/card-types")
      .then((res) => res.json())
      .then((data) => setCardTypes(data))
      .catch((error) => console.error("Error fetching card types", error));
  }, []);

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleCloseToast = () => setToast((prev) => ({ ...prev, open: false }));

  const handleSubmit = async (dataItem: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/magnetic-card/${id}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardNumber: dataItem.cardNumber,
          cardHolderName: dataItem.cardHolderName,
          cvv: dataItem.cvv,
          status: dataItem.status,
          civility: dataItem.civility,
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
          address: dataItem.address,
          state: dataItem.state,
          city: dataItem.city,
          postalCode: dataItem.postalCode,
          deliveryMethod: dataItem.deliveryMethod,
          creationOrRenewal: dataItem.creationOrRenewal,
          pinCodeReceived: dataItem.pinCodeReceived,
          pinCodeReceptionDate: dataItem.pinCodeReceptionDate
            ? new Date(dataItem.pinCodeReceptionDate)
            : null,
          pinCodeDeliveryDate: dataItem.pinCodeDeliveryDate
            ? new Date(dataItem.pinCodeDeliveryDate)
            : null,
          otpCodeReceived: dataItem.otpCodeReceived,
          otpCodeReceptionDate: dataItem.otpCodeReceptionDate
            ? new Date(dataItem.otpCodeReceptionDate)
            : null,
          otpCodeDeliveryDate: dataItem.otpCodeDeliveryDate
            ? new Date(dataItem.otpCodeDeliveryDate)
            : null,
          observation: dataItem.observation,
          cardTypeId: dataItem.cardTypeId,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error creating card");
      }
      setToast({
        open: true,
        message: "Card created successfully",
        severity: "success",
      });
      setTimeout(() => router.push(`/dashboard/magnetic-cards/${id}`), 2000);
    } catch (err: any) {
      setToast({ open: true, message: err.message, severity: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <KLoader />;
  }

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
                  create magnetic card
                </legend>
                <div style={{ marginBottom: "1rem" }}>
                  <Field
                    name="cardNumber"
                    component={TextInput}
                    label="Card Number *"
                    validator={requiredValidator}
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <Field
                    name="cardHolderName"
                    component={TextInput}
                    label="Card Holder Name *"
                    validator={requiredValidator}
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <Field name="cvv" component={TextInput} label="CVV" />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <Field
                    name="cardTypeId"
                    component={DropDownInput}
                    label="Card Type *"
                    data={
                      cardTypes.length > 0
                        ? cardTypes.map((type) => ({
                            value: type.id.toString(),
                            text: type.name,
                          }))
                        : [{ value: "", text: "Loading..." }]
                    }
                    textField="text"
                    dataItemKey="value"
                    validator={requiredValidator}
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <Field
                    name="status"
                    component={DropDownInput}
                    label="Status *"
                    data={[
                      { value: "PENDING", text: "pending" },
                      { value: "ACTIVE", text: "active" },
                      { value: "INACTIVE", text: "inactive" },
                      { value: "BLOCKED", text: "blocked" },
                      { value: "EXPIRED", text: "expired" },
                      { value: "LOST", text: "lost" },
                      { value: "STOLEN", text: "stolen" },
                    ]}
                    textField="text"
                    dataItemKey="value"
                    validator={requiredValidator}
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <Field
                    name="civility"
                    component={DropDownInput}
                    label="Civility"
                    data={[
                      { value: "", text: "select" },
                      { value: "MR", text: "mr." },
                      { value: "MRS", text: "mrs." },
                      { value: "MS", text: "ms." },
                      { value: "MISS", text: "miss" },
                      { value: "DR", text: "dr." },
                      { value: "PROF", text: "prof." },
                      { value: "MAITRE", text: "maître" },
                    ]}
                    textField="text"
                    dataItemKey="value"
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <Field
                    name="requestDate"
                    component={TextInput}
                    label="Request Date"
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
                    label="Expiration Date *"
                    type="date"
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <Field name="address" component={TextInput} label="Address" />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <Field name="state" component={TextInput} label="State" />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <Field name="city" component={TextInput} label="City" />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <Field
                    name="postalCode"
                    component={TextInput}
                    label="Postal Code"
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <Field
                    name="deliveryMethod"
                    component={DropDownInput}
                    label="Delivery Method *"
                    data={[
                      { value: "ENVOI", text: "send" },
                      { value: "RETRAIT", text: "pickup" },
                    ]}
                    textField="text"
                    dataItemKey="value"
                    validator={requiredValidator}
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <Field
                    name="creationOrRenewal"
                    component={DropDownInput}
                    label="Creation or Renewal *"
                    data={[
                      { value: "CREATION", text: "creation" },
                      { value: "RENEWAL", text: "renewal" },
                    ]}
                    textField="text"
                    dataItemKey="value"
                    validator={requiredValidator}
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <Field
                    name="pinCodeReceived"
                    component={TextInput}
                    label="PIN Code Received"
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <Field
                    name="pinCodeReceptionDate"
                    component={TextInput}
                    label="PIN Reception Date"
                    type="date"
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <Field
                    name="pinCodeDeliveryDate"
                    component={TextInput}
                    label="PIN Delivery Date"
                    type="date"
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <Field
                    name="otpCodeReceived"
                    component={TextInput}
                    label="OTP Code Received"
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <Field
                    name="otpCodeReceptionDate"
                    component={TextInput}
                    label="OTP Reception Date"
                    type="date"
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <Field
                    name="otpCodeDeliveryDate"
                    component={TextInput}
                    label="OTP Delivery Date"
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
                  onClick={() => router.push(`/dashboard/magnetic-cards`)}
                >
                  back
                </Button>
                <Button
                  type="submit"
                  themeColor="primary"
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting ? "Creating..." : "Create Card"}
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

export default CreateMagneticCardPage;
