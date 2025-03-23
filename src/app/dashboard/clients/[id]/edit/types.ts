import {
  ClientType,
  RecordStatus,
  PersonPhysical,
  PersonMoral,
  IdentityDocument,
  Activity,
} from "@/../types/models";

export interface ClientFormData {
  id?: string;
  type: ClientType;
  status?: RecordStatus;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  personPhysical?: Partial<PersonPhysical> & { birthDate?: string };
  personMoral?: Partial<PersonMoral> & { businessCreationDate?: string };
  identityDocuments: (Partial<IdentityDocument> & { issueDate?: string })[];
  activity?: Partial<Activity>;
}
