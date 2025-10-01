# chill6homepage

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines React, TanStack Router, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **TanStack Router** - File-based routing with full type safety
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Biome** - Linting and formatting
- **PWA** - Progressive Web App support
- **Tauri** - Build native desktop applications

## Getting Started

First, install the dependencies:

```bash
bun install
```


Then, run the development server:

```bash
bun dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.







## Project Structure

```
chill6homepage/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Router)
```

## Available Scripts

- `bun dev`: Start all applications in development mode
- `bun build`: Build all applications
- `bun dev:web`: Start only the web application
- `bun check-types`: Check TypeScript types across all apps
- `bun check`: Run Biome formatting and linting
- `cd apps/web && bun generate-pwa-assets`: Generate PWA assets
- `cd apps/web && bun desktop:dev`: Start Tauri desktop app in development
- `cd apps/web && bun desktop:build`: Build Tauri desktop app

## Features

- [ ] Offline Ready
- [x] Shopping cart
- [x] Shareable cart
- [x] Send order to WhatsApp admin
- [ ] Order e2e via web
- [ ] Check order status from website (require login)
- [ ] QRIS payment via web
- [ ] Bank payment via web
- [x] Dedicated 3rd party order page (PremPage)
- [x] 3rd party shopping cart
- [x] Order T&C
- [ ] Payment history (require login)
- [ ] Membership discount (require login)
- [x] Event calendar
- [ ] Blog platform
- [ ] Update product availability via telegram bot
