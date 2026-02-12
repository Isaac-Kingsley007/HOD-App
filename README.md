This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 20 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/) or [bun](https://bun.sh/)
- [PostgreSQL](https://www.postgresql.org/) database

## Clone the Repository

To clone this repository to your local machine:

```bash
git clone https://github.com/Isaac-Kingsley007/HOD-App.git
cd HOD-App
```

## Installation

1. Install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

2. Set up your environment variables:

Copy the `.env.example` file to `.env` and update it with your database connection string:

```bash
cp .env.example .env
```

Then edit the `.env` file with your actual database credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/hod_app"
```

**Note:** Replace `username` and `password` with your actual PostgreSQL credentials. Never commit your `.env` file to version control as it contains sensitive information.

3. Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
