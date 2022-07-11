import { KApp } from "@kustomer/apps-server-sdk";
import helpers from "./helpers";

export function onSubscriptionEvent(app: KApp) {
  return async (org: string, _query: any, _headers: any, body: any) => {
    try {
      app.log.info("event arrived!");

      app.log.info("body", body);

      const Org = app.in(org);

      const kobject = await helpers.getEventKobject(
        Org.kobjects,
        body.payload.uri,
        app
      );

      app.log.info("kobject", kobject);

      const event = { kobject, calendly: body.payload };

      app.log.info("event", event);

      if (event.kobject) {
        return await helpers.updateEventKobject(Org.kobjects, event, app);
      }

      return await helpers.createEventKobject(Org.customers, event, app);
    } catch (err) {
      app.log.error("failed to process webhook", err);
    }
  };
}
