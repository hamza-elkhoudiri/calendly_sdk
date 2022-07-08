import { KApp } from "@kustomer/apps-server-sdk";
import * as API from "../../api";

export function onSubscriptionEvent(app: KApp, {}: API.Calendly) {
  return async (org: string, _query: any, _headers: any, body: any) => {
    try {
      app.log.info("event arrived!");

      console.log(org, body);
    } catch (err) {
      app.log.error("failed to process webhook", err);
    }
  };
}
