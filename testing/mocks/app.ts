import crypto from "crypto";

import { KApp } from "@kustomer/apps-server-sdk";

export const testApp = new KApp({
  clientId: crypto.randomBytes(16).toString("hex"),
  clientSecret: crypto.randomBytes(16).toString("hex"),
  roles: [],
  env: "test",
  url: "http://example123.com",
  app: "test",
  title: "Test",
  iconUrl: "http://example123.com/static/icon.png",
  version: "1.0.0",
  description: "my test app",
  dependencies: ["kustomer-^1.8.16"],
  screenshots: [],
  appDetails: {
    appDeveloper: {
      name: "Kustomer",
      website: "https://kustomer.com",
      supportEmail: "support@kustomer.com",
    },
    externalPlatform: {
      name: "Test",
      website: "https://test.com",
    },
  },
  default: false,
  system: false,
  visibility: "public",
  changelog: {
    "1.0.0": "init",
  },
});
