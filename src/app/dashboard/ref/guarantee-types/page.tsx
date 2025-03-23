"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Typography } from "@progress/kendo-react-common";
import { Button } from "@progress/kendo-react-buttons";
import { ListView } from "@progress/kendo-react-listview";
import KLoader from "@/app/components/loader/KLoader";

export default function GuaranteeTypesList() {
  const [guaranteeTypes, setGuaranteeTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/guarantee-types")
      .then((res) => res.json())
      .then((data) => {
        setGuaranteeTypes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const renderGuaranteeTypeItem = (props: any) => {
    const gt = props.dataItem;
    return (
      <li
        style={{
          padding: "10px",
          borderBottom: "1px solid #ccc",
          transition: "all 0.3s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = "#f0f0f0";
          (e.currentTarget as HTMLElement).style.transform = "scale(1.008)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor =
            "transparent";
          (e.currentTarget as HTMLElement).style.transform = "scale(1)";
        }}
      >
        <Link href={`/dashboard/ref/guarantee-types/${gt.id}`} legacyBehavior>
          <a style={{ textDecoration: "none", color: "inherit" }}>
            <Typography.p style={{ margin: 0 }}>{gt.name}</Typography.p>
            {gt.description && (
              <Typography.p style={{ color: "#888" }}>
                {gt.description}
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
        Guarantee Types
      </Typography.h4>
      <div style={{ marginBottom: "1rem" }}>
        <Button
          onClick={() =>
            window.location.assign("/dashboard/ref/guarantee-types/create")
          }
          themeColor="primary"
        >
          Create Guarantee Type
        </Button>
      </div>
      {loading ? (
        <KLoader />
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          <ListView data={guaranteeTypes} item={renderGuaranteeTypeItem} />
        </ul>
      )}
    </div>
  );
}
