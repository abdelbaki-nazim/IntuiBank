"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardTitle,
  CardBody,
  CardActions,
} from "@progress/kendo-react-layout";
import { Input } from "@progress/kendo-react-inputs";
import {
  DropDownList,
  DropDownListChangeEvent,
} from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";
import { Typography } from "@progress/kendo-react-common";
import KLoader from "@/app/components/loader/KLoader";

export default function CreateCreditApplicationPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [creditTypes, setCreditTypes] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/credit-types")
      .then((res) => res.json())
      .then((data) => setCreditTypes(data))
      .catch((error) => console.error("Error fetching credit types", error));
  }, []);

  const [form, setForm] = useState({
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
  });

  const [creditTypeId, setCreditTypeId] = useState<string>("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: any) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.value }));
  };

  const handleSelectChange = (e: DropDownListChangeEvent) => {
    const value = e.value.value ?  e.value.value : "";
    setCreditTypeId(value);
  };
  
  const validateForm = () => {
    if (!creditTypeId || !form.creditTypeAbbrev || !form.creditCode) {
      return "Please fill in all required fields (Credit Type, Abbreviation, and solicitedAmount).";
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
        clientId: userId,
        id: id,
        creditTypeId: creditTypeId,
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
      };
      const res = await fetch("/api/credit-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error creating credit application");
      }
      router.push("/dashboard/credit-applications");
    } catch (err: any) {
      console.error(err);
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
            create credit application
          </Typography.h4>
        </CardTitle>
        <CardBody>
          <hr style={{ margin: "1rem 0" }} />
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  Credit Type *
                </Typography.p>
                <DropDownList
                  name="creditTypeId"
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <Typography.p style={{ textTransform: "lowercase" }}>
                  Solicited Amount *
                </Typography.p>
                <Input
                  name="solicitedAmount"
                  type="number"
                  value={form.solicitedAmount}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  style={{ width: "100%" }}
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
                {isSubmitting ? "creating..." : "create application"}
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
