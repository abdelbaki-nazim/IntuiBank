import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/./../lib/prisma";
import { ZodError } from "zod";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const clientId = await params;

    const formData = await req.json();

    const sanitize = (value: any) => (value === "" ? null : value);

    const parseDate = (
      dateStr: string | null | undefined
    ): Date | undefined => {
      if (!dateStr) return undefined;
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return new Date(dateStr + "T00:00:00.000Z");
      }
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? undefined : d;
    };

    const getRawValue = (val: any) =>
      typeof val === "object" && val !== null && "value" in val
        ? val.value
        : val;

    const updatedClient = await prisma.client.update({
      where: { id: clientId.id },
      data: {
        status: getRawValue(formData.status),
        type: getRawValue(formData.type),
      },
      include: {
        personPhysical: true,
        personMoral: true,
        identityDocuments: true,
      },
    });

    if (formData.type === "PHYSICAL" && formData.personPhysical) {
      const { personPhysical } = formData;
      const activities = personPhysical.activities?.[0] || {};

      await prisma.personPhysical.update({
        where: { clientId: clientId.id },
        data: {
          civility: sanitize(getRawValue(personPhysical.civility)),
          activityType: sanitize(getRawValue(personPhysical.activityType)),
          firstName: sanitize(personPhysical.firstName),
          middleName: sanitize(personPhysical.middleName),
          lastName: sanitize(personPhysical.lastName),
          maidenName: sanitize(personPhysical.maidenName),
          birthDate: parseDate(personPhysical.birthDate),
          birthPlace: sanitize(personPhysical.birthPlace),
          gender: sanitize(personPhysical.gender),
          presumed: personPhysical.presumed,
          countryOfBirth: sanitize(personPhysical.countryOfBirth),
          nationalityOrigin: sanitize(personPhysical.nationalityOrigin),
          nationalityAcquisition: sanitize(
            personPhysical.nationalityAcquisition
          ),
          maritalStatus: sanitize(personPhysical.maritalStatus),
          spouseLastName: sanitize(personPhysical.spouseLastName),
          spouseFirstName: sanitize(personPhysical.spouseFirstName),
          motherMaidenName: sanitize(personPhysical.motherMaidenName),
          motherFirstName: sanitize(personPhysical.motherFirstName),
          fatherFirstName: sanitize(personPhysical.fatherFirstName),
          personalAddress: sanitize(personPhysical.personalAddress),
          postalCode: sanitize(personPhysical.postalCode),
          city: sanitize(personPhysical.city),
          stateDepartment: sanitize(personPhysical.stateDepartment),
          country: sanitize(personPhysical.country),
          landlinePhone: sanitize(personPhysical.landlinePhone),
          personalMobilePhone: sanitize(personPhysical.personalMobilePhone),
          personalFax: sanitize(personPhysical.personalFax),
          personalEmail: sanitize(personPhysical.personalEmail),
        },
      });

      if (updatedClient.personPhysical) {
        await prisma.activity.upsert({
          where: { id: activities.id || "" },
          update: {
            profession: sanitize(activities.profession),
            employer: sanitize(activities.employer),
            monthlyIncome: sanitize(activities.monthlyIncome),
            businessFullName: sanitize(activities.businessFullName),
            businessDenomination: sanitize(activities.businessDenomination),
            legalForm: sanitize(activities.legalForm),
            businessActivity: sanitize(activities.businessActivity),
            capital: sanitize(activities.capital),
            workforce: sanitize(activities.workforce),
            headquartersAddress: sanitize(activities.headquartersAddress),
            businessPostalCode: sanitize(activities.businessPostalCode),
            cityOfBusiness: sanitize(activities.cityOfBusiness),
            stateDepartment: sanitize(activities.stateDepartment),
            taxIdentificationNumber: sanitize(
              activities.taxIdentificationNumber
            ),
            statisticalIdentificationNumber: sanitize(
              activities.statisticalIdentificationNumber
            ),
            businessCreationDate: parseDate(activities.businessCreationDate),
            annualRevenue: sanitize(activities.annualRevenue),
            professionalPhone: sanitize(activities.professionalPhone),
            professionalMobile: sanitize(activities.professionalMobile),
            professionalFax: sanitize(activities.professionalFax),
            professionalEmail: sanitize(activities.professionalEmail),
          },
          create: {
            personPhysicalId: updatedClient.personPhysical.id,
            ...activities,
          },
        });
      }
    }

    if (formData.type === "MORAL" && formData.personMoral) {
      const { personMoral } = formData;

      await prisma.personMoral.update({
        where: { clientId: clientId.id },
        data: {
          firstName: sanitize(personMoral.firstName),
          middleName: sanitize(personMoral.middleName),
          lastName: sanitize(personMoral.lastName),
          maidenName: sanitize(personMoral.maidenName),
          companyName: sanitize(personMoral.companyName),
          denomination: sanitize(personMoral.denomination),
          legalForm: sanitize(personMoral.legalForm),
          businessActivity: sanitize(personMoral.businessActivity),
          capital: sanitize(personMoral.capital),
          workforce: sanitize(personMoral.workforce),
          headquartersAddress: sanitize(personMoral.headquartersAddress),
          postalCode: sanitize(personMoral.postalCode),
          city: sanitize(personMoral.city),
          stateDepartment: sanitize(personMoral.stateDepartment),
          taxIdentificationNumber: sanitize(
            personMoral.taxIdentificationNumber
          ),
          statisticalIdentificationNumber: sanitize(
            personMoral.statisticalIdentificationNumber
          ),
          businessCreationDate: parseDate(personMoral.businessCreationDate),
          annualRevenue: sanitize(personMoral.annualRevenue),
          professionalPhone: sanitize(personMoral.professionalPhone),
          professionalMobile: sanitize(personMoral.professionalMobile),
          professionalFax: sanitize(personMoral.professionalFax),
          professionalEmail: sanitize(personMoral.professionalEmail),
        },
      });
    }

    if (formData.identityDocuments?.[0]) {
      const identityDoc = formData.identityDocuments[0];

      await prisma.identityDocument.upsert({
        where: { id: identityDoc.id || "" },
        update: {
          documentType: sanitize(getRawValue(identityDoc.documentType)),
          documentNumber: sanitize(identityDoc.documentNumber),
          issueDate: parseDate(identityDoc.issueDate),
          issuedBy: sanitize(identityDoc.issuedBy),
          otherIssuingEntity: sanitize(identityDoc.otherIssuingEntity),
          nationalIdentifierNumber: sanitize(
            identityDoc.nationalIdentifierNumber
          ),
          otherAuthorization: sanitize(identityDoc.otherAuthorization),
          tradeRegisterNumber: sanitize(identityDoc.tradeRegisterNumber),
          artisanCardNumber: sanitize(identityDoc.artisanCardNumber),
          professionalDocumentDate: parseDate(
            identityDoc.professionalDocumentDate
          ),
          professionalDocumentIssuedBy: sanitize(
            identityDoc.professionalDocumentIssuedBy
          ),
          otherProfessionalDocumentIssuer: sanitize(
            identityDoc.otherProfessionalDocumentIssuer
          ),
        },
        create: {
          clientId: clientId.id,
          id: identityDoc.id,
          documentType: sanitize(getRawValue(identityDoc.documentType)),
          otherDocumentType: sanitize(identityDoc.otherDocumentType),
          documentNumber: sanitize(identityDoc.documentNumber),
          issueDate: parseDate(identityDoc.issueDate) as Date,
          issuedBy: sanitize(identityDoc.issuedBy),
          otherIssuingEntity: sanitize(identityDoc.otherIssuingEntity),
          nationalIdentifierNumber: sanitize(
            identityDoc.nationalIdentifierNumber
          ),
          otherAuthorization: sanitize(identityDoc.otherAuthorization),
          tradeRegisterNumber: sanitize(identityDoc.tradeRegisterNumber),
          artisanCardNumber: sanitize(identityDoc.artisanCardNumber),
          professionalDocumentDate: parseDate(
            identityDoc.professionalDocumentDate
          ),
          professionalDocumentIssuedBy: sanitize(
            identityDoc.professionalDocumentIssuedBy
          ),
          otherProfessionalDocumentIssuer: sanitize(
            identityDoc.otherProfessionalDocumentIssuer
          ),
        },
      });
    }

    return NextResponse.json(updatedClient, { status: 200 });
  } catch (error: any) {
    console.error("Update error:", error);
    const errorMessage =
      error instanceof ZodError
        ? error.errors.map((err) => err.message).join(", ")
        : error.message || "Failed to update client";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deletedUser = await prisma.client.update({
      where: { id },
      data: {
        status: "DELETED",
        deletedAt: new Date(),
      },
    });

    return NextResponse.json(deletedUser, { status: 200 });
  } catch (error) {
    console.log("Error deleting user:", error);
    return NextResponse.json(
      { message: "An error has occured" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const type = req.nextUrl.searchParams.get("type");

  try {
    const user = await prisma.client.findUnique({
      where: { id: id as string },
      include: {
        personPhysical:
          type === "PHYSICAL" ? { include: { activities: true } } : false,
        personMoral: type === "MORAL",
        identityDocuments: true,

        accounts: {
          include: {
            accountPurpose: true,
            currency: true,
            magneticCards: { include: { cardType: true } },
            cheques: true,
            creditApplications: {
              include: {
                credits: {
                  include: {
                    creditType: true,
                    amortizationEntries: true,
                    guarantees: { include: { guaranteeType: true } },
                    legalAction: true,
                    financings: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Quelque chose a mal tourné" },
      { status: 500 }
    );
  }
}
