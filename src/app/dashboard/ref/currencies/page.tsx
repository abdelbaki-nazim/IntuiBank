"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { ListView } from "@progress/kendo-react-listview";
import { Typography } from "@progress/kendo-react-common";
import { useRouter } from "next/navigation";
import Link from "next/link";
import KLoader from "@/app/components/loader/KLoader";

export default function CurrenciesList() {
  const router = useRouter();

  const [currencies, setCurrencies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/currencies")
      .then((res) => res.json())
      .then((data) => {
        setCurrencies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const renderCurrencyItem = (props: any) => {
    const currency = props.dataItem;
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
        <Link href={`/dashboard/ref/currencies/${currency.id}`} legacyBehavior>
          <a style={{ textDecoration: "none", color: "inherit" }}>
            <Typography.p style={{ margin: 0 }}>
              {`${currency.code} - ${currency.name}`}
            </Typography.p>
            {currency.symbol && (
              <Typography.p style={{ color: "#888" }}>
                {currency.symbol}
              </Typography.p>
            )}
          </a>
        </Link>
      </li>
    );
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Typography.h4>Currencies</Typography.h4>
      <div style={{ marginBottom: "1rem" }}>
        <Button
          themeColor="primary"
          onClick={() => router.push("/dashboard/ref/currencies/create")}
        >
          Create Currency
        </Button>
      </div>
      {loading ? (
        <KLoader />
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          <ListView data={currencies} item={renderCurrencyItem} />
        </ul>
      )}
    </div>
  );
}
