"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PanelBar,
  PanelBarItem,
  PanelBarSelectEventArguments,
} from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import { SvgIcon } from "@progress/kendo-react-common";
import {
  homeIcon,
  userIcon,
  walletSolidIcon,
  barcodeIcon,
  fileReportIcon,
  dollarIcon,
  folderIcon,
  listOrderedIcon,
  checkCircleIcon,
  documentManagerIcon,
  groupIcon,
  clipboardIcon,
  lockIcon,
  clockIcon,
  saveIcon,
  dataIcon,
} from "@progress/kendo-svg-icons";

const items = [
  {
    id: "overview",
    title: (
      <span>
        <SvgIcon icon={homeIcon} size="medium" style={{ marginRight: "8px" }} />
        Overview
      </span>
    ),
    url: "/dashboard",
  },
  {
    id: "clients",
    title: (
      <span>
        <SvgIcon icon={userIcon} size="medium" style={{ marginRight: "8px" }} />
        Client Management
      </span>
    ),
    children: [
      {
        id: "clientList",
        title: (
          <span style={{ paddingLeft: "20px" }}>
            <SvgIcon
              icon={userIcon}
              size="medium"
              style={{ marginRight: "8px" }}
            />
            Client List
          </span>
        ),
        url: "/dashboard/clients",
      },
    ],
  },
  {
    id: "accountsOperations",
    title: (
      <span>
        <SvgIcon
          icon={walletSolidIcon}
          size="medium"
          style={{ marginRight: "8px" }}
        />
        Accounts & Operations
      </span>
    ),
    children: [
      {
        id: "bankAccounts",
        title: (
          <span style={{ paddingLeft: "20px" }}>
            <SvgIcon
              icon={walletSolidIcon}
              size="medium"
              style={{ marginRight: "8px" }}
            />
            Bank Accounts
          </span>
        ),
        url: "/dashboard/accounts",
      },
      {
        id: "magneticCards",
        title: (
          <span style={{ paddingLeft: "20px" }}>
            <SvgIcon
              icon={barcodeIcon}
              size="medium"
              style={{ marginRight: "8px" }}
            />
            Magnetic Cards
          </span>
        ),
        url: "/dashboard/magnetic-cards",
      },
      {
        id: "cheques",
        title: (
          <span style={{ paddingLeft: "20px" }}>
            <SvgIcon
              icon={fileReportIcon}
              size="medium"
              style={{ marginRight: "8px" }}
            />
            Cheques
          </span>
        ),
        url: "/dashboard/cheques",
      },
    ],
  },
  {
    id: "creditsFinancing",
    title: (
      <span>
        <SvgIcon
          icon={dollarIcon}
          size="medium"
          style={{ marginRight: "8px" }}
        />
        Credits & Financing
      </span>
    ),
    children: [
      {
        id: "creditFiles",
        title: (
          <span style={{ paddingLeft: "20px" }}>
            <SvgIcon
              icon={folderIcon}
              size="medium"
              style={{ marginRight: "8px" }}
            />
            Credit Files
          </span>
        ),
        url: "/dashboard/credit-applications",
      },
      {
        id: "amortizations",
        title: (
          <span style={{ paddingLeft: "20px" }}>
            <SvgIcon
              icon={listOrderedIcon}
              size="medium"
              style={{ marginRight: "8px" }}
            />
            Amortization Schedules
          </span>
        ),
        url: "/dashboard/amortizations",
      },
      {
        id: "guarantees",
        title: (
          <span style={{ paddingLeft: "20px" }}>
            <SvgIcon
              icon={checkCircleIcon}
              size="medium"
              style={{ marginRight: "8px" }}
            />
            Guarantees
          </span>
        ),
        url: "/dashboard/guarantees",
      },
      {
        id: "financings",
        title: (
          <span style={{ paddingLeft: "20px" }}>
            <SvgIcon
              icon={walletSolidIcon}
              size="medium"
              style={{ marginRight: "8px" }}
            />
            Financing
          </span>
        ),
        url: "/dashboard/financings",
      },
      {
        id: "legalActions",
        title: (
          <span style={{ paddingLeft: "20px" }}>
            <SvgIcon
              icon={documentManagerIcon}
              size="medium"
              style={{ marginRight: "8px" }}
            />
            Legal Actions
          </span>
        ),
        url: "/dashboard/legal-actions",
      },
    ],
  },
  {
    id: "references",
    title: (
      <span>
        <SvgIcon
          icon={folderIcon}
          size="medium"
          style={{ marginRight: "8px" }}
        />
        References
      </span>
    ),
    children: [
      {
        id: "currencies",
        title: (
          <span style={{ paddingLeft: "20px" }}>
            <SvgIcon
              icon={dollarIcon}
              size="medium"
              style={{ marginRight: "8px" }}
            />
            Currencies
          </span>
        ),
        url: "/dashboard/ref/currencies",
      },
      {
        id: "accountTypes",
        title: (
          <span style={{ paddingLeft: "20px" }}>
            <SvgIcon
              icon={groupIcon}
              size="medium"
              style={{ marginRight: "8px" }}
            />
            Account Types
          </span>
        ),
        url: "/dashboard/ref/account-purposes",
      },
      {
        id: "cardTypes",
        title: (
          <span style={{ paddingLeft: "20px" }}>
            <SvgIcon
              icon={walletSolidIcon}
              size="medium"
              style={{ marginRight: "8px" }}
            />
            Card Types
          </span>
        ),
        url: "/dashboard/ref/card-types",
      },
      {
        id: "creditTypes",
        title: (
          <span style={{ paddingLeft: "20px" }}>
            <SvgIcon
              icon={clipboardIcon}
              size="medium"
              style={{ marginRight: "8px" }}
            />
            Credit Types
          </span>
        ),
        url: "/dashboard/ref/credit-types",
      },
      {
        id: "guaranteeTypes",
        title: (
          <span style={{ paddingLeft: "20px" }}>
            <SvgIcon
              icon={checkCircleIcon}
              size="medium"
              style={{ marginRight: "8px" }}
            />
            Guarantee Types
          </span>
        ),
        url: "/dashboard/ref/guarantee-types",
      },
    ],
  },
  {
    id: "systemAdmin",
    title: (
      <span>
        <SvgIcon icon={lockIcon} size="medium" style={{ marginRight: "8px" }} />
        System Administration
      </span>
    ),
    children: [
      {
        id: "loginHistory",
        title: (
          <span style={{ paddingLeft: "20px" }}>
            <SvgIcon
              icon={clockIcon}
              size="medium"
              style={{ marginRight: "8px" }}
            />
            Login History
          </span>
        ),
        url: "/dashboard/login-logs",
      },
      {
        id: "auditLogs",
        title: (
          <span style={{ paddingLeft: "20px" }}>
            <SvgIcon
              icon={clipboardIcon}
              size="medium"
              style={{ marginRight: "8px" }}
            />
            Audit Logs
          </span>
        ),
        url: "/dashboard/audit-logs",
      },
      {
        id: "backup",
        title: (
          <span style={{ paddingLeft: "20px" }}>
            <SvgIcon
              icon={saveIcon}
              size="medium"
              style={{ marginRight: "8px" }}
            />
            Backup
          </span>
        ),
        url: "/dashboard/backup",
      },
      {
        id: "sessions",
        title: (
          <span style={{ paddingLeft: "20px" }}>
            <SvgIcon
              icon={lockIcon}
              size="medium"
              style={{ marginRight: "8px" }}
            />
            Sessions
          </span>
        ),
        url: "/dashboard/sessions",
      },
    ],
  },
  {
    id: "about",
    title: (
      <span style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <div
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            backgroundColor: "#444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            color: "#FFF",
          }}
        >
          i
        </div>
        About
      </span>
    ),
    children: [
      {
        id: "sbSchema",
        title: (
          <span style={{ paddingLeft: "20px" }}>
            <SvgIcon
              icon={dataIcon}
              size="medium"
              style={{ marginRight: "8px" }}
            />
            DB Schema
          </span>
        ),
        url: "/dashboard/db",
      },
    ],
  },
];

const renderPanelBarItems = (itemsArray: any) => {
  return itemsArray.map((item: any) => {
    if (item.children) {
      return (
        <PanelBarItem key={item.id} uniqueKey={item.id} title={item.title}>
          {renderPanelBarItems(item.children)}
        </PanelBarItem>
      );
    } else {
      return (
        <PanelBarItem
          key={item.id}
          uniqueKey={item.id}
          title={
            <Link
              href={item.url}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {item.title}
            </Link>
          }
        />
      );
    }
  });
};

const AdminSideNav = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expanded, setExpanded] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("panelBarExpanded");
    if (stored) {
      setExpanded(JSON.parse(stored));
    }
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setDrawerOpen(true);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSelect = (e: PanelBarSelectEventArguments) => {
    if (e.expandedItems) {
      setExpanded(e.expandedItems);
      localStorage.setItem("panelBarExpanded", JSON.stringify(e.expandedItems));
    }
  };

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const headerBackground = "#EEE";

  return (
    <>
      {isMobile && (
        <div
          style={{
            backgroundColor: headerBackground,
            color: "white",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 100,
          }}
        >
          <Link
            href="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
              paddingLeft: 8,
            }}
          >
            <Image src="/logo.svg" alt="logo" width={125} height={45} />
          </Link>
          {isMobile && (
            <Button onClick={toggleDrawer}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </Button>
          )}
        </div>
      )}

      {
        <div
          style={{
            width: 280,
            position: "fixed",
            top: isMobile ? 60 : 0,
            left: isMobile ? (drawerOpen ? 0 : -280) : 0,
            height: "100vh",
            backgroundColor: "#fff",
            boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
            transition: "left 0.3s ease",
            zIndex: 100,
          }}
        >
          {!isMobile && (
            <div
              style={{
                backgroundColor: headerBackground,
                color: "white",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Link
                href="/dashboard"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "inherit",
                  padding: 8,
                }}
              >
                <Image src="/logo.svg" alt="logo" width={120} height={40} />
              </Link>
              {isMobile && <Button icon="k-i-close" onClick={toggleDrawer} />}
            </div>
          )}

          <div
            style={{
              overflowY: "auto",
              paddingBottom: 120,
              height: "calc(100vh - 64px)",
            }}
          >
            <PanelBar
              isControlled={true}
              expanded={expanded}
              onSelect={handleSelect}
              style={{
                borderColor: "transparent"
              }}
            >
              {renderPanelBarItems(items)}
            </PanelBar>
          </div>
        </div>
      }
    </>
  );
};

export default AdminSideNav;
