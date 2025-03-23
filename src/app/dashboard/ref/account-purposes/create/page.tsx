"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  Field,
  FormElement,
  FieldRenderProps,
} from "@progress/kendo-react-form";
import { Error } from "@progress/kendo-react-labels";
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { Typography } from "@progress/kendo-react-common";

export default function CreateAccountPurpose() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    name: "",
    description: "",
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/account-purposes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push("/dashboard/ref/account-purposes");
      } else {
        const result = await res.json();
        setError(result.error || "Error creating account purpose");
      }
    } catch (err) {
      setError("Error creating account purpose");
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

  return (
    <div style={{ maxWidth: "768px", margin: "auto", padding: "2rem" }}>
      <Typography.h4>Create Account Purpose</Typography.h4>
      <Form
        initialValues={initialValues}
        onSubmit={handleSubmit}
        render={(formRenderProps) => (
          <FormElement style={{ width: "100%" }}>
            <Field
              name="name"
              component={CustomInput}
              label="Name"
              validator={(value: any) => (value ? "" : "Name is required")}
            />
            <Field
              name="description"
              component={CustomInput}
              label="Description"
            />
            {error && (
              <Typography.p style={{ color: "red", marginBottom: "1rem" }}>
                {error}
              </Typography.p>
            )}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                onClick={() => router.push("/dashboard/ref/account-purposes")}
                fillMode="outline"
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
