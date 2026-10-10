# Shared PostgreSQL

PostgreSQL 18 runs on `127.0.0.1:5432`, database `profile_projects`, with independent schemas and non-superuser roles:

| Application | Schema | Role |
| --- | --- | --- |
| Healthy at Home | healthy_at_home | healthy_app |
| Ecommerce | ecommerce | ecommerce_app |
| Backoffice LMS | backoffice_lms | lms_app |
| Portfolio NestJS | bc_profile_nest | profile_nest_app |
| Portfolio Spring Boot | bc_profile_spring | profile_spring_app |

Each role owns its schema and has its own search_path. Application roles cannot access other project schemas. Tables must not be created in public.

## Start

From the bc_profile workspace: `npm run db:up`. Persistent data lives in the Docker named volume `profile-projects-database_postgres_data`. `npm run db:down` stops PostgreSQL without removing data.

For a new installation, copy `.env.example` to `.env` here and assign independent random passwords. Set each backend's ignored `.env` DATABASE_URL to `postgresql://<role>:<URL-encoded-password>@127.0.0.1:5432/profile_projects` and DB_SCHEMA to the schema in the table. Configure JWT/session secrets separately. Spring Boot also uses SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME, SPRING_DATASOURCE_PASSWORD and DB_SCHEMA; see its .env.example.

`init.sql` creates roles and schemas on an empty volume. For an existing PostgreSQL cluster, the administrator can execute the same SQL with its environment variables loaded. It is idempotent and does not reset existing passwords. App passwords must match existing roles. Never remove the data volume to change configuration.

Portfolio containers use `npm run backend:up`; this loads the database environment and joins the shared database network. Host applications use localhost; Docker applications use profile-projects-postgres.

## Data migration

Existing SQLite files were backed up before import. Their original files remain available; applications now use PostgreSQL only. The import scripts require Node 24, SQLITE_SOURCE pointing to a backup, and DATABASE_URL / DB_SCHEMA in backend .env.

From a project backend: `SQLITE_SOURCE=/absolute/path/to/backup.sqlite npm run db:migrate:sqlite`. Build LMS backend first. The importer refuses nonempty destinations, retains IDs, checks counts and updates identity sequences. Imports run in transactions; Healthy/Ecommerce foreign keys are validated before commit. Do not run demo seed before importing original data.

For a new demo database only: `ALLOW_DEMO_SEED=true npm run db:seed` in the project backend. Runtime never falls back to SQLite/MySQL.

## Verify and backup

From the workspace: `node scripts/check-postgres.mjs` verifies all five schemas, application roles, cross-schema isolation, transaction writes and portfolio health endpoints. Run each project's integration tests with its API/frontend started.

Back up all schemas without exposing passwords:

```sh
docker exec profile-projects-postgres pg_dump -U profile_admin -d profile_projects -Fc > /absolute/path/profile_projects.dump
```

Restore to a separate database for verification before changing live data. Environment files, old SQLite databases, dumps and backups are ignored and must not be committed.

This application uses `ecommerce`. Shared provisioning files are in the bc_profile workspace at `infrastructure/postgres/`.
