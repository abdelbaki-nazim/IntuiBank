"use client";

import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  Image,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Button } from "@progress/kendo-react-buttons";

import dynamic from "next/dynamic";
import { Typography } from "@progress/kendo-react-common";

const PDFViewerNoSSR = dynamic(
  () => import("@progress/kendo-react-pdf-viewer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

interface UserData {
  userInfos?: {
    civility: string;
    name: string;
    address: string;
    cityDepartment: string;
    postalCode: string;
    number: string;
  };
}

const today = new Date();
const formattedDate = `${today.getDate().toString().padStart(2, "0")}/${(
  today.getMonth() + 1
)
  .toString()
  .padStart(2, "0")}/${today.getFullYear()}`;
const currentYear = today.getFullYear();

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    flexDirection: "column",
    position: "relative",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  logo: {
    width: 240,
    height: "auto",
  },
  agencyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#003366",
  },
  bankInfo: {
    textAlign: "left",
    marginBottom: 20,
  },
  clientInfoContainer: {
    alignSelf: "flex-end",
    maxWidth: "50%",
    backgroundColor: "#e8f4f8",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  subject: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 20,
  },
  bodyText: {
    textAlign: "justify",
    marginBottom: 20,
  },
  signature: {
    marginTop: 40,
    textAlign: "left",
  },
  dateText: {
    marginTop: 5,
    textAlign: "left",
    fontSize: 12,
  },
  refContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  refText: {
    fontSize: 10,
    color: "#666",
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 40,
    fontSize: 10,
    color: "#666",
  },
});

const MyDocument: React.FC<UserData> = ({ userInfos }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerContainer}>
        <Image style={styles.logo} src="/logo.png" />
        <Text style={styles.agencyName}>Agency </Text>
      </View>

      <View style={styles.bankInfo}>
        <Text>Bank of America</Text>
        <Text>123 Main St</Text>
        <Text>New York, NY 10001</Text>
        <Text>Phone: (212) 555-1234</Text>
        <Text>Fax: (212) 555-5678</Text>
      </View>

      <View style={styles.clientInfoContainer}>
        <Text>
          {userInfos?.civility} {userInfos?.name}
        </Text>
        <Text>{userInfos?.address}</Text>
        <Text>{userInfos?.cityDepartment}</Text>
        <Text>{userInfos?.number}</Text>
        <Text>{userInfos?.postalCode}</Text>
      </View>

      <Text style={styles.subject}>Subject: Invitation</Text>

      <Text style={styles.bodyText}>
        You have kindly chosen our bank, and we are happy to count you among our
        customers.
      </Text>
      <Text style={styles.bodyText}>
        We take this opportunity to thank you for the trust you place in our
        institution and to assure you of our availability to always serve you
        better.
      </Text>
      <Text style={styles.bodyText}>
        Furthermore, we ask you to acknowledge receipt of this letter and return
        it to our counters.
      </Text>

      <Text style={styles.signature}>The Agency Director</Text>
      <Text style={styles.dateText}>{formattedDate}</Text>

      <View style={styles.refContainer}>
        <Text style={styles.refText}>{currentYear}</Text>
      </View>

      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>
  </Document>
);

const InvitationLetter: React.FC<UserData> = ({ userInfos }) => {
  const [showInstruction, setShowInstruction] = useState<boolean>(false);

  useEffect(() => {
    if (!localStorage.getItem("PDFViewer")) {
      setShowInstruction(true);
    }
  }, []);

  const handleCloseInstruction = () => {
    setShowInstruction(false);
    localStorage.setItem("PDFViewer", "true");
  };

  const [pdfData, setPdfData] = React.useState<string | null>(null);

  React.useEffect(() => {
    const generatePdf = async () => {
      const blob = await pdf(<MyDocument userInfos={userInfos} />).toBlob();
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64Data = reader.result as string;
        const rawBase64 = base64Data.split(",")[1];
        setPdfData(base64Data);
      };
      reader.readAsDataURL(blob);
    };

    generatePdf();
  }, [userInfos]);

  const handleDownload = () => {
    if (!pdfData) return;
    const link = document.createElement("a");
    link.href = pdfData;
    link.download = "invitation.pdf";
    link.click();
  };

  if (!pdfData) {
    return <div>Loading PDF...</div>;
  }

  return (
    <>
      <div style={{ marginBlock: "24px" }}>
        <Typography.h6>Download the invitation letter</Typography.h6>
        <Button themeColor={"primary"} size={"large"} onClick={handleDownload}>
          Download PDF
        </Button>
      </div>
      <PDFViewerNoSSR data={pdfData} style={{ height: 615, width: "100%" }} />
      {showInstruction && (
        <Dialog
          width={400}
          title="Instruction"
          onClose={handleCloseInstruction}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <p style={{ margin: 0 }}>
              Looks like our PDF Viewer is playing hide and seek in Next.js 15!
              Could you sprinkle some Kendo magic to help it reappear?
              <br />
              Thanks for the awesome work!
            </p>
          </div>
          <DialogActionsBar>
            <Button onClick={handleCloseInstruction} themeColor="primary">
              Make PDFViewer Great Again!
            </Button>
          </DialogActionsBar>
        </Dialog>
      )}
    </>
  );
};

export default InvitationLetter;
