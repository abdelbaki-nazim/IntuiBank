"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { Grid, GridColumn } from "@progress/kendo-react-grid";

export interface AmortizationEntry {
  installmentNumber: number;
  dueDate: string;
  principalPortion: number;
  interestPortion: number;
  scheduledPayment: number;
  amountPaid: number;
  carryOverPayment: number;
  remainingBalance: number;
}

export interface AmortizationData {
  schedule: AmortizationEntry[];
}

interface AmortizationFormProps {
  creditDetails: {
    principalAmount: number;
    termInMonths: number;
    interestRate: number;
  };
  onFinish: (data: AmortizationData) => void;
  disabled?: boolean;
  active?: boolean;
  isSubmitting?: boolean;
}

export default function AmortizationForm({
  creditDetails,
  onFinish,
  disabled,
  active,
  isSubmitting,
}: AmortizationFormProps) {
  const [amortizationSchedule, setAmortizationSchedule] = useState<
    AmortizationEntry[]
  >([]);

  const calculateAmortization = (
    principal: number,
    interestRate: number,
    term: number
  ): AmortizationEntry[] => {
    const schedule: AmortizationEntry[] = [];
    const monthlyRate = interestRate / 100 / 12;
    let monthlyPayment: number;
    if (monthlyRate === 0) {
      monthlyPayment = principal / term;
    } else {
      monthlyPayment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) /
        (Math.pow(1 + monthlyRate, term) - 1);
    }
    let remainingBalance = principal;
    const today = new Date();
    for (let i = 1; i <= term; i++) {
      const interestPortion = remainingBalance * monthlyRate;
      const principalPortion = monthlyPayment - interestPortion;
      remainingBalance -= principalPortion;
      const dueDate = new Date(today);
      dueDate.setMonth(dueDate.getMonth() + i);
      schedule.push({
        installmentNumber: i,
        dueDate: dueDate.toLocaleDateString(),
        principalPortion: parseFloat(principalPortion.toFixed(2)),
        interestPortion: parseFloat(interestPortion.toFixed(2)),
        scheduledPayment: parseFloat(monthlyPayment.toFixed(2)),
        amountPaid: 0,
        carryOverPayment: 0,
        remainingBalance: parseFloat(remainingBalance.toFixed(2)),
      });
    }
    return schedule;
  };

  useEffect(() => {
    if (
      creditDetails.principalAmount > 0 &&
      creditDetails.termInMonths > 0 &&
      creditDetails.interestRate >= 0
    ) {
      const schedule = calculateAmortization(
        creditDetails.principalAmount,
        creditDetails.interestRate,
        creditDetails.termInMonths
      );
      setAmortizationSchedule(schedule);
    }
  }, [creditDetails]);

  const handleFinish = () => {
    const payload: AmortizationData = { schedule: amortizationSchedule };
    onFinish(payload);
  };

  return (
    <div style={{ marginBottom: "48px", marginTop: "16px" }}>
      <h5>Amortization Schedule</h5>
      {amortizationSchedule.length > 0 ? (
        <div style={{ marginTop: "16px" }}>
          <Grid
            data={amortizationSchedule}
            style={{ height: "400px" }}
            resizable={true}
          >
            <GridColumn
              field="installmentNumber"
              title="Installment #"
              width="100px"
              minResizableWidth={80}
            />
            <GridColumn
              field="dueDate"
              title="Due Date"
              width="120px"
              minResizableWidth={100}
            />
            <GridColumn
              field="principalPortion"
              title="Principal"
              width="100px"
              minResizableWidth={80}
            />
            <GridColumn
              field="interestPortion"
              title="Interest"
              width="100px"
              minResizableWidth={80}
            />
            <GridColumn
              field="scheduledPayment"
              title="Scheduled Payment"
              width="130px"
              minResizableWidth={100}
            />
            <GridColumn
              field="amountPaid"
              title="Amount Paid"
              width="100px"
              minResizableWidth={80}
            />
            <GridColumn
              field="carryOverPayment"
              title="Carry-Over"
              width="100px"
              minResizableWidth={80}
            />
            <GridColumn
              field="remainingBalance"
              title="Balance"
              width="100px"
              minResizableWidth={80}
            />
          </Grid>
        </div>
      ) : (
        <p>No schedule available.</p>
      )}
      {active && !disabled && (
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <Button
            disabled={isSubmitting}
            onClick={handleFinish}
            themeColor={"primary"}
          >
            Finish and Approve
          </Button>
        </div>
      )}
    </div>
  );
}
