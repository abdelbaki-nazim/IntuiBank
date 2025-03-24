"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Typography } from "@progress/kendo-react-common";
import { Button } from "@progress/kendo-react-buttons";
import { ListView } from "@progress/kendo-react-listview";
import KLoader from "@/app/components/loader/KLoader";

export default function AccountPurposesList() {
  const [purposes, setPurposes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/account-purposes", { next: { revalidate: 0 } })
      .then((res) => res.json())
      .then((data) => {
        setPurposes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const renderPurposeItem = (props: any) => {
    const purpose = props.dataItem;
    return (
      <li
        style={{
          padding: "10px",
          borderBottom: "1px solid #ccc",
          transition: "all 0.3s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          const target = e.currentTarget as HTMLElement;
          target.style.backgroundColor = "#f0f0f0";
          target.style.transform = "scale(1.008)";
        }}
        onMouseLeave={(e) => {
          const target = e.currentTarget as HTMLElement;
          target.style.backgroundColor = "transparent";
          target.style.transform = "scale(1)";
        }}
      >
        <Link
          href={`/dashboard/ref/account-purposes/${purpose.id}`}
          legacyBehavior
        >
          <a style={{ textDecoration: "none", color: "inherit" }}>
            <Typography.p style={{ margin: 0 }}>{purpose.name}</Typography.p>
            {purpose.description && (
              <Typography.p style={{ color: "#888" }}>
                {purpose.description}
              </Typography.p>
            )}
          </a>
        </Link>
      </li>
    );
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Typography.h4 style={{ marginBottom: "1rem" }}>
        Account Purposes
      </Typography.h4>
      <div style={{ marginBottom: "1rem" }}>
        <Button
          themeColor="primary"
          onClick={() => router.push("/dashboard/ref/account-purposes/create")}
        >
          Create Account Purpose
        </Button>
      </div>
      {loading ? (
        <KLoader />
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          <ListView data={purposes} item={renderPurposeItem} />
        </ul>
      )}
    </div>
  );
}
