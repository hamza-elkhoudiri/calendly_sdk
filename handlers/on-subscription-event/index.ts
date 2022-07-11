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

      const eventTypeUrl = eventResource.event_type;

      const eventTypeResource = await Calendly.getEventResource(eventTypeUrl);

      const eventType = eventTypeResource?.type;

      const eventName = eventResource?.name;

      const eventDescription = eventTypeResource?.description_plain;

      const eventDuration = eventTypeResource?.duration;

      const eventStartTime = eventResource?.start_time;

      const eventEndTime = eventResource?.end_time;

      app.log.info("eventDetails", {
        eventType,
        eventName,
        eventDescription,
        eventDuration,
        eventStartTime,
        eventEndTime,
        status: body.payload.status,
        qAndA: body.payload?.questions_and_answers,
        eventUpdatedAt: body.payload.updated_at,
        canceledReason: body.payload?.cancellation?.reason,
        eventLocation: body.payload?.location?.location,
      });

      const Org = app.in(org);

      const kobject = await helpers.getEventKobject(
        Org.kobjects,
        body.payload.uri,
        app
      );

      const event = {
        kobject,
        calendly: {
          eventType,
          eventName,
          eventDescription,
          eventDuration,
          eventStartTime,
          eventEndTime,
          status: body.payload.status,
          qAndA: body.payload?.questions_and_answers,
          eventUpdatedAt: body.payload.updated_at,
          canceledReason: body.payload?.cancellation?.reason,
          eventLocation: body.payload?.location?.location,
        },
      };

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
