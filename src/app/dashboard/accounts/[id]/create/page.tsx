"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@progress/kendo-react-layout";
import { Input, TextArea, Checkbox } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";

export default function CreateAccountPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [form, setForm] = useState({
    userId: id,
    accountNumber: "",
    accountDescription: "",
    accountPurposeId: "",
    currencyId: "",
    currentBalance: "0",
    openedAt: "",
    status: "ACTIVE",
    otherAccountPurposes: "",
    chapter: "",
    kycDetails: "",
    kycValidated: false,
    observation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [accountPurposes, setAccountPurposes] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);

  useEffect(() => {
    const fetchAccountPurposes = async () => {
      try {
        const res = await fetch("/api/account-purposes");
        if (!res.ok) throw new Error("Error fetching account types");
        const data = await res.json();
        setAccountPurposes(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCurrencies = async () => {
      try {
        const res = await fetch("/api/currencies");
        if (!res.ok) throw new Error("Error fetching currencies");
        const data = await res.json();
        setCurrencies(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAccountPurposes();
    fetchCurrencies();
  }, []);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleToastClose = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log(form);

    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: form.userId,
          accountNumber: form.accountNumber,
          accountDescription: form.accountDescription,
          accountPurposeId: form.accountPurposeId,
          currencyId: form.currencyId,
          currentBalance: parseFloat(form.currentBalance),
          openedAt: form.openedAt ? form.openedAt : null,
          status: form.status,
          otherAccountPurposes: form.otherAccountPurposes,
          chapter: form.chapter,
          kycDetails: form.kycDetails,
          kycValidated: form.kycValidated,
          observation: form.observation,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error creating account");
      }
      setToast({
        open: true,
        message: "Account created successfully",
        severity: "success",
      });
      setTimeout(() => {
        router.push("/dashboard/accounts");
      }, 1500);
    } catch (err: any) {
      setToast({
        open: true,
        message: err.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto" }}>
      <Card style={{ padding: "20px" }}>
        <h2>Create Bank Account</h2>
        <hr style={{ margin: "16px 0" }} />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>

          <div style={{ marginBottom: "16px" }}>
            <label>ID Client</label>
            <Input
              name="userId"
              value={form.userId}
              readOnly
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Account Number</label>
            <Input
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Account Description</label>
            <Input
              name="accountDescription"
              value={form.accountDescription}
              onChange={handleChange}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
            <div style={{ flex: 1 }}>
              <label>Account Type</label>
              <DropDownList
                data={
                  accountPurposes.length > 0
                    ? accountPurposes
                    : [{ id: 1, name: "Loading..." }]
                }
                textField="name"
                dataItemKey="id"
                name="accountPurposeId"
                value={
                  accountPurposes.find(
                    (item) => item.id === form.accountPurposeId
                  ) || null
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    accountPurposeId: e.value ? e.value.id : "",
                  }))
                }
                required
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Currency</label>
              <DropDownList
                data={
                  currencies.length > 0
                    ? currencies
                    : [{ id: 1, code: "Loading..." }]
                }
                textField="code"
                dataItemKey="id"
                name="currencyId"
                value={
                  currencies.find((item) => item.id === form.currencyId) || null
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    currencyId: e.value ? e.value.id : "",
                  }))
                }
                required
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Other Account Types</label>
            <Input
              name="otherAccountPurposes"
              value={form.otherAccountPurposes}
              onChange={handleChange}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
            <div style={{ flex: 1 }}>
              <label>Current Balance</label>
              <Input
                name="currentBalance"
                type="number"
                value={form.currentBalance}
                onChange={handleChange}
                required
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Opened On (YYYY-MM-DD)</label>
              <Input
                name="openedAt"
                type="date"
                value={form.openedAt}
                onChange={handleChange}
                required
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Status</label>
            <DropDownList
              data={[
                { value: "ACTIVE", text: "Active" },
                { value: "SUSPENDED", text: "Suspended" },
              ]}
              name="status"
              textField="text"
              dataItemKey="value"
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status: e.value.value,
                }))
              }
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Chapter</label>
            <Input
              name="chapter"
              value={form.chapter}
              onChange={handleChange}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>KYC Details</label>
            <TextArea
              name="kycDetails"
              defaultValue={form.kycDetails}
              onChange={handleChange}
              style={{ width: "100%" }}
              rows={3}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>
              <Checkbox
                name="kycValidated"
                checked={form.kycValidated}
                onChange={handleChange}
              />{" "}
              KYC Validated
            </label>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Observation</label>
            <TextArea
              name="observation"
              defaultValue={form.observation}
              onChange={handleChange}
              style={{ width: "100%" }}
              rows={3}
            />
          </div>

          <div style={{ textAlign: "right", marginTop: "16px" }}>
            <Button type="submit" themeColor="primary" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </form>
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
            onClose={handleToastClose}
          >
            {toast.message}
          </Notification>
        )}
      </NotificationGroup>
    </div>
  );
}
