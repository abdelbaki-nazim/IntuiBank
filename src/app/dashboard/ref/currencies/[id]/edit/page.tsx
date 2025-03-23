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
import KLoader from "@/app/components/loader/KLoader";

export default function CurrencyEdit() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [currency, setCurrency] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initialValues, setInitialValues] = useState({
    code: "",
    name: "",
    symbol: "",
    isActive: true,
  });

  useEffect(() => {
    setLoading(true);
    fetch(`/api/currencies/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setCurrency(data);
          setInitialValues({
            code: data.code,
            name: data.name,
            symbol: data.symbol,
            isActive: data.isActive,
          });
        }
      })
      .catch(() => setError("Error retrieving data"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/currencies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/dashboard/ref/currencies");
      }
    } catch (err) {
      setError("Error updating data");
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
      <div style={{ marginBottom: "2rem" }}>
        <Checkbox
          checked={value}
          onChange={(e) => onChange({ target: { value: e.value } })}
          label="Active"
        />
      </div>
    );
  };

  if (error) {
    return (
      <div style={{ maxWidth: "768px", margin: "auto", padding: "2rem" }}>
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            borderLeft: "4px solid red",
            borderRadius: "8px",
            backgroundColor: "#fff",
          }}
        >
          <Typography.h5 style={{ color: "red", marginBottom: "1rem" }}>
            Loading Error
          </Typography.h5>
          <Typography.p style={{ color: "#555", marginBottom: "1rem" }}>
            {error}
          </Typography.p>
          <Button
            onClick={() => router.push("/dashboard/ref/currencies")}
            themeColor="primary"
          >
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <KLoader />;
  }

  if (!currency) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <Typography.p>No currency found.</Typography.p>
        <Button
          onClick={() => router.push("/dashboard/ref/currencies")}
          themeColor="primary"
        >
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "768px", margin: "auto", padding: "2rem" }}>
      <div
        style={{
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          borderTop: "4px solid #1976d2",
          backgroundColor: "#fff",
        }}
      >
        <Typography.h4 style={{ marginBottom: "1rem" }}>
          Edit Currency
        </Typography.h4>
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
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </FormElement>
          )}
        />
      </div>
    </div>
  );
}
