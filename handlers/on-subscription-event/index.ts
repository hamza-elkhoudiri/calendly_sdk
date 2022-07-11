import { KApp } from "@kustomer/apps-server-sdk";
import helpers from "./helpers";
import * as API from "../../api";

export function onSubscriptionEvent(app: KApp, Calendly: API.Calendly) {
  return async (org: string, _query: any, _headers: any, body: any) => {
    try {
      app.log.info("event arrived!");

      app.log.info("body", body);

      const eventResourceUrl = body.payload.uri.match(/.+?(?=\/invitee)/)[0];

      app.log.info("eventResourceUrl", eventResourceUrl);

      const eventResource = await Calendly.getEventResource(eventResourceUrl);

      app.log.info("eventResource", eventResource);

      const Org = app.in(org);

      const kobject = await helpers.getEventKobject(
        Org.kobjects,
        body.payload.uri,
        app
      );

      const event = { kobject, calendly: eventResource };

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
