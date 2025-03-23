"use client";

import React from "react";
import { Card, CardBody } from "@progress/kendo-react-layout";
import { Button, Chip } from "@progress/kendo-react-buttons";
import { Avatar } from "@progress/kendo-react-layout";
import { userIcon } from "@progress/kendo-svg-icons";
import { SvgIcon } from "@progress/kendo-react-common";
import { formatDateField } from "../../../../../../lib/formatDate";

interface Person {
  image?: string;
  professionalEmail?: string;
  personalEmail?: string;
  companyName?: string;
  firstName?: string;
  lastName?: string;
}

interface User {
  type?: string;
  status?: string;
  personMoral?: Person;
  personPhysical?: Person;
}

interface HeaderProps {
  user: User;
}

const renderAvatar = (
  person: Person,
  displayName: string,
  isMoral: boolean
): React.ReactElement => {
  const email = isMoral ? person.professionalEmail : person.personalEmail;
  if (email && person.image) {
    return <Avatar size="large" />;
  }
  return (
    <Avatar type="icon" size="large">
      <SvgIcon icon={userIcon} />
    </Avatar>
  );
};

const getUserStatusChip = (status: string) => {
  let color:
    | "base"
    | "success"
    | "error"
    | "warning"
    | "info"
    | null
    | undefined;
  let label = "";
  switch (status) {
    case "ACTIVE":
      color = "success";
      label = "Active";
      break;
    case "DELETED":
      color = "error";
      label = "Deleted";
      break;
    case "ARCHIVED":
      color = "warning";
      label = "Archived";
      break;
    case "SUSPENDED":
      color = "info";
      label = "Suspended";
      break;
    default:
      label = status || "N/A";
  }
  return <Chip style={{cursor: "default"}} text={label} themeColor={color} />;
};

export default function PersonalInformation({ user }: any) {
  const isMoral = user?.type === "MORAL";
  const person = isMoral ? user?.personMoral || {} : user?.personPhysical || {};
  const displayName = isMoral
    ? person?.companyName || "N/A"
    : `${person?.firstName || "N/A"} ${person?.lastName || ""}`.trim();

  return (
    <div>
      <Card
        style={{ padding: "1rem", marginBottom: "1rem", textAlign: "center" }}
      >
        <CardBody>
          <Avatar type="icon" size="large">
            <SvgIcon icon={userIcon} />
          </Avatar>

          <h1 style={{ margin: 0, marginBottom: "0.5rem" }}>{displayName}</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "8px",
            }}
          >
            {getUserStatusChip(user?.status)}
          </div>
        </CardBody>
      </Card>

      <Card style={{ marginBottom: "1rem", padding: "1rem" }}>
        <CardBody>
          <h2 style={{ color: "#007bff" }}>Client Information</h2>
          <div>
            <p>
              <strong>ID:</strong> {user?.id || "N/A"}
            </p>
            <p>
              <strong>Type:</strong> {user?.type || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {user?.status || "N/A"}
            </p>
            <p>
              <strong>Creation Date:</strong> {formatDateField(user?.createdAt)}
            </p>
            <p>
              <strong>Last Modified:</strong> {formatDateField(user?.updatedAt)}
            </p>
            <p>
              <strong>Deletion Date:</strong> {formatDateField(user?.deletedAt)}
            </p>
          </div>
        </CardBody>
      </Card>

      <Card style={{ marginBottom: "1rem", padding: "1rem" }}>
        <CardBody>
          <h2 style={{ color: "#007bff" }}>Personal Information</h2>
          <div>
            {isMoral ? (
              <>
                <p>
                  <strong>Company Name:</strong> {person?.companyName || "N/A"}
                </p>
                <p>
                  <strong>Denomination:</strong> {person?.denomination || "N/A"}
                </p>
                <p>
                  <strong>Legal Form:</strong> {person?.legalForm || "N/A"}
                </p>
                <p>
                  <strong>Business Activity:</strong>{" "}
                  {person?.businessActivity || "N/A"}
                </p>
                <p>
                  <strong>Capital:</strong> {person?.capital || "N/A"}
                </p>
                <p>
                  <strong>Workforce:</strong> {person?.workforce || "N/A"}
                </p>
                <p>
                  <strong>Headquarters Address:</strong>{" "}
                  {person?.headquartersAddress || "N/A"}
                </p>
                <p>
                  <strong>Postal Code:</strong> {person?.postalCode || "N/A"}
                </p>
                <p>
                  <strong>City:</strong> {person?.city || "N/A"}
                </p>
                <p>
                  <strong>State/Region:</strong>{" "}
                  {person?.stateDepartment || "N/A"}
                </p>
                <p>
                  <strong>Tax Identification Number:</strong>{" "}
                  {person?.taxIdentificationNumber || "N/A"}
                </p>
                <p>
                  <strong>Statistical Identification Number:</strong>{" "}
                  {person?.statisticalIdentificationNumber || "N/A"}
                </p>
                <p>
                  <strong>Business Creation Date:</strong>{" "}
                  {formatDateField(person?.businessCreationDate)}
                </p>
                <p>
                  <strong>Annual Revenue:</strong>{" "}
                  {person?.annualRevenue || "N/A"}
                </p>
                <p>
                  <strong>Business Phone:</strong>{" "}
                  {person?.professionalPhone || "N/A"}
                </p>
                <p>
                  <strong>Business Mobile Phone:</strong>{" "}
                  {person?.professionalMobilePhone || "N/A"}
                </p>
                <p>
                  <strong>Business Fax:</strong>{" "}
                  {person?.professionalFax || "N/A"}
                </p>
                <p>
                  <strong>Business Email:</strong>{" "}
                  {person?.professionalEmail || "N/A"}
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Salutation:</strong> {person?.civility || "N/A"}
                </p>
                <p>
                  <strong>First Name:</strong> {person?.firstName || "N/A"}
                </p>
                <p>
                  <strong>Middle Name:</strong> {person?.middleName || "N/A"}
                </p>
                <p>
                  <strong>Last Name:</strong> {person?.lastName || "N/A"}
                </p>
                <p>
                  <strong>Maiden Name:</strong> {person?.maidenName || "N/A"}
                </p>
                <p>
                  <strong>Birth Date:</strong>{" "}
                  {formatDateField(person?.birthDate)}
                </p>
                <p>
                  <strong>Birth Place:</strong> {person?.birthPlace || "N/A"}
                </p>
                <p>
                  <strong>Gender:</strong> {person?.gender || "N/A"}
                </p>
                <p>
                  <strong>Presumed:</strong> {person?.presumed ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Birth Certificate Number:</strong>{" "}
                  {person?.birtCertificateNumber || "N/A"}
                </p>
                <p>
                  <strong>Country of Birth:</strong>{" "}
                  {person?.countryOfBirth || "N/A"}
                </p>
                <p>
                  <strong>Nationality of Origin:</strong>{" "}
                  {person?.nationalityOrigin || "N/A"}
                </p>
                <p>
                  <strong>Acquired Nationality:</strong>{" "}
                  {person?.nationalityAcquisition || "N/A"}
                </p>
                <p>
                  <strong>Marital Status:</strong>{" "}
                  {person?.maritalStatus || "N/A"}
                </p>
                <p>
                  <strong>Spouse Last Name:</strong>{" "}
                  {person?.spouseLastName || "N/A"}
                </p>
                <p>
                  <strong>Spouse First Name:</strong>{" "}
                  {person?.spouseFirstName || "N/A"}
                </p>
                <p>
                  <strong>Mother's Maiden Name:</strong>{" "}
                  {person?.motherMaidenName || "N/A"}
                </p>
                <p>
                  <strong>Mother's First Name:</strong>{" "}
                  {person?.motherFirstName || "N/A"}
                </p>
                <p>
                  <strong>Father's First Name:</strong>{" "}
                  {person?.fatherFirstName || "N/A"}
                </p>
                <p>
                  <strong>Address:</strong> {person?.personalAddress || "N/A"}
                </p>
                <p>
                  <strong>Postal Code:</strong> {person?.postalCode || "N/A"}
                </p>
                <p>
                  <strong>City:</strong> {person?.city || "N/A"}
                </p>
                <p>
                  <strong>State/Region:</strong>{" "}
                  {person?.stateDepartment || "N/A"}
                </p>
                <p>
                  <strong>Country:</strong> {person?.country || "N/A"}
                </p>
                <p>
                  <strong>Landline:</strong> {person?.landlinePhone || "N/A"}
                </p>
                <p>
                  <strong>Mobile Phone:</strong>{" "}
                  {person?.personalMobilePhone || "N/A"}
                </p>
                <p>
                  <strong>Fax:</strong> {person?.personalFax || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {person?.personalEmail || "N/A"}
                </p>
              </>
            )}
          </div>
        </CardBody>
      </Card>

      {!isMoral && person?.activities && person.activities.length > 0 && (
        <Card style={{ marginBottom: "1rem", padding: "1rem" }}>
          <CardBody>
            <h2 style={{ color: "#007bff" }}>Activities</h2>
            {person.activities.map((activity: any) => (
              <Card
                key={activity.id}
                style={{ marginBottom: "0.5rem", padding: "0.5rem" }}
              >
                <CardBody>
                  <p>
                    <strong>Profession:</strong> {activity?.profession || "N/A"}
                  </p>
                  <p>
                    <strong>Employer:</strong> {activity?.employer || "N/A"}
                  </p>
                  <p>
                    <strong>Monthly Income:</strong>{" "}
                    {activity?.monthlyIncome || "N/A"}
                  </p>
                </CardBody>
              </Card>
            ))}
          </CardBody>
        </Card>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1rem",
        }}
      >
        <Button
          fillMode="outline"
          onClick={() => {
            window.location.href = "/dashboard/clients";
          }}
        >
          Back
        </Button>
        <Button
          themeColor={"primary"}
          onClick={() => {
            window.location.href = `/dashboard/clients/${user?.id}/edit?type=${
              user?.type || "N/A"
            }`;
          }}
        >
          Edit
        </Button>
      </div>
    </div>
  );
}
