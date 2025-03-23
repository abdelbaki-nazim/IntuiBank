const axios = require('axios');

const endpoint = 'https://intuibank.vercel.app/api/clients';

const payloads = [
  {
    "client": {
      "type": "PHYSICAL",
      "status": "ACTIVE"
    },
    "identityDocuments": [
      {
        "documentType": "CNIBE",
        "documentNumber": "ID123456",
        "issueDate": "2015-06-12T00:00:00.000Z",
        "issuedBy": "National ID Authority"
      }
    ],
    "personPhysical": {
      "civility": "MR",
      "firstName": "John",
      "lastName": "Jesus",
      "birthDate": "1985-08-25T00:00:00.000Z",
      "birthPlace": "New York",
      "gender": "Male",
      "countryOfBirth": "USA",
      "nationalityOrigin": "USA",
      "maritalStatus": "Married",
      "motherFirstName": "Anna",
      "fatherFirstName": "Robert",
      "personalAddress": "123 Main St",
      "postalCode": "10001",
      "city": "New York",
      "stateDepartment": "NY",
      "country": "USA",
      "personalMobilePhone": "+12125550123",
      "personalEmail": "john.doe@example.com"
    }
  },
  {
    "client": {
      "type": "PHYSICAL",
      "status": "DELETED"
    },
    "identityDocuments": [
      {
        "documentType": "PASSEPORT",
        "documentNumber": "P987654321",
        "issueDate": "2018-03-10T00:00:00.000Z",
        "issuedBy": "Government Passport Office"
      }
    ],
    "personPhysical": {
      "civility": "MRS",
      "firstName": "Emily",
      "lastName": "Clark",
      "birthDate": "1990-11-05T00:00:00.000Z",
      "birthPlace": "Los Angeles",
      "gender": "Female",
      "countryOfBirth": "USA",
      "nationalityOrigin": "USA",
      "maritalStatus": "Single",
      "motherFirstName": "Jessica",
      "fatherFirstName": "Daniel",
      "personalAddress": "456 Oak Ave",
      "postalCode": "90001",
      "city": "Los Angeles",
      "stateDepartment": "CA",
      "country": "USA",
      "personalMobilePhone": "+13235550123",
      "personalEmail": "emily.clark@example.com"
    }
  },
  {
    "client": {
      "type": "PHYSICAL",
      "status": "SUSPENDED"
    },
    "identityDocuments": [
      {
        "documentType": "PERMIS_CONDUIRE",
        "documentNumber": "D555666777",
        "issueDate": "2019-07-22T00:00:00.000Z",
        "issuedBy": "DMV"
      }
    ],
    "personPhysical": {
      "civility": "MS",
      "firstName": "Sophia",
      "lastName": "Miller",
      "birthDate": "1995-04-14T00:00:00.000Z",
      "birthPlace": "Chicago",
      "gender": "Female",
      "countryOfBirth": "USA",
      "nationalityOrigin": "USA",
      "maritalStatus": "Single",
      "motherFirstName": "Linda",
      "fatherFirstName": "Thomas",
      "personalAddress": "789 Pine St",
      "postalCode": "60601",
      "city": "Chicago",
      "stateDepartment": "IL",
      "country": "USA",
      "personalMobilePhone": "+13125550123",
      "personalEmail": "sophia.miller@example.com"
    }
  },
  {
    "client": {
      "type": "PHYSICAL",
      "status": "ARCHIVED"
    },
    "identityDocuments": [
      {
        "documentType": "CARTE_ELECTEUR",
        "documentNumber": "E333444555",
        "issueDate": "2017-01-15T00:00:00.000Z",
        "issuedBy": "Election Commission"
      }
    ],
    "personPhysical": {
      "civility": "DR",
      "firstName": "Michael",
      "lastName": "Johnson",
      "birthDate": "1980-02-28T00:00:00.000Z",
      "birthPlace": "Houston",
      "gender": "Male",
      "countryOfBirth": "USA",
      "nationalityOrigin": "USA",
      "maritalStatus": "Married",
      "spouseFirstName": "Rebecca",
      "spouseLastName": "Johnson",
      "motherFirstName": "Sarah",
      "fatherFirstName": "William",
      "personalAddress": "101 Elm St",
      "postalCode": "77001",
      "city": "Houston",
      "stateDepartment": "TX",
      "country": "USA",
      "personalMobilePhone": "+17135550123",
      "personalEmail": "michael.johnson@example.com"
    }
  }
];

async function pushData(payload) {
  try {
    const response = await axios.post(endpoint, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Successfully pushed payload. Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error pushing payload:', error.response.data);
    } else {
      console.error('Error pushing payload:', error.message);
    }
  }
}

async function run() {
  for (const [index, payload] of payloads.entries()) {
    console.log(`Pushing payload ${index + 1} of ${payloads.length}`);
    await pushData(payload);
  }
  console.log('All payloads pushed.');
}

run();