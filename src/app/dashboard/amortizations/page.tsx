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

export interface AmortizationEntry {
  id: string;
  installmentNumber: number;
  dueDate: string;
  principalPortion?: number | null;
  interestPortion?: number | null;
  scheduledPayment?: number | null;
  amountPaid?: number | null;
  carryOverPayment?: number | null;
  remainingBalance?: number | null;
  paid: boolean;
}

export interface Credit {
  id: string;
  amortizationEntries: AmortizationEntry[];
  creditApplication: CreditApplication;
}

interface EntryData extends AmortizationEntry {
  credit: Credit;
}

interface GroupedClient {
  client: Client;
  credits: Credit[];
}

const AmortizationByClient: React.FC = () => {
  const [entries, setEntries] = useState<EntryData[]>([]);
  const [groupedData, setGroupedData] = useState<Record<string, GroupedClient>>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [paymentInputs, setPaymentInputs] = useState<Record<string, string>>(
    {}
  );
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
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
      const res = await fetch("/api/amortization-entries", {
        next: { revalidate: 0 },
      });
      if (!res.ok) {
        throw new Error("Error loading data");
      }
      const data: EntryData[] = await res.json();
      setEntries(data);
    } catch (error) {
      console.error("Error retrieving data:", error);
      setToast({
        message: "Error loading data",
        severity: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdatePayment = async (entryId: string) => {
    const inputValue = paymentInputs[entryId];
    const parsedValue = parseFloat(inputValue);
    if (isNaN(parsedValue)) {
      setToast({
        message: "Please enter a valid amount",
        severity: "error",
      });
      return;
    }
    setUpdateLoading(entryId);
    try {
      const res = await fetch(`/api/amortization-entries/${entryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountPaid: parsedValue }),
      });
      if (!res.ok) {
        throw new Error("Error updating");
      }
      await fetchData();
      setToast({ message: "Payment updated", severity: "success" });
      setPaymentInputs((prev) => ({ ...prev, [entryId]: "" }));
      setEditingRowId(null);
    } catch (error) {
      console.error("Error updating entry:", error);
      setToast({ message: "Error updating", severity: "error" });
    }
    setUpdateLoading(null);
  };

  useEffect(() => {
    const creditMap = new Map<string, Credit>();
    entries.forEach((entry) => {
      if (!creditMap.has(entry.credit.id)) {
        creditMap.set(entry.credit.id, entry.credit);
      }
    });

    const grouped: Record<string, GroupedClient> = {};
    creditMap.forEach((credit) => {
      const client = credit.creditApplication.account.client;
      if (!grouped[client.id]) {
        grouped[client.id] = { client, credits: [] };
      }
      grouped[client.id].credits.push(credit);
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
  }, [entries, search]);

  return (
    <div style={{ padding: "2rem" }}>
      <h4>Amortization Schedule by Client</h4>
      <div style={{ marginBottom: "1rem" }}>
        <Input
          placeholder="Search by client name"
          value={search}
          onChange={(e) => setSearch(String(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem",
          }}
        >
          <Loader />
        </div>
      ) : Object.keys(groupedData).length === 0 ? (
        <div>No results found</div>
      ) : (
        Object.values(groupedData).map(({ client, credits }) => (
          <PanelBar key={client.id}>
            <PanelBarItem
              title={
                <Link
                  href={`/dashboard/clients/${client.id}/${getFullName(
                    client
                  )}`}
                >
                  {getFullName(client)}
                </Link>
              }
            >
              {credits.map((credit) => {
                const totalDifferential = credit.amortizationEntries.reduce(
                  (acc, entry) => acc + (entry.carryOverPayment || 0),
                  0
                );
                return (
                  <PanelBar key={credit.id}>
                    <PanelBarItem title={`Credit ID: ${credit.id}`}>
                      <div
                        style={{
                          overflowX: "auto",
                          border: "1px solid #ccc",
                          padding: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        <Grid
                          pageable={true}
                          resizable={true}
                          data={credit.amortizationEntries}
                        >
                          <Column
                            field="installmentNumber"
                            title="Installment"
                            width="80px"
                            cell={(props) => (
                              <td style={{ textAlign: "center" }}>
                                {props.dataItem.installmentNumber.toLocaleString(
                                  "en-US"
                                )}
                              </td>
                            )}
                          />
                          <Column
                            field="dueDate"
                            title="Due Date"
                            width="150px"
                            cell={(props) => (
                              <td style={{ textAlign: "center" }}>
                                {new Date(
                                  props.dataItem.dueDate
                                ).toLocaleDateString()}
                              </td>
                            )}
                          />
                          <Column
                            field="principalPortion"
                            title="Principal"
                            width="120px"
                            cell={(props) => (
                              <td style={{ textAlign: "center" }}>
                                {props.dataItem.principalPortion != null
                                  ? props.dataItem.principalPortion.toLocaleString(
                                      "en-US"
                                    )
                                  : "-"}
                              </td>
                            )}
                          />
                          <Column
                            field="interestPortion"
                            title="Interests"
                            width="120px"
                            cell={(props) => (
                              <td style={{ textAlign: "center" }}>
                                {props.dataItem.interestPortion != null
                                  ? props.dataItem.interestPortion.toLocaleString(
                                      "en-US"
                                    )
                                  : "-"}
                              </td>
                            )}
                          />
                          <Column
                            field="scheduledPayment"
                            title="Scheduled Payment"
                            width="120px"
                            cell={(props) => (
                              <td style={{ textAlign: "center" }}>
                                {props.dataItem.scheduledPayment != null
                                  ? props.dataItem.scheduledPayment.toLocaleString(
                                      "en-US"
                                    )
                                  : "-"}
                              </td>
                            )}
                          />
                          <Column
                            field="amountPaid"
                            title="Amount Paid"
                            width="120px"
                            cell={(props) => {
                              if (editingRowId === props.dataItem.id) {
                                return (
                                  <td style={{ textAlign: "center" }}>
                                    <Input
                                      type="number"
                                      placeholder="Amount Paid"
                                      value={
                                        paymentInputs[props.dataItem.id] !==
                                        undefined
                                          ? paymentInputs[props.dataItem.id]
                                          : props.dataItem.amountPaid ?? ""
                                      }
                                      onChange={(e) =>
                                        setPaymentInputs((prev) => ({
                                          ...prev,
                                          [props.dataItem.id]: e.target.value,
                                        }))
                                      }
                                      style={{ minWidth: "80px" }}
                                    />
                                  </td>
                                );
                              }
                              return (
                                <td style={{ textAlign: "center" }}>
                                  {props.dataItem.amountPaid != null
                                    ? props.dataItem.amountPaid.toLocaleString(
                                        "en-US"
                                      )
                                    : "-"}
                                </td>
                              );
                            }}
                          />
                          <Column
                            field="carryOverPayment"
                            title="Carry Over"
                            width="120px"
                            cell={(props) => (
                              <td style={{ textAlign: "center" }}>
                                {props.dataItem.carryOverPayment != null
                                  ? props.dataItem.carryOverPayment.toLocaleString(
                                      "en-US"
                                    )
                                  : "-"}
                              </td>
                            )}
                          />
                          <Column
                            field="remainingBalance"
                            title="Remaining Balance"
                            width="120px"
                            cell={(props) => (
                              <td style={{ textAlign: "center" }}>
                                {props.dataItem.remainingBalance != null
                                  ? props.dataItem.remainingBalance.toLocaleString(
                                      "en-US"
                                    )
                                  : "-"}
                              </td>
                            )}
                          />
                          <Column
                            field="paid"
                            title="Paid"
                            width="80px"
                            cell={(props) => (
                              <td style={{ textAlign: "center" }}>
                                {props.dataItem.paid ? "Yes" : "No"}
                              </td>
                            )}
                          />
                          <Column
                            title="Actions"
                            width="150px"
                            cell={(props) => (
                              <td style={{ textAlign: "center" }}>
                                {editingRowId === props.dataItem.id ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "0.5rem",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Button
                                      onClick={() =>
                                        handleUpdatePayment(props.dataItem.id)
                                      }
                                      disabled={
                                        updateLoading === props.dataItem.id
                                      }
                                    >
                                      {updateLoading === props.dataItem.id
                                        ? "Loading..."
                                        : "Save"}
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setEditingRowId(null);
                                        setPaymentInputs((prev) => ({
                                          ...prev,
                                          [props.dataItem.id]: "",
                                        }));
                                      }}
                                      themeColor="base"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    onClick={() => {
                                      setEditingRowId(props.dataItem.id);
                                      setPaymentInputs((prev) => ({
                                        ...prev,
                                        [props.dataItem.id]:
                                          props.dataItem.amountPaid !== null
                                            ? String(props.dataItem.amountPaid)
                                            : "",
                                      }));
                                    }}
                                  >
                                    Edit
                                  </Button>
                                )}
                              </td>
                            )}
                          />
                          <Column
                            title="Total Differential"
                            width="120px"
                            cell={() => (
                              <td style={{ textAlign: "center" }}>
                                {totalDifferential.toLocaleString("en-US")}
                              </td>
                            )}
                          />
                        </Grid>
                      </div>
                    </PanelBarItem>
                  </PanelBar>
                );
              })}
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

export default AmortizationByClient;
