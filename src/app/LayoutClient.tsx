"use client";

import { useState, useEffect } from "react";
import SideNav from "@/app/components/sidenav/SideNav";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <SideNav />
      <div
        style={{
          marginLeft: isMobile ? "0" : "280px",
          padding: isMobile ? "86px 12px" : "46px 24px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
