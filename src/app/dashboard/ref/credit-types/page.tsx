"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Typography } from "@progress/kendo-react-common";
import { Button } from "@progress/kendo-react-buttons";
import { ListView } from "@progress/kendo-react-listview";
import KLoader from "@/app/components/loader/KLoader";

export default function CreditTypesList() {
  const [creditTypes, setCreditTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/credit-types")
      .then((res) => res.json())
      .then((data) => {
        setCreditTypes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const renderCreditTypeItem = (props: any) => {
    const type = props.dataItem;
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
        <Link href={`/dashboard/ref/credit-types/${type.id}`} legacyBehavior>
          <a style={{ textDecoration: "none", color: "inherit" }}>
            <Typography.p style={{ margin: 0 }}>{type.name}</Typography.p>
            {type.description && (
              <Typography.p style={{ color: "#888" }}>
                {type.description}
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
        Credit Types
      </Typography.h4>
      <div style={{ marginBottom: "1rem" }}>
        <Button
          themeColor="primary"
          onClick={() => router.push("/dashboard/ref/credit-types/create")}
        >
          Create Credit Type
        </Button>
      </div>
      {loading ? (
        <KLoader />
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          <ListView data={creditTypes} item={renderCreditTypeItem} />
        </ul>
      )}
    </div>
  );
}
