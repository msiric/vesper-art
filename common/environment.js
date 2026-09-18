export const ENV_OPTIONS = {
  STAGING: "staging",
  TESTING: "testing",
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  SEEDING: "seeding",
};

export const environment = process.env.NODE_ENV;

export const demoMode = process.env.DEMO_MODE === "true";
