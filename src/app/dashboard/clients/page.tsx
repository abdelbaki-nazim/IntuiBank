"use client";

import { useEffect, useState } from "react";
import { Button } from "@progress/kendo-react-buttons";
import KLoader from "@/app/components/loader/KLoader";
import { Input, InputChangeEvent } from "@progress/kendo-react-inputs";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";

import { Typography } from "@progress/kendo-react-common";
import { Slide } from "@progress/kendo-react-animation";
import ClientList from "./ClientList";
import { Tooltip } from "@progress/kendo-react-tooltip";
import { useRouter } from "next/navigation";

export interface Client {
  id: string;
  type: "PHYSICAL" | "MORAL";
  status: string;
  createdAt: Date;
  personPhysical?: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    maidenName?: string;
    personalEmail?: string;
  };
  personMoral?: {
    companyName?: string;
    professionalEmail?: string;
  };
}

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessages, setErrorMessages] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [notification, setNotification] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error";
  }>({ visible: false, message: "", type: "success" });

  const fetchClients = async () => {
    setErrorMessages("");
    try {
      const response = await fetch("/api/clients", { next: { revalidate: 0 } });
      if (!response.ok) {
        throw new Error("An error occurred while fetching clients");
      }
      const data = await response.json();
      setClients(data);
    } catch (error) {
      setErrorMessages("An error occurred while retrieving data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Error during deletion");
      }
      await fetchClients();
      setNotification({
        visible: true,
        message: "Client successfully deleted",
        type: "success",
      });
    } catch (error) {
      setNotification({
        visible: true,
        message:
          error instanceof Error ? error.message : "Failed to delete client",
        type: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearchChange = (event: InputChangeEvent) => {
    setSearchQuery(event.target.value as string);
  };

  if (loading) return <KLoader />;

  const filteredClients = clients.filter((client) => {
    const query = searchQuery.toLowerCase();
    let fullName = "";
    if (client.type === "PHYSICAL") {
      fullName = `${client.personPhysical?.lastName || ""} ${
        client.personPhysical?.middleName || ""
      } ${client.personPhysical?.firstName || ""}`.trim();
      if (
        client.personPhysical?.maidenName &&
        client.personPhysical?.maidenName !== client.personPhysical?.lastName
      ) {
        fullName += ` (née ${client.personPhysical.maidenName})`;
      }
    } else if (client.type === "MORAL") {
      fullName = client.personMoral?.companyName || "";
    }
    return (
      fullName.toLowerCase().includes(query) ||
      client.status.toLowerCase().includes(query)
    );
  });

  return (
    <div className="k-flex k-flex-col k-gap-4">
      <div className="k-flex k-justify-between k-align-center">
        <Typography.h3>Client Management</Typography.h3>
      </div>

      {/* Search Bar */}
      <div style={{ width: "100%" }}>
        <Input
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for a client..."
          style={{ width: "100%" }}
        />
      </div>

      <ClientList
        clients={filteredClients}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      {errorMessages && (
        <Typography.p className="k-text-error">{errorMessages}</Typography.p>
      )}

      {notification.visible && (
        <NotificationGroup
          style={{
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            alignItems: "center",
          }}
        >
          <Slide direction="up">
            <Notification
              type={{ style: notification.type, icon: true }}
              closable={true}
              onClose={() =>
                setNotification({ ...notification, visible: false })
              }
              style={{
                fontSize: "1rem",
                padding: "8px",
                minWidth: "160px",
              }}
            >
              {notification.message}
            </Notification>
          </Slide>
        </NotificationGroup>
      )}

      <Tooltip anchorElement="pointer" parentTitle={true}>
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "56px",
            height: "56px",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "rgba(0, 123, 255, 0.3)",
              animation: "pulse 3s infinite",
            }}
          />
          <Button
            onClick={() => router.push("/dashboard/clients/create")}
            themeColor="primary"
            style={{
              position: "relative", 
              borderRadius: "50%",
              width: "56px",
              height: "56px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Add Client</title>
              <path
                d="M12 5v14M5 12h14"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </Button>
          <style jsx>{`
            @keyframes pulse {
              0% {
                transform: scale(1);
                opacity: 0.7;
              }
              100% {
                transform: scale(1.5);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      </Tooltip>
    </div>
  );
}
