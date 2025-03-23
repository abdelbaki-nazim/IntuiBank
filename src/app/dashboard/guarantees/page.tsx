"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@progress/kendo-react-inputs";
import { PanelBar, PanelBarItem } from "@progress/kendo-react-layout";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import { Notification } from "@progress/kendo-react-notification";
import Link from "next/link";
import { getFullName } from "../../../../lib/getFullName";
import { Loader } from "@progress/kendo-react-indicators";

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

export interface Guarantee {
  id: string;
  creditId: string;
  guaranteeTypeId?: string | null;
  description?: string | null;
  value?: number | null;
  metadata?: any;
  expiryDate?: string;
  observation?: string | null;
  createdAt: string;
  updatedAt: string;
  credit: Credit;
  guaranteeType?: GuaranteeType | null;
}

export interface GuaranteeType {
  id: string;
  name?: string;
}

export interface Credit {
  id: string;
  creditApplication: CreditApplication;
}

interface GuaranteeEntry extends Guarantee {}

interface GroupedClient {
  client: Client;
  credits: Record<string, GuaranteeEntry[]>;
}

const GuaranteesByClient: React.FC = () => {
  const [guaranteeEntries, setGuaranteeEntries] = useState<GuaranteeEntry[]>(
    []
  );
  const [groupedData, setGroupedData] = useState<Record<string, GroupedClient>>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [toast, setToast] = useState<{
    message: string;
    severity: "success" | "error" | null;
  }>({
    message: "",
    severity: null,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/guarantees", { next: { revalidate: 0 } });
      if (!res.ok) {
        throw new Error("Error loading guarantees");
      }
      const data: GuaranteeEntry[] = await res.json();
      setGuaranteeEntries(data);
    } catch (error) {
      console.error("Error retrieving guarantees:", error);
      setToast({
        message: "Error loading guarantees",
        severity: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleValidateGuarantee = async (guaranteeId: string) => {
    setUpdateLoading(guaranteeId);
    try {
      const res = await fetch(`/api/guarantees/${guaranteeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ observation: "Validée" }),
      });
      if (!res.ok) {
        throw new Error("Error updating");
      }
      setGuaranteeEntries((prev) =>
        prev.map((entry) =>
          entry.id === guaranteeId
            ? { ...entry, observation: "Validée" }
            : entry
        )
      );
      setToast({ message: "Guarantee validated", severity: "success" });
    } catch (error) {
      console.error("Error updating guarantee:", error);
      setToast({ message: "Error updating", severity: "error" });
    }
    setUpdateLoading(null);
  };

  useEffect(() => {
    const grouped: Record<string, GroupedClient> = {};

    guaranteeEntries.forEach((entry) => {
      const client = entry.credit.creditApplication.account.client;
      if (!grouped[client.id]) {
        grouped[client.id] = { client, credits: {} };
      }
      const creditId = entry.credit.id;
      if (!grouped[client.id].credits[creditId]) {
        grouped[client.id].credits[creditId] = [];
      }
      grouped[client.id].credits[creditId].push(entry);
    });

    const filteredGrouped = Object.values(grouped).reduce((acc, group) => {
      if (
        getFullName(group.client).toLowerCase().includes(search.toLowerCase())
      ) {
        acc[group.client.id] = group;
      }
      return acc;
    }, {} as Record<string, GroupedClient>);

    setGroupedData(filteredGrouped);
  }, [guaranteeEntries, search]);

  return (
    <div style={{ padding: "2rem" }}>
      <h4>Guarantees by Client</h4>
      <div style={{ marginBottom: "1rem" }}>
        <Input
          placeholder="Search by client name"
          value={search}
          onChange={(e) => setSearch(String(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Loader />
        </div>
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
              {Object.entries(credits).map(([creditId, guaranteeList]) => (
                <PanelBar key={creditId} style={{ marginBottom: "1rem" }}>
                  <PanelBarItem
                    title={`Credit ID: ${creditId}`}
                    expanded={true}
                  >
                    <div
                      style={{
                        overflowX: "auto",
                        border: "1px solid #ccc",
                        padding: "1rem",
                      }}
                    >
                      <Grid data={guaranteeList}>
                        <Column field="id" title="ID" width="80px" />
                        <Column
                          field="description"
                          title="Description"
                          width="150px"
                        />
                        <Column field="value" title="Value" width="100px" />
                        <Column
                          field="expiryDate"
                          title="Expiry Date"
                          width="130px"
                          cell={(props) => (
                            <td style={{ textAlign: "center" }}>
                              {props.dataItem.expiryDate
                                ? new Date(
                                    props.dataItem.expiryDate
                                  ).toLocaleDateString()
                                : "-"}
                            </td>
                          )}
                        />
                        <Column
                          field="observation"
                          title="Observation"
                          width="130px"
                        />
                        <Column
                          field="guaranteeType"
                          title="Type"
                          width="100px"
                          cell={(props) => (
                            <td style={{ textAlign: "center" }}>
                              {props.dataItem.guaranteeType?.name ?? "-"}
                            </td>
                          )}
                        />
                        <Column
                          title="Actions"
                          width="150px"
                          cell={(props) => (
                            <td style={{ textAlign: "center" }}>
                              {props.dataItem.observation !== "Validée" && (
                                <Button
                                  onClick={() =>
                                    handleValidateGuarantee(props.dataItem.id)
                                  }
                                  disabled={updateLoading === props.dataItem.id}
                                  themeColor="primary"
                                >
                                  {updateLoading === props.dataItem.id
                                    ? "Loading..."
                                    : "Validate"}
                                </Button>
                              )}
                            </td>
                          )}
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
    </div>
  );
};

export default GuaranteesByClient;
