"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  TabStrip,
  TabStripTab,
  TabStripSelectEventArguments,
} from "@progress/kendo-react-layout";
import { Form, FormElement, FormRenderProps } from "@progress/kendo-react-form";
import { Button } from "@progress/kendo-react-buttons";
import { Slide } from "@progress/kendo-react-animation";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";
import { Typography } from "@progress/kendo-react-common";

import { GeneralTab } from "./GeneralTab";
import { IdentityTab } from "./IdentityTab";
import { DetailsMoralTab } from "./DetailsMoralTab";
import { CredentialsTab } from "./CredentialsTab";
import { ActivityTypeTab } from "./ActivityTypeTab";
import { ActivityTab } from "./ActivityTab";

import { ClientType as ClientTypeEnum } from "@/../types/models";
import { ClientFormData } from "./types"; 
import KLoader from "@/app/components/loader/KLoader";

const formatDate = (date?: Date | string): string =>
  !date
    ? ""
    : typeof date === "string"
    ? date
    : date.toISOString().split("T")[0];

const ClientEditPage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const searchParams = useSearchParams();
  const paramType = searchParams.get("type");
  const type: ClientTypeEnum =
    paramType && ["PHYSICAL", "MORAL"].includes(paramType)
      ? (paramType as ClientTypeEnum)
      : ClientTypeEnum.PHYSICAL;

  const [formData, setFormData] = useState<ClientFormData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); 
  const [activeTab, setActiveTab] = useState<number>(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    async function fetchClient() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/clients/${id}?type=${type}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Unknown error");
        }
        const data = await res.json();
        setFormData(data);
      } catch (error: any) {
        setSnackbar({
          open: true,
          message: error.message || "Error loading client",
          severity: "error",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchClient();
  }, [id, type]);

  const handleTabSelect = (e: TabStripSelectEventArguments): void => {
    setActiveTab(e.selected);
  };

  const handleFieldChange =
    (
      section:
        | "client"
        | "personPhysical"
        | "personMoral"
        | "identity"
        | "activity"
    ) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!formData) return;
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };

  const handleSubmit = async (
    values: { [name: string]: any },
    event?: React.SyntheticEvent
  ): Promise<void> => {
    const data = values as ClientFormData;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const responseData = await res.json();
        throw new Error(responseData.error || "Unknown error");
      }
      setSnackbar({
        open: true,
        message: "Client updated successfully",
        severity: "success",
      });
      setTimeout(() => {
        router.push(`/dashboard/clients/${id}/${paramType}`);
      }, 2000);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to update",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !formData) {
    return <KLoader />;
  }

  const isMoral =
    formData.type === ClientTypeEnum.MORAL || !!formData.personMoral;

  return (
    <div style={{ maxWidth: "768px", margin: "auto", padding: "32px" }}>
      <Typography.h4 style={{ textAlign: "center" }}>Edit Client</Typography.h4>
      <Form
        initialValues={formData}
        onSubmit={handleSubmit}
        render={(formRenderProps: FormRenderProps) => (
          <>
            <TabStrip
              selected={activeTab}
              onSelect={handleTabSelect}
              keepTabsMounted={true}
            >
              <TabStripTab title="General">
                <div style={{ padding: "16px" }}>
                  <GeneralTab
                    formData={formData}
                    onFieldChange={handleFieldChange}
                  />
                </div>
              </TabStripTab>
              <TabStripTab title="Identity">
                <div style={{ padding: "16px" }}>
                  <IdentityTab
                    formData={formData}
                    onFieldChange={handleFieldChange}
                  />
                </div>
              </TabStripTab>
              {isMoral ? (
                <TabStripTab title="Details">
                  <div style={{ padding: "16px" }}>
                    <DetailsMoralTab
                      formData={formData}
                      onFieldChange={handleFieldChange}
                    />
                  </div>
                </TabStripTab>
              ) : (
                [
                  <TabStripTab title="Credentials">
                    <div style={{ padding: "16px" }}>
                      <CredentialsTab
                        formData={formData}
                        onFieldChange={handleFieldChange}
                        onCheckboxChange={(section: "personPhysical") =>
                          (e: any) =>
                            formRenderProps.onChange(
                              "personPhysical.presumed",
                              {
                                value: e.target.checked,
                              }
                            )}
                      />
                    </div>
                  </TabStripTab>,
                  <TabStripTab title="Activity Type">
                    <div style={{ padding: "16px" }}>
                      <ActivityTypeTab formRenderProps={formRenderProps} />
                    </div>
                  </TabStripTab>,
                  <TabStripTab title="Activity">
                    <div style={{ padding: "16px" }}>
                      <ActivityTab formRenderProps={formRenderProps} />
                    </div>
                  </TabStripTab>,
                ]
              )}
            </TabStrip>
            <FormElement style={{ padding: 20 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <Button
                  onClick={() => router.push("/dashboard/clients")}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  themeColor="primary"
                  disabled={!formRenderProps.allowSubmit || isSubmitting}
                >
                  {isSubmitting ? "Submitting" : "Submit"}
                </Button>
              </div>
            </FormElement>
          </>
        )}
      />
      {snackbar.open && (
        <NotificationGroup
          style={{
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            alignItems: "center",
          }}
        >
          <Slide direction="up">
            <Notification
              type={{ style: snackbar.severity, icon: true }}
              closable={true}
              onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
              style={{
                marginTop: "16px",
                fontSize: "1rem",
                padding: "8px",
                minWidth: "160px",
              }}
            >
              {snackbar.message}
            </Notification>
          </Slide>
        </NotificationGroup>
      )}
    </div>
  );
};

export default ClientEditPage;
