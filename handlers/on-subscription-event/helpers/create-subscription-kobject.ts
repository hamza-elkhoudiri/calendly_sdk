import { KApp, KObject } from "@kustomer/apps-server-sdk";
import { Customers } from "@kustomer/apps-server-sdk/lib/api/customer";

import * as klasses from "../../../klasses";
import * as API from "../../../api";

export async function createSubscriptionKobject(
  Customers: Customers,
  event: any,
  Calendly: API.Calendly,
  app: KApp
) {
  app.log.info("creating kobject");

  let customer = await Customers.getByEmail(event.calendly.email);

  const kobject: KObject = klasses.event.map(event);

  if (customer) {
    await Customers.createKObject(customer.id, klasses.event.name, kobject);

    app.log.info("created kobject");

    return;
  }

  app.log.info("creating customer");

  customer = await Customers.create({
    name: `${event.calendly.first_name} ${event.calendly.last_name}`,
    emails: [{ email: event.calendly.email }],
  });

  app.log.info("created customer");

  await Customers.createKObject(customer.id, klasses.event.name, kobject);

  app.log.info("created kobject");
}
