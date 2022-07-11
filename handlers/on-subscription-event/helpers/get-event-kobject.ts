import { KApp } from "@kustomer/apps-server-sdk";
import { KObjects } from "@kustomer/apps-server-sdk/lib/api/kobject";

import * as klasses from "../../../klasses";

export async function getEventKobject(
  Kobjects: KObjects,
  eventId: string,
  app: KApp
) {
  app.log.info("getting kobject");

  const kobject = await Kobjects.getByExternalId(eventId, klasses.event.name);

  app.log.info("kobject retrieved", kobject);

  return kobject;
}
