# Staff Management

This project is a monorepo that contains both a frontend and a backend application. The frontend is built with Next.js, and the backend is built with Express and TypeScript. The funtinalities are creating staff , reading staff , updating staff ,  deleteting staff, searching by Staff ID , searching for birthday by using DateRange Picker and searching by staff Gender.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or later)
- [npm](https://www.npmjs.com/) (version 7 or later)
- [Lerna](https://lerna.js.org/)

## Getting Started

### Install Dependencies

First, install the dependencies for the entire monorepo:

```sh
npm install
npx lerna bootstrap
npm run dev
```

## Project Configuration

### Frontend

The frontend application is located in `frontend` folder.It is built with Nextjs Typescript. You can start the development server with:

```sh
npm run dev:frontend

```

To build frontend application. start the development server with:

```sh
npm run build:frontend

```

### Backend

The backend application is located in the `backend` folder. It is built with Express and TypeScript. You can start the development server with:

```sh
npm run dev:backend

```

To build backed application. start the development server with:

```sh

npm run build:backend

```

### Run Both frontend and Backend

You can start the development server with:

```sh
npm run dev
```

To build the entire application. start the development server with:

```sh

npm build dev:
