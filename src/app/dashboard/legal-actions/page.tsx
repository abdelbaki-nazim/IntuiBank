"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@progress/kendo-react-inputs";
import { PanelBar, PanelBarItem } from "@progress/kendo-react-layout";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Notification } from "@progress/kendo-react-notification";
import { Form, Field } from "@progress/kendo-react-form";
import Link from "next/link";
import { getFullName } from "../../../../lib/getFullName";
import { Typography } from "@progress/kendo-react-common";
import KLoader from "@/app/components/loader/KLoader";
import { Badge, BadgeContainer } from "@progress/kendo-react-indicators";

interface Client {
  id: string;
  type: "PHYSICAL" | "MORAL";
  status: string;
  personMoral: {
    id: string;
    companyName: string;
  } | null;
  personPhysical: {
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    maidenName?: string;
  } | null;
}

interface Account {
  id: string;
  client: Client;
}

interface CreditApplication {
  id: string;
  account: Account;
}

export interface Credit {
  id: string;
  legalAction: LegalAction[];
  creditApplication: CreditApplication;
}

export interface LegalAction {
  id: string;
  creditId: string;
  unpaidClaim?: number | null;
  invitation?: string | null;
  miseEnDemeure?: string | null;
  lastWarning?: string | null;
  sommation?: string | null;
  pvCarence?: string | null;
  observation?: string | null;
  createdAt: string;
  updatedAt: string;
  credit: Credit;
}

interface GroupedClient {
  client: Client;
  credits: Credit[];
}

const NumberInput = (fieldRenderProps: any) => {
  const { validationMessage, visited, value, ...others } = fieldRenderProps;
  return (
    <div style={{ marginBottom: "10px" }}>
      <Input {...others} type="number" value={value} />
      {visited && validationMessage && (
        <div style={{ color: "red", fontSize: "0.8rem" }}>
          {validationMessage}
        </div>
      )}
    </div>
  );
};

const TextInput = (fieldRenderProps: any) => {
  const { validationMessage, visited, value, ...others } = fieldRenderProps;
  return (
    <div style={{ marginBottom: "10px" }}>
      <Input {...others} value={value} />
      {visited && validationMessage && (
        <div style={{ color: "red", fontSize: "0.8rem" }}>
          {validationMessage}
        </div>
      )}
    </div>
  );
};

const LegalActionsPage: React.FC = () => {
  const [creditsData, setCreditsData] = useState<Credit[]>([]);
  const [groupedData, setGroupedData] = useState<Record<string, GroupedClient>>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [toast, setToast] = useState<{
    message: string;
    severity: "success" | "error" | null;
  }>({
    message: "",
    severity: null,
  });
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedCredit, setSelectedCredit] = useState<Credit | null>(null);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/legal-actions", {
        next: { revalidate: 0 },
      });
      if (!res.ok) {
        throw new Error("Error loading credits");
      }
      const data: Credit[] = await res.json();
      setCreditsData(data);
    } catch (error) {
      console.error("Error fetching credits:", error);
      setToast({ message: "Error loading data", severity: "error" });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const grouped: Record<string, GroupedClient> = {};
    creditsData.forEach((credit) => {
      const client = credit.creditApplication.account.client;
      if (!grouped[client.id]) {
        grouped[client.id] = { client, credits: [] };
      }
      grouped[client.id].credits.push(credit);
    });
    const filtered = Object.values(grouped).reduce((acc, group) => {
      if (
        getFullName(group.client).toLowerCase().includes(search.toLowerCase())
      ) {
        acc[group.client.id] = group;
      }
      return acc;
    }, {} as Record<string, GroupedClient>);
    setGroupedData(filtered);
  }, [creditsData, search]);

  const handleOpenDialog = (credit: Credit) => {
    setSelectedCredit(credit);
    setOpenDialog(true);
  };

  const handleSubmit = async (data: any) => {
    if (!selectedCredit) return;
    const unpaidClaim =
      data.unpaidClaim === "" || isNaN(Number(data.unpaidClaim))
        ? null
        : parseFloat(data.unpaidClaim);
    const payload = { ...data, creditId: selectedCredit.id, unpaidClaim };
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/legal-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error("Error adding legal action");
      }
      const newAction: LegalAction = await res.json();
      setCreditsData((prev) =>
        prev.map((credit) =>
          credit.id === selectedCredit.id
            ? {
                ...credit,
                legalAction: [...(credit.legalAction || []), newAction],
              }
            : credit
        )
      );
      setToast({ message: "Legal action added", severity: "success" });
      setOpenDialog(false);
    } catch (error) {
      console.error(error);
      setToast({ message: "Error adding legal action", severity: "error" });
    }
    setIsSubmitting(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Typography.h4>Legal Actions by Client</Typography.h4>
      <div style={{ marginBottom: "1rem" }}>
        <Input
          placeholder="Search by client name"
          value={search}
          onChange={(e) => setSearch(String(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>
      {loading ? (
        <KLoader />
      ) : Object.keys(groupedData).length === 0 ? (
        <div>No results found</div>
      ) : (
        Object.values(groupedData).map(({ client, credits }) => (
          <PanelBar key={client.id}>
            <PanelBarItem
              title={
                <Link href={`/dashboard/clients/${client.id}`} passHref>
                  {getFullName(client)}
                </Link>
              }
            >
              {credits.map((credit) => (
                <PanelBar key={credit.id} style={{ marginBottom: "1rem" }}>
                  <PanelBarItem
                    title={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <BadgeContainer>
                          <span className="title">Credit ID: {credit.id} </span>
                          <Badge themeColor={"warning"} rounded={"full"}>
                            {credit.legalAction ? credit.legalAction.length : 0}
                          </Badge>
                        </BadgeContainer>

                        <Button
                          onClick={() => handleOpenDialog(credit)}
                          themeColor="base"
                          style={{ marginLeft: "200px" }}
                        >
                          Start Legal Action
                        </Button>
                      </div>
                    }
                  >
                    <div
                      style={{
                        overflowX: "auto",
                        border: "1px solid #ccc",
                        padding: "1rem",
                      }}
                    >
                      <Grid resizable data={credit.legalAction || []}>
                        <Column field="id" title="ID" width="80px" />
                        <Column
                          field="unpaidClaim"
                          title="Unpaid Claim"
                          width="100px"
                        />
                        <Column
                          field="invitation"
                          title="Invitation"
                          width="120px"
                        />
                        <Column
                          field="miseEnDemeure"
                          title="Mise en demeure"
                          width="120px"
                        />
                        <Column
                          field="lastWarning"
                          title="Last Warning"
                          width="120px"
                        />
                        <Column
                          field="sommation"
                          title="Sommation"
                          width="120px"
                        />
                        <Column
                          field="pvCarence"
                          title="PV Carence"
                          width="120px"
                        />
                        <Column
                          field="observation"
                          title="Observation"
                          width="150px"
                        />
                      </Grid>
                    </div>
                  </PanelBarItem>
                </PanelBar>
              ))}
            </PanelBarItem>
          </PanelBar>
        ))
      )}
      {toast.severity && (
        <Notification
          type={{
            style: toast.severity === "success" ? "success" : "error",
            icon: true,
          }}
          closable
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
          }}
          onClose={() => setToast({ message: "", severity: null })}
        >
          {toast.message}
        </Notification>
      )}
      {openDialog && (
        <Dialog
          title="Add Legal Action"
          onClose={() => setOpenDialog(false)}
          width={300}
        >
          <Form
            initialValues={{
              unpaidClaim: "",
              invitation: "",
              miseEnDemeure: "",
              lastWarning: "",
              sommation: "",
              pvCarence: "",
              observation: "",
            }}
            onSubmit={handleSubmit}
            render={(formRenderProps) => (
              <>
                <div style={{ margin: "20px 0", width: "100%" }}>
                  {selectedCredit && (
                    <Typography.p>Credit ID: {selectedCredit.id}</Typography.p>
                  )}
                  <Field
                    name="unpaidClaim"
                    component={NumberInput}
                    label="Unpaid Claim"
                    validator={(value) =>
                      value === "" || isNaN(Number(value)) ? "Required" : ""
                    }
                    style={{ width: "100%" }}
                  />
                  <Field
                    name="invitation"
                    component={TextInput}
                    label="Invitation"
                    style={{ width: "100%" }}
                  />
                  <Field
                    name="miseEnDemeure"
                    component={TextInput}
                    label="Mise en demeure"
                    style={{ width: "100%" }}
                  />
                  <Field
                    name="lastWarning"
                    component={TextInput}
                    label="Last Warning"
                    style={{ width: "100%" }}
                  />
                  <Field
                    name="sommation"
                    component={TextInput}
                    label="Sommation"
                    style={{ width: "100%" }}
                  />
                  <Field
                    name="pvCarence"
                    component={TextInput}
                    label="PV Carence"
                    style={{ width: "100%" }}
                  />
                  <Field
                    name="observation"
                    component={TextInput}
                    label="Observation"
                    style={{ width: "100%" }}
                  />
                </div>
                <div style={{ textAlign: "right" }}>
                  <Button
                    onClick={() => setOpenDialog(false)}
                    themeColor="base"
                    style={{ marginRight: "8px" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={formRenderProps.onSubmit}
                    themeColor="primary"
                  >
                    {isSubmitting ? "Submitting..." : "Add"}
                  </Button>
                </div>
              </>
            )}
          />
        </Dialog>
      )}
    </div>
  );
};

export default LegalActionsPage;
