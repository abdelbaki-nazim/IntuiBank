"use client";

import React from "react";
import { ClientType, DocumentType } from "@/../types/models";

const formatDate = (date?: Date | string): string => {
  if (!date) return "";
  return typeof date === "string" ? date : date.toISOString().split("T")[0];
};

export interface ClientFormData {
  client: Partial<{
    type: ClientType;
  }>;
  personPhysical?: Partial<{}> & { birthDate?: string };
  personMoral?: Partial<{}> & { businessCreationDate?: string };
  identityDocuments: Partial<{
    documentType: DocumentType;
    documentNumber: string;
    issueDate: string;
    issuedBy: string;
  }>[];
  activity?: Partial<{}>;
}

export interface WizardContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formState: ClientFormData;
  setFormState: (state: ClientFormData) => void;
}

export const WizardContext = React.createContext<WizardContextType>({
  currentStep: 0,
  setCurrentStep: () => {},
  formState: {
    client: { type: ClientType.PHYSICAL },
    identityDocuments: [
      {
        documentType: DocumentType.CNIBE,
        documentNumber: "",
        issueDate: formatDate(new Date()),
        issuedBy: "",
      },
    ],
  },
  setFormState: () => {},
});
