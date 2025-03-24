// Some details are in french

export enum Role {
  SUPERADMIN = "SUPERADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum RecordStatus {
  ACTIVE = "ACTIVE",
  DELETED = "DELETED",
  ARCHIVED = "ARCHIVED",
  SUSPENDED = "SUSPENDED",
}

export enum CardStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
  EXPIRED = "EXPIRED",
  LOST = "LOST",
  STOLEN = "STOLEN",
  PENDING = "PENDING",
}

export enum CreditStatus {
  PENDING = "PENDING",
  INITIATED = "INITIATED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELED = "CANCELED",
}

export enum CreditState {
  ACTIVE = "ACTIVE",
  PAID_OFF = "PAID_OFF",
  DEFAULTED = "DEFAULTED",
  CANCELLED = "CANCELLED",
  SUSPENDED = "SUSPENDED",
}

export enum DeliveryMethod {
  ENVOI = "ENVOI",
  REMISE = "REMISE",
}

export enum CreationOrRenewal {
  CREATION = "CREATION",
  RENOUVELLEMENT = "RENOUVELLEMENT",
}

export enum Civility {
  MR = "MR",
  MRS = "MRS",
  MS = "MS",
  MISS = "MISS",
  DR = "DR",
  PROF = "PROF",
  MAITRE = "MAITRE",
}

export enum ClientType {
  PHYSICAL = "PHYSICAL",
  MORAL = "MORAL",
}

export enum ActivityType {
  INDIVIDUAL = "INDIVIDUAL",
  PROFESSIONAL = "PROFESSIONAL",
}

export enum DocumentType {
  CNIBE = "CNIBE",
  PASSEPORT = "PASSEPORT",
  PERMIS_CONDUIRE = "PERMIS_CONDUIRE",
  CARTE_ELECTEUR = "CARTE_ELECTEUR",
  CARTE_CONSULAIRE = "CARTE_CONSULAIRE",
}

export enum AuthorizationType {
  AGREMENT = "AGREMENT",
  PATENTE = "PATENTE",
  LICENCE = "LICENCE",
  CARTE_ARTISAN = "CARTE_ARTISAN",
  AUTRE = "AUTRE",
}

// Interfaces

export interface User {
  id: string;
  role: Role;
  email: string;
  emailVerified?: boolean | null;
  image?: string | null;
  name?: string | null;
  passwordHash?: string | null;
  failedLoginAttempts: number;
  lastFailedAttemptAt?: Date | null;
  lastLoginAt?: Date | null;
  isBlocked: boolean;
  blockedUntil?: Date | null;
  isTwoFactorEnabled: boolean;
  twoFactorSecret?: string | null;
  auditLogs: AuditLog[];
  sessions: Session[];
}

export interface Client {
  id: string;
  type: ClientType;
  status: RecordStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  accounts: Account[];
  personPhysical?: PersonPhysical | null;
  personMoral?: PersonMoral | null;
  identityDocuments: IdentityDocument[];
}

export interface PersonPhysical {
  id: string;
  civility?: Civility | null;
  activityType?: ActivityType | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  maidenName?: string | null;
  birthDate: Date;
  birthPlace: string;
  gender: string;
  presumed: boolean;
  birtCertificateNumber?: string | null;
  countryOfBirth: string;
  nationalityOrigin: string;
  nationalityAcquisition?: string | null;
  maritalStatus: string;
  spouseLastName?: string | null;
  spouseFirstName?: string | null;
  motherMaidenName?: string | null;
  motherFirstName: string;
  fatherFirstName: string;
  personalAddress: string;
  postalCode: string;
  city: string;
  stateDepartment: string;
  country: string;
  landlinePhone?: string | null;
  personalMobilePhone: string;
  personalFax?: string | null;
  personalEmail: string;
  client: Client;
  clientId: string;
  activities: Activity[];
}

export interface PersonMoral {
  id: string;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  maidenName?: string | null;
  companyName: string;
  denomination?: string | null;
  legalForm: string;
  businessActivity: string;
  capital: string;
  workforce?: number | null;
  headquartersAddress: string;
  postalCode: string;
  city: string;
  stateDepartment: string;
  taxIdentificationNumber?: string | null;
  statisticalIdentificationNumber?: string | null;
  businessCreationDate: Date | null;
  annualRevenue?: number | null;
  professionalPhone: string;
  professionalMobile?: string | null;
  professionalFax?: string | null;
  professionalEmail: string;
  client: Client;
  clientId: string;
}

export interface Activity {
  id: string;
  personPhysicalId: string;
  client: PersonPhysical;
  profession?: string | null;
  employer?: string | null;
  monthlyIncome?: number | null;
  businessFullName?: string | null;
  businessDenomination?: string | null;
  legalForm?: string | null;
  businessActivity?: string | null;
  capital?: number | null;
  workforce?: number | null;
  headquartersAddress?: string | null;
  businessPostalCode?: string | null;
  cityOfBusiness?: string | null;
  stateDepartment?: string | null;
  taxIdentificationNumber?: string | null;
  statisticalIdentificationNumber?: string | null;
  businessCreationDate?: Date | null;
  annualRevenue?: number | null;
  professionalPhone?: string | null;
  professionalMobile?: string | null;
  professionalFax?: string | null;
  professionalEmail?: string | null;
}

export interface IdentityDocument {
  id: string;
  clientId: string;
  client: Client;
  documentType: DocumentType;
  otherDocumentType?: string | null;
  documentNumber: string;
  issueDate: Date;
  issuedBy: string;
  otherIssuingEntity?: string | null;
  nationalIdentifierNumber: string;
  otherAuthorization?: string | null;
  tradeRegisterNumber?: string | null;
  artisanCardNumber?: string | null;
  professionalDocumentDate?: Date | null;
  professionalDocumentIssuedBy?: string | null;
  otherProfessionalDocumentIssuer?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  client: Client;
  clientId: string;
  accountNumber: string;
  accountDescription?: string | null;
  accountPurpose: AccountPurpose;
  accountPurposeId: string;
  otherAccountPurposes?: string | null;
  openedAt?: Date | null;
  chapter?: string | null;
  currency: Currency;
  currencyId: string;
  currentBalance: number;
  status: RecordStatus;
  deletedAt?: Date | null;
  kycDetails?: string | null;
  kycValidated: boolean;
  observation?: string | null;
  createdAt: Date;
  updatedAt: Date;
  creditApplications: CreditApplication[];
  magneticCards?: MagneticCard | null;
  cheques?: Cheque | null;
}

export interface AccountPurpose {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  accounts: Account[];
}

export interface MagneticCard {
  id: string;
  account: Account;
  accountId: string;
  cardNumber: string;
  cardHolderName?: string | null;
  cvv?: string | null;
  status: CardStatus;
  civility?: Civility | null;
  requestDate?: Date | null;
  issuedAt?: Date | null;
  deliveryDate?: Date | null;
  receptionDate?: Date | null;
  expirationDate?: Date | null;
  address?: string | null;
  wilaya?: string | null;
  commune?: string | null;
  postalCode?: string | null;
  deliveryMethod: DeliveryMethod;
  creationOrRenewal: CreationOrRenewal;
  pinCodeReceived?: string | null;
  pinCodeReceptionDate?: Date | null;
  pinCodeDeliveryDate?: Date | null;
  otpCodeReceived?: string | null;
  otpCodeReceptionDate?: Date | null;
  otpCodeDeliveryDate?: Date | null;
  observation?: string | null;
  createdAt: Date;
  updatedAt: Date;
  cardTypeId: string;
  cardType: CardType;
}

export interface CardType {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  magneticCards: MagneticCard[];
}

export interface Cheque {
  id: string;
  account: Account;
  accountId: string;
  chequeNumber: string;
  requestDate: Date;
  issuedAt?: Date | null;
  deliveryDate?: Date | null;
  receptionDate?: Date | null;
  expirationDate?: Date | null;
  observation?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreditApplication {
  id: string;
  creditTypeId: string;
  creditType: CreditType;
  creditTypeAbbrev?: string | null;
  creditCode?: string | null;
  activity?: string | null;
  sector?: string | null;
  activityBranch?: string | null;
  specificZone?: string | null;
  clientStatus?: string | null;
  projectCost?: number | null;
  solicitedAmount?: number | null;
  receptionDate?: Date | null;
  realEstateToFinance?: string | null;
  realEstateValue?: number | null;
  promoter?: string | null;
  monthlyIncome?: number | null;
  guaranteeIncome?: number | null;
  theoreticalInstallment?: number | null;
  apport?: number | null;
  pnr?: string | null;
  status: CreditStatus;
  account: Account;
  clientId: string;
  riskScore?: number | null;
  riskCategory?: "Low" | "Medium" | "High" | null;
  lastRiskAssessment?: Date | null;
  riskComments?: string | null;
  credits?: Credit | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Credit {
  id: string;
  status: CreditState;
  creditApplication: CreditApplication;
  CreditApplicationId: string;
  creditNumber: string;
  creditTypeId: string;
  creditType: CreditType;
  principalAmount?: number | null;
  interestRate?: number | null;
  termInMonths?: number | null;
  startDate?: Date | null;
  endDate?: Date | null;
  monthlyInstallment?: number | null;
  approvedAmount?: number | null;
  transmissionDate?: Date | null;
  accordRecu?: boolean | null;
  accordDate?: Date | null;
  deferredMonths?: number | null;
  bonification?: number | null;
  amountInLetter?: string | null;
  secondaryRC?: string | null;
  rcDate?: Date | null;
  accountNumber?: string | null;
  clientIdentifier?: string | null;
  authorizationNumber?: string | null;
  authorizationDate?: Date | null;
  decisionDate?: Date | null;
  scheduledDueDate?: Date | null;
  authorizedAmount?: number | null;
  mobilisedAmount?: number | null;
  disbursementDate?: Date | null;
  numberOfEffects?: number | null;
  firstDueDate?: Date | null;
  lastDueDate?: Date | null;
  initialDossier?: string | null;
  dossierNumber?: string | null;
  amendment?: string | null;
  observation?: string | null;
  createdAt: Date;
  updatedAt: Date;
  amortizationEntries: AmortizationEntry[];
  guarantees: Guarantee[];
  legalAction: CreditLegalAction[];
  financings: Financing[];
}

export interface CreditType {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  credits: Credit[];
  creditApplication: CreditApplication[];
}

export interface AmortizationEntry {
  id: string;
  credit: Credit;
  creditId: string;
  installmentNumber: number;
  dueDate: Date;
  principalPortion?: number | null;
  interestPortion?: number | null;
  totalPayment?: number | null;
  remainingBalance?: number | null;
  paid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Guarantee {
  id: string;
  credit: Credit;
  creditId: string;
  guaranteeTypeId?: string | null;
  guaranteeType?: GuaranteeType | null;
  description?: string | null;
  value?: number | null;
  metadata?: any;
  expiryDate?: Date | null;
  observation?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GuaranteeType {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  guarantees: Guarantee[];
}

export interface Financing {
  id: string;
  creditId: string;
  credit: Credit;
  type: string;
  value: number;
  order: number;
  observation?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreditLegalAction {
  id: string;
  creditId: string;
  credit: Credit;
  unpaidClaim?: number | null;
  invitation?: string | null;
  miseEnDemeure?: string | null;
  lastWarning?: string | null;
  sommation?: string | null;
  pvCarence?: string | null;
  observation?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  accounts: Account[];
}

export interface AuditLog {
  id: string;
  userId: string;
  user: User;
  actionType: string;
  affectedEntity: string;
  affectedEntityId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  loggedAt: Date;
}

export interface LoginLog {
  id: string;
  email: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  device?: string | null;
  os?: string | null;
  browser?: string | null;
  browserVer?: string | null;
  locale?: string | null;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  loggedAt: Date;
  isSuccess: boolean;
  failureReason?: string | null;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  user: User;
  expires: Date;
  createdAt: Date;
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}
