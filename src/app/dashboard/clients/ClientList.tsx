"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { GridPDFExport } from "@progress/kendo-react-pdf";
import { Button, ButtonGroup } from "@progress/kendo-react-buttons";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Loader } from "@progress/kendo-react-indicators";
import { SvgIcon } from "@progress/kendo-react-common";
import { CSVLink } from "react-csv";
import {
  checkCircleIcon,
  trashIcon,
  folderIcon,
  circleIcon,
  pinIcon,
  arrowRightIcon,
} from "@progress/kendo-svg-icons";
import { getFullName } from "../../../../lib/getFullName";

export interface Client {
  id: string;
  type: "PHYSICAL" | "MORAL";
  status: string;
  createdAt: Date;
  personPhysical?: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    maidenName?: string;
    personalEmail?: string;
  };
  personMoral?: {
    companyName?: string;
    professionalEmail?: string;
  };
}

interface ClientListProps {
  clients: Client[];
  onDelete: (id: string) => void;
  deletingId: string | null;
}

const ClientList: React.FC<ClientListProps> = ({
  clients,
  onDelete,
  deletingId,
}) => {
  const router = useRouter();
  const [deleteCandidate, setDeleteCandidate] = useState<string | null>(null);
  const [showInstruction, setShowInstruction] = useState<boolean>(false);

  useEffect(() => {
    if (!localStorage.getItem("instructionShown")) {
      setShowInstruction(true);
    }
  }, []);

  const handleCloseInstruction = () => {
    setShowInstruction(false);
    localStorage.setItem("instructionShown", "true");
  };

  const pdfExportRef = useRef<any>(null);

  const handleRowDoubleClick = (event: any) => {
    const client: Client = event.dataItem;
    router.push(`/dashboard/clients/${client.id}/${client.type}`);
  };

  const rowRender = (trElement: React.ReactElement<any>, props: any) => {
    const existingStyle = (trElement.props.style as React.CSSProperties) || {};
    return React.cloneElement(trElement, {
      style: { ...existingStyle, cursor: "pointer" },
    });
  };

  const CustomHeaderCell = (props: any) => {
    const {
      thProps,
      columnMenuWrapperProps,
      selectionChange,
      selectionValue,
      ...rest
    } = props;
    return (
      <th
        {...rest}
        style={{
          backgroundColor: "#dcddf4",
          color: "#222",
          fontWeight: "normal",
          padding: 12,
          ...rest.style,
        }}
      >
        {rest.children}
      </th>
    );
  };

  const handleOpenDelete = (id: string) => {
    setDeleteCandidate(id);
  };

  const handleCloseDelete = () => {
    setDeleteCandidate(null);
  };

  const handleConfirmDelete = () => {
    if (deleteCandidate) {
      onDelete(deleteCandidate);
      setDeleteCandidate(null);
    }
  };

  const iconMapping: Record<string, any> = {
    ACTIVE: checkCircleIcon,
    DELETED: trashIcon,
    ARCHIVED: folderIcon,
    SUSPENDED: circleIcon,
  };

  const FullNameCell = (props: any) => <td>{getFullName(props.dataItem)}</td>;

  const CreatedAtCell = (props: any) => {
    const dateStr = props.dataItem.createdAt
      ? new Date(props.dataItem.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "2-digit",
        })
      : "N/A";
    return <td>{dateStr}</td>;
  };

  const TypeCell = (props: any) => (
    <td>{props.dataItem.type === "PHYSICAL" ? "Physical" : "Moral"}</td>
  );

  const StatusCell = (props: any) => {
    const status = props.dataItem.status;

    const statusIcon = iconMapping[status] || pinIcon;
    return (
      <td>
        <SvgIcon
          icon={statusIcon}
          size="medium"
          style={{ marginRight: "4px", verticalAlign: "middle" }}
        />
        {status}
      </td>
    );
  };

  const ActionsCell = (props: any) => {
    const client: Client = props.dataItem;
    return (
      <td style={{ textAlign: "center" }}>
        {client.status === "ACTIVE" && (
          <Button
            onClick={() => handleOpenDelete(client.id)}
            disabled={deletingId === client.id}
            themeColor="error"
            fillMode="flat"
          >
            {deletingId === client.id ? <Loader size="small" /> : "Delete"}
          </Button>
        )}
      </td>
    );
  };

  const exportPDF = () => {
    if (pdfExportRef.current) {
      pdfExportRef.current.save();
    }
  };

  const gridComponent = (
    <Grid
      data={clients}
      style={{ maxWidth: "100%", overflowX: "auto" }}
      onRowDoubleClick={handleRowDoubleClick}
      rowRender={rowRender}
      resizable={true}
      reorderable={true}
      autoProcessData={true}
      defaultSkip={0}
      defaultTake={20}
      pageable={{
        buttonCount: 6,
        pageSizes: [10, 30, 50, "All"],
      }}
    >
      <GridColumn
        title="Full Name"
        cell={FullNameCell}
        cells={{ headerCell: CustomHeaderCell }}
      />
      <GridColumn
        title="Creation Date"
        cell={CreatedAtCell}
        cells={{ headerCell: CustomHeaderCell }}
        width="200px"
      />
      <GridColumn
        title="Type"
        cell={TypeCell}
        cells={{ headerCell: CustomHeaderCell }}
        width="150px"
      />
      <GridColumn
        title="Status"
        cell={StatusCell}
        cells={{ headerCell: CustomHeaderCell }}
        width="150px"
      />
      <GridColumn
        title="Actions"
        cell={ActionsCell}
        cells={{ headerCell: CustomHeaderCell }}
        width="100px"
      />
    </Grid>
  );

  return (
    <div className="k-flex k-flex-col k-gap-4" style={{ padding: "16px" }}>
      <div
        className="k-flex k-justify-end k-align-center"
        style={{ marginBottom: "16px" }}
      >
        <ButtonGroup>
          <CSVLink
            data={clients}
            filename="clients.csv"
            className="k-button k-button-md k-button-solid k-button-solid-primary k-rounded-md"
            style={{ marginRight: "8px", textDecoration: "none" }}
          >
            Export to CSV
          </CSVLink>
          <Button
            themeColor="primary"
            onClick={exportPDF}
            style={{ marginLeft: "8px" }}
          >
            Export to PDF
          </Button>
        </ButtonGroup>
      </div>

      {gridComponent}

      <div style={{ display: "none" }}>
        <GridPDFExport margin="1cm" ref={pdfExportRef}>
          {gridComponent}
        </GridPDFExport>
      </div>

      {deleteCandidate && (
        <Dialog title="Confirm Deletion" onClose={handleCloseDelete}>
          <p style={{ margin: "25px", textAlign: "center" }}>
            Are you sure you want to delete this client? The client will be
            retained for 30 days before permanent deletion.
          </p>
          <DialogActionsBar>
            <Button onClick={handleCloseDelete}>Cancel</Button>
            <Button onClick={handleConfirmDelete} themeColor="error" autoFocus>
              Confirm
            </Button>
          </DialogActionsBar>
        </Dialog>
      )}
      {showInstruction && (
        <Dialog title="Instruction" onClose={handleCloseInstruction}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <SvgIcon icon={arrowRightIcon} size="large" />
            <p style={{ margin: 0 }}>
              Double click on any row to enter the user profile.
            </p>
          </div>
          <DialogActionsBar>
            <Button onClick={handleCloseInstruction} themeColor="primary">
              Understood!
            </Button>
          </DialogActionsBar>
        </Dialog>
      )}
    </div>
  );
};

export default ClientList;
