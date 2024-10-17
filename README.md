This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

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



   Add-Content -Path README.md -Value @"
   
   ## Project Structure
   
   - frontend/: Next.js frontend
   - backend/: Python backend
   - docker-compose.yml: Docker configuration
   "@




   ## Project Structure

- frontend/: Next.js frontend application
- backend/: Python backend application
- docker-compose.yml: Docker configuration for both services

## Setup Instructions

1. Clone the repository
2. Set up the frontend:
   ```
   cd frontend
   npm install
   npm run dev
   ```
3. Set up the backend:
   ```
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   python app/main.py
   ```
4. To run both services using Docker:
   ```
   docker-compose up --build
   ```

# YogForever

YogForever is a web application for yoga enthusiasts to book classes and manage their yoga journey.

## Important Notes for Developers

### Password Reset Functionality

During local development, the password reset functionality uses the local server URL. This is important for testing the feature in a development environment.

**Key Point:** In the Supabase project settings, set the "Reset Password URL" to:
```
http://localhost:3000/reset-password
```

**Why this is important:**
1. Local Testing: This allows you to test the password reset flow on your local machine.
2. Development-Production Parity: It ensures that the password reset feature works similarly in both development and production environments.
3. Security: It prevents accidentally sending users to a non-existent or incorrect URL during the password reset process.

**Remember:** Before deploying to production, update the "Reset Password URL" in Supabase project settings to your actual domain, e.g., `https://www.yogaharmony.com/reset-password`.

### Environment Variables

Ensure that you have set up the following environment variables in your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with your actual Supabase project details.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables as mentioned above
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
