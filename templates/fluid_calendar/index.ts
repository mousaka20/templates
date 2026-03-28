import { defineApp } from "easypanel";

export default defineApp({
  name: "fluid-calendar",
  services: [
    {
      name: "app",
      image: "eibrahim/fluid-calendar:latest",
      restart: "unless-stopped",
      dependsOn: ["db"],
      ports: [
        {
          container: 3000,
        },
      ],
      env: {
        DATABASE_URL:
          "postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}",
        NEXTAUTH_URL: "${APP_URL}",
        NEXT_PUBLIC_APP_URL: "${APP_URL}",
        NEXTAUTH_SECRET: "${RANDOM_SECRET}",
        NODE_ENV: "production",
      },
      volumes: [
        {
          name: "app_data",
          mountPath: "/app/data",
        },
      ],
      healthcheck: {
        test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000"],
        interval: "30s",
        timeout: "5s",
        retries: 5,
        startPeriod: "20s",
      },
    },
    {
      name: "db",
      image: "postgres:15-alpine",
      restart: "unless-stopped",
      env: {
        POSTGRES_USER: "${DB_USER}",
        POSTGRES_PASSWORD: "${DB_PASSWORD}",
        POSTGRES_DB: "${DB_NAME}",
      },
      volumes: [
        {
          name: "db_data",
          mountPath: "/var/lib/postgresql/data",
        },
      ],
      healthcheck: {
        test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"],
        interval: "10s",
        timeout: "5s",
        retries: 5,
      },
    },
  ],
  volumes: [
    {
      name: "app_data",
    },
    {
      name: "db_data",
    },
  ],
  variables: [
    {
      name: "DB_USER",
      label: "Database User",
      default: "fluid",
    },
    {
      name: "DB_PASSWORD",
      label: "Database Password",
      type: "password",
      generate: true,
    },
    {
      name: "DB_NAME",
      label: "Database Name",
      default: "fluid_calendar",
    },
  ],
});
