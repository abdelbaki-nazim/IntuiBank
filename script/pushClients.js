const axios = require("axios");

const endpoint = "https://intuibank.vercel.app/api/clients";

const payloads = [
  {
    client: {
      type: "PHYSICAL",
      status: "ACTIVE",
    },
    identityDocuments: [
      {
        documentType: "PASSEPORT",
        documentNumber: "P12345678",
        issueDate: "2020-01-15T00:00:00.000Z",
        issuedBy: "Autorité Gouvernementale",
        otherDocumentType: "Passeport International",
      },
    ],
    personPhysical: {
      civility: "MR",
      firstName: "John",
      middleName: "A.",
      lastName: "Doe",
      birthDate: "1990-05-20T00:00:00.000Z",
      birthPlace: "New York",
      gender: "Male",
      countryOfBirth: "USA",
      nationalityOrigin: "USA",
      maritalStatus: "Single",
      motherFirstName: "Jane",
      fatherFirstName: "Robert",
      personalAddress: "123 Main St",
      postalCode: "10001",
      city: "New York",
      stateDepartment: "NY",
      country: "USA",
      personalMobilePhone: "+12125550123",
      personalEmail: "john.doe@example.com",
      activities: [
        {
          activityType: "PROFESSIONAL",
          profession: "Software Developer",
          employer: "Tech Inc",
          monthlyIncome: 7000,
          businessFullName: "Tech Incorporated",
          businessDenomination: "Tech",
          legalForm: "LLC",
          businessActivity: "IT Services",
          capital: 500000,
          workforce: 50,
          headquartersAddress: "456 Tech Ave",
          businessPostalCode: "10002",
          cityOfBusiness: "New York",
          stateDepartment: "NY",
          taxIdentificationNumber: "TIN123456",
          statisticalIdentificationNumber: "SIN654321",
          businessCreationDate: "2015-03-10T00:00:00.000Z",
          annualRevenue: 1200000,
          professionalPhone: "+12125550124",
          professionalEmail: "contact@techinc.com",
        },
      ],
    },
  },

  {
    client: {
      type: "PHYSICAL",
      status: "ACTIVE",
    },
    identityDocuments: [
      {
        documentType: "CNIBE",
        documentNumber: "ID987654",
        issueDate: "2018-07-01T00:00:00.000Z",
        issuedBy: "Bureau de l'ID",
      },
    ],
    personPhysical: {
      civility: "MRS",
      firstName: "Emily",
      lastName: "Smith",
      birthDate: "1985-09-15T00:00:00.000Z",
      birthPlace: "Los Angeles",
      gender: "Female",
      countryOfBirth: "USA",
      nationalityOrigin: "USA",
      maritalStatus: "Married",
      spouseFirstName: "Michael",
      spouseLastName: "Smith",
      motherFirstName: "Anna",
      fatherFirstName: "David",
      personalAddress: "789 Sunset Blvd",
      postalCode: "90028",
      city: "Los Angeles",
      stateDepartment: "CA",
      country: "USA",
      personalMobilePhone: "+13105550123",
      personalEmail: "emily.smith@example.com",
    },
  },

  {
    client: {
      type: "PHYSICAL",
      status: "ACTIVE",
    },
    identityDocuments: [
      {
        documentType: "PERMIS_CONDUIRE",
        documentNumber: "D555666777",
        issueDate: "2019-11-20T00:00:00.000Z",
        issuedBy: "DMV",
      },
    ],
    personPhysical: {
      civility: "MISS",
      firstName: "Sophia",
      lastName: "Brown",
      birthDate: "1995-02-28T00:00:00.000Z",
      birthPlace: "Chicago",
      gender: "Female",
      countryOfBirth: "USA",
      nationalityOrigin: "USA",
      maritalStatus: "Single",
      motherFirstName: "Linda",
      fatherFirstName: "James",
      personalAddress: "321 Lake Shore Dr",
      postalCode: "60601",
      city: "Chicago",
      stateDepartment: "IL",
      country: "USA",
      personalMobilePhone: "+13125550123",
      personalEmail: "sophia.brown@example.com",
    },
  },
  {
    client: {
      type: "PHYSICAL",
      status: "ACTIVE",
    },
    identityDocuments: [
      {
        documentType: "PASSEPORT",
        documentNumber: "P87654321",
        issueDate: "2017-03-05T00:00:00.000Z",
        issuedBy: "Autorité de Passeport",
      },
    ],
    personPhysical: {
      civility: "MS",
      firstName: "Laura",
      lastName: "Martinez",
      birthDate: "1992-12-12T00:00:00.000Z",
      birthPlace: "Miami",
      gender: "Female",
      countryOfBirth: "USA",
      nationalityOrigin: "USA",
      maritalStatus: "Single",
      motherFirstName: "Carmen",
      fatherFirstName: "Jose",
      personalAddress: "456 Ocean Dr",
      postalCode: "33139",
      city: "Miami",
      stateDepartment: "FL",
      country: "USA",
      personalMobilePhone: "+13055550123",
      personalEmail: "laura.martinez@example.com",
      activities: [
        {
          activityType: "INDIVIDUAL",
          profession: "Graphic Designer",
          monthlyIncome: 4000,
          businessFullName: "Freelance",
          legalForm: "N/A",
          businessActivity: "Design",
          capital: 0,
          workforce: 0,
          headquartersAddress: "Home Office",
          businessPostalCode: "33139",
          cityOfBusiness: "Miami",
          stateDepartment: "FL",
          businessCreationDate: "2019-06-01T00:00:00.000Z",
          annualRevenue: 48000,
          professionalPhone: "+13055550124",
          professionalEmail: "laura.design@example.com",
        },
      ],
    },
  },
  {
    client: {
      type: "PHYSICAL",
      status: "ACTIVE",
    },
    identityDocuments: [
      {
        documentType: "CNIBE",
        documentNumber: "ID333222",
        issueDate: "2021-08-15T00:00:00.000Z",
        issuedBy: "Bureau d'Identification",
      },
    ],
    personPhysical: {
      civility: "DR",
      firstName: "Michael",
      lastName: "Anderson",
      birthDate: "1980-07-07T00:00:00.000Z",
      birthPlace: "Boston",
      gender: "Male",
      countryOfBirth: "USA",
      nationalityOrigin: "USA",
      maritalStatus: "Married",
      spouseFirstName: "Sarah",
      spouseLastName: "Anderson",
      motherFirstName: "Patricia",
      fatherFirstName: "Richard",
      personalAddress: "789 Beacon St",
      postalCode: "02108",
      city: "Boston",
      stateDepartment: "MA",
      country: "USA",
      personalMobilePhone: "+16175550123",
      personalEmail: "michael.anderson@example.com",
      activities: [
        {
          activityType: "PROFESSIONAL",
          profession: "Consultant",
          employer: "Consulting Co",
          monthlyIncome: 9000,
          businessFullName: "Consulting Company",
          legalForm: "LLC",
          businessActivity: "Consulting",
          capital: 250000,
          workforce: 10,
          headquartersAddress: "101 Business Rd",
          businessPostalCode: "02109",
          cityOfBusiness: "Boston",
          stateDepartment: "MA",
          businessCreationDate: "2016-04-01T00:00:00.000Z",
          annualRevenue: 108000,
          professionalPhone: "+16175550124",
          professionalEmail: "contact@consultingco.com",
        },
      ],
    },
  },
];

async function pushData(payload) {
  try {
    const response = await axios.post(endpoint, payload, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Successfully pushed payload. Response:", response.data);
  } catch (error) {
    if (error.response) {
      console.error("Error pushing payload:", error.response.data);
    } else {
      console.error("Error pushing payload:", error.message);
    }
  }
}

async function run() {
  for (const [index, payload] of payloads.entries()) {
    console.log(`Pushing payload ${index + 1} of ${payloads.length}`);
    await pushData(payload);
  }
  console.log("All payloads pushed.");
}

run();
