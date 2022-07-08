import { KApp } from "@kustomer/apps-server-sdk";
import axios from "axios";
import { SUBSCRIPTION_EVENT, EVENTS } from "../constants";

export class Calendly {
  baseUrl = "https://api.calendly.com";
  token: string;
  app: KApp;

  constructor(token: string, app: KApp) {
    this.token = token;
    this.app = app;
  }

  get headers() {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  webhookUrl(orgId: string) {
    return `${this.app.manifest.url}/orgs/${orgId}/hooks/${SUBSCRIPTION_EVENT}`;
  }

  async getWebhooks() {
    const res = await axios.get(
      `${this.baseUrl}/webhook_subscriptions`,
      this.headers
    );
    return res?.data?.webhooks;
  }

  async getEventsNotAlreadyRegistered(orgId: string) {
    const webhooks = await this.getWebhooks();

    if (!webhooks || !webhooks.length) return EVENTS;

    return EVENTS.filter((event) => {
      return !webhooks.find(
        (webhook) =>
          webhook.event === event && webhook.address === this.webhookUrl(orgId)
      );
    });
  }

  async registerWebhooks(orgId: string) {
    const events = await this.getEventsNotAlreadyRegistered(orgId);

    if (!events.length) {
      this.app.log.info("Events already registered");
      return [];
    }

    const payload = {
      url: this.webhookUrl(orgId),
      events: EVENTS,
      organization: "",
      scope: "organization",
    };

    const res = await axios.post(
      `${this.baseUrl}/webhook_subscriptions`,
      payload,
      this.headers
    );
    return res?.data?.webhook;
  }
}
