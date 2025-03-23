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
import KLoader from "@/app/components/loader/KLoader";

export default function EditAccountPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error" as "success" | "error",
  });
  const [form, setForm] = useState({
    accountNumber: "",
    accountDescription: "",
    accountPurposeId: "",
    currencyId: "",
    currentBalance: "",
    openedAt: "",
    status: "ACTIVE",
    otherAccountPurposes: "",
    chapter: "",
    kycDetails: "",
    kycValidated: false,
    observation: "",
  });
  const [accountPurposes, setAccountPurposes] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountRes, purposesRes, currenciesRes] = await Promise.all([
          fetch(`/api/accounts/${id}`),
          fetch(`/api/account-purposes`),
          fetch(`/api/currencies`),
        ]);
        if (!accountRes.ok) {
          const data = await accountRes.json();
          throw new Error(data.message || "Error fetching account");
        }
        if (!purposesRes.ok) {
          const data = await purposesRes.json();
          throw new Error(data.message || "Error fetching account purposes");
        }
        if (!currenciesRes.ok) {
          const data = await currenciesRes.json();
          throw new Error(data.message || "Error fetching currencies");
        }
        const accountData = await accountRes.json();
        const purposesData = await purposesRes.json();
        const currenciesData = await currenciesRes.json();

        setForm({
          accountNumber: accountData.accountNumber || "",
          accountDescription: accountData.accountDescription || "",
          accountPurposeId: accountData.accountPurposeId?.toString() || "",
          currencyId: accountData.currencyId?.toString() || "",
          currentBalance: accountData.currentBalance?.toString() || "",
          openedAt: accountData.openedAt
            ? accountData.openedAt.split("T")[0]
            : "",
          status: accountData.status || "ACTIVE",
          otherAccountPurposes: accountData.otherAccountPurposes || "",
          chapter: accountData.chapter || "",
          kycDetails: accountData.kycDetails || "",
          kycValidated: accountData.kycValidated || false,
          observation: accountData.observation || "",
        });
        setAccountPurposes(purposesData);
        setCurrencies(currenciesData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;
    setForm({ ...form, [name]: e.value });
  };

  console.log(form);
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/accounts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountDescription: form.accountDescription,
          accountPurposeId: parseInt(form.accountPurposeId),
          currencyId: parseInt(form.currencyId),
          currentBalance: parseFloat(form.currentBalance),
          openedAt: form.openedAt || null,
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
        throw new Error(data.message || "Error updating account");
      }
      router.push(`/dashboard/accounts/${id}`);
    } catch (err: any) {
      setError(err.message);
      setToast({ open: true, message: err.message, severity: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <KLoader />;
  }

  const statusOptions = [
    { value: "ACTIVE", text: "Active" },
    { value: "DELETED", text: "Deleted" },
    { value: "ARCHIVED", text: "Archived" },
    { value: "SUSPENDED", text: "Suspended" },
  ];

  return (
    <div
      style={{ maxWidth: "600px", margin: "40px auto", marginBottom: "40px" }}
    >
      <Card style={{ padding: "20px" }}>
        <h2>Edit Account</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: "16px" }}>
            <label>Account Number</label>
            <Input
              name="accountNumber"
              value={form.accountNumber}
              readOnly
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

          <div style={{ marginBottom: "16px" }}>
            <label>Account Purpose</label>
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
                  (item) => item.id.toString() === form.accountPurposeId
                ) || null
              }
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  accountPurposeId: e.value ? e.value.id.toString() : "",
                }))
              }
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
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
                currencies.find(
                  (item) => item.id.toString() === form.currencyId
                ) || null
              }
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  currencyId: e.value ? e.value.id.toString() : "",
                }))
              }
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Current Balance</label>
            <Input
              name="currentBalance"
              type="number"
              value={form.currentBalance}
              onChange={handleChange}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Opened At (YYYY-MM-DD)</label>
            <Input
              name="openedAt"
              type="date"
              value={form.openedAt}
              onChange={handleChange}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Status</label>
            <DropDownList
              data={statusOptions}
              textField="text"
              dataItemKey="value"
              name="status"
              value={
                statusOptions.find((item) => item.value === form.status) || null
              }
              onChange={(e) =>
                setForm((prev) => ({ ...prev, status: e.value.value }))
              }
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Other Account Purposes</label>
            <Input
              name="otherAccountPurposes"
              value={form.otherAccountPurposes}
              onChange={handleChange}
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
            <label
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Checkbox
                name="kycValidated"
                checked={form.kycValidated}
                onChange={handleCheckboxChange}
              />
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

          <div
            style={{
              textAlign: "center",
              marginTop: "16px",
              display: "flex",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            <Button
              type="button"
              fillMode="outline"
              onClick={() => router.push(`/dashboard/accounts/${id}`)}
            >
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting} themeColor="primary">
              {isSubmitting ? "Updating..." : "Update Account"}
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
            onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          >
            {toast.message}
          </Notification>
        )}
      </NotificationGroup>
    </div>
  );
}
