"use client";

import React, { useEffect, useState } from "react";
import UserTabs, { Tab } from "../components/UserTabs";
import PersonalInfo from "../components/PersonalInfo";
import BankInfo from "../components/BankInfo";
import InvitationLetter from "../components/InvitationLetter";
import { getFullName } from "../../../../../../lib/getFullName";
import { useParams } from "next/navigation";
import { civilityToEnglish } from "../../../../../../lib/civilityToEnglish";
import KLoader from "@/app/components/loader/KLoader";

interface UserData {
  civility: string;
  name: string;
  address: string;
  cityDepartment: string;
  postalCode: string;
  number: string;
}

export default function UserDetailPage() {
  const { id, type } = useParams() as { id: string; type: string };
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState<Tab>("personal");
  const [userInfos, setUserInfos] = useState<UserData>({
    civility: "",
    name: "client",
    address: "",
    cityDepartment: "",
    postalCode: "",
    number: "",
  });

  useEffect(() => {
    fetch(`/api/clients/${id}?type=${type}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          setUser(data);
          const civility = data?.personPhysical
            ? civilityToEnglish(data.personPhysical.civility)
            : "";
          const name = getFullName(data);
          const address = data?.personPhysical
            ? data.personPhysical.personalAddress
            : "";
          const cityDepartment = data?.personPhysical
            ? `${data.personPhysical.city}, ${data.personPhysical.stateDepartment}`
            : "";
          const postalCode = data?.personPhysical
            ? data.personPhysical.postalCode
            : "";
          const number = data?.personPhysical
            ? data.personPhysical.personalMobilePhone
            : "";

          setUserInfos((prev) => ({
            ...prev,
            civility,
            name,
            address,
            cityDepartment,
            postalCode,
            number,
          }));
        }
      })
      .catch(() => setError("Error fetching data"));
  }, [id, type]);

  if (error) {
    return (
      <div style={{ maxWidth: "768px", margin: "32px auto", padding: "32px" }}>
        <div
          style={{
            padding: "32px",
            textAlign: "center",
            borderLeft: "4px solid red",
            borderRadius: "8px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return <KLoader />;
  }

  return (
    <div style={{ margin: "32px auto", padding: "32px" }}>
      <div
        style={{
          padding: "32px",
          borderRadius: "8px",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        <UserTabs
          selectedTab={selectedTab}
          onTabChange={(tab) => setSelectedTab(tab)}
        />
        {selectedTab === "personal" && <PersonalInfo user={user} />}
        {selectedTab === "bank" && (
          <BankInfo accounts={user.accounts} userId={user.id} />
        )}
        {selectedTab === "other" && (
          <InvitationLetter userInfos={userInfos}/>
        )}
      </div>
    </div>
  );
}
