"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { ListView, ListViewEvent } from "@progress/kendo-react-listview";
import { Card, CardTitle, CardSubtitle } from "@progress/kendo-react-layout";
import { Input } from "@progress/kendo-react-inputs";
import { Loader } from "@progress/kendo-react-indicators";

interface LoginLog {
  id: string;
  email: string;
  ipAddress?: string;
  userAgent?: string;
  loggedAt: string;
  isSuccess: boolean;
  failureReason?: string;
}

const LoginLogsList: React.FC = () => {
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const take = 10;

  const skipRef = useRef<number>(0);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/login-logs?skip=${skipRef.current}&take=${take}`
      );
      const data: LoginLog[] = await res.json();

      setLogs((prev) => {
        const combined = [...prev, ...data];
        const uniqueMap = new Map<string, LoginLog>();
        combined.forEach((log) => uniqueMap.set(log.id, log));
        return Array.from(uniqueMap.values());
      });

      skipRef.current += take;
      if (data.length < take) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) =>
    log.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedLogs = filteredLogs.reduce((acc, log) => {
    const dateKey = new Date(log.loggedAt).toLocaleDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(log);
    return acc;
  }, {} as Record<string, LoginLog[]>);

  const sortedDates = Object.keys(groupedLogs).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const compositeData: Array<
    { type: "header"; date: string } | (LoginLog & { type: "log" })
  > = [];
  sortedDates.forEach((date) => {
    compositeData.push({ type: "header", date });
    groupedLogs[date].forEach((log) =>
      compositeData.push({ ...log, type: "log" })
    );
  });

  const scrollHandler = (event: ListViewEvent) => {
    const e = event.nativeEvent;
    if (
      e.target.scrollTop + 10 >=
        e.target.scrollHeight - e.target.clientHeight &&
      hasMore &&
      !loading
    ) {
      fetchLogs();
    }
  };

  const itemRender = (props: any) => {
    const dataItem = props.dataItem;
    if (dataItem.type === "header") {
      return (
        <div
          style={{
            backgroundColor: "#f0f0f0",
            padding: "8px 16px",
            fontWeight: "bold",
          }}
        >
          {dataItem.date}
        </div>
      );
    }
    return (
      <div className="k-listview-item">
        <Card
          style={{
            width: "100%",
            boxShadow: "none",
            margin: "10px 0",
            border: "1px solid #ddd",
          }}
        >
          <div style={{ padding: "8px" }}>
            <CardTitle style={{ fontSize: 16 }}>{dataItem.email}</CardTitle>
            <CardSubtitle style={{ fontSize: 14 }}>
              {new Date(dataItem.loggedAt).toLocaleTimeString()} —{" "}
              {dataItem.isSuccess
                ? "Success"
                : `Failure: ${dataItem.failureReason}`}
            </CardSubtitle>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 800,
        margin: "0 auto",
        padding: "16px",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Login History</h2>
      <div style={{ marginBottom: "16px" }}>
        <Input
          placeholder="Search by email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(String(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>
      <ListView
        data={compositeData}
        item={itemRender}
        style={{ height: 530, overflow: "auto" }}
        onScroll={scrollHandler}
      />
      {loading && <Loader type="infinite-spinner" />}
      {!hasMore && (
        <div style={{ textAlign: "center", padding: "16px" }}>
          No more data available.
        </div>
      )}
    </div>
  );
};

export default LoginLogsList;
