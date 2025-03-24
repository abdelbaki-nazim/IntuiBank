"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { PDFExport } from "@progress/kendo-react-pdf";
import { QRCode } from "@progress/kendo-react-barcodes";
import { Button } from "@progress/kendo-react-buttons";
import {
  Grid,
  GridColumn as Column,
  GridCustomCellProps,
} from "@progress/kendo-react-grid";
import { getFullName } from "../../../../../../lib/getFullName";
import { Typography } from "@progress/kendo-react-common";
import Image from "next/image";
import KLoader from "@/app/components/loader/KLoader";

export default function CreditSummaryPage() {
  const params = useParams();
  const id = params.id;
  const [statusData, setStatusData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pdfExportComponent = useRef<PDFExport>(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch(
          `/api/credit-applications/${id}/status?getAllRelatedData=true`,
          { next: { revalidate: 0 } }
        );
        if (!res.ok) {
          throw new Error("Error fetching status");
        }
        const data = await res.json();
        setStatusData(data);
      } catch (error) {
        console.error("Error fetching summary data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, [id]);

  const creditApp = statusData?.CreditApplication?.data;
  const creditDetails = statusData?.creditDetails?.data;
  const guarantee = statusData?.guarantee?.data;
  const financing = statusData?.financing?.data;
  const amortization = statusData?.amortization?.data;

  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHref(window.location.href);
    }
  }, []);

  const exportPDF = () => {
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save();
    }
  };

  if (loading) {
    return <KLoader />;
  }

  return (
    <>
      <PDFExport
        ref={pdfExportComponent}
        paperSize="A4"
        margin="0.2cm"
        scale={0.7}
        author="IntuiBank"
        date={new Date()}
        title="Credit Summary"
      >
        <div
          style={{
            padding: "2rem",
            border: "2px solid #1976d2",
            borderRadius: "8px",
            backgroundColor: "#fff",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <Image src="/logo.svg" alt="Logo" width={250} height={150} />
          </div>

          <Typography.h4 style={{ textAlign: "center" }}>
            Credit Application Summary
          </Typography.h4>
          <hr style={{ margin: "1rem 0" }} />

          {/* Client Profile Section */}
          {statusData?.CreditApplication?.data?.account?.client && (
            <div
              style={{
                padding: "1rem",
                borderRadius: "8px",
                textAlign: "center",
                border: "1px solid #ccc",
                maxWidth: "500px",
                margin: "1rem auto",
              }}
            >
              <Typography.h5 style={{ color: "#1976d2" }}>
                {getFullName(
                  statusData?.CreditApplication?.data?.account?.client
                ) || "Client Name"}
              </Typography.h5>
              <a
                href={`/dashboard/clients/${statusData?.CreditApplication?.data?.account?.client?.id}/${statusData?.CreditApplication?.data?.account?.client?.type}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "4px",
                  marginTop: "0.5rem",
                }}
              >
                View Profile
              </a>
            </div>
          )}

          <div
            style={{
              padding: "1rem",
              marginBottom: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <Typography.h5>Credit Application</Typography.h5>
            {creditApp ? (
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div style={{ width: "50%", marginBottom: "0.5rem" }}>
                  <strong>Code:</strong> {creditApp.creditCode}
                </div>
                <div style={{ width: "50%", marginBottom: "0.5rem" }}>
                  <strong>Credit Type:</strong> {creditApp.creditType?.name}
                </div>
                <div style={{ width: "50%", marginBottom: "0.5rem" }}>
                  <strong>Activity:</strong> {creditApp.activity}
                </div>
                <div style={{ width: "50%", marginBottom: "0.5rem" }}>
                  <strong>Sector:</strong> {creditApp.sector}
                </div>
                <div style={{ width: "50%", marginBottom: "0.5rem" }}>
                  <strong>Solicited Amount:</strong>{" "}
                  {creditApp.solicitedAmount?.toLocaleString()}
                </div>
              </div>
            ) : (
              <Typography.p>No Credit Application data available.</Typography.p>
            )}
          </div>

          <div
            style={{
              padding: "1rem",
              marginBottom: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <Typography.h5>Credit Details</Typography.h5>
            {creditDetails ? (
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div style={{ width: "50%", marginBottom: "0.5rem" }}>
                  <strong>Credit Number:</strong> {creditDetails.creditNumber}
                </div>
                <div style={{ width: "50%", marginBottom: "0.5rem" }}>
                  <strong>Borrowed Amount:</strong>{" "}
                  {creditDetails.principalAmount.toLocaleString()}
                </div>
                <div style={{ width: "50%", marginBottom: "0.5rem" }}>
                  <strong>Interest Rate:</strong> {creditDetails.interestRate}%
                </div>
                <div style={{ width: "50%", marginBottom: "0.5rem" }}>
                  <strong>Term (months):</strong> {creditDetails.termInMonths}
                </div>
                <div style={{ width: "50%", marginBottom: "0.5rem" }}>
                  <strong>Start Date:</strong>{" "}
                  {new Date(creditDetails.startDate).toLocaleDateString()}
                </div>
                <div style={{ width: "50%", marginBottom: "0.5rem" }}>
                  <strong>End Date:</strong>{" "}
                  {new Date(creditDetails.endDate).toLocaleDateString()}
                </div>
                <div style={{ width: "50%", marginBottom: "0.5rem" }}>
                  <strong>Monthly Installment:</strong>{" "}
                  {creditDetails.monthlyInstallment.toLocaleString()}
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography.p>No Credit Details available.</Typography.p>
                <a
                  href={`/dashboard/credit-applications/${id}/approval`}
                  style={{
                    display: "inline-block",
                    padding: "0.5rem 1rem",
                    border: "1px solid #1976d2",
                    color: "#1976d2",
                    textDecoration: "none",
                    borderRadius: "4px",
                  }}
                >
                  Add Credit
                </a>
              </div>
            )}
          </div>

          <div
            style={{
              padding: "1rem",
              marginBottom: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <Typography.h5>Guarantee</Typography.h5>
            {guarantee ? (
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div style={{ width: "50%", marginBottom: "0.5rem" }}>
                  <strong>Description:</strong> {guarantee.description}
                </div>
                <div style={{ width: "50%", marginBottom: "0.5rem" }}>
                  <strong>Value:</strong> {guarantee.value.toLocaleString()}
                </div>
                <div style={{ width: "50%", marginBottom: "0.5rem" }}>
                  <strong>Expiry Date:</strong>{" "}
                  {new Date(guarantee.expiryDate).toLocaleDateString()}
                </div>
                {guarantee.observation && (
                  <div style={{ width: "50%", marginBottom: "0.5rem" }}>
                    <strong>Observation:</strong> {guarantee.observation}
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography.p>No Guarantee data available.</Typography.p>
                <a
                  href={`/dashboard/credit-applications/${id}/approval`}
                  style={{
                    display: "inline-block",
                    padding: "0.5rem 1rem",
                    border: "1px solid #1976d2",
                    color: "#1976d2",
                    textDecoration: "none",
                    borderRadius: "4px",
                  }}
                >
                  Add Guarantee
                </a>
              </div>
            )}
          </div>

          <div
            style={{
              padding: "1rem",
              marginBottom: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <Typography.h5>Financing</Typography.h5>
            {Array.isArray(financing) && financing.length > 0 ? (
              financing.map((fin: any, index: number) => (
                <div key={index} style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    <div style={{ width: "50%", marginBottom: "0.5rem" }}>
                      <strong>Type:</strong> {fin.type || "N/A"}
                    </div>
                    <div style={{ width: "50%", marginBottom: "0.5rem" }}>
                      <strong>Value:</strong>{" "}
                      {fin.value ? fin.value.toLocaleString() : "0"}
                    </div>
                    <div style={{ width: "50%", marginBottom: "0.5rem" }}>
                      <strong>Order:</strong> {fin.order || "0"}
                    </div>
                    {fin.observation && (
                      <div style={{ width: "50%", marginBottom: "0.5rem" }}>
                        <strong>Observation:</strong> {fin.observation || ""}
                      </div>
                    )}
                  </div>
                  {index !== financing.length - 1 && (
                    <hr style={{ margin: "0.5rem 0" }} />
                  )}
                </div>
              ))
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography.p>No Financing data available.</Typography.p>
                <a
                  href={`/dashboard/credit-applications/${id}/approval`}
                  style={{
                    display: "inline-block",
                    padding: "0.5rem 1rem",
                    border: "1px solid #1976d2",
                    color: "#1976d2",
                    textDecoration: "none",
                    borderRadius: "4px",
                  }}
                >
                  Add Financing
                </a>
              </div>
            )}
          </div>

          <div
            style={{
              padding: "1rem",
              marginBottom: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <Typography.h5>Amortization</Typography.h5>
            {amortization &&
            Array.isArray(amortization) &&
            amortization.length > 0 ? (
              <Grid resizable data={amortization}>
                <Column
                  field="installmentNumber"
                  title="Installment"
                  width={"60px"}
                />
                <Column
                  field="dueDate"
                  title="Date"
                  width={"110px"}
                  cell={(props) => (
                    <td>
                      {new Date(props.dataItem.dueDate).toLocaleDateString()}
                    </td>
                  )}
                />
                <Column
                  field="principalPortion"
                  title="Principal"
                  cell={(props) => (
                    <td>{props.dataItem.principalPortion.toLocaleString()}</td>
                  )}
                />
                <Column
                  field="interestPortion"
                  title="Interest"
                  cell={(props) => (
                    <td>{props.dataItem.interestPortion.toLocaleString()}</td>
                  )}
                />
                <Column
                  field="scheduledPayment"
                  title="Scheduled Payment"
                  cell={(props) => (
                    <td>{props.dataItem.scheduledPayment.toLocaleString()}</td>
                  )}
                />
                <Column
                  field="amountPaid"
                  title="Amount Paid"
                  cell={(props) => (
                    <td>{props.dataItem.amountPaid.toLocaleString()}</td>
                  )}
                />
                <Column
                  field="carryOverPayment"
                  title="Carry-Over"
                  cell={(props) => (
                    <td>{props.dataItem.carryOverPayment.toLocaleString()}</td>
                  )}
                />
                <Column
                  field="remainingBalance"
                  title="Balance"
                  cell={(props) => (
                    <td>{props.dataItem.remainingBalance.toLocaleString()}</td>
                  )}
                />
                <Column
                  field="paid"
                  title="Paid"
                  cell={(props: GridCustomCellProps) => (
                    <td
                      {...props.tdProps}
                      style={{
                        ...props.tdProps?.style,
                        backgroundColor: "rgb(55, 180, 0,0.32)",
                      }}
                    >
                      {typeof props.dataItem.paid === "boolean"
                        ? props.dataItem.paid
                          ? "✔"
                          : "No"
                        : "N/A"}
                    </td>
                  )}
                />
              </Grid>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography.p>No Amortization schedule available.</Typography.p>
                <a
                  href={`/dashboard/credit-applications/${id}/approval`}
                  style={{
                    display: "inline-block",
                    padding: "0.5rem 1rem",
                    border: "1px solid #1976d2",
                    color: "#1976d2",
                    textDecoration: "none",
                    borderRadius: "4px",
                  }}
                >
                  Add Schedule
                </a>
              </div>
            )}
          </div>

          {/* QR Code */}
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Typography.h5>Scan for Details</Typography.h5>
            <QRCode
              value={href || "https://intuibank.vercel.app/dashboard"}
              size={128}
            />
          </div>
        </div>
      </PDFExport>

      <div
        style={{ textAlign: "center", marginTop: "2rem", marginBottom: "3rem" }}
      >
        <Button onClick={exportPDF} themeColor={"primary"}>
          Download PDF
        </Button>
      </div>
    </>
  );
}
