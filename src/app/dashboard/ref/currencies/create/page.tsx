"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Form,
  Field,
  FormElement,
  FieldRenderProps,
} from "@progress/kendo-react-form";
import { Error } from "@progress/kendo-react-labels";
import { Input, Checkbox } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { Typography } from "@progress/kendo-react-common";

export default function CreateCurrencyPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    code: "",
    name: "",
    symbol: "",
    isActive: true,
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/currencies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push("/dashboard/ref/currencies");
      } else {
        const result = await res.json();
        setError(result.error || "Error creating currency");
      }
    } catch (err) {
      setError("Error creating currency");
    } finally {
      setIsSubmitting(false);
    }
  };

  const CustomInput = (fieldRenderProps: FieldRenderProps) => {
    const { validationMessage, visited, ...others } = fieldRenderProps;
    return (
      <div style={{ marginBottom: "1rem" }}>
        <Input {...others} />
        {visited && validationMessage && <Error>{validationMessage}</Error>}
      </div>
    );
  };

  const CustomCheckbox = (fieldRenderProps: FieldRenderProps) => {
    const { value, onChange } = fieldRenderProps;
    return (
      <div style={{ marginBottom: "1rem" }}>
        <Checkbox
          checked={value}
          onChange={(e) => onChange({ target: { value: e.value } })}
          label="Active"
        />
      </div>
    );
  };

  return (
    <div style={{ maxWidth: "768px", margin: "auto", padding: "2rem" }}>
      <Typography.h4>Create Currency</Typography.h4>
      <Form
        initialValues={initialValues}
        onSubmit={handleSubmit}
        render={(formRenderProps) => (
          <FormElement style={{ width: "100%" }}>
            <Field
              name="code"
              component={CustomInput}
              label="Code"
              validator={(value: any) => (value ? "" : "Code is required")}
            />
            <Field
              name="name"
              component={CustomInput}
              label="Name"
              validator={(value: any) => (value ? "" : "Name is required")}
            />
            <Field name="symbol" component={CustomInput} label="Symbol" />
            <Field name="isActive" component={CustomCheckbox} />
            {error && (
              <Typography.p style={{ color: "red", marginBottom: "1rem" }}>
                {error}
              </Typography.p>
            )}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                fillMode={"outline"}
                onClick={() => router.push("/dashboard/ref/currencies")}
                themeColor="primary"
              >
                Back
              </Button>
              <Button
                type="submit"
                themeColor="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Create"}
              </Button>
            </div>
          </FormElement>
        )}
      />
    </div>
  );
}
