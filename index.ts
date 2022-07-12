import "dotenv/config";
import { AppOptions, KApp } from "@kustomer/apps-server-sdk";
import { APP_ROLES, SUBSCRIPTION_EVENT } from "./constants";
import kviews from "./kviews";
import * as API from "./api";
import * as handlers from "./handlers";
import * as klasses from "./klasses";
import { CalendlySettings } from "./types";

if (!process.env.BASE_URL) {
  throw new Error("baseUrl is required");
}

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
  throw new Error("clientId and clientSecret are required");
}

const APP_VERSION = "3.0.41";

const options: AppOptions = {
  app: "calendly_sdk",
  title: "Calendly",
  version: APP_VERSION,
  iconUrl: `${process.env.BASE_URL}/assets/images/icon.png`,
  url: process.env.BASE_URL,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  roles: APP_ROLES,
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
  changelog: {
    [APP_VERSION]: "Something",
  },
  settings: {
    default: {
      authToken: {
        type: "secret",
        defaultValue: "",
        required: true,
      },
    },
  },
  default: false,
  system: false,
  visibility: "public",
};

const app = new KApp<CalendlySettings>(options);
let Calendly;

app.onInstall = async (_userId, orgId) => {
  try {
    app.log.info("registering webhooks");
    await Calendly.registerWebhooks(orgId);
  } catch (err) {
    app.log.error(JSON.stringify(err, undefined, 2));
  }
};

app.useKlass(klasses.event.name, klasses.event.scheme);

app.useView("calendly-sdk-event-kview", kviews.event, {
  resource: "kobject",
  context: "expanded-timeline",
  displayName: "Calendly Event",
  icon: "calendar",
  state: "open",
  klass: "calendly-sdk-event",
});

(async () => {
  try {
    await app.start(
      +(process.env.PORT || 3001),
      process.env.NODE_ENV === "local"
    );
    const authTokenSetting = await app.in("aacebo").settings.get();

    Calendly = new API.Calendly(
      authTokenSetting?.default.authToken as string,
      app
    );

    app.onHook(SUBSCRIPTION_EVENT, handlers.onSubscriptionEvent(app, Calendly));

    app.log.info(await app.in("aacebo").getToken());
  } catch (err) {
    app.log.error(JSON.stringify(err, undefined, 2));
  }
})();
