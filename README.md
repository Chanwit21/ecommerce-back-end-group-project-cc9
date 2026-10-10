# Ecommerce backend

NestJS 11 / Sequelize. Configure .env using .env.example with random SECRET_KEY. npm install, ALLOW_DEMO_SEED=true npm run db:seed, npm run dev (port4200), npm run build, npm start. PostgreSQL is required (DATABASE_URL / DB_SCHEMA); no production auto-sync. See docs/project-structure.md. Payments and social login require provider integration.

Database configuration and import: [PostgreSQL guide](docs/postgresql.md). Configure DATABASE_URL and DB_SCHEMA before seeding or starting.
