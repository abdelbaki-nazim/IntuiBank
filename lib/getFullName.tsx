export interface Client {
  id: string;
  type: "PHYSICAL" | "MORAL";
  status: string;
  personMoral: {
    id: string;
    companyName: string;
  } | null;
  personPhysical: {
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    maidenName?: string;
  } | null;
}

const getFullName = (client: Client): string => {
  if (client.type === "PHYSICAL" && client.personPhysical) {
    let name = `${client.personPhysical.lastName || ""} ${
      client.personPhysical.middleName || ""
    } ${client.personPhysical.firstName || ""}`.trim();
    if (
      client.personPhysical.maidenName &&
      client.personPhysical.maidenName !== client.personPhysical.lastName
    ) {
      name += ` (maiden name: ${client.personPhysical.maidenName})`;
    }
    return name;
  } else if (client.type === "MORAL" && client.personMoral) {
    return client.personMoral.companyName || "";
  }
  return "Unknown User";
};

export { getFullName };
