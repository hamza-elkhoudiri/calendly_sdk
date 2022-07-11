import { KApp, KObject } from "@kustomer/apps-server-sdk";

import * as klasses from "../../../klasses";
import { KObjects } from "@kustomer/apps-server-sdk/lib/api/kobject";

export async function updateEventKobject(
  Kobjects: KObjects,
  event: any,
  app: KApp
) {
  const kobject: KObject = klasses.event.map(event);

  app.log.info("updating kobject", kobject);

  await Kobjects.update(
    event.kobject.id as string,
    klasses.event.name,
    kobject
  );

  app.log.info("updated kobject");
}
