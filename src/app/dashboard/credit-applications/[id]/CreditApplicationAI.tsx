"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import {
  NotificationGroup,
  Notification,
} from "@progress/kendo-react-notification";
import { Typography } from "@progress/kendo-react-common";
import KLoader from "@/app/components/loader/KLoader";
import { Typewriter } from "react-simple-typewriter";

interface AIRiskAssessment {
  riskScore: number;
  riskCategory: "Low" | "Medium" | "High";
  riskComments: string;
  historyImpact: string;
}

export default function CreditApplicationAI() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [assessment, setAssessment] = useState<AIRiskAssessment | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Cursor state for each Typewriter field
  const [showScoreCursor, setShowScoreCursor] = useState<boolean>(true);
  const [showCategoryCursor, setShowCategoryCursor] = useState<boolean>(true);
  const [showCommentsCursor, setShowCommentsCursor] = useState<boolean>(true);
  const [showHistoryCursor, setShowHistoryCursor] = useState<boolean>(true);

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("info");

  const openSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Trigger the AI assessment by calling the API endpoint.
  const runAssessment = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/credit-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creditApplicationId: id }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error running AI assessment");
      }

      const data = await res.json();
      // data.text is an array of strings, join and clean the markdown if present.
      let rawText: string = Array.isArray(data.text)
        ? data.text.join(" ")
        : data.text;
      rawText = rawText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      // Parse the cleaned text as JSON and store it.
      const parsed: AIRiskAssessment = JSON.parse(rawText);
      setAssessment(parsed);
      // Reset cursor states (if re-run).
      setShowScoreCursor(true);
      setShowCategoryCursor(true);
      setShowCommentsCursor(true);
      setShowHistoryCursor(true);
      openSnackbar("AI assessment generated", "success");
    } catch (err: any) {
      setError(err.message || "Error running assessment");
      openSnackbar(err.message || "Error running assessment", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      style={{
        margin: "2rem",
        padding: "1.5rem",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <Typography.h4 style={{ marginBottom: "1rem" }}>
        AI Risk Assessment
      </Typography.h4>

      {!assessment && !loading && (
        <div style={{ marginTop: "1rem" }}>
          <Button onClick={runAssessment} disabled={loading}>
            {loading ? "Generating Assessment..." : "Run AI Assessment"}
          </Button>
        </div>
      )}

      {loading && <KLoader />}

      {assessment && (
        <div
          style={{ marginTop: "1rem", textAlign: "left", lineHeight: "1.6" }}
        >
          <Typography.h6>Risk Score:</Typography.h6>
          <p
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: assessment.riskScore > 75 ? "red" : "green",
            }}
          >
            <Typewriter
              words={[`${assessment.riskScore}/100`]}
              loop={1}
              cursor={showScoreCursor}
              cursorStyle="|"
              typeSpeed={100}
              deleteSpeed={60}
              onLoopDone={() => setShowScoreCursor(false)}
            />
          </p>

          <Typography.h6>Risk Category:</Typography.h6>
          <p
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: assessment.riskCategory === "High" ? "red" : "green",
            }}
          >
            <Typewriter
              words={[assessment.riskCategory]}
              loop={1}
              cursor={showCategoryCursor}
              cursorStyle="|"
              typeSpeed={40}
              deleteSpeed={20}
              onLoopDone={() => setShowCategoryCursor(false)}
            />
          </p>

          <Typography.h6>Risk Comments:</Typography.h6>
          <p style={{ fontSize: "16px" }}>
            <Typewriter
              words={[assessment.riskComments]}
              loop={1}
              cursor={showCommentsCursor}
              cursorStyle="|"
              typeSpeed={30}
              deleteSpeed={15}
              onLoopDone={() => setShowCommentsCursor(false)}
            />
          </p>

          <Typography.h6>History Impact:</Typography.h6>
          <p style={{ fontSize: "16px" }}>
            <Typewriter
              words={[assessment.historyImpact]}
              loop={1}
              cursor={showHistoryCursor}
              cursorStyle="|"
              typeSpeed={30}
              deleteSpeed={15}
              onLoopDone={() => setShowHistoryCursor(false)}
            />
          </p>
        </div>
      )}

      {error && (
        <div style={{ marginTop: "1rem" }}>
          <Typography.p style={{ color: "red" }}>{error}</Typography.p>
        </div>
      )}

      <NotificationGroup
        style={{
          position: "fixed",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {snackbarOpen && (
          <Notification
            type={{ style: snackbarSeverity, icon: true }}
            closable
            onClose={() => setSnackbarOpen(false)}
          >
            {snackbarMessage}
          </Notification>
        )}
      </NotificationGroup>
    </Card>
  );
}
