import { KApp } from "@kustomer/apps-server-sdk";
import axios from "axios";
import { SUBSCRIPTION_EVENT, EVENTS } from "../constants";

export class Calendly {
  baseUrl = "https://api.calendly.com";
  token: string;
  app: KApp;

  constructor(app: KApp) {
    this.token = this.getSettings()?.default?.authToken;
    this.app = app;
  }

  get headers() {
    return {
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
    };
  }

  webhookUrl(orgId: string) {
    return `${this.app.manifest.url}/orgs/${orgId}/hooks/${SUBSCRIPTION_EVENT}`;
  }

  getSettings() {
    let calendlySettings;

    this.app
      .in("aacebo")
      .settings.get()
      .then((settings) => {
        calendlySettings = settings;
      });

    return calendlySettings;
  }

  async getWebhooks() {
    const userDetails = await this.getCurrentUserDetails();
    const res = await axios.get(
      `${this.baseUrl}/webhook_subscriptions?scope=organization&organization=${userDetails.current_organization}`,
      this.headers
    );
    return res?.data;
  }

  async getCurrentUserDetails() {
    const res = await axios.get(`${this.baseUrl}/users/me`, this.headers);
    return res?.data?.resource;
  }

  async getEventsNotAlreadyRegistered(orgId: string) {
    const { collection } = await this.getWebhooks();

    if (!collection || !collection.length) return EVENTS;
    return EVENTS.filter((event) => {
      return !collection.find((webhook) => {
        return (
          webhook.events.includes(event) &&
          webhook.callback_url === this.webhookUrl(orgId)
        );
      });
    });
  }

  async getEventResource(url: string) {
    const res = await axios.get(url, this.headers);
    return res?.data?.resource;
  }

  async createWebhooks(orgId) {
    const userDetails = await this.getCurrentUserDetails();

    const payload = {
      url: this.webhookUrl(orgId),
      events: EVENTS,
      organization: userDetails?.current_organization,
      scope: "organization",
    };

    const res = await axios.post(
      `${this.baseUrl}/webhook_subscriptions`,
      payload,
      this.headers
    );
    return res?.data?.resource;
  }

  async registerWebhooks(orgId: string) {
    const events = await this.getEventsNotAlreadyRegistered(orgId);

    if (!events.length) {
      this.app.log.info("Events already registered");
      return [];
    }

    return this.createWebhooks(orgId);
  }
}
