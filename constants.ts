export const APP_ROLES = [
  "org.user.customer.read",
  "org.user.customer.write",
  "org.user.kobject.read",
  "org.user.kobject.write",
  "org.permission.customer.read",
  "org.permission.customer.create",
  "org.permission.customer.update",
  "org.permission.kobject.create",
  "org.permission.kobject.update",
  "org.permission.kobject.kobject_*.create",
  "org.permission.kobject.kobject_*.update",
];

export const SUBSCRIPTION_EVENT = "calendly.event";

export const INVITEE_CREATED = "invitee.created";
export const INVITEE_CANCELED = "invitee.canceled";

export const EVENTS = [INVITEE_CREATED, INVITEE_CANCELED];
