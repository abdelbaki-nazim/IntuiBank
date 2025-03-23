--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: ActivityType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ActivityType" AS ENUM (
    'INDIVIDUAL',
    'PROFESSIONAL'
);


ALTER TYPE public."ActivityType" OWNER TO postgres;

--
-- Name: AuthorizationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AuthorizationType" AS ENUM (
    'AGREMENT',
    'PATENTE',
    'LICENCE',
    'CARTE_ARTISAN',
    'AUTRE'
);


ALTER TYPE public."AuthorizationType" OWNER TO postgres;

--
-- Name: CardStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CardStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'BLOCKED',
    'EXPIRED',
    'LOST',
    'STOLEN',
    'PENDING'
);


ALTER TYPE public."CardStatus" OWNER TO postgres;

--
-- Name: Civility; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Civility" AS ENUM (
    'MR',
    'MRS',
    'MS',
    'MISS',
    'DR',
    'PROF',
    'MAITRE'
);


ALTER TYPE public."Civility" OWNER TO postgres;

--
-- Name: ClientType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ClientType" AS ENUM (
    'PHYSICAL',
    'MORAL'
);


ALTER TYPE public."ClientType" OWNER TO postgres;

--
-- Name: CreationOrRenewal; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CreationOrRenewal" AS ENUM (
    'CREATION',
    'RENOUVELLEMENT'
);


ALTER TYPE public."CreationOrRenewal" OWNER TO postgres;

--
-- Name: CreditState; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CreditState" AS ENUM (
    'ACTIVE',
    'PAID_OFF',
    'DEFAULTED',
    'CANCELLED',
    'SUSPENDED'
);


ALTER TYPE public."CreditState" OWNER TO postgres;

--
-- Name: CreditStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CreditStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'CANCELED',
    'INITIATED'
);


ALTER TYPE public."CreditStatus" OWNER TO postgres;

--
-- Name: DeliveryMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DeliveryMethod" AS ENUM (
    'ENVOI',
    'REMISE'
);


ALTER TYPE public."DeliveryMethod" OWNER TO postgres;

--
-- Name: DocumentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DocumentType" AS ENUM (
    'CNIBE',
    'PASSEPORT',
    'PERMIS_CONDUIRE',
    'CARTE_ELECTEUR',
    'CARTE_CONSULAIRE'
);


ALTER TYPE public."DocumentType" OWNER TO postgres;

--
-- Name: RecordStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RecordStatus" AS ENUM (
    'ACTIVE',
    'DELETED',
    'ARCHIVED',
    'SUSPENDED'
);


ALTER TYPE public."RecordStatus" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'SUPERADMIN',
    'ADMIN',
    'USER'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "clientId" text NOT NULL,
    "accountNumber" text NOT NULL,
    "accountDescription" text,
    "accountPurposeId" text NOT NULL,
    "otherAccountPurposes" text,
    "openedAt" timestamp(3) without time zone,
    chapter text,
    "currencyId" text NOT NULL,
    "currentBalance" double precision DEFAULT 0 NOT NULL,
    status public."RecordStatus" DEFAULT 'ACTIVE'::public."RecordStatus" NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "kycDetails" text,
    "kycValidated" boolean DEFAULT false NOT NULL,
    observation text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Account" OWNER TO postgres;

--
-- Name: AccountPurpose; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AccountPurpose" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AccountPurpose" OWNER TO postgres;

--
-- Name: Activity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Activity" (
    id text NOT NULL,
    "personPhysicalId" text NOT NULL,
    profession text,
    employer text,
    "monthlyIncome" double precision,
    "businessFullName" text,
    "businessDenomination" text,
    "legalForm" text,
    "businessActivity" text,
    capital double precision,
    workforce integer,
    "headquartersAddress" text,
    "businessPostalCode" text,
    "cityOfBusiness" text,
    "stateDepartment" text,
    "taxIdentificationNumber" text,
    "statisticalIdentificationNumber" text,
    "businessCreationDate" timestamp(3) without time zone,
    "annualRevenue" double precision,
    "professionalPhone" text,
    "professionalMobile" text,
    "professionalFax" text,
    "professionalEmail" text
);


ALTER TABLE public."Activity" OWNER TO postgres;

--
-- Name: AmortizationEntry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AmortizationEntry" (
    id text NOT NULL,
    "creditId" text NOT NULL,
    "installmentNumber" integer NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    "principalPortion" double precision,
    "interestPortion" double precision,
    "remainingBalance" double precision,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    "amountPaid" double precision,
    "carryOverPayment" double precision,
    "scheduledPayment" double precision
);


ALTER TABLE public."AmortizationEntry" OWNER TO postgres;

--
-- Name: AmortizationEntryHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AmortizationEntryHistory" (
    id text NOT NULL,
    "entryId" text NOT NULL,
    "previousAmountPaid" double precision,
    "newAmountPaid" double precision,
    "previousRemainingBalance" double precision,
    "newRemainingBalance" double precision,
    differential double precision,
    "changedBy" text,
    "changeDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AmortizationEntryHistory" OWNER TO postgres;

--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AuditLog" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "actionType" text NOT NULL,
    "affectedEntity" text NOT NULL,
    "affectedEntityId" text,
    "ipAddress" text,
    "userAgent" text,
    "loggedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AuditLog" OWNER TO postgres;

--
-- Name: CardType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CardType" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CardType" OWNER TO postgres;

--
-- Name: Cheque; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Cheque" (
    id text NOT NULL,
    "accountId" text NOT NULL,
    "chequeNumber" text NOT NULL,
    "requestDate" timestamp(3) without time zone NOT NULL,
    "issuedAt" timestamp(3) without time zone,
    "deliveryDate" timestamp(3) without time zone,
    "receptionDate" timestamp(3) without time zone,
    "expirationDate" timestamp(3) without time zone,
    observation text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Cheque" OWNER TO postgres;

--
-- Name: Client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Client" (
    id text NOT NULL,
    type public."ClientType" DEFAULT 'PHYSICAL'::public."ClientType" NOT NULL,
    status public."RecordStatus" DEFAULT 'ACTIVE'::public."RecordStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."Client" OWNER TO postgres;

--
-- Name: Credit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Credit" (
    id text NOT NULL,
    "creditNumber" text NOT NULL,
    "creditTypeId" text NOT NULL,
    "principalAmount" double precision,
    "interestRate" double precision,
    "termInMonths" integer,
    "startDate" timestamp(3) without time zone,
    "endDate" timestamp(3) without time zone,
    "monthlyInstallment" double precision,
    status public."CreditState" DEFAULT 'ACTIVE'::public."CreditState" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "CreditApplicationId" text NOT NULL,
    "accordDate" timestamp(3) without time zone,
    "accordRecu" boolean,
    "accountNumber" text,
    amendment text,
    "amountInLetter" text,
    "approvedAmount" double precision,
    "authorizationDate" timestamp(3) without time zone,
    "authorizationNumber" text,
    "authorizedAmount" double precision,
    bonification double precision,
    "clientIdentifier" text,
    "decisionDate" timestamp(3) without time zone,
    "deferredMonths" integer,
    "disbursementDate" timestamp(3) without time zone,
    "dossierNumber" text,
    "firstDueDate" timestamp(3) without time zone,
    "initialDossier" text,
    "lastDueDate" timestamp(3) without time zone,
    "mobilisedAmount" double precision,
    "numberOfEffects" integer,
    observation text,
    "rcDate" timestamp(3) without time zone,
    "scheduledDueDate" timestamp(3) without time zone,
    "secondaryRC" text,
    "transmissionDate" timestamp(3) without time zone
);


ALTER TABLE public."Credit" OWNER TO postgres;

--
-- Name: CreditApplication; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CreditApplication" (
    id text NOT NULL,
    "creditTypeAbbrev" text,
    "creditCode" text,
    activity text,
    sector text,
    "activityBranch" text,
    "specificZone" text,
    "clientStatus" text,
    "projectCost" double precision,
    "solicitedAmount" double precision,
    "receptionDate" timestamp(3) without time zone,
    "realEstateToFinance" text,
    "realEstateValue" double precision,
    promoter text,
    "monthlyIncome" double precision,
    "guaranteeIncome" double precision,
    "theoreticalInstallment" double precision,
    apport double precision,
    pnr text,
    status public."CreditStatus" DEFAULT 'PENDING'::public."CreditStatus" NOT NULL,
    "clientId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "creditTypeId" text NOT NULL
);


ALTER TABLE public."CreditApplication" OWNER TO postgres;

--
-- Name: CreditLegalAction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CreditLegalAction" (
    id text NOT NULL,
    "creditId" text NOT NULL,
    "unpaidClaim" double precision,
    invitation text,
    "miseEnDemeure" text,
    "lastWarning" text,
    sommation text,
    "pvCarence" text,
    observation text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CreditLegalAction" OWNER TO postgres;

--
-- Name: CreditType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CreditType" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CreditType" OWNER TO postgres;

--
-- Name: Currency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Currency" (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    symbol text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Currency" OWNER TO postgres;

--
-- Name: Financing; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Financing" (
    id text NOT NULL,
    "creditId" text NOT NULL,
    type text NOT NULL,
    value double precision NOT NULL,
    "order" integer NOT NULL,
    observation text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Financing" OWNER TO postgres;

--
-- Name: Guarantee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Guarantee" (
    id text NOT NULL,
    "creditId" text NOT NULL,
    "guaranteeTypeId" text,
    description text,
    value double precision,
    metadata jsonb,
    "expiryDate" timestamp(3) without time zone,
    observation text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Guarantee" OWNER TO postgres;

--
-- Name: GuaranteeType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GuaranteeType" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."GuaranteeType" OWNER TO postgres;

--
-- Name: IdentityDocument; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."IdentityDocument" (
    id text NOT NULL,
    "clientId" text NOT NULL,
    "otherDocumentType" text,
    "documentNumber" text NOT NULL,
    "issueDate" timestamp(3) without time zone NOT NULL,
    "issuedBy" text NOT NULL,
    "otherIssuingEntity" text,
    "nationalIdentifierNumber" text,
    "otherAuthorization" text,
    "tradeRegisterNumber" text,
    "artisanCardNumber" text,
    "professionalDocumentDate" timestamp(3) without time zone,
    "professionalDocumentIssuedBy" text,
    "otherProfessionalDocumentIssuer" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "documentType" public."DocumentType" DEFAULT 'CNIBE'::public."DocumentType" NOT NULL
);


ALTER TABLE public."IdentityDocument" OWNER TO postgres;

--
-- Name: LoginLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LoginLog" (
    id text NOT NULL,
    email text NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    locale text,
    "loggedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isSuccess" boolean NOT NULL,
    browser text,
    "browserVer" text,
    city text,
    country text,
    device text,
    "failureReason" text,
    os text,
    region text
);


ALTER TABLE public."LoginLog" OWNER TO postgres;

--
-- Name: MagneticCard; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MagneticCard" (
    id text NOT NULL,
    "accountId" text NOT NULL,
    "cardNumber" text NOT NULL,
    "cardHolderName" text,
    cvv text,
    status public."CardStatus" DEFAULT 'PENDING'::public."CardStatus" NOT NULL,
    civility public."Civility",
    "requestDate" timestamp(3) without time zone,
    "issuedAt" timestamp(3) without time zone,
    "deliveryDate" timestamp(3) without time zone,
    "receptionDate" timestamp(3) without time zone,
    "expirationDate" timestamp(3) without time zone,
    address text,
    wilaya text,
    commune text,
    "postalCode" text,
    "deliveryMethod" public."DeliveryMethod" DEFAULT 'ENVOI'::public."DeliveryMethod" NOT NULL,
    "creationOrRenewal" public."CreationOrRenewal" DEFAULT 'CREATION'::public."CreationOrRenewal" NOT NULL,
    "pinCodeReceived" text,
    "pinCodeReceptionDate" timestamp(3) without time zone,
    "pinCodeDeliveryDate" timestamp(3) without time zone,
    "otpCodeReceived" text,
    "otpCodeReceptionDate" timestamp(3) without time zone,
    "otpCodeDeliveryDate" timestamp(3) without time zone,
    observation text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "cardTypeId" text NOT NULL
);


ALTER TABLE public."MagneticCard" OWNER TO postgres;

--
-- Name: PersonMoral; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PersonMoral" (
    id text NOT NULL,
    "firstName" text,
    "middleName" text,
    "lastName" text,
    "maidenName" text,
    "companyName" text NOT NULL,
    denomination text,
    "legalForm" text NOT NULL,
    "businessActivity" text NOT NULL,
    capital text NOT NULL,
    workforce integer,
    "headquartersAddress" text NOT NULL,
    "postalCode" text NOT NULL,
    city text NOT NULL,
    "stateDepartment" text NOT NULL,
    "taxIdentificationNumber" text,
    "statisticalIdentificationNumber" text,
    "businessCreationDate" timestamp(3) without time zone NOT NULL,
    "annualRevenue" double precision,
    "professionalPhone" text NOT NULL,
    "professionalMobile" text,
    "professionalFax" text,
    "professionalEmail" text NOT NULL,
    "clientId" text NOT NULL
);


ALTER TABLE public."PersonMoral" OWNER TO postgres;

--
-- Name: PersonPhysical; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PersonPhysical" (
    id text NOT NULL,
    civility public."Civility",
    "activityType" public."ActivityType",
    "firstName" text,
    "middleName" text,
    "lastName" text,
    "maidenName" text,
    "birthDate" timestamp(3) without time zone NOT NULL,
    "birthPlace" text NOT NULL,
    gender text NOT NULL,
    presumed boolean DEFAULT false NOT NULL,
    "birtCertificateNumber" text,
    "countryOfBirth" text NOT NULL,
    "nationalityOrigin" text NOT NULL,
    "nationalityAcquisition" text,
    "maritalStatus" text NOT NULL,
    "spouseLastName" text,
    "spouseFirstName" text,
    "motherMaidenName" text,
    "motherFirstName" text NOT NULL,
    "fatherFirstName" text NOT NULL,
    "personalAddress" text NOT NULL,
    "postalCode" text NOT NULL,
    city text NOT NULL,
    "stateDepartment" text NOT NULL,
    country text NOT NULL,
    "landlinePhone" text,
    "personalMobilePhone" text NOT NULL,
    "personalFax" text,
    "personalEmail" text NOT NULL,
    "clientId" text NOT NULL
);


ALTER TABLE public."PersonPhysical" OWNER TO postgres;

--
-- Name: Session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Session" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    email text NOT NULL,
    "emailVerified" boolean,
    image text,
    name text,
    "passwordHash" text,
    "failedLoginAttempts" integer DEFAULT 0 NOT NULL,
    "lastFailedAttemptAt" timestamp(3) without time zone,
    "lastLoginAt" timestamp(3) without time zone,
    "isBlocked" boolean DEFAULT false NOT NULL,
    "blockedUntil" timestamp(3) without time zone,
    "isTwoFactorEnabled" boolean DEFAULT false NOT NULL,
    "twoFactorSecret" text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VerificationToken" OWNER TO postgres;

--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Account" (id, "clientId", "accountNumber", "accountDescription", "accountPurposeId", "otherAccountPurposes", "openedAt", chapter, "currencyId", "currentBalance", status, "deletedAt", "kycDetails", "kycValidated", observation, "createdAt", "updatedAt") FROM stdin;
cm7wurage0000kz8w5jn1lbaf	8c4767ce-d8b0-471e-8e79-4b6c7b353fc7	989876543		cm7tjszvf0008kz70soc1ky4w		2025-03-06 00:00:00		cm7tjumsz000akz70t1aap276	100009	ACTIVE	\N		t		2025-03-06 04:34:25.836	2025-03-10 06:51:49.168
cm7y2x4qb0001kzyk41l1a1jk	8c4767ce-d8b0-471e-8e79-4b6c7b353fc7	99765438767	llkl	cm7tjszvf0008kz70soc1ky4w		2025-03-19 00:00:00	1111	cm7tjumsz000akz70t1aap276	100000	ACTIVE	\N	Non suspect	f	None	2025-03-07 01:10:41.422	2025-03-10 06:52:06.602
cm7tjz4ui000dkz70u71ifro7	8c4767ce-d8b0-471e-8e79-4b6c7b353fc7	134134134314		cm7tjszvf0008kz70soc1ky4w		2025-03-03 00:00:00	123	cm7tjumsz000akz70t1aap276	10000000	ACTIVE	\N	Non suspect	t	Tout est bon	2025-03-03 21:09:17.445	2025-03-10 22:52:42.564
cm84xe7no0000kzuwqh9gougr	038cb85e-259a-4d3d-b977-abb55db1cfef	997654387	iiji	cm7tjtc740009kz7080ihsgwl		2025-03-11 00:00:00		cm7tjumsz000akz70t1aap276	10000	ACTIVE	\N		f		2025-03-11 20:10:23.94	2025-03-15 06:57:32.002
cm85n1khq0001kzkkvpzfgsjb	c1c38a71-6311-4096-8eee-1515d3db02a5	997654387324	Compte ...	cm7tjszvf0008kz70soc1ky4w		2025-03-12 00:00:00	089	cm7tjumsz000akz70t1aap276	123123	ACTIVE	\N	True	t	Nothing here	2025-03-12 08:08:24.061	2025-03-18 02:54:51.961
cm8k71l200003kz70uf9pbm5c	c1c38a71-6311-4096-8eee-1515d3db02a5	98876543112		cm7tjtc740009kz7080ihsgwl		2025-03-05 00:00:00		cm7tjumsz000akz70t1aap276	0	ACTIVE	\N		f		2025-03-22 12:37:03.576	2025-03-22 12:37:03.576
cm8k7fhee0006kz70eh9u4tqb	8c4767ce-d8b0-471e-8e79-4b6c7b353fc7	99999999999999999999999999999		cm7tjszvf0008kz70soc1ky4w		2025-02-27 00:00:00		cm7tjumsz000akz70t1aap276	0	SUSPENDED	\N		t	AA	2025-03-22 12:47:52.022	2025-03-22 12:57:26.754
\.


--
-- Data for Name: AccountPurpose; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AccountPurpose" (id, name, description, "isActive", "createdAt", "updatedAt") FROM stdin;
cm7tjszvf0008kz70soc1ky4w	Compte courant	Un compte de dépôt utilisé pour les transactions quotidiennes, telles que les dépôts de salaire, les paiements de factures et les retraits d'espèces. Il offre généralement un accès facile aux fonds via des cartes de débit, des chéquiers et des services bancaires en ligne.	t	2025-03-03 21:04:31.131	2025-03-03 21:04:31.131
cm7tjtc740009kz7080ihsgwl	Compte d'épargne	Un compte de dépôt conçu pour économiser de l'argent et gagner des intérêts. Il offre généralement un taux d'intérêt plus élevé que les comptes courants, mais peut avoir des restrictions sur le nombre de retraits ou de transferts autorisés par mois.	t	2025-03-03 21:04:47.104	2025-03-03 21:04:47.104
cm8ljah4p000bkz4408mz310j	dzafzsc213	azza	t	2025-03-23 11:07:39.962	2025-03-23 11:19:04.895
\.


--
-- Data for Name: Activity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Activity" (id, "personPhysicalId", profession, employer, "monthlyIncome", "businessFullName", "businessDenomination", "legalForm", "businessActivity", capital, workforce, "headquartersAddress", "businessPostalCode", "cityOfBusiness", "stateDepartment", "taxIdentificationNumber", "statisticalIdentificationNumber", "businessCreationDate", "annualRevenue", "professionalPhone", "professionalMobile", "professionalFax", "professionalEmail") FROM stdin;
cm84wffce0005kzogj5f83swl	cm84wffce0004kzogkmtg396x	Prof	Lycée	100000	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cm8io0q5z000bkznspvutu4qe	cm8io0q5z000akzns9xd7pyz3	\N	\N	\N	aaaaaaa	aaaaaaa	aaaaaaaaa	aaaaa	111111111	11110	FD FD	06004	DF	qqqqqq	1111111	111111	2025-03-14 00:00:00	111111	0665542834	11111111111	\N	fleurvertessssssssssurfondblanc@gmail.com
cm84wx4150009kzogiyivpiuf	cm84wx4150008kzogg4evp79k	jnj	nj	9090	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cm7tjm2fa0006kz70nzwtpd0q	cm7tjm2fa0005kz7003hdryjx	Professeur	Lycée Soumani	100000	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cm8inw9od0007kzns2bbd8y1j	cm8inw9od0006kznsuv1ex6he	sss	sss	11111111111	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: AmortizationEntry; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AmortizationEntry" (id, "creditId", "installmentNumber", "dueDate", "principalPortion", "interestPortion", "remainingBalance", "createdAt", "updatedAt", paid, "amountPaid", "carryOverPayment", "scheduledPayment") FROM stdin;
cm8lbpf7b002gkziwzkjbx2e7	cm8lazeq50002kziwr0u7r7lu	2	2025-05-22 22:00:00	81.78	3.83	836.78	2025-03-23 07:35:20.197	2025-03-23 09:32:22.988	t	10	0	85.61
cm7tsnt3a0036kzwgk280q8vv	cm7tqh4pq0003kzwgvvwezzk0	3	2025-06-03 22:00:00	4003.63	383.51	88038.88	2025-03-04 01:12:25.509	2025-03-12 07:44:09.02	t	\N	\N	\N
cm7tsnt5q003akzwg8fkm1cxy	cm7tqh4pq0003kzwgvvwezzk0	5	2025-08-03 22:00:00	4037.06	350.08	79981.51	2025-03-04 01:12:25.513	2025-03-12 07:44:21.443	t	\N	\N	\N
cm7tsnt4n0039kzwgoau8owz6	cm7tqh4pq0003kzwgvvwezzk0	6	2025-09-03 22:00:00	4053.88	333.26	75927.63	2025-03-04 01:12:25.513	2025-03-12 07:50:40.057	t	\N	\N	\N
cm85mn0fa0004kzf8uo0ybwjw	cm85mmjjt0001kzf83w094zmd	1	2025-04-11 22:00:00	814.41	41.67	9185.59	2025-03-12 07:57:04.87	2025-03-12 07:57:04.87	f	\N	\N	\N
cm85mn0mo0007kzf8phmwas6r	cm85mmjjt0001kzf83w094zmd	9	2025-12-11 23:00:00	841.95	14.12	2546.97	2025-03-12 07:57:04.884	2025-03-12 07:57:04.884	f	\N	\N	\N
cm85mn0o4000akzf8t3mej6fp	cm85mmjjt0001kzf83w094zmd	5	2025-08-11 22:00:00	828.07	28.01	5893.88	2025-03-12 07:57:04.883	2025-03-12 07:57:04.883	f	\N	\N	\N
cm85mn0od000dkzf8jhar6joa	cm85mmjjt0001kzf83w094zmd	12	2026-03-11 23:00:00	852.52	3.55	0	2025-03-12 07:57:04.886	2025-03-12 07:57:04.886	f	\N	\N	\N
cm85ncftp0006kzkkof5ohes1	cm85nbs0h0003kzkkofpohyya	1	2025-04-11 22:00:00	4087.36	166.67	95912.64	2025-03-12 08:16:51.229	2025-03-12 08:16:51.229	f	\N	\N	\N
cm85ncfty0007kzkklh9cziyp	cm85nbs0h0003kzkkofpohyya	22	2027-01-11 23:00:00	4232.83	21.2	8486.83	2025-03-12 08:16:51.23	2025-03-12 08:16:51.23	f	\N	\N	\N
cm85ncfu40008kzkkg9ustvw4	cm85nbs0h0003kzkkofpohyya	23	2027-02-11 23:00:00	4239.88	14.14	4246.95	2025-03-12 08:16:51.23	2025-03-12 08:16:51.23	f	\N	\N	\N
cm85ncfua0009kzkkw9tkvqk0	cm85nbs0h0003kzkkofpohyya	24	2027-03-11 23:00:00	4246.95	7.08	0	2025-03-12 08:16:51.23	2025-03-12 08:16:51.23	f	\N	\N	\N
cm85ncfw3000ckzkk5ulddvp8	cm85nbs0h0003kzkkofpohyya	13	2026-04-11 22:00:00	4169.86	84.17	46329.71	2025-03-12 08:16:51.23	2025-03-12 08:16:51.23	f	\N	\N	\N
cm85ncfxw000fkzkk2bogeexo	cm85nbs0h0003kzkkofpohyya	20	2026-11-11 23:00:00	4218.75	35.27	16945.44	2025-03-12 08:16:51.23	2025-03-12 08:16:51.23	f	\N	\N	\N
cm85ncfy4000ikzkkm25628aj	cm85nbs0h0003kzkkofpohyya	7	2025-10-11 22:00:00	4128.4	125.62	71245.03	2025-03-12 08:16:51.23	2025-03-12 08:16:51.23	f	\N	\N	\N
cm85ncfz1000lkzkk1zlbnshk	cm85nbs0h0003kzkkofpohyya	14	2026-05-11 22:00:00	4176.81	77.22	42152.9	2025-03-12 08:16:51.23	2025-03-12 08:16:51.23	f	\N	\N	\N
cm85ncfz7000okzkko2nkn6jy	cm85nbs0h0003kzkkofpohyya	9	2025-12-11 23:00:00	4142.18	111.85	62967.57	2025-03-12 08:16:51.23	2025-03-12 08:16:51.23	f	\N	\N	\N
cm85ncfzi000rkzkkvne7sogp	cm85nbs0h0003kzkkofpohyya	16	2026-07-11 22:00:00	4190.74	63.28	33778.38	2025-03-12 08:16:51.23	2025-03-12 08:16:51.23	f	\N	\N	\N
cm7tsnt6w003bkzwgn63rdij3	cm7tqh4pq0003kzwgvvwezzk0	8	2025-11-03 23:00:00	4087.74	299.4	67769.12	2025-03-04 01:12:25.515	2025-03-12 08:17:51.348	t	\N	\N	\N
cm85o11pv0008kzq459c34qvy	cm85nzu7i0002kzq459ynk499	12	2026-03-11 23:00:00	8525.23	35.52	0	2025-03-12 08:35:59.294	2025-03-12 08:35:59.294	f	0	0	8560.75
cm85o11oe0005kzq4yggzdzd6	cm85nzu7i0002kzq459ynk499	2	2025-05-11 22:00:00	8178.02	382.73	83677.9	2025-03-12 08:35:59.294	2025-03-12 09:05:02.256	t	7000	560.75	8560.75
cm85o11qd000bkzq4ub4lkfb5	cm85nzu7i0002kzq459ynk499	3	2025-06-11 22:00:00	8212.09	348.66	75465.81	2025-03-12 08:35:59.294	2025-03-12 09:11:30.272	t	8	1560.75	8560.75
cm85o11qo000fkzq4e9vxogjz	cm85nzu7i0002kzq459ynk499	5	2025-08-11 22:00:00	8280.67	280.08	58938.84	2025-03-12 08:35:59.294	2025-03-12 09:13:11.885	t	10000	0	8560.75
cm8lbpf5f002bkziwvtzq3vxb	cm8lazeq50002kziwr0u7r7lu	5	2025-08-22 22:00:00	82.81	2.8	589.39	2025-03-23 07:35:20.197	2025-03-23 07:35:20.197	f	0	0	85.61
cm8lbpf64002ekziw7frehkbf	cm8lazeq50002kziwr0u7r7lu	9	2025-12-22 23:00:00	84.2	1.41	254.7	2025-03-23 07:35:20.198	2025-03-23 07:35:20.198	f	0	0	85.61
cm8lbpf500028kziwlwdnsqbd	cm8lazeq50002kziwr0u7r7lu	12	2026-03-22 23:00:00	85.25	0.36	0	2025-03-23 07:35:20.198	2025-03-23 07:35:20.198	t	0	0	85.61
cm7tsnt3m0038kzwgzznezalq	cm7tqh4pq0003kzwgvvwezzk0	2	2025-05-03 22:00:00	3987.02	400.12	92042.51	2025-03-04 01:12:25.51	2025-03-23 09:29:08.097	t	\N	-1009	\N
cm8lbpf2d0025kziw946kbxxz	cm8lazeq50002kziwr0u7r7lu	1	2025-04-22 22:00:00	81.44	4.17	918.56	2025-03-23 07:35:20.197	2025-03-23 09:31:17.238	t	85.61	0	85.61
cm7tsnt320034kzwgcmalhh2h	cm7tqh4pq0003kzwgvvwezzk0	22	2027-01-03 23:00:00	4332.75	54.39	8719.74	2025-03-04 01:12:25.517	2025-03-04 01:12:25.517	f	\N	\N	\N
cm7tsnt360035kzwg763lsz1x	cm7tqh4pq0003kzwgvvwezzk0	23	2027-02-03 23:00:00	4350.81	36.33	4368.94	2025-03-04 01:12:25.517	2025-03-04 01:12:25.517	f	\N	\N	\N
cm7tsnt3c0037kzwgdtt8s2xk	cm7tqh4pq0003kzwgvvwezzk0	24	2027-03-03 23:00:00	4368.94	18.2	0	2025-03-04 01:12:25.517	2025-03-04 01:12:25.517	f	\N	\N	\N
cm7tsnt7t003ckzwgbqzozr2k	cm7tqh4pq0003kzwgvvwezzk0	17	2026-08-03 22:00:00	4243.61	143.53	30204.47	2025-03-04 01:12:25.516	2025-03-06 16:09:42.791	t	\N	\N	\N
cm7tsnt7y003ekzwg5pyphhon	cm7tqh4pq0003kzwgvvwezzk0	15	2026-06-03 22:00:00	4208.46	178.68	38674.07	2025-03-04 01:12:25.516	2025-03-04 01:12:25.516	f	\N	\N	\N
cm7tsnt81003gkzwg4g43x69j	cm7tqh4pq0003kzwgvvwezzk0	11	2026-02-03 23:00:00	4139.05	248.09	55403.44	2025-03-04 01:12:25.516	2025-03-04 01:12:25.516	f	\N	\N	\N
cm85mn0ff0006kzf8qg2jspsh	cm85mmjjt0001kzf83w094zmd	3	2025-06-11 22:00:00	821.21	34.87	7546.58	2025-03-12 07:57:04.876	2025-03-12 07:57:04.876	f	\N	\N	\N
cm85mn0ms0008kzf8mkg5iaa3	cm85mmjjt0001kzf83w094zmd	8	2025-11-11 23:00:00	838.46	17.61	3388.92	2025-03-12 07:57:04.884	2025-03-12 07:57:04.884	f	\N	\N	\N
cm85mn0o8000bkzf8vjb688u8	cm85mmjjt0001kzf83w094zmd	4	2025-07-11 22:00:00	824.63	31.44	6721.95	2025-03-12 07:57:04.88	2025-03-12 07:57:04.88	f	\N	\N	\N
cm85mn0og000ekzf8998vwj3l	cm85mmjjt0001kzf83w094zmd	6	2025-09-11 22:00:00	831.52	24.56	5062.37	2025-03-12 07:57:04.883	2025-03-12 07:57:04.883	f	\N	\N	\N
cm85ncfvp000akzkkgomdqsm1	cm85nbs0h0003kzkkofpohyya	2	2025-05-11 22:00:00	4094.17	159.85	91818.47	2025-03-12 08:16:51.229	2025-03-12 08:16:51.229	f	\N	\N	\N
cm85ncfwa000dkzkkvexxoqyr	cm85nbs0h0003kzkkofpohyya	8	2025-11-11 23:00:00	4135.28	118.74	67109.74	2025-03-12 08:16:51.23	2025-03-12 08:16:51.23	f	\N	\N	\N
cm85ncfy0000gkzkkoxds5wf2	cm85nbs0h0003kzkkofpohyya	15	2026-06-11 22:00:00	4183.77	70.25	37969.13	2025-03-12 08:16:51.23	2025-03-12 08:16:51.23	f	\N	\N	\N
cm85ncfy8000jkzkka0a6bvqx	cm85nbs0h0003kzkkofpohyya	4	2025-07-11 22:00:00	4107.83	146.2	83609.64	2025-03-12 08:16:51.23	2025-03-12 08:16:51.23	f	\N	\N	\N
cm85ncfz4000mkzkkk00z6pdk	cm85nbs0h0003kzkkofpohyya	21	2026-12-11 23:00:00	4225.78	28.24	12719.66	2025-03-12 08:16:51.23	2025-03-12 08:16:51.23	f	\N	\N	\N
cm85ncfz9000pkzkkpfy32bkm	cm85nbs0h0003kzkkofpohyya	17	2026-08-11 22:00:00	4197.73	56.3	29580.65	2025-03-12 08:16:51.23	2025-03-12 08:16:51.23	f	\N	\N	\N
cm85ncfzz000skzkk4d3m1c8k	cm85nbs0h0003kzkkofpohyya	10	2026-01-11 23:00:00	4149.08	104.95	58818.48	2025-03-12 08:16:51.23	2025-03-12 08:16:51.23	f	\N	\N	\N
cm85o11px0009kzq47px34ze8	cm85nzu7i0002kzq459ynk499	9	2025-12-11 23:00:00	8419.54	141.21	25469.7	2025-03-12 08:35:59.294	2025-03-12 08:35:59.294	f	0	0	8560.75
cm85o11ql000ckzq4b4951r50	cm85nzu7i0002kzq459ynk499	8	2025-11-11 23:00:00	8384.61	176.14	33889.25	2025-03-12 08:35:59.294	2025-03-12 08:35:59.294	f	0	0	8560.75
cm85o11ph0006kzq4wwmj2edz	cm85nzu7i0002kzq459ynk499	1	2025-04-11 22:00:00	8144.08	416.67	91855.92	2025-03-12 08:35:59.294	2025-03-12 09:03:21.108	t	8000	0	8560.75
cm85o11qn000ekzq4ekhkjiyq	cm85nzu7i0002kzq459ynk499	6	2025-09-11 22:00:00	8315.17	245.58	50623.67	2025-03-12 08:35:59.294	2025-03-12 09:20:14.009	t	17000	-1439.25	8560.75
cm8lbpf570029kziwwks97krm	cm8lazeq50002kziwr0u7r7lu	6	2025-09-22 22:00:00	83.15	2.46	506.24	2025-03-23 07:35:20.197	2025-03-23 07:35:20.197	f	0	0	85.61
cm8lbpf5g002ckziwwpyj6v6w	cm8lazeq50002kziwr0u7r7lu	11	2026-02-22 23:00:00	84.9	0.71	85.25	2025-03-23 07:35:20.198	2025-03-23 07:35:20.198	f	0	0	85.61
cm8lbpf78002fkziwz7xtjc4p	cm8lazeq50002kziwr0u7r7lu	8	2025-11-22 23:00:00	83.85	1.76	338.89	2025-03-23 07:35:20.197	2025-03-23 07:35:20.197	f	0	0	85.61
cm7tsnt0l0033kzwge81qprm3	cm7tqh4pq0003kzwgvvwezzk0	1	2025-04-03 22:00:00	3970.47	416.67	96029.53	2025-03-04 01:12:25.509	2025-03-23 09:29:08.061	t	1009	\N	\N
cm8lbpf3t0026kziws4y34olz	cm8lazeq50002kziwr0u7r7lu	3	2025-06-22 22:00:00	82.12	3.49	754.66	2025-03-23 07:35:20.197	2025-03-23 09:32:23.011	f	0	75.61	85.61
cm7tsnt7y003dkzwg45yirdcy	cm7tqh4pq0003kzwgvvwezzk0	13	2026-04-03 22:00:00	4173.61	213.53	47073.54	2025-03-04 01:12:25.516	2025-03-04 01:12:25.516	f	\N	\N	\N
cm7tsnt9m003ikzwg7f51joy4	cm7tqh4pq0003kzwgvvwezzk0	12	2026-03-03 23:00:00	4156.29	230.85	51247.14	2025-03-04 01:12:25.516	2025-03-04 01:12:25.516	f	\N	\N	\N
cm7tsnt9u003jkzwg8tikur8a	cm7tqh4pq0003kzwgvvwezzk0	19	2026-10-03 22:00:00	4279.04	108.1	21664.14	2025-03-04 01:12:25.517	2025-03-04 01:12:25.517	f	\N	\N	\N
cm7tsnt9y003kkzwgvog089aw	cm7tqh4pq0003kzwgvvwezzk0	21	2026-12-03 23:00:00	4314.78	72.36	13052.5	2025-03-04 01:12:25.517	2025-03-04 01:12:25.517	f	\N	\N	\N
cm7tsnt9z003lkzwg7im86x8d	cm7tqh4pq0003kzwgvvwezzk0	16	2026-07-03 22:00:00	4226	161.14	34448.08	2025-03-04 01:12:25.516	2025-03-04 01:12:25.516	f	\N	\N	\N
cm7tsnta1003nkzwg2ki6mkwr	cm7tqh4pq0003kzwgvvwezzk0	18	2026-09-03 22:00:00	4261.29	125.85	25943.18	2025-03-04 01:12:25.516	2025-03-04 01:12:25.516	f	\N	\N	\N
cm7tsnta1003mkzwggglpj70z	cm7tqh4pq0003kzwgvvwezzk0	14	2026-05-03 22:00:00	4191	196.14	42882.54	2025-03-04 01:12:25.516	2025-03-04 01:12:25.516	f	\N	\N	\N
cm7tsntac003pkzwg6vqb2jul	cm7tqh4pq0003kzwgvvwezzk0	20	2026-11-03 23:00:00	4296.87	90.27	17367.27	2025-03-04 01:12:25.517	2025-03-04 01:12:25.517	f	\N	\N	\N
cm7ux3z9p0006kz34r6p5p9bg	cm7uwt9k80001kz34oaw4r6ym	1	2025-04-03 22:00:00	39704.72	4166.67	960295.28	2025-03-04 20:04:44.749	2025-03-04 20:04:44.749	f	\N	\N	\N
cm7ux3zd10007kz34zhib28d8	cm7uwt9k80001kz34oaw4r6ym	8	2025-11-03 23:00:00	40877.35	2994.04	677691.19	2025-03-04 20:04:44.835	2025-03-04 20:04:44.835	f	\N	\N	\N
cm7ux3zd50008kz34r7bk4xnl	cm7uwt9k80001kz34oaw4r6ym	5	2025-08-03 22:00:00	40370.62	3500.77	799815.11	2025-03-04 20:04:44.835	2025-03-04 20:04:44.835	f	\N	\N	\N
cm7ux3zd90009kz34dnq6wvvc	cm7uwt9k80001kz34oaw4r6ym	11	2026-02-03 23:00:00	41390.45	2480.94	554034.36	2025-03-04 20:04:44.835	2025-03-04 20:04:44.835	f	\N	\N	\N
cm7ux3ze0000akz3498hxcrin	cm7uwt9k80001kz34oaw4r6ym	10	2026-01-03 23:00:00	41218.71	2652.68	595424.81	2025-03-04 20:04:44.791	2025-03-04 20:04:44.791	f	\N	\N	\N
cm7ux3ze0000bkz34m09690y4	cm7uwt9k80001kz34oaw4r6ym	6	2025-09-03 22:00:00	40538.83	3332.56	759276.29	2025-03-04 20:04:44.789	2025-03-04 20:04:44.789	f	\N	\N	\N
cm7ux3zec000ckz34kxapwlag	cm7uwt9k80001kz34oaw4r6ym	15	2026-06-03 22:00:00	42084.62	1786.77	386740.74	2025-03-04 20:04:44.792	2025-03-04 20:04:44.792	f	\N	\N	\N
cm7ux3zep000dkz348b8ktm4n	cm7uwt9k80001kz34oaw4r6ym	2	2025-05-03 22:00:00	39870.16	4001.23	920425.12	2025-03-04 20:04:44.751	2025-03-04 20:04:44.751	f	\N	\N	\N
cm7ux3zeu000ekz341mnmw38c	cm7uwt9k80001kz34oaw4r6ym	3	2025-06-03 22:00:00	40036.29	3835.1	880388.83	2025-03-04 20:04:44.755	2025-03-04 20:04:44.755	f	\N	\N	\N
cm7ux3zg5000fkz34mpkw58ul	cm7uwt9k80001kz34oaw4r6ym	24	2027-03-03 23:00:00	43689.35	182.04	0	2025-03-04 20:04:44.797	2025-03-04 20:04:44.797	f	\N	\N	\N
cm7ux3zgh000gkz341g82e0s1	cm7uwt9k80001kz34oaw4r6ym	12	2026-03-03 23:00:00	41562.91	2308.48	512471.44	2025-03-04 20:04:44.791	2025-03-04 20:04:44.791	f	\N	\N	\N
cm7ux3zgm000hkz34ji14rwyq	cm7uwt9k80001kz34oaw4r6ym	7	2025-10-03 22:00:00	40707.74	3163.65	718568.55	2025-03-04 20:04:44.789	2025-03-04 20:04:44.789	f	\N	\N	\N
cm7ux3zhd000ikz34njfmit6w	cm7uwt9k80001kz34oaw4r6ym	19	2026-10-03 22:00:00	42790.42	1080.97	216641.42	2025-03-04 20:04:44.794	2025-03-04 20:04:44.794	f	\N	\N	\N
cm7ux3zhr000lkz346dy1qtmj	cm7uwt9k80001kz34oaw4r6ym	4	2025-07-03 22:00:00	40203.1	3668.29	840185.73	2025-03-04 20:04:44.758	2025-03-04 20:04:44.758	f	\N	\N	\N
cm7ux3zhq000kkz34407nhsom	cm7uwt9k80001kz34oaw4r6ym	18	2026-09-03 22:00:00	42612.87	1258.52	259431.85	2025-03-04 20:04:44.793	2025-03-04 20:04:44.793	f	\N	\N	\N
cm7ux3zhq000jkz34myalum5x	cm7uwt9k80001kz34oaw4r6ym	21	2026-12-03 23:00:00	43147.75	723.64	130524.95	2025-03-04 20:04:44.795	2025-03-04 20:04:44.795	f	\N	\N	\N
cm7ux3zi5000nkz34y43o7h7m	cm7uwt9k80001kz34oaw4r6ym	23	2027-02-03 23:00:00	43508.07	363.32	43689.35	2025-03-04 20:04:44.796	2025-03-04 20:04:44.796	f	\N	\N	\N
cm7ux3zi1000mkz34l8ovq36x	cm7uwt9k80001kz34oaw4r6ym	22	2027-01-03 23:00:00	43327.54	543.85	87197.42	2025-03-04 20:04:44.795	2025-03-04 20:04:44.795	f	\N	\N	\N
cm7ux3zi8000okz34zbfz6mcj	cm7uwt9k80001kz34oaw4r6ym	13	2026-04-03 22:00:00	41736.09	2135.3	470735.35	2025-03-04 20:04:44.825	2025-03-04 20:04:44.825	f	\N	\N	\N
cm7ux3zij000pkz34n893arez	cm7uwt9k80001kz34oaw4r6ym	17	2026-08-03 22:00:00	42436.05	1435.34	302044.72	2025-03-04 20:04:44.792	2025-03-04 20:04:44.792	f	\N	\N	\N
cm7ux3zio000qkz34jg3heob1	cm7uwt9k80001kz34oaw4r6ym	14	2026-05-03 22:00:00	41909.99	1961.4	428825.36	2025-03-04 20:04:44.791	2025-03-04 20:04:44.791	f	\N	\N	\N
cm7ux3zj0000rkz34kyt09bmm	cm7uwt9k80001kz34oaw4r6ym	9	2025-12-03 23:00:00	41047.68	2823.71	636643.52	2025-03-04 20:04:44.789	2025-03-04 20:04:44.789	f	\N	\N	\N
cm7ux3zj2000tkz34zov0cqea	cm7uwt9k80001kz34oaw4r6ym	16	2026-07-03 22:00:00	42259.97	1611.42	344480.77	2025-03-04 20:04:44.792	2025-03-04 20:04:44.792	f	\N	\N	\N
cm7ux3zj2000skz3480a75o7c	cm7uwt9k80001kz34oaw4r6ym	20	2026-11-03 23:00:00	42968.72	902.67	173672.71	2025-03-04 20:04:44.794	2025-03-04 20:04:44.794	f	\N	\N	\N
cm7tsntas003qkzwg1rdxxk11	cm7tqh4pq0003kzwgvvwezzk0	7	2025-10-03 22:00:00	4070.77	316.37	71856.85	2025-03-04 01:12:25.514	2025-03-06 13:26:45.146	t	\N	\N	\N
cm7tsnt9a003hkzwgbm7x2tag	cm7tqh4pq0003kzwgvvwezzk0	4	2025-07-03 22:00:00	4020.31	366.83	84018.57	2025-03-04 01:12:25.51	2025-03-12 07:44:13.723	t	\N	\N	\N
cm85mn0fd0005kzf8qvi30dim	cm85mmjjt0001kzf83w094zmd	2	2025-05-11 22:00:00	817.8	38.27	8367.79	2025-03-12 07:57:04.874	2025-03-12 07:57:04.874	f	\N	\N	\N
cm85mn0nn0009kzf8z3xo5243	cm85mmjjt0001kzf83w094zmd	11	2026-02-11 23:00:00	848.99	7.09	852.52	2025-03-12 07:57:04.885	2025-03-12 07:57:04.885	f	\N	\N	\N
cm85mn0oa000ckzf8jj04lg8k	cm85mmjjt0001kzf83w094zmd	10	2026-01-11 23:00:00	845.46	10.61	1701.51	2025-03-12 07:57:04.885	2025-03-12 07:57:04.885	f	\N	\N	\N
cm85mn0oi000fkzf8u1bdx3l4	cm85mmjjt0001kzf83w094zmd	7	2025-10-11 22:00:00	834.98	21.09	4227.39	2025-03-12 07:57:04.884	2025-03-12 07:57:04.884	f	\N	\N	\N
cm85ncfvs000bkzkkate8bldh	cm85nbs0h0003kzkkofpohyya	3	2025-06-11 22:00:00	4101	153.03	87717.47	2025-03-12 08:16:51.229	2025-03-12 08:16:51.229	f	\N	\N	\N
cm85ncfwc000ekzkk3bstp4xz	cm85nbs0h0003kzkkofpohyya	5	2025-08-11 22:00:00	4114.68	139.35	79494.97	2025-03-12 08:16:51.23	2025-03-12 08:16:51.23	f	\N	\N	\N
cm85ncfy3000hkzkkymmy4fdn	cm85nbs0h0003kzkkofpohyya	11	2026-02-11 23:00:00	4156	98.03	54662.49	2025-03-12 08:16:51.23	2025-03-12 08:16:51.23	f	\N	\N	\N
cm85ncfy8000kkzkk0t73i2za	cm85nbs0h0003kzkkofpohyya	18	2026-09-11 22:00:00	4204.73	49.3	25375.93	2025-03-12 08:16:51.23	2025-03-12 08:16:51.23	f	\N	\N	\N
cm85ncfz5000nkzkkcj5yhahq	cm85nbs0h0003kzkkofpohyya	12	2026-03-11 23:00:00	4162.92	91.1	50499.57	2025-03-12 08:16:51.23	2025-03-12 08:16:51.23	f	\N	\N	\N
cm85ncfza000qkzkkccgys6o6	cm85nbs0h0003kzkkofpohyya	6	2025-09-11 22:00:00	4121.53	132.49	75373.43	2025-03-12 08:16:51.23	2025-03-12 08:16:51.23	f	\N	\N	\N
cm85ncg1n000tkzkkpk6txg8p	cm85nbs0h0003kzkkofpohyya	19	2026-10-11 22:00:00	4211.73	42.29	21164.19	2025-03-12 08:16:51.23	2025-03-12 08:16:51.23	f	\N	\N	\N
cm85o11qm000dkzq4pn3mpa2o	cm85nzu7i0002kzq459ynk499	10	2026-01-11 23:00:00	8454.62	106.12	17015.08	2025-03-12 08:35:59.294	2025-03-12 08:35:59.294	f	0	0	8560.75
cm85o11qw000gkzq4gf5rocs0	cm85nzu7i0002kzq459ynk499	11	2026-02-11 23:00:00	8489.85	70.9	8525.23	2025-03-12 08:35:59.294	2025-03-12 08:35:59.294	f	0	0	8560.75
cm85o11q9000akzq46eh8yn83	cm85nzu7i0002kzq459ynk499	7	2025-10-11 22:00:00	8349.82	210.93	42273.85	2025-03-12 08:35:59.294	2025-03-12 09:20:14.014	f	0	-8439.25	8560.75
cm85o11pr0007kzq4zovgng1h	cm85nzu7i0002kzq459ynk499	4	2025-07-11 22:00:00	8246.31	314.44	67219.51	2025-03-12 08:35:59.294	2025-03-12 09:12:49.58	t	8560.75	8552.75	8560.75
cm7tsnt80003fkzwgyhmny8rz	cm7tqh4pq0003kzwgvvwezzk0	9	2025-12-03 23:00:00	4104.77	282.37	63664.35	2025-03-04 01:12:25.516	2025-03-13 06:38:53.25	t	11	\N	\N
cm7tsnta4003okzwgwqi4yel7	cm7tqh4pq0003kzwgvvwezzk0	10	2026-01-03 23:00:00	4121.87	265.27	59542.48	2025-03-04 01:12:25.516	2025-03-13 06:38:53.256	f	\N	-11	\N
cm8lbpf420027kziw2pzmvy9i	cm8lazeq50002kziwr0u7r7lu	7	2025-10-22 22:00:00	83.5	2.11	422.74	2025-03-23 07:35:20.197	2025-03-23 07:35:20.197	f	0	0	85.61
cm8lbpf5e002akziwwb2qhbdg	cm8lazeq50002kziwr0u7r7lu	4	2025-07-22 22:00:00	82.46	3.14	672.2	2025-03-23 07:35:20.197	2025-03-23 07:35:20.197	f	0	0	85.61
cm8lbpf5j002dkziwp143qwaf	cm8lazeq50002kziwr0u7r7lu	10	2026-01-22 23:00:00	84.55	1.06	170.15	2025-03-23 07:35:20.198	2025-03-23 07:35:20.198	f	0	0	85.61
\.


--
-- Data for Name: AmortizationEntryHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AmortizationEntryHistory" (id, "entryId", "previousAmountPaid", "newAmountPaid", "previousRemainingBalance", "newRemainingBalance", differential, "changedBy", "changeDate") FROM stdin;
\.


--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AuditLog" (id, "userId", "actionType", "affectedEntity", "affectedEntityId", "ipAddress", "userAgent", "loggedAt") FROM stdin;
\.


--
-- Data for Name: CardType; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CardType" (id, name, description, "createdAt", "updatedAt") FROM stdin;
cm7wtx7wr0001kzu4wmm2k5dv	MasterCard		2025-03-06 04:11:02.859	2025-03-06 04:11:02.859
cm7y5svrb0002kzykuh3ikuh7	CIB		2025-03-07 02:31:22.056	2025-03-07 02:31:22.056
cm8lj8eq8000akz44y2k3irlg	aaa	dzde	2025-03-23 11:06:03.536	2025-03-23 11:16:49.122
\.


--
-- Data for Name: Cheque; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Cheque" (id, "accountId", "chequeNumber", "requestDate", "issuedAt", "deliveryDate", "receptionDate", "expirationDate", observation, "createdAt", "updatedAt") FROM stdin;
cm7xjgwqs0001kzgg5o6arz9i	cm7wurage0000kz8w5jn1lbaf	2343242432 49	2025-03-06 00:00:00	2025-03-06 00:00:00	2025-03-10 00:00:00	2025-03-10 00:00:00	2027-03-10 00:00:00	\N	2025-03-06 16:06:11.907	2025-03-10 20:42:27.553
cm8kgm8oq0003kz1ozfg47fad	cm7tjz4ui000dkz70u71ifro7	23432423432 43213	2025-02-26 00:00:00	\N	\N	\N	\N	\N	2025-03-22 17:05:03.866	2025-03-22 17:05:03.866
cm8kg3gup0001kz1od7319myy	cm85n1khq0001kzkkvpzfgsjb	2343242432 43	2025-03-15 00:00:00	\N	\N	\N	\N	heeloo	2025-03-22 16:50:27.979	2025-03-22 17:14:34.809
\.


--
-- Data for Name: Client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Client" (id, type, status, "createdAt", "updatedAt", "deletedAt") FROM stdin;
47ed8fab-b8dc-46ab-a240-5e5a4e6f9ec0	MORAL	ACTIVE	2025-03-03 05:28:09.07	2025-03-11 20:07:54.834	2025-03-11 20:07:54.83
c1c38a71-6311-4096-8eee-1515d3db02a5	PHYSICAL	SUSPENDED	2025-03-11 19:43:20.932	2025-03-20 14:30:28.474	2025-03-20 14:30:28.342
30c77f1d-4dde-4ccc-81a7-8b3865849619	PHYSICAL	DELETED	2025-03-11 19:59:21.038	2025-03-21 05:38:05.178	2025-03-21 05:38:05.118
ed967fe6-2db4-480b-82ef-724e5cdf6cf9	PHYSICAL	ACTIVE	2025-03-21 10:56:44.655	2025-03-21 10:56:44.655	\N
038cb85e-259a-4d3d-b977-abb55db1cfef	PHYSICAL	ACTIVE	2025-03-11 19:57:06.019	2025-03-21 14:46:59.534	2025-03-21 05:34:51.112
3ce462c0-7aa0-4ead-8f3a-8bfc45563836	MORAL	ACTIVE	2025-03-21 10:41:29.321	2025-03-21 15:21:04.915	\N
8c4767ce-d8b0-471e-8e79-4b6c7b353fc7	PHYSICAL	SUSPENDED	2025-03-03 20:59:07.829	2025-03-21 15:36:17.909	2025-03-12 02:39:31.964
49726415-5c0b-47bb-b171-4885ca913d48	PHYSICAL	ACTIVE	2025-03-21 10:53:16.663	2025-03-21 17:15:51.955	\N
dd8d5de1-6d40-4eeb-aeb4-5c57c2d57c11	MORAL	DELETED	2025-03-11 20:01:50.77	2025-03-21 17:16:23.125	2025-03-21 05:28:58.732
\.


--
-- Data for Name: Credit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Credit" (id, "creditNumber", "creditTypeId", "principalAmount", "interestRate", "termInMonths", "startDate", "endDate", "monthlyInstallment", status, "createdAt", "updatedAt", "CreditApplicationId", "accordDate", "accordRecu", "accountNumber", amendment, "amountInLetter", "approvedAmount", "authorizationDate", "authorizationNumber", "authorizedAmount", bonification, "clientIdentifier", "decisionDate", "deferredMonths", "disbursementDate", "dossierNumber", "firstDueDate", "initialDossier", "lastDueDate", "mobilisedAmount", "numberOfEffects", observation, "rcDate", "scheduledDueDate", "secondaryRC", "transmissionDate") FROM stdin;
cm7tqh4pq0003kzwgvvwezzk0	1111324324	cm7tjwc5u000bkz70nmzzwov9	100000	5	24	2025-03-04 00:00:00	2027-03-04 00:00:00	4387.139	ACTIVE	2025-03-04 00:11:14.846	2025-03-04 00:11:14.846	cm7tlrbh2000lkz70gsnnndns	\N	f				100000	\N		0	0		\N	0	\N		\N		\N	0	0		\N	\N		\N
cm7uwt9k80001kz34oaw4r6ym	109876556	cm7tjwc5u000bkz70nmzzwov9	1000000	5	24	2025-03-04 00:00:00	2027-03-04 00:00:00	43871.39	ACTIVE	2025-03-04 19:56:24.873	2025-03-04 19:56:24.873	cm7tvm46b003rkzwgfzswvo2s	\N	f				0	\N		0	0		\N	0	\N		\N		\N	0	0		\N	\N		\N
cm85mmjjt0001kzf83w094zmd	1234214	cm7tjwc5u000bkz70nmzzwov9	10000	5	12	2025-03-19 00:00:00	2026-03-12 00:00:00	856.075	ACTIVE	2025-03-12 07:56:43.002	2025-03-12 07:56:43.002	cm85mloms0000kzf8360k8mzj	\N	f				0	\N		0	0		\N	0	\N		\N		\N	0	0		\N	\N		\N
cm85nbs0h0003kzkkofpohyya		cm7tjwc5u000bkz70nmzzwov9	100000	2	24	\N	\N	4254.026	ACTIVE	2025-03-12 08:16:20.37	2025-03-12 08:16:20.37	cm85n6f830002kzkkhii1qybc	\N	f				0	\N		0	0		\N	0	\N		\N		\N	0	0		\N	\N		\N
cm85nzu7i0002kzq459ynk499	123123	cm7tjwc5u000bkz70nmzzwov9	100000	5	12	\N	\N	8560.748	ACTIVE	2025-03-12 08:35:02.958	2025-03-12 08:35:02.958	cm85nrn0a0000kzq48odpro85	\N	f				0	\N		0	0		\N	0	\N		\N		\N	0	0		\N	\N		\N
cm8lazeq50002kziwr0u7r7lu	111111	cm7tjwc5u000bkz70nmzzwov9	1000	5	12	2025-03-22 00:00:00	2025-03-15 00:00:00	85.607	ACTIVE	2025-03-23 07:15:06.702	2025-03-23 07:15:06.702	cm8l5asib0004kz1opdzttptq	\N	f				1	\N		0	0		\N	0	\N		\N		\N	0	0		\N	\N		\N
\.


--
-- Data for Name: CreditApplication; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CreditApplication" (id, "creditTypeAbbrev", "creditCode", activity, sector, "activityBranch", "specificZone", "clientStatus", "projectCost", "solicitedAmount", "receptionDate", "realEstateToFinance", "realEstateValue", promoter, "monthlyIncome", "guaranteeIncome", "theoreticalInstallment", apport, pnr, status, "clientId", "createdAt", "updatedAt", "creditTypeId") FROM stdin;
cm7tlrbh2000lkz70gsnnndns	IMM	CRD456	Agriculture	Primaire	Céréales	Zone rurale	Ancien	2000000	2000000	2025-03-03 00:00:00	Terrain	\N		200000	20000	\N	\N	PNR239	APPROVED	cm7tjz4ui000dkz70u71ifro7	2025-03-03 21:59:12.086	2025-03-03 22:02:51.942	cm7tjwc5u000bkz70nmzzwov9
cm7tvm46b003rkzwgfzswvo2s	immmob	CRD78	BB	bb	bb	bb	nouveau	10000	10000	2025-03-04 00:00:00	aa	100000	PA	10000	\N	\N	\N		INITIATED	cm7tjz4ui000dkz70u71ifro7	2025-03-04 02:35:05.507	2025-03-10 07:17:08.636	cm7tjwc5u000bkz70nmzzwov9
cm85mloms0000kzf8360k8mzj	EEE	234234	ez	re	re	re	ancient	\N	1000000	2025-03-19 00:00:00		\N		\N	\N	\N	\N		APPROVED	cm84xe7no0000kzuwqh9gougr	2025-03-12 07:56:02.912	2025-03-12 07:57:05.25	cm7tjwc5u000bkz70nmzzwov9
cm85n6f830002kzkkhii1qybc	AZZE	DZF23						\N	10000	2025-03-19 00:00:00		\N		\N	\N	\N	\N		APPROVED	cm85n1khq0001kzkkvpzfgsjb	2025-03-12 08:12:10.515	2025-03-12 08:16:51.528	cm7tjwc5u000bkz70nmzzwov9
cm85nrn0a0000kzq48odpro85	OPKO	0090KK						\N	9999	2025-03-19 00:00:00		\N		\N	\N	\N	\N		APPROVED	cm85n1khq0001kzkkvpzfgsjb	2025-03-12 08:28:40.378	2025-03-12 08:35:59.392	cm7tjwc5u000bkz70nmzzwov9
cm8l86uah0000kziw20nixizs	IMM	CRD45234098IUZE						\N	111111111111	2025-03-21 00:00:00		\N		\N	\N	\N	\N		PENDING	cm85n1khq0001kzkkvpzfgsjb	2025-03-23 05:56:54.617	2025-03-23 06:54:39.506	cm8l8ix250001kziwwu516dq4
cm8l5asib0004kz1opdzttptq	IMM	CRD45234098IUZE						2222222222	2222222222222	2025-03-29 00:00:00		\N		\N	\N	1123123	123123	PNR12323ER	APPROVED	cm7tjz4ui000dkz70u71ifro7	2025-03-23 04:36:00.081	2025-03-23 07:35:20.393	cm7tjwc5u000bkz70nmzzwov9
\.


--
-- Data for Name: CreditLegalAction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CreditLegalAction" (id, "creditId", "unpaidClaim", invitation, "miseEnDemeure", "lastWarning", sommation, "pvCarence", observation, "createdAt", "updatedAt") FROM stdin;
cm8lhbh0r002ikziwme9uweqi	cm7uwt9k80001kz34oaw4r6ym	\N	a		s	\N	s	\N	2025-03-23 10:12:27.24	2025-03-23 10:12:27.24
cm8lhbh2m002kkziwetes1w8c	cm7uwt9k80001kz34oaw4r6ym	\N	a		s	\N	s	\N	2025-03-23 10:12:27.241	2025-03-23 10:12:27.241
cm8lhbh2q002mkziwu7gfi6zf	cm7uwt9k80001kz34oaw4r6ym	\N	a		s	\N	s	\N	2025-03-23 10:12:27.24	2025-03-23 10:12:27.24
cm8lhmrua0003kz44owt8j4ej	cm8lazeq50002kziwr0u7r7lu	11	aa						2025-03-23 10:21:14.482	2025-03-23 10:21:14.482
\.


--
-- Data for Name: CreditType; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CreditType" (id, name, description, "createdAt", "updatedAt") FROM stdin;
cm7tjwc5u000bkz70nmzzwov9	Crédit immobilier	Prêt pour l'achat d'un bien immobilier.	2025-03-03 21:07:07.026	2025-03-03 21:07:07.026
cm8l8ix250001kziwwu516dq4	Auto		2025-03-23 06:06:18.078	2025-03-23 06:06:18.078
cm8lj6m070009kz44mhk5n1hw	ssss	S4	2025-03-23 11:04:39.655	2025-03-23 11:13:35.81
\.


--
-- Data for Name: Currency; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Currency" (id, code, name, symbol, "isActive", "createdAt", "updatedAt") FROM stdin;
cm8lhuspl0004kz44dwdbran6	pokp	okp		t	2025-03-23 10:27:28.858	2025-03-23 10:27:28.858
cm7tjumsz000akz70t1aap276	DZD	Dinard Algérien 	DA	t	2025-03-03 21:05:47.508	2025-03-23 10:52:21.539
cm8liuagu0005kz448gyc98o3	ezez	zeze	zez	t	2025-03-23 10:55:04.83	2025-03-23 10:55:04.83
cm8lix6jg0006kz4403m6dk20	az	azaz		t	2025-03-23 10:57:19.708	2025-03-23 10:57:19.708
\.


--
-- Data for Name: Financing; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Financing" (id, "creditId", type, value, "order", observation, "createdAt", "updatedAt") FROM stdin;
cm7uwvrnf0003kz34iafclkxc	cm7uwt9k80001kz34oaw4r6ym	F2	10000	2	B	2025-03-04 19:58:21.628	2025-03-04 19:58:21.628
cm7uwvrqp0004kz34lwyhbezl	cm7uwt9k80001kz34oaw4r6ym	F1	10000	1	A	2025-03-04 19:58:21.632	2025-03-04 19:58:21.632
cm7uwvrqt0005kz34f58i3199	cm7uwt9k80001kz34oaw4r6ym	F3	10000	3	C	2025-03-04 19:58:21.628	2025-03-04 19:58:21.628
cm85ncc1x0005kzkk2ryg3gxw	cm85nbs0h0003kzkkofpohyya	F	0	1		2025-03-12 08:16:46.341	2025-03-12 08:16:46.341
cm85o0qg70004kzq4qm5ocec6	cm85nzu7i0002kzq459ynk499	F	0	1		2025-03-12 08:35:44.744	2025-03-12 08:35:44.744
cm8lb7ygj0004kziwfbc2dy01	cm8lazeq50002kziwr0u7r7lu		0	1		2025-03-23 07:21:45.523	2025-03-23 07:21:45.523
cm85mmydp0003kzf8pn4kw1vb	cm85mmjjt0001kzf83w094zmd	F	1	1	Validated	2025-03-12 07:57:02.221	2025-03-23 09:56:12.768
\.


--
-- Data for Name: Guarantee; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Guarantee" (id, "creditId", "guaranteeTypeId", description, value, metadata, "expiryDate", observation, "createdAt", "updatedAt") FROM stdin;
cm7uwuo100002kz34a2zq1xg7	cm7uwt9k80001kz34oaw4r6ym	cm7tjx1q0000ckz700517urtz	Hello	10000	\N	2026-03-04 00:00:00	\N	2025-03-04 19:57:30.276	2025-03-04 19:57:30.276
cm85mmtkq0002kzf8rkh0h1ll	cm85mmjjt0001kzf83w094zmd	cm7tjx1q0000ckz700517urtz	zer	1111	\N	2025-03-12 00:00:00	\N	2025-03-12 07:56:55.994	2025-03-12 07:56:55.994
cm85nc6pp0004kzkkhopqnodm	cm85nbs0h0003kzkkofpohyya	cm7tjx1q0000ckz700517urtz	AAA	11	\N	2025-03-19 00:00:00	\N	2025-03-12 08:16:39.421	2025-03-12 08:16:39.421
cm85o0mha0003kzq4w7qrr7j8	cm85nzu7i0002kzq459ynk499	cm7tjx1q0000ckz700517urtz	efze	2341	\N	2025-03-20 00:00:00	\N	2025-03-12 08:35:39.598	2025-03-12 08:35:39.598
cm8lb4uza0003kziw3bsia9rl	cm8lazeq50002kziwr0u7r7lu	cm7tjx1q0000ckz700517urtz	aaaaaaaaa	7	\N	2025-03-24 00:00:00	\N	2025-03-23 07:19:21.046	2025-03-23 07:19:21.046
cm7ts0mso000ekzwgrtevmolj	cm7tqh4pq0003kzwgvvwezzk0	cm7tjx1q0000ckz700517urtz		1000	\N	2026-03-04 00:00:00	Validée	2025-03-04 00:54:24.361	2025-03-23 09:46:29.174
\.


--
-- Data for Name: GuaranteeType; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."GuaranteeType" (id, name, description, "createdAt", "updatedAt") FROM stdin;
cm7tjx1q0000ckz700517urtz	Hypothèque	Garantie réelle sur un bien immobilier permettant à la banque de le saisir en cas de non-remboursement du prêt.	2025-03-03 21:07:40.153	2025-03-03 21:07:40.153
cm8lj3nh60008kz44lep67kni	jnkjkn		2025-03-23 11:02:21.594	2025-03-23 11:02:21.594
cm8lj2c4s0007kz44hoea1x6h	aze	az	2025-03-23 11:01:20.236	2025-03-23 11:10:30.546
\.


--
-- Data for Name: IdentityDocument; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."IdentityDocument" (id, "clientId", "otherDocumentType", "documentNumber", "issueDate", "issuedBy", "otherIssuingEntity", "nationalIdentifierNumber", "otherAuthorization", "tradeRegisterNumber", "artisanCardNumber", "professionalDocumentDate", "professionalDocumentIssuedBy", "otherProfessionalDocumentIssuer", "createdAt", "updatedAt", "documentType") FROM stdin;
cm7smctjc0002kzqwsg2vaxfp	47ed8fab-b8dc-46ab-a240-5e5a4e6f9ec0	CNIBE	0987657890	2025-02-26 00:00:00	algérie	algérie	098765467890	AGREMENT	098765789	098765789	2025-03-03 00:00:00	09876	oijo	2025-03-03 05:28:09.096	2025-03-06 16:09:00.063	CNIBE
cm84wfffd0006kzogimvcnrjb	c1c38a71-6311-4096-8eee-1515d3db02a5	\N	09382423	2025-03-11 00:00:00	Kherrata	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-11 19:43:21.049	2025-03-11 19:43:21.049	CNIBE
cm84x008f000dkzogak2unv4p	30c77f1d-4dde-4ccc-81a7-8b3865849619	\N	aa	2025-03-11 00:00:00	aa	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-11 19:59:21.136	2025-03-11 19:59:21.136	CNIBE
cm8io0q69000ckznscopzrr15	ed967fe6-2db4-480b-82ef-724e5cdf6cf9	\N	324234	2025-03-21 00:00:00	GEzef	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-21 10:56:44.674	2025-03-21 10:56:44.674	CNIBE
cm84wx41p000akzogows6vcw6	038cb85e-259a-4d3d-b977-abb55db1cfef	\N	0909	2025-03-11 00:00:00	jnjnj	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-11 19:57:06.109	2025-03-21 14:46:59.622	CNIBE
cm8inh3w50004kznshx6yrr1x	3ce462c0-7aa0-4ead-8f3a-8bfc45563836	\N	324234	2025-03-21 00:00:00	GEzef	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-21 10:41:29.334	2025-03-21 15:21:04.977	CNIBE
cm7tjm2ft0007kz70cvpoq34u	8c4767ce-d8b0-471e-8e79-4b6c7b353fc7	\N	2542353245435	2020-01-03 00:00:00	Kherrata	\N	098765467890	\N	\N	\N	\N	\N	\N	2025-03-03 20:59:07.865	2025-03-21 15:36:19.004	CNIBE
cm8inw9ox0008kznsesx52y1y	49726415-5c0b-47bb-b171-4885ca913d48	\N	32423422/	2025-03-21 00:00:00	GEzef	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-21 10:53:16.689	2025-03-21 17:15:52.203	PERMIS_CONDUIRE
cm84x37pe000gkzogco95rkr4	dd8d5de1-6d40-4eeb-aeb4-5c57c2d57c11	\N	21321	2025-03-21 00:00:00	dff	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-11 20:01:50.786	2025-03-21 17:16:23.406	PERMIS_CONDUIRE
\.


--
-- Data for Name: LoginLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LoginLog" (id, email, "ipAddress", "userAgent", locale, "loggedAt", "isSuccess", browser, "browserVer", city, country, device, "failureReason", os, region) FROM stdin;
cm7tjfjr00001kz70elalpdh8	bendris.hamzaisp@gmail.com	::1	node	*	2025-03-03 20:54:03.706	t	\N	\N	\N	\N	\N	\N	\N	\N
cm7tjh0pl0003kz70hhtls1up	bendris.hamzaisp@gmail.com	::1	node	*	2025-03-03 20:55:12.345	t	\N	\N	\N	\N	\N	\N	\N	\N
cm7tpit2m0001kzwglrffo134	bendris.hamzaisp@gmail.com	::1	node	*	2025-03-03 23:44:33.454	t	\N	\N	\N	\N	\N	\N	\N	\N
cm7trfgve0009kzwgccy7y7ol	bendris.hamzaisp@gmail.com	::1	node	*	2025-03-04 00:37:56.906	t	\N	\N	\N	\N	\N	\N	\N	\N
cm7uom47o003tkzwg51c66h93	bendris.hamzaisp@gmail.com	::1	node	*	2025-03-04 16:06:54.409	t	\N	\N	\N	\N	\N	\N	\N	\N
cm7uous11003vkzwg17dh2a73	abdelbakinazim.akkal2226@etu.univ-setif.dz	::1	node	*	2025-03-04 16:13:38.534	t	\N	\N	\N	\N	\N	\N	\N	\N
cm7uowcz0003xkzwg7etqhu6g	abdelbakinazim.akkal2226@etu.univ-setif.dz	::1	node	*	2025-03-04 16:14:52.332	t	\N	\N	\N	\N	\N	\N	\N	\N
cm7wtvu680000kzu46xyymwht	bendris.hamzaisp@gmail.com	::1	node	*	2025-03-06 04:09:58.399	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm7xdrh8i0005kz8w59ix44nn	bendris.hamzaisp@gmail.com	::1	node	*	2025-03-06 13:26:27.329	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm7xfduqg0002kzbo9yjhln29	bendris.hamzaisp@gmail.com	::1	node	*	2025-03-06 14:11:50.87	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm7y2hbpz0000kzyk6plblo42	bendris.hamzaisp@gmail.com	::1	node	*	2025-03-07 00:58:24.021	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm7z6x4rx0006kzykel5fyao1	bendris.hamzaisp@gmail.com	::1	node	*	2025-03-07 19:50:26.104	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm80ku5wt0000kzf0sucfimvq	abdelbakinazim.akkal2226@etu.univ-setif.dz	::1	node	*	2025-03-08 19:07:48.457	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm82iiygc0000kzl0xln2cblx	abdelbakinazim.akkal2226@etu.univ-setif.dz	::1	node	*	2025-03-10 03:38:38.696	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm82qrlf60000kz2s0g7ccw8o	fleurvertesurfondblanc@gmail.com	::1	node	*	2025-03-10 07:29:18.641	f	unknown	NaN	\N	\N	Desktop	Utilisateur non inscrit dans la base de données	unknown	\N
cm82v6r4a0000kznweia1n8fu	abdelbakinazim.akkal2226@etu.univ-setif.dz	::1	node	*	2025-03-10 09:33:04.324	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm82v88bo0001kznwu5861vyu	bendris.hamzaisp@gmail.com	::1	node	*	2025-03-10 09:34:13.283	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm83hm9mh0000kzp4v6pok6q2	abdelbakinazim.akkal2226@etu.univ-setif.dz	::1	node	*	2025-03-10 20:00:59.702	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm83t6m6e0000kzlsur435fgs	bendris.hamzaisp@gmail.com	::1	node	*	2025-03-11 01:24:44.868	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm84vvf220000kz68ih5rxc07	abdelbakinazim.akkal2226@etu.univ-setif.dz	::1	node	*	2025-03-11 19:27:47.445	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm84w1x2v0001kz682zkpv4ot	abdelbakinazim.akkal2226@etu.univ-setif.dz	::1	node	*	2025-03-11 19:32:50.74	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm855d98j0000kz3cwko6f4q0	abdelbakinazim.akkal2226@etu.univ-setif.dz	::1	node	*	2025-03-11 23:53:36.256	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm855zxjj0000kz049qhcnzr9	abdelbakinazim.akkal2226@etu.univ-setif.dz	::1	node	*	2025-03-12 00:11:14.189	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm8560vae0001kz04tttwwdn8	abdelbakinazim.akkal2226@etu.univ-setif.dz	::1	node	*	2025-03-12 00:11:57.925	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm8569pi30002kz04v4qbe8lf	abdelbakinazim.akkal2226@etu.univ-setif.dz	::1	node	*	2025-03-12 00:18:50.33	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm856b3hl0003kz04f4n29r8a	abdelbakinazim.akkal2226@etu.univ-setif.dz	::1	node	*	2025-03-12 00:19:55.111	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm856hhdz0004kz04vnsf4tjt	abdelbakinazim.akkal2226@etu.univ-setif.dz	::1	node	*	2025-03-12 00:24:53.062	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm856jt1h0005kz044fjgexjx	abdelbakinazim.akkal2226@etu.univ-setif.dz	::1	node	*	2025-03-12 00:26:41.476	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm85703y10000kzokzes5kmyh	bendris.hamzaisp@gmail.com	127.0.0.1	node	*	2025-03-12 00:39:22.104	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm8572zrm0001kzokuk4wflkn	abdelbakinazim.akkal2226@etu.univ-setif.dz	127.0.0.1	node	*	2025-03-12 00:41:36.657	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm85745rh0002kzoknlflkj9z	abdelbakinazim.akkal2226@etu.univ-setif.dz	127.0.0.1	node	*	2025-03-12 00:42:31.084	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm857575k0003kzok8qa8434z	bendris.hamzaisp@gmail.com	127.0.0.1	node	*	2025-03-12 00:43:19.543	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm857l77q0000kzd00ekv3oxz	abdelbakinazim.akkal2226@etu.univ-setif.dz	::1	node	*	2025-03-12 00:55:46.112	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm85m4e260000kz2czc9r7h5d	bendris.hamzaisp@gmail.com	::1	node	*	2025-03-12 07:42:36.074	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm8692bt30000kz8kagvpsjji	abdelbakinazim.akkal2226@etu.univ-setif.dz	::1	node	*	2025-03-12 18:24:51.012	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm86amd3y0001kz8k9qyw1921	bendris.hamzaisp@gmail.com	::1	node	*	2025-03-12 19:08:25.43	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm86nuvny0000kzegotd5afdx	bendris.hamzaisp@gmail.com	::1	node	*	2025-03-13 01:18:57.737	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm86o43z60001kzegqgfyg27c	abdelbakinazim.akkal2226@etu.univ-setif.dz	::1	node	*	2025-03-13 01:26:08.416	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm86z8mdp0000kzxkpck7cjit	abdelbakinazim.akkal2226@etu.univ-setif.dz	::1	node	*	2025-03-13 06:37:34.667	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm87sq2a90000kz3oc5dg7ven	abdelbakinazim.akkal2226@etu.univ-setif.dz	::1	node	*	2025-03-13 20:22:57.293	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm89uny230000kzicvc0fzk7b	abdelbakinazim.akkal2226@etu.univ-setif.dz	::1	node	*	2025-03-15 06:52:50.088	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm8c2489o0000kzagomsq8qk4	abdelbakinazim.akkal2226@etu.univ-setif.dz	::1	node	*	2025-03-16 19:56:59.479	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm8cm1k2x0001kzag4ujfqbui	abdelbakinazim.akkal2226@etu.univ-setif.dz	::1	node	*	2025-03-17 05:14:47.142	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
cm8dw3wae0000kznkc1832339	abdelbakinazim.akkal2226@etu.univ-setif.dz	::1	node	*	2025-03-18 02:44:18.609	t	unknown	NaN	\N	\N	Desktop	Succès!	unknown	\N
\.


--
-- Data for Name: MagneticCard; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MagneticCard" (id, "accountId", "cardNumber", "cardHolderName", cvv, status, civility, "requestDate", "issuedAt", "deliveryDate", "receptionDate", "expirationDate", address, wilaya, commune, "postalCode", "deliveryMethod", "creationOrRenewal", "pinCodeReceived", "pinCodeReceptionDate", "pinCodeDeliveryDate", "otpCodeReceived", "otpCodeReceptionDate", "otpCodeDeliveryDate", observation, "createdAt", "updatedAt", "cardTypeId") FROM stdin;
cm7y5twgt0004kzyks10aa6xm	cm7wurage0000kz8w5jn1lbaf	535502202097	ABDELBAKI AKKAL	222	ACTIVE	\N	2025-03-07 00:00:00	\N	\N	\N	2025-03-14 00:00:00	\N	\N	\N	\N	ENVOI	CREATION	222	\N	\N	111	\N	\N	\N	2025-03-07 02:32:09.629	2025-03-10 12:27:57.652	cm7y5svrb0002kzykuh3ikuh7
cm7wtxvbv0003kzu4q90zg51w	cm7tjz4ui000dkz70u71ifro7	5355026607102097	ABDELBAKI AKKAL	434	PENDING	MAITRE	2025-03-07 00:00:00	\N	\N	\N	2025-03-06 00:00:00	\N	\N	\N	06004	ENVOI	CREATION	\N	\N	\N	\N	\N	\N	\N	2025-03-06 04:11:33.21	2025-03-10 12:30:44.404	cm7wtx7wr0001kzu4wmm2k5dv
cm83hrich0004kzp47d1u5961	cm7y2x4qb0001kzyk41l1a1jk	7102097	AKKAL AJK	111	EXPIRED	PROF	2025-03-10 00:00:00	\N	2025-03-21 00:00:00	\N	2025-03-20 00:00:00	\N	\N	\N	\N	ENVOI	CREATION	\N	\N	\N	\N	\N	\N	\N	2025-03-10 20:05:04.289	2025-03-22 15:02:51.531	cm7wtx7wr0001kzu4wmm2k5dv
cm8ke7uyv0008kz70jvlx60b7	cm8k7fhee0006kz70eh9u4tqb	2341241324	ergergre	123	PENDING	MRS	2025-03-13 00:00:00	\N	\N	\N	\N	\N	\N	\N	\N	ENVOI	CREATION	\N	\N	\N	\N	\N	\N	\N	2025-03-22 15:57:53.67	2025-03-22 16:03:16.213	cm7wtx7wr0001kzu4wmm2k5dv
\.


--
-- Data for Name: PersonMoral; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PersonMoral" (id, "firstName", "middleName", "lastName", "maidenName", "companyName", denomination, "legalForm", "businessActivity", capital, workforce, "headquartersAddress", "postalCode", city, "stateDepartment", "taxIdentificationNumber", "statisticalIdentificationNumber", "businessCreationDate", "annualRevenue", "professionalPhone", "professionalMobile", "professionalFax", "professionalEmail", "clientId") FROM stdin;
cm7smctiz0001kzqwzntt0ty2	ABDELBAKI	NAZIM	AKKAL	ABDELBAKI NAZIM AKKAL	Nokia	Nokia	Eurl	Tel	200000000	199	BOITE POSTALE 207 KHERRATA	06004	BEJAIA	algérie	200098798	098990	2025-03-03 00:00:00	90909090	0665542834	0665542834	08976543567	fleurvertesurfondblanc@gmail.com	47ed8fab-b8dc-46ab-a240-5e5a4e6f9ec0
cm8inh3vy0003kznstuqw3pty	\N	jj	\N	\N	hello	ozzzzzz	324234	ZERRZE	2313	\N	Kherrata Belmajore	06004	Constantine	dsfzd	\N	\N	2025-03-21 00:00:00	\N	0665542834	\N	\N	fleurvertesurssfondblanc@gmail.com	3ce462c0-7aa0-4ead-8f3a-8bfc45563836
cm84x37p3000fkzogjbiaenz5	AAAA	\N	ssssss	\N	aaa	\N	aaa	aaa	934939	293439	aaa	03242	iii	iii	\N	\N	2025-03-11 00:00:00	0	SDF	\N	\N	dfzef@zefze.Ff	dd8d5de1-6d40-4eeb-aeb4-5c57c2d57c11
\.


--
-- Data for Name: PersonPhysical; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PersonPhysical" (id, civility, "activityType", "firstName", "middleName", "lastName", "maidenName", "birthDate", "birthPlace", gender, presumed, "birtCertificateNumber", "countryOfBirth", "nationalityOrigin", "nationalityAcquisition", "maritalStatus", "spouseLastName", "spouseFirstName", "motherMaidenName", "motherFirstName", "fatherFirstName", "personalAddress", "postalCode", city, "stateDepartment", country, "landlinePhone", "personalMobilePhone", "personalFax", "personalEmail", "clientId") FROM stdin;
cm84wffce0004kzogkmtg396x	MR	\N	Akkal	\N	ab nazim	\N	1997-12-02 00:00:00	Kherrata	Homme	f	\N	Algérie	Algérienne	Algérienne	Marié	\N	\N	Guettaf	Noura	Mouloud	Belmajore	06004	Kherrata	Béjaia	Algérie	0349783487	0665542834	\N	fleur@gmail.com	c1c38a71-6311-4096-8eee-1515d3db02a5
cm84x0060000ckzogu5jdtqcv	\N	\N	aa	\N	aa	\N	2025-03-12 00:00:00	aa	aa	f	\N	aa	iaaa		aa	\N	\N	\N	aa	aa	jj	009	ii	i	iaa		09098	\N	aa@aa.aa	30c77f1d-4dde-4ccc-81a7-8b3865849619
cm8io0q5z000akzns9xd7pyz3	MRS	\N	Abdelbaki Nazim	\N	Akkal	\N	2025-03-20 00:00:00	AAoiii	Male	t	\N	Algérie	aaaaaaaaa	\N	aaa	Akkal	Abdelbaki Nazim	\N	aaa	aaaa	Kherrata Belmajore	06004	Constantine	aaaaaa	Algérie	0665542834	0665542834	\N	fleurvertesursssfondblanc@gmail.com	ed967fe6-2db4-480b-82ef-724e5cdf6cf9
cm84wx4150008kzogg4evp79k	MR	\N	aa	\N	aa	\N	2025-03-11 00:00:00	aa	aa	f	\N	nj	jjn	jn	jn	jn	jn	j	nj	sss	aa	0989	OIJ	jnj	jnj	\N	0989	\N	aa@aa.com	038cb85e-259a-4d3d-b977-abb55db1cfef
cm7tjm2fa0005kz7003hdryjx	MR	\N	Abdelbaki 	Nazim	Akkal	\N	1997-02-15 00:00:00	Kherrata	Homme	f	\N	Algérie	algérienne	algérienne	marié	aaa	aaa	Guettaf	Noura	Mouloud	Kherrata Belmajore	06004	Constantine	Béjaia	Algérie	034983498	0665542834	\N	fleurvertesurfondblanc@gmail.com	8c4767ce-d8b0-471e-8e79-4b6c7b353fc7
cm8inw9od0006kznsuv1ex6he	MR	INDIVIDUAL	Abdelbaki Nazima	\N	Akkal	\N	2025-03-22 00:00:00	AAa	Male	t	\N	Algérie	sssss	\N	ssssss	Akkal	Abdelbaki Nazim	\N	ssssssss	sssssss	Kherrata Belmajore	06004	Constantine	sssssss	Algérie	0665542834	0665542834	aaa	fleurvanc@gmail.com	49726415-5c0b-47bb-b171-4885ca913d48
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Session" (id, "sessionToken", "userId", expires, "createdAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, role, email, "emailVerified", image, name, "passwordHash", "failedLoginAttempts", "lastFailedAttemptAt", "lastLoginAt", "isBlocked", "blockedUntil", "isTwoFactorEnabled", "twoFactorSecret") FROM stdin;
14ae2d89-859f-41e7-b806-97ccd0f7369a	SUPERADMIN	bendris.hamzaisp@gmail.com	t	\N	Bendris	$2b$12$7TgPtCQofivLtz99Cz./V.U53j.DpIghbG4dqOYpT/IsQllyn0WYi	0	\N	2025-03-13 01:18:57.698	f	\N	f	\N
b6348862-1ce9-45b9-9455-ef283d0ca55b	ADMIN	abdelbakinazim.akkal2226@etu.univ-setif.dz	t	\N	abdelbakinazim	$2b$12$/XTDssp6MmyyD1Vqc7YQredOo.ysD4eHuc570GOxD8JD8ogHOuoFO	0	\N	2025-03-18 02:44:18.5	f	\N	f	\N
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
\.


--
-- Name: AccountPurpose AccountPurpose_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AccountPurpose"
    ADD CONSTRAINT "AccountPurpose_pkey" PRIMARY KEY (id);


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: Activity Activity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_pkey" PRIMARY KEY (id);


--
-- Name: AmortizationEntryHistory AmortizationEntryHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AmortizationEntryHistory"
    ADD CONSTRAINT "AmortizationEntryHistory_pkey" PRIMARY KEY (id);


--
-- Name: AmortizationEntry AmortizationEntry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AmortizationEntry"
    ADD CONSTRAINT "AmortizationEntry_pkey" PRIMARY KEY (id);


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: CardType CardType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CardType"
    ADD CONSTRAINT "CardType_pkey" PRIMARY KEY (id);


--
-- Name: Cheque Cheque_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cheque"
    ADD CONSTRAINT "Cheque_pkey" PRIMARY KEY (id);


--
-- Name: Client Client_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Client"
    ADD CONSTRAINT "Client_pkey" PRIMARY KEY (id);


--
-- Name: CreditApplication CreditApplication_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CreditApplication"
    ADD CONSTRAINT "CreditApplication_pkey" PRIMARY KEY (id);


--
-- Name: CreditLegalAction CreditLegalAction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CreditLegalAction"
    ADD CONSTRAINT "CreditLegalAction_pkey" PRIMARY KEY (id);


--
-- Name: CreditType CreditType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CreditType"
    ADD CONSTRAINT "CreditType_pkey" PRIMARY KEY (id);


--
-- Name: Credit Credit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Credit"
    ADD CONSTRAINT "Credit_pkey" PRIMARY KEY (id);


--
-- Name: Currency Currency_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Currency"
    ADD CONSTRAINT "Currency_pkey" PRIMARY KEY (id);


--
-- Name: Financing Financing_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Financing"
    ADD CONSTRAINT "Financing_pkey" PRIMARY KEY (id);


--
-- Name: GuaranteeType GuaranteeType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GuaranteeType"
    ADD CONSTRAINT "GuaranteeType_pkey" PRIMARY KEY (id);


--
-- Name: Guarantee Guarantee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Guarantee"
    ADD CONSTRAINT "Guarantee_pkey" PRIMARY KEY (id);


--
-- Name: IdentityDocument IdentityDocument_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."IdentityDocument"
    ADD CONSTRAINT "IdentityDocument_pkey" PRIMARY KEY (id);


--
-- Name: LoginLog LoginLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LoginLog"
    ADD CONSTRAINT "LoginLog_pkey" PRIMARY KEY (id);


--
-- Name: MagneticCard MagneticCard_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MagneticCard"
    ADD CONSTRAINT "MagneticCard_pkey" PRIMARY KEY (id);


--
-- Name: PersonMoral PersonMoral_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PersonMoral"
    ADD CONSTRAINT "PersonMoral_pkey" PRIMARY KEY (id);


--
-- Name: PersonPhysical PersonPhysical_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PersonPhysical"
    ADD CONSTRAINT "PersonPhysical_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: AccountPurpose_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AccountPurpose_name_key" ON public."AccountPurpose" USING btree (name);


--
-- Name: Account_accountNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Account_accountNumber_key" ON public."Account" USING btree ("accountNumber");


--
-- Name: Account_clientId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Account_clientId_idx" ON public."Account" USING btree ("clientId");


--
-- Name: Activity_personPhysicalId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Activity_personPhysicalId_idx" ON public."Activity" USING btree ("personPhysicalId");


--
-- Name: AmortizationEntry_creditId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AmortizationEntry_creditId_idx" ON public."AmortizationEntry" USING btree ("creditId");


--
-- Name: AmortizationEntry_dueDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AmortizationEntry_dueDate_idx" ON public."AmortizationEntry" USING btree ("dueDate");


--
-- Name: AuditLog_loggedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_loggedAt_idx" ON public."AuditLog" USING btree ("loggedAt");


--
-- Name: AuditLog_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_userId_idx" ON public."AuditLog" USING btree ("userId");


--
-- Name: CardType_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CardType_name_key" ON public."CardType" USING btree (name);


--
-- Name: Cheque_accountId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Cheque_accountId_idx" ON public."Cheque" USING btree ("accountId");


--
-- Name: Cheque_accountId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Cheque_accountId_key" ON public."Cheque" USING btree ("accountId");


--
-- Name: Cheque_chequeNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Cheque_chequeNumber_key" ON public."Cheque" USING btree ("chequeNumber");


--
-- Name: Client_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Client_id_idx" ON public."Client" USING btree (id);


--
-- Name: CreditType_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CreditType_name_key" ON public."CreditType" USING btree (name);


--
-- Name: Credit_CreditApplicationId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Credit_CreditApplicationId_idx" ON public."Credit" USING btree ("CreditApplicationId");


--
-- Name: Credit_CreditApplicationId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Credit_CreditApplicationId_key" ON public."Credit" USING btree ("CreditApplicationId");


--
-- Name: Credit_creditNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Credit_creditNumber_key" ON public."Credit" USING btree ("creditNumber");


--
-- Name: Currency_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Currency_code_key" ON public."Currency" USING btree (code);


--
-- Name: GuaranteeType_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "GuaranteeType_name_key" ON public."GuaranteeType" USING btree (name);


--
-- Name: Guarantee_creditId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Guarantee_creditId_idx" ON public."Guarantee" USING btree ("creditId");


--
-- Name: Guarantee_guaranteeTypeId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Guarantee_guaranteeTypeId_idx" ON public."Guarantee" USING btree ("guaranteeTypeId");


--
-- Name: IdentityDocument_clientId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IdentityDocument_clientId_idx" ON public."IdentityDocument" USING btree ("clientId");


--
-- Name: LoginLog_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "LoginLog_email_idx" ON public."LoginLog" USING btree (email);


--
-- Name: LoginLog_ipAddress_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "LoginLog_ipAddress_idx" ON public."LoginLog" USING btree ("ipAddress");


--
-- Name: LoginLog_loggedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "LoginLog_loggedAt_idx" ON public."LoginLog" USING btree ("loggedAt");


--
-- Name: MagneticCard_accountId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "MagneticCard_accountId_idx" ON public."MagneticCard" USING btree ("accountId");


--
-- Name: MagneticCard_accountId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "MagneticCard_accountId_key" ON public."MagneticCard" USING btree ("accountId");


--
-- Name: MagneticCard_cardNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "MagneticCard_cardNumber_key" ON public."MagneticCard" USING btree ("cardNumber");


--
-- Name: PersonMoral_clientId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PersonMoral_clientId_key" ON public."PersonMoral" USING btree ("clientId");


--
-- Name: PersonMoral_professionalEmail_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PersonMoral_professionalEmail_key" ON public."PersonMoral" USING btree ("professionalEmail");


--
-- Name: PersonPhysical_clientId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PersonPhysical_clientId_key" ON public."PersonPhysical" USING btree ("clientId");


--
-- Name: PersonPhysical_personalEmail_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PersonPhysical_personalEmail_key" ON public."PersonPhysical" USING btree ("personalEmail");


--
-- Name: Session_expires_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Session_expires_idx" ON public."Session" USING btree (expires);


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: Session_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Session_userId_idx" ON public."Session" USING btree ("userId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_id_idx" ON public."User" USING btree (id);


--
-- Name: User_role_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_role_idx" ON public."User" USING btree (role);


--
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- Name: Account Account_accountPurposeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_accountPurposeId_fkey" FOREIGN KEY ("accountPurposeId") REFERENCES public."AccountPurpose"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Account Account_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Account Account_currencyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES public."Currency"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Activity Activity_personPhysicalId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_personPhysicalId_fkey" FOREIGN KEY ("personPhysicalId") REFERENCES public."PersonPhysical"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AmortizationEntryHistory AmortizationEntryHistory_entryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AmortizationEntryHistory"
    ADD CONSTRAINT "AmortizationEntryHistory_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES public."AmortizationEntry"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AmortizationEntry AmortizationEntry_creditId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AmortizationEntry"
    ADD CONSTRAINT "AmortizationEntry_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES public."Credit"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AuditLog AuditLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Cheque Cheque_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cheque"
    ADD CONSTRAINT "Cheque_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CreditApplication CreditApplication_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CreditApplication"
    ADD CONSTRAINT "CreditApplication_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CreditApplication CreditApplication_creditTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CreditApplication"
    ADD CONSTRAINT "CreditApplication_creditTypeId_fkey" FOREIGN KEY ("creditTypeId") REFERENCES public."CreditType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CreditLegalAction CreditLegalAction_creditId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CreditLegalAction"
    ADD CONSTRAINT "CreditLegalAction_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES public."Credit"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Credit Credit_CreditApplicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Credit"
    ADD CONSTRAINT "Credit_CreditApplicationId_fkey" FOREIGN KEY ("CreditApplicationId") REFERENCES public."CreditApplication"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Credit Credit_creditTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Credit"
    ADD CONSTRAINT "Credit_creditTypeId_fkey" FOREIGN KEY ("creditTypeId") REFERENCES public."CreditType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Financing Financing_creditId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Financing"
    ADD CONSTRAINT "Financing_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES public."Credit"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Guarantee Guarantee_creditId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Guarantee"
    ADD CONSTRAINT "Guarantee_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES public."Credit"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Guarantee Guarantee_guaranteeTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Guarantee"
    ADD CONSTRAINT "Guarantee_guaranteeTypeId_fkey" FOREIGN KEY ("guaranteeTypeId") REFERENCES public."GuaranteeType"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: IdentityDocument IdentityDocument_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."IdentityDocument"
    ADD CONSTRAINT "IdentityDocument_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MagneticCard MagneticCard_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MagneticCard"
    ADD CONSTRAINT "MagneticCard_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MagneticCard MagneticCard_cardTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MagneticCard"
    ADD CONSTRAINT "MagneticCard_cardTypeId_fkey" FOREIGN KEY ("cardTypeId") REFERENCES public."CardType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PersonMoral PersonMoral_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PersonMoral"
    ADD CONSTRAINT "PersonMoral_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PersonPhysical PersonPhysical_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PersonPhysical"
    ADD CONSTRAINT "PersonPhysical_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

