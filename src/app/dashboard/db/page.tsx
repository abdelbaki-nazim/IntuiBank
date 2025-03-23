"use client";

import * as React from "react";
import { createDataTree } from "@progress/kendo-react-data-tools";
import {
  OrgChart,
  OrgChartExpandChangeEvent,
  processOrgChartItems,
} from "@progress/kendo-react-orgchart";

const idField = "id";
const childrenField = "children";
const titleField = "name";
const expandField = "expanded";

const flatData = [
  { id: 1, name: "IntuiBank Schema", title: "Root" },
  { id: 2, name: "USER", title: "User", parentId: 1 },
  { id: 3, name: "AUDIT_LOG", title: "Audit Log", parentId: 2 },
  { id: 4, name: "SESSION", title: "Session", parentId: 2 },
  { id: 5, name: "CLIENT", title: "Client", parentId: 1 },
  { id: 6, name: "PERSON_PHYSICAL", title: "Person Physical", parentId: 5 },
  { id: 7, name: "ACTIVITY", title: "Activity", parentId: 6 },
  { id: 8, name: "PERSON_MORAL", title: "Person Moral", parentId: 5 },
  { id: 9, name: "IDENTITY_DOCUMENT", title: "Identity Document", parentId: 5 },
  { id: 10, name: "ACCOUNT", title: "Account", parentId: 5 },
  { id: 11, name: "MAGNETIC_CARD", title: "Magnetic Card", parentId: 10 },
  { id: 12, name: "CHEQUE", title: "Cheque", parentId: 10 },
  {
    id: 13,
    name: "CREDIT_APPLICATION",
    title: "Credit Application",
    parentId: 10,
  },
  { id: 14, name: "CREDIT", title: "Credit", parentId: 13 },
  {
    id: 15,
    name: "AMORTIZATION_ENTRY",
    title: "Amortization Entry",
    parentId: 14,
  },
  { id: 16, name: "GUARANTEE", title: "Guarantee", parentId: 14 },
  { id: 17, name: "GUARANTEE_TYPE", title: "Guarantee Type", parentId: 16 },
  { id: 18, name: "FINANCING", title: "Financing", parentId: 14 },
  {
    id: 19,
    name: "CREDIT_LEGAL_ACTION",
    title: "Credit Legal Action",
    parentId: 14,
  },
];

const treeData = createDataTree(
  flatData,
  (item) => item.id,
  (item) => item.parentId,
  childrenField
);

const App = () => {
  const [expand, setExpand] = React.useState({ ids: [1], idField });

  const onExpandChange = (event: OrgChartExpandChangeEvent) => {
    const ids = [...expand.ids];
    const index = ids.indexOf(event.item.id);
    if (index === -1) {
      ids.push(event.item.id);
    } else {
      ids.splice(index, 1);
    }
    setExpand({ ids, idField });
  };

  const expandedData = React.useMemo(() => {
    return processOrgChartItems(treeData, { expand, childrenField });
  }, [expand]);

  const customCardRender = (props: any) => {
    const { item } = props;
    return <div className="custom-card">{item.name}</div>;
  };

  return (
    <div style={{ padding: "24px"}}>
      <h1 style={{ textAlign: "center" }}>DB OrgChart</h1>
      <OrgChart
        data={expandedData}
        navigatable={true}
        idField={idField}
        titleField={titleField}
        childrenField={childrenField}
        expandField={expandField}
        onExpandChange={onExpandChange}
        cardWidth={180}
        itemRender={customCardRender}
      />
    </div>
  );
};

export default App;
