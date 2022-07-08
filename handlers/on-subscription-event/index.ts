import { KApp } from "@kustomer/apps-server-sdk";
import * as API from "../../api";
import helpers from "./helpers";

export function onSubscriptionEvent(app: KApp, {}: API.Calendly) {
  return async (org: string, _query: any, _headers: any, body: any) => {
    try {
      app.log.info("event arrived!");

      const Org = app.in(org);

      const kobject = await helpers.getSubscriptionKobject(
        Org.kobjects,
        body.event.id,
        app
      );

      app.log.info("kobject", kobject);
    } catch (err) {
      app.log.error("failed to process webhook", err);
    }
  };
}
