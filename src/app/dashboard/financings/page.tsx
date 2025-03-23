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

export interface Credit {
  id: string;
  creditApplication: CreditApplication;
}

export interface Financing {
  id: string;
  creditId: string;
  credit: Credit;
  type: string;
  value: number;
  order: number;
  observation?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface GroupedClient {
  client: Client;
  credits: Record<string, Financing[]>;
}

const FinancingPage: React.FC = () => {
  const [financings, setFinancings] = useState<Financing[]>([]);
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
      const res = await fetch("/api/financings", { next: { revalidate: 0 } });
      if (!res.ok) {
        throw new Error("Error loading financings");
      }
      const data: Financing[] = await res.json();
      setFinancings(data);
    } catch (error) {
      console.error("Error loading financings:", error);
      setToast({ message: "Error loading financings", severity: "error" });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const grouped: Record<string, GroupedClient> = {};

    financings.forEach((fin) => {
      const client = fin.credit.creditApplication.account.client;
      if (!grouped[client.id]) {
        grouped[client.id] = { client, credits: {} };
      }
      const creditId = fin.credit.id;
      if (!grouped[client.id].credits[creditId]) {
        grouped[client.id].credits[creditId] = [];
      }
      grouped[client.id].credits[creditId].push(fin);
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
  }, [financings, search]);

  const handleValidateFinancing = async (financingId: string) => {
    setUpdateLoading(financingId);
    try {
      const res = await fetch(`/api/financings/${financingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ observation: "Validated" }),
      });
      if (!res.ok) {
        throw new Error("Error updating financing");
      }
      setFinancings((prev) =>
        prev.map((fin) =>
          fin.id === financingId ? { ...fin, observation: "Validated" } : fin
        )
      );
      setToast({ message: "Financing validated", severity: "success" });
    } catch (error) {
      console.error("Error updating financing:", error);
      setToast({ message: "Error updating financing", severity: "error" });
    }
    setUpdateLoading(null);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h4>Financings by Client</h4>
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
              {Object.entries(credits).map(([creditId, financingList]) => (
                <PanelBar key={creditId} style={{ marginBottom: "1rem" }}>
                  <PanelBarItem title={`Credit ID: ${creditId}`}>
                    <div
                      style={{
                        overflowX: "auto",
                        border: "1px solid #ccc",
                        padding: "1rem",
                      }}
                    >
                      <Grid data={financingList}>
                        <Column field="order" title="Order" width="80px" />
                        <Column field="type" title="Type" width="100px" />
                        <Column field="value" title="Value" width="100px" />
                        <Column
                          field="observation"
                          title="Observation"
                          width="130px"
                        />
                        <Column
                          title="Actions"
                          width="150px"
                          cell={(props) => (
                            <td style={{ textAlign: "center" }}>
                              {props.dataItem.observation !== "Validated" && (
                                <Button
                                  onClick={() =>
                                    handleValidateFinancing(props.dataItem.id)
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

export default FinancingPage;
