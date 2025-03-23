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
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { Typography } from "@progress/kendo-react-common";
import KLoader from "@/app/components/loader/KLoader";

export default function CardTypeEdit() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [cardType, setCardType] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    setLoading(true);
    fetch(`/api/card-types/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setCardType(data);
          setInitialValues({
            name: data.name,
            description: data.description,
          });
        }
      })
      .catch(() => setError("Error retrieving data"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/card-types/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/dashboard/ref/card-types");
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
            onClick={() => router.push("/dashboard/ref/card-types")}
            themeColor="primary"
            fillMode="outline"
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

  if (!cardType) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <Typography.p>No card type found.</Typography.p>
        <Button
          onClick={() => router.push("/dashboard/ref/card-types")}
          themeColor="primary"
          fillMode="outline"
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
          Edit Card Type
        </Typography.h4>
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
                validator={(value: any) =>
                  value.length > 300 ? "Description too long" : ""
                }
              />
              {error && (
                <Typography.p style={{ color: "red", marginBottom: "1rem" }}>
                  {error}
                </Typography.p>
              )}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  onClick={() => router.push("/dashboard/ref/card-types")}
                  themeColor="primary"
                  fillMode="outline"
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
