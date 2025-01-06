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

### 2. Run the development server

```bash
yarn dev
```

Open http://localhost:3000 with your browser to see the result.

### API Documentation

Visit /api-doc for the API documentation. This endpoint provides detailed information on how to interact with the available APIs.
