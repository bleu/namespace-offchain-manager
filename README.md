# Project Title

This is a Next.js project that can be deployed on [Vercel](https://vercel.com).

## Package.json Scripts

Below are the main scripts available in the **package.json**:

- **dev**: `next dev --turbo`  
  Starts the development server with the Turbo engine.
- **build**: `next build`  
  Builds the application for production usage.
- **start**: `next start`  
  Starts the application in production mode.
- **lint:fix**: `yarn biome check --write ./src`  
  Runs linting checks and automatically fixes issues in `./src`.

## Getting Started

### 1. Set up the database

```bash
docker-compose up -d
npx prisma migrate dev
```

### 2. Configure Resend API Key

To send emails using Resend, you need to obtain an API key from Resend and set the following environment variables in your .env file:

1. Go to the Resend website and sign up for an account.
2. Navigate to the API section and generate a new API key.
3. Copy the generated API key.
4. Add the following environment variables to your .env file:

```bash
NEXT_PUBLIC_APP_URL="http://localhost:3000" # app url
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="Namespace <example@example.com>"
```

Replace your-resend-api-key with the API key you copied from the Resend website.

#### API Documentation

Visit `/api-doc` for the API documentation. This endpoint provides detailed information on how to interact with the available APIs. ```

### 3. Run the development server

```bash
yarn dev
```

Open http://localhost:3000 with your browser to see the result.

### API Documentation

Visit /api-doc for the API documentation. This endpoint provides detailed information on how to interact with the available APIs.
