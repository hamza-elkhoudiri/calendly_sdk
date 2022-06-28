import "dotenv/config";
import { KApp } from "@kustomer/apps-server-sdk";
import changelog from "./changelog/index.json";

if (!process.env.BASE_URL) {
  throw new Error("baseUrl is required");
}

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
  throw new Error("clientId and clientSecret are required");
}

const app = new KApp({
  app: "calendly_sdk",
  title: "Calendly",
  version: "0.0.2",
  iconUrl: `${process.env.BASE_URL}/assets/images/icon.png`,
  url: process.env.BASE_URL,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  roles: [
    "org.user.customer.read",
    "org.user.customer.write",
    "org.user.kobject.read",
    "org.user.kobject.write",
    "org.permission.customer.read",
    "org.permission.customer.create",
    "org.permission.customer.update",
    "org.permission.kobject.create",
    "org.permission.kobject.update",
    "org.permission.kobject.kobject_*.create",
    "org.permission.kobject.kobject_*.update",
  ],
  env: "qa",
  releaseNotesUrl:
    "https://help.kustomer.com/calendly-app-release-notes-ByTY2RmBu",
  description: `Calendly lets you save time scheduling meetings by making it easier to decide on a convenient time.\n 

  Connect your Calendly account to Kustomer so that you can view meeting details in a customer’s timeline and in an insight card.\n

  Calendy is automated scheduling software that has been designed to make that process of finding meeting times easy.\n

  Learn more about the integration in the [Kustomer Help Center](https://help.kustomer.com/integrate-with-calendly-SkjppgFpv).`,
  dependencies: ["kustomer-^1.4.11"],
  screenshots: [
    `${process.env.BASE_URL}/assets/images/screenshot-1.png`,
    `${process.env.BASE_URL}/assets/images/screenshot-2.png`,
  ],
  appDetails: {
    appDeveloper: {
      name: "Kustomer",
      website: "https://kustomer.com",
      supportEmail: "support@kustomer.com",
    },
    externalPlatform: {
      name: "Calendly",
      website: "https://calendly.com",
    },
  },
  changelog,
  default: false,
  system: false,
  visibility: "public",
});

(async () => {
  try {
    await app.start(
      +(process.env.PORT || 3001),
      process.env.NODE_ENV === "local"
    );

    app.log.info(await app.in("aacebo").getToken());
  } catch (err) {
    app.log.error(JSON.stringify(err, undefined, 2));
  }
})();
