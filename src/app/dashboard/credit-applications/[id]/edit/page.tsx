"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardTitle, CardBody } from "@progress/kendo-react-layout";
import { Input } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";
import { Typography } from "@progress/kendo-react-common";
import { InputChangeEvent } from "@progress/kendo-react-inputs";
import KLoader from "@/app/components/loader/KLoader";

const creditStatusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELED", label: "Canceled by Client" },
];

export default function EditCreditApplicationPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [creditTypes, setCreditTypes] = useState<any[]>([]);
  console.log(creditTypes);

  useEffect(() => {
    fetch("/api/credit-types", { next: { revalidate: 0 } })
      .then((res) => res.json())
      .then((data) => setCreditTypes(data))
      .catch((err) => console.error("Error fetching credit types", err));
  }, []);

  const [form, setForm] = useState({
    creditType: "",
    creditTypeId: "",
    creditTypeAbbrev: "",
    creditCode: "",
    activity: "",
    sector: "",
    activityBranch: "",
    specificZone: "",
    clientStatus: "",
    projectCost: "",
    solicitedAmount: "",
    receptionDate: "",
    realEstateToFinance: "",
    realEstateValue: "",
    promoter: "",
    monthlyIncome: "",
    guaranteeIncome: "",
    theoreticalInstallment: "",
    apport: "",
    pnr: "",
    status: "PENDING",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCreditApp = async () => {
      try {
        const res = await fetch(`/api/credit-applications/${id}`, {
          next: { revalidate: 0 },
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(
            data.message || "Error retrieving credit application"
          );
        }
        const data = await res.json();
        console.log(data);
        setForm({
          creditType: data.creditType?.name || "",
          creditTypeId: data.creditTypeId,
          creditTypeAbbrev: data.creditTypeAbbrev || "",
          creditCode: data.creditCode || "",
          activity: data.activity || "",
          sector: data.sector || "",
          activityBranch: data.activityBranch || "",
          specificZone: data.specificZone || "",
          clientStatus: data.clientStatus || "",
          projectCost: data.projectCost?.toString() || "",
          solicitedAmount: data.solicitedAmount?.toString() || "",
          receptionDate: data.receptionDate
            ? data.receptionDate.split("T")[0]
            : "",
          realEstateToFinance: data.realEstateToFinance || "",
          realEstateValue: data.realEstateValue?.toString() || "",
          promoter: data.promoter || "",
          monthlyIncome: data.monthlyIncome?.toString() || "",
          guaranteeIncome: data.guaranteeIncome?.toString() || "",
          theoreticalInstallment: data.theoreticalInstallment?.toString() || "",
          apport: data.apport?.toString() || "",
          pnr: data.pnr || "",
          status: data.status || "PENDING",
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCreditApp();
  }, [id]);

  const handleChange = (e: InputChangeEvent) => {
    setForm((prev) => ({ ...prev, [e.target.name as string]: e.target.value }));
  };

  const handleSelectChange = (e: any) => {
    const selected = e.target.value;
    setForm((prev) => ({
      ...prev,
      creditType: selected ? selected.text : "",
      creditTypeId: selected ? selected.value : "",
    }));
  };

  const handleStatusChange = (e: any) => {
    const selected = e.target.value;
    setForm((prev) => ({ ...prev, status: selected ? selected.value : "" }));
  };

  const validateForm = () => {
    if (!form.creditTypeId || !form.creditTypeAbbrev || !form.creditCode) {
      return "Please fill in all required fields: Credit Type, Abbreviation, and Credit Code.";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const payload = {
        creditTypeId: form.creditTypeId,
        creditTypeAbbrev: form.creditTypeAbbrev,
        creditCode: form.creditCode,
        activity: form.activity,
        sector: form.sector,
        activityBranch: form.activityBranch,
        specificZone: form.specificZone,
        clientStatus: form.clientStatus,
        projectCost: parseFloat(form.projectCost),
        solicitedAmount: parseFloat(form.solicitedAmount),
        receptionDate: form.receptionDate || null,
        realEstateToFinance: form.realEstateToFinance,
        realEstateValue: parseFloat(form.realEstateValue),
        promoter: form.promoter,
        monthlyIncome: parseFloat(form.monthlyIncome),
        guaranteeIncome: parseFloat(form.guaranteeIncome),
        theoreticalInstallment: parseFloat(form.theoreticalInstallment),
        apport: parseFloat(form.apport),
        pnr: form.pnr,
        status: form.status,
      };
      const res = await fetch(`/api/credit-applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error updating credit application");
      }
      router.push("/dashboard/credit-applications");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <KLoader />;
  }

  return (
    <div style={{ margin: "2rem" }}>
      <Card
        style={{
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        <CardTitle>
          <Typography.h4
            style={{ textTransform: "lowercase", textAlign: "center" }}
          >
            Edit Credit Application
          </Typography.h4>
        </CardTitle>
        <CardBody>
          <hr style={{ margin: "1rem 0" }} />
          {error && (
            <Typography.p style={{ color: "red", marginBottom: "1rem" }}>
              {error}
            </Typography.p>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  Credit Type *
                </Typography.p>
                <DropDownList
                  name="creditType"
                  data={
                    creditTypes.length > 0
                      ? creditTypes.map((type) => ({
                          value: type.id,
                          text: type.name,
                        }))
                      : [{ value: "", text: "Loading..." }]
                  }
                  textField="text"
                  dataItemKey="value"
                  value={
                    creditTypes.length > 0 && form.creditTypeId
                      ? creditTypes
                          .map((type) => ({ value: type.id, text: type.name }))
                          .find((item) => item.value === form.creditTypeId) ||
                        null
                      : null
                  }
                  onChange={handleSelectChange}
                />
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  Abbreviation *
                </Typography.p>
                <Input
                  name="creditTypeAbbrev"
                  value={form.creditTypeAbbrev}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ flex: "1 1 100%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  Credit Code *
                </Typography.p>
                <Input
                  name="creditCode"
                  value={form.creditCode}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  Activity
                </Typography.p>
                <Input
                  name="activity"
                  value={form.activity}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  Sector
                </Typography.p>
                <Input
                  name="sector"
                  value={form.sector}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  Business Branch
                </Typography.p>
                <Input
                  name="activityBranch"
                  value={form.activityBranch}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  Specific Zone
                </Typography.p>
                <Input
                  name="specificZone"
                  value={form.specificZone}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ flex: "1 1 100%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  Client Status
                </Typography.p>
                <Input
                  name="clientStatus"
                  value={form.clientStatus}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  Project Cost
                </Typography.p>
                <Input
                  name="projectCost"
                  type="number"
                  value={form.projectCost}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  Solicited Amount
                </Typography.p>
                <Input
                  name="solicitedAmount"
                  type="number"
                  value={form.solicitedAmount}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  Reception Date (YYYY-MM-DD)
                </Typography.p>
                <Input
                  name="receptionDate"
                  type="date"
                  value={form.receptionDate}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  Real Estate to Finance
                </Typography.p>
                <Input
                  name="realEstateToFinance"
                  value={form.realEstateToFinance}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  Real Estate Value
                </Typography.p>
                <Input
                  name="realEstateValue"
                  type="number"
                  value={form.realEstateValue}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  Promoter
                </Typography.p>
                <Input
                  name="promoter"
                  value={form.promoter}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  Monthly Income
                </Typography.p>
                <Input
                  name="monthlyIncome"
                  type="number"
                  value={form.monthlyIncome}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  Guarantee Income
                </Typography.p>
                <Input
                  name="guaranteeIncome"
                  type="number"
                  value={form.guaranteeIncome}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  Theoretical Installment
                </Typography.p>
                <Input
                  name="theoreticalInstallment"
                  type="number"
                  value={form.theoreticalInstallment}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  Contribution
                </Typography.p>
                <Input
                  name="apport"
                  type="number"
                  value={form.apport}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ flex: "1 1 100%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  PNR
                </Typography.p>
                <Input
                  name="pnr"
                  value={form.pnr}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ flex: "1 1 100%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  Application Status
                </Typography.p>
                <DropDownList
                  name="status"
                  data={creditStatusOptions}
                  textField="label"
                  dataItemKey="value"
                  value={
                    creditStatusOptions.find(
                      (opt) => opt.value === form.status
                    ) || { value: "" }
                  }
                  onChange={handleStatusChange}
                />
              </div>
            </div>
            <div style={{ marginTop: "1rem", textAlign: "right" }}>
              <Button
                type="submit"
                themeColor="primary"
                disabled={isSubmitting}
                style={{ textTransform: "lowercase", padding: "0.5rem 1rem" }}
              >
                {isSubmitting ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
      <NotificationGroup
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {error && (
          <Notification
            type={{ style: "error", icon: true }}
            closable={true}
            onClose={() => setError("")}
          >
            {error}
          </Notification>
        )}
      </NotificationGroup>
    </div>
  );
}
