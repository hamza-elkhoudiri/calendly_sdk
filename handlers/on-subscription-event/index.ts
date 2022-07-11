import { KApp } from "@kustomer/apps-server-sdk";
import helpers from "./helpers";

export function onSubscriptionEvent(app: KApp) {
  return async (org: string, _query: any, _headers: any, body: any) => {
    try {
      app.log.info("event arrived!");

      app.log.info("body", body);

      const Org = app.in(org);

      const kobject = await helpers.getSubscriptionKobject(
        Org.kobjects,
        body.payload.uri,
        app
      );

      const event = { kobject, calendly: body.payload };

      if (event.kobject) {
        return await helpers.updateSubscriptionKobject(
          Org.kobjects,
          event,
          app
        );
      }

      return await helpers.createSubscriptionKobject(Org.customers, event, app);
    } catch (err) {
      app.log.error("failed to process webhook", err);
    }
  };
}
