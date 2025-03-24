# IntuiBank Dashboard

**IntuiBank Dashboard** is an open-source financial management platform built for banking and credit institutions. It streamlines client onboarding, account management, credit processing, and legal actions in one unified interface.

---

## Overview

IntuiBank Dashboard provides a comprehensive solution for financial institutions by integrating multiple modules such as:

- **Client and Account Management:** Manage both individual and corporate client profiles with detailed personal and business data.
- **Credit Processing:** Submit, review, and track credit applications, approvals, repayment schedules, and risk mitigation processes.
- **Legal Actions:** Initiate and manage legal actions linked to credit cases.
- **Activity Monitoring:** Infinite scrolling lists with day-based grouping for login and activity logs.
- **Reporting:** Generate high-quality PDF reports and share access via QR codes.
- **Modern UI:** Leveraging KendoReact components for a sleek, production-ready interface.

---

## Technologies Used

- **React & TypeScript:** Core framework for building a scalable, type-safe front-end.
- **Next.js:** Provides server-side rendering and static site generation for optimal performance.
- **PostgreSQL:** Robust relational database for storing financial and client data.
- **Prisma:** Modern ORM for database management and migrations.
- **KendoReact:** Comprehensive suite of UI components including Grid, ListView, PanelBar, Dialog, PDFExport, QRCode, and more.
- **npm:** For dependency management and scripts.

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/abdelbaki-nazim/IntuiBank.git
cd IntuiBank
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and configure your PostgreSQL connection string:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/your_database
NEXTAUTH_URL=https://your-api-url.com
```

### 4. Run Prisma Migrations

```bash
npx prisma migrate dev
```

### 5. Build and Start the Development Server

```bash
npm run dev
```

Open your browser at [http://localhost:3000](http://localhost:3000)

---

## Advanced Instructions

### NPM Scripts

- `npm run dev` – Starts Next.js development server
- `npx prisma generate` – Prisma client
- `npm run build` – Production build
- `npm run start` – Starts production server
- `npm run lint` – Code linting

### Testing

Set up tests using Jest/React Testing Library. Refer to project documentation for guidelines.

---

## Contributing

1. Fork the repository
2. Create feature branch
3. Submit pull request
4. Follow code style and include tests

---

## Demo & Screenshots

**Dashboard Home:**  
![Dashboard](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2czgvnuuih3j17qcdsg7.png)

**Login Logs:**  
![Login Logs](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/t37nkhbrrw3bj54ppz7p.png)

**Credit & Account Management:**  
![Account Management](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5lhphbiup65rm6i8b28i.png)  
![Credit Application](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vct81z73y4n4udhjqpda.png)

**PDF Reports & QR Codes:**  
![PDFViewer](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/m9dccxlt25j7fhlo3dkt.png)  
![QR Code](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yswjhmzbcma2ywxttj1h.png)

**Other Features:**  
![Bank accounts list](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/uw9pd5f1bn0p3lcqhi84.png)  
![Magnetic cards statistics](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/92ke59y751rft22u3cy6.png)  
![Inline grid editing](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tcllo00mcahoouawju7x.png)  
![ORG chart](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/222s4uw569n785h9und6.png)  
![Stepper form](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/nhryc6suhviizdrlm5kg.png)  
![Details](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ksjc537ghn9rcgctrlbm.png)  
![Currencies management](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bqoxuef1ygloye04a5h3.png)

---

## License

Licensed under [MIT License](LICENSE)

---

## About

IntuiBank Dashboard combines React, Next.js, PostgreSQL, Prisma, and KendoReact. Explore the repository for implementation details.

Happy coding!  
**Akkal Abdelbaki Nazim**
**Losange**
