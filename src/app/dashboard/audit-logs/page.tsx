"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardHeader, CardBody } from "@progress/kendo-react-layout";
import { Input } from "@progress/kendo-react-inputs";
import { Typography } from "@progress/kendo-react-common";
import {
  ListView,
} from "@progress/kendo-react-listview";
import KLoader from "@/app/components/loader/KLoader";

interface AuditLog {
  id: string;
  userId: string;
  user: {
    id: string;
    email?: string;
    name?: string;
  };
  actionType: string;
  affectedEntity: string;
  affectedEntityId?: string;
  ipAddress?: string;
  userAgent?: string;
  loggedAt: string;
}

const AuditLogsList: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [skip, setSkip] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const take = 20;
  const observer = useRef<IntersectionObserver | null>(null);

  const lastLogElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchLogs();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/audit-logs?skip=${skip}&take=${take}`, {
        next: { revalidate: 0 },
      });
      const data: AuditLog[] = await res.json();
      setLogs((prev) => [...prev, ...data]);
      setSkip((prev) => prev + take);
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

  const filteredLogs = logs.filter((log) => {
    const userText = (log.user.email || log.user.name || "").toLowerCase();
    const term = searchTerm.toLowerCase();
    return (
      userText.includes(term) ||
      log.actionType.toLowerCase().includes(term) ||
      log.affectedEntity.toLowerCase().includes(term)
    );
  });

  const groupedLogs = filteredLogs.reduce((acc, log) => {
    const dateKey = new Date(log.loggedAt).toLocaleDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(log);
    return acc;
  }, {} as Record<string, AuditLog[]>);

  const sortedDates = Object.keys(groupedLogs).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div
      style={{ width: "100%", maxWidth: 800, margin: "0 auto", padding: 16 }}
    >
      <Typography.h4 style={{ textAlign: "center", marginBottom: 16 }}>
        Audit Logs
      </Typography.h4>

      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search by User, Action, or Entity"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.value)}
        />
      </div>

      {sortedDates.map((date) => (
        <div key={date} style={{ marginBottom: 16 }}>
          <Typography.h6
            style={{ borderBottom: "1px solid #ccc", paddingBottom: 8 }}
          >
            {date}
          </Typography.h6>
          <ListView
            data={groupedLogs[date]}
            item={(props) => (
              <Card key={props.dataItem.id} style={{ marginBottom: 8 }}>
                <CardHeader>
                  {props.dataItem.user.email ||
                    props.dataItem.user.name ||
                    props.dataItem.userId}{" "}
                  - {props.dataItem.actionType}
                </CardHeader>
                <CardBody>
                  <Typography.p>
                    <strong>Entity:</strong> {props.dataItem.affectedEntity}{" "}
                    {props.dataItem.affectedEntityId
                      ? `(${props.dataItem.affectedEntityId})`
                      : ""}
                  </Typography.p>
                  <Typography.p>
                    <strong>IP:</strong> {props.dataItem.ipAddress || "N/A"} –{" "}
                    {new Date(props.dataItem.loggedAt).toLocaleTimeString()}
                  </Typography.p>
                  <Typography.p>
                    <strong>User Agent:</strong>{" "}
                    {props.dataItem.userAgent || "N/A"}
                  </Typography.p>
                </CardBody>
              </Card>
            )}
          />
        </div>
      ))}

      {loading && <KLoader />}
      {!hasMore && (
        <Typography.p style={{ textAlign: "center", padding: 16 }}>
          No more data available.
        </Typography.p>
      )}
    </div>
  );
};

export default AuditLogsList;
