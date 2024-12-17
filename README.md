# Billio

A modern web application built with Next.js, Supabase, and Tailwind CSS.

## Prerequisites

- Node.js 18.x or later
- npm or yarn package manager
- A Supabase account and project

## Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/saminkhan1/billio
cd billio
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up your environment variables:
   - Copy `.env.example` to `.env.local`
   - Update the following variables in `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

## Running the Application

1. Development mode:
```bash
npm run dev
# or
yarn dev
```
The application will be available at [http://localhost:3000](http://localhost:3000)

2. Production build:
```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Tech Stack

- **Framework**: Next.js
- **Database/Backend**: Supabase
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui

- **Icons**: Lucide React

## Project Structure

- `/app` - Next.js app router pages and layouts
- `/components` - Reusable UI components
- `/hooks` - Custom React hooks
- `/utils` - Utility functions and helpers



## Deployment

The application can be deployed to any platform that supports Next.js applications. For optimal performance, we recommend:

1. Vercel (Preferred)
2. Netlify
3. Self-hosted solution

Make sure to configure your environment variables in your deployment platform.
