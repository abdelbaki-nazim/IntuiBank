import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/./../lib/prisma";
import { z } from "zod";
import {
  ClientType,
  RecordStatus,
  DocumentType,
  Civility,
  AuthorizationType,
  ActivityType,
} from "@prisma/client";

const IdentityDocumentSchema = z.object({
  documentType: z.nativeEnum(DocumentType),
  otherDocumentType: z.string().optional(),
  documentNumber: z.string().min(1),
  issueDate: z.coerce.date(),
  issuedBy: z.string().min(1),
  otherIssuingEntity: z.string().optional(),
  nationalIdentifierNumber: z.string().optional(),
  authorizationType: z.nativeEnum(AuthorizationType).optional(),
  otherAuthorization: z.string().optional(),
  tradeRegisterNumber: z.string().optional(),
  artisanCardNumber: z.string().optional(),
  professionalDocumentDate: z.coerce.date().optional(),
  professionalDocumentIssuedBy: z.string().optional(),
  otherProfessionalDocumentIssuer: z.string().optional(),
});

const ActivitySchema = z.object({
  activityType: z.nativeEnum(ActivityType).optional(),
  profession: z.string().optional(),
  employer: z.string().optional(),
  monthlyIncome: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().optional()
  ),
  businessFullName: z.string().optional(),
  businessDenomination: z.string().optional(),
  legalForm: z.string().optional(),
  businessActivity: z.string().optional(),
  capital: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().optional()
  ),
  workforce: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().optional()
  ),
  headquartersAddress: z.string().optional(),
  businessPostalCode: z.string().optional(),
  cityOfBusiness: z.string().optional(),
  stateDepartment: z.string().optional(),
  taxIdentificationNumber: z.string().optional(),
  statisticalIdentificationNumber: z.string().optional(),
  businessCreationDate: z.coerce.date().optional(),
  annualRevenue: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().optional()
  ),
  professionalPhone: z.string().optional(),
  professionalMobile: z.string().optional(),
  professionalFax: z.string().optional(),
  professionalEmail: z.string().email().optional(),
});

const PersonPhysicalSchema = z.object({
  civility: z.nativeEnum(Civility).optional(),
  firstName: z.string().min(1),
  middleName: z.string().optional(),
  lastName: z.string().min(1),
  maidenName: z.string().optional(),
  birthDate: z.coerce.date(),
  birthPlace: z.string().min(1),
  gender: z.string().min(1),
  presumed: z.boolean().optional().default(false),
  birthCertificateNumber: z.string().optional(),
  countryOfBirth: z.string().min(1),
  nationalityOrigin: z.string().min(1),
  nationalityAcquisition: z.string().optional(),
  maritalStatus: z.string().min(1),
  spouseLastName: z.string().optional(),
  spouseFirstName: z.string().optional(),
  motherMaidenName: z.string().optional(),
  motherFirstName: z.string().min(1),
  fatherFirstName: z.string().min(1),
  personalAddress: z.string().min(1),
  postalCode: z.string().min(1),
  city: z.string().min(1),
  stateDepartment: z.string().min(1),
  country: z.string().min(1),
  landlinePhone: z.string().optional(),
  personalMobilePhone: z.string().min(1),
  personalFax: z.string().optional(),
  personalEmail: z.string().email(),
  activities: z.array(ActivitySchema).optional(),
});

const PersonMoralSchema = z.object({
  companyName: z.string().min(1),
  denomination: z.string().optional(),
  legalForm: z.string().min(1),
  businessActivity: z.string().min(1),
  capital: z.string().min(1),
  workforce: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().optional()
  ),
  headquartersAddress: z.string().min(1),
  postalCode: z.string().min(1),
  city: z.string().min(1),
  stateDepartment: z.string().min(1),
  taxIdentificationNumber: z.string().optional(),
  statisticalIdentificationNumber: z.string().optional(),
  businessCreationDate: z.coerce.date(),
  annualRevenue: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().optional()
  ),
  professionalPhone: z.string().min(1),
  professionalMobile: z.string().optional(),
  professionalFax: z.string().optional(),
  professionalEmail: z.string().email(),
});

const transformEnumFields = (data: any) => {
  if (
    data.client &&
    typeof data.client.type === "object" &&
    data.client.type.value
  ) {
    data.client.type = data.client.type.value;
  }
  if (Array.isArray(data.identityDocuments)) {
    data.identityDocuments = data.identityDocuments.map((doc: any) => {
      if (
        doc &&
        typeof doc.documentType === "object" &&
        doc.documentType.value
      ) {
        doc.documentType = doc.documentType.value;
      }
      return doc;
    });
  }
  if (
    data.personPhysical &&
    typeof data.personPhysical.civility === "object" &&
    data.personPhysical.civility.value
  ) {
    data.personPhysical.civility = data.personPhysical.civility.value;
  }
  if (
    data.personPhysical &&
    typeof data.personPhysical.activityType === "object" &&
    data.personPhysical.activityType.value
  ) {
    data.personPhysical.activityType = data.personPhysical.activityType.value;
  }
  return data;
};

const FullClientSchema = z
  .object({
    client: z.object({
      type: z.nativeEnum(ClientType),
      status: z
        .nativeEnum(RecordStatus)
        .optional()
        .default(RecordStatus.ACTIVE),
    }),
    identityDocuments: z.array(IdentityDocumentSchema).min(1),
    personPhysical: z.optional(PersonPhysicalSchema),
    personMoral: z.optional(PersonMoralSchema),
    activity: z.optional(ActivitySchema),
  })
  .refine(
    (data) => {
      if (data.client.type === ClientType.PHYSICAL && !data.personPhysical)
        return false;
      if (data.client.type === ClientType.MORAL && !data.personMoral)
        return false;
      return true;
    },
    {
      message: "The person's data must match the client type.",
    }
  );

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Payload received:", body);

    const transformedBody = transformEnumFields(body);
    console.log("Transformed payload:", transformedBody);

    const validation = FullClientSchema.safeParse(transformedBody);
    console.log("Validation result:", validation);

    if (!validation.success) {
      console.error(validation.error);
      return NextResponse.json(
        { error: validation.error.message },
        { status: 400 }
      );
    }

    const {
      client: clientData,
      identityDocuments,
      personPhysical,
      personMoral,
      activity,
    } = validation.data;

    const result = await prisma.$transaction(async (tx) => {
      const client = await tx.client.create({
        data: { type: clientData.type, status: clientData.status },
      });

      if (clientData.type === ClientType.PHYSICAL && personPhysical) {
        const physical = await tx.personPhysical.create({
          data: {
            ...personPhysical,
            clientId: client.id,
            activities: {
              create: activity ? [activity] : [],
            },
          },
          include: { activities: true },
        });

        await tx.identityDocument.createMany({
          data: identityDocuments.map((doc) => ({
            clientId: client.id,
            otherDocumentType: doc.otherDocumentType,
            documentNumber: doc.documentNumber,
            issueDate: new Date(doc.issueDate),
            issuedBy: doc.issuedBy,
            otherIssuingEntity: doc.otherIssuingEntity,
            nationalIdentifierNumber: doc.nationalIdentifierNumber,
            otherAuthorization: doc.authorizationType || doc.otherAuthorization,
            tradeRegisterNumber: doc.tradeRegisterNumber,
            artisanCardNumber: doc.artisanCardNumber,
            professionalDocumentDate: doc.professionalDocumentDate
              ? new Date(doc.professionalDocumentDate)
              : null,
            professionalDocumentIssuedBy: doc.professionalDocumentIssuedBy,
            otherProfessionalDocumentIssuer:
              doc.otherProfessionalDocumentIssuer,
          })),
        });

        return { client, person: physical };
      }

      if (clientData.type === ClientType.MORAL && personMoral) {
        const moral = await tx.personMoral.create({
          data: { ...personMoral, clientId: client.id },
        });

        await tx.identityDocument.createMany({
          data: identityDocuments.map((doc) => ({
            clientId: client.id,
            otherDocumentType: doc.otherDocumentType,
            documentNumber: doc.documentNumber,
            issueDate: new Date(doc.issueDate),
            issuedBy: doc.issuedBy,
            otherIssuingEntity: doc.otherIssuingEntity,
            nationalIdentifierNumber: doc.nationalIdentifierNumber,
            otherAuthorization: doc.authorizationType || doc.otherAuthorization,
            tradeRegisterNumber: doc.tradeRegisterNumber,
            artisanCardNumber: doc.artisanCardNumber,
            professionalDocumentDate: doc.professionalDocumentDate
              ? new Date(doc.professionalDocumentDate)
              : null,
            professionalDocumentIssuedBy: doc.professionalDocumentIssuedBy,
            otherProfessionalDocumentIssuer:
              doc.otherProfessionalDocumentIssuer,
          })),
        });

        return { client, person: moral };
      }

      throw new Error("Invalid client type");
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Client creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const clients = await prisma.client.findMany({
      include: {
        personPhysical: true,
        personMoral: true,
      },
    });
    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      {
        error: "An error has occured",
      },
      { status: 500 }
    );
  }
}
