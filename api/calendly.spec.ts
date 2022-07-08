import axios from "axios";
import {
  SUBSCRIPTION_EVENT,
  INVITEE_CREATED,
  INVITEE_UPDATED,
  INVITEE_CANCELED,
  ROUTING_FORM_SUBMISSION_CREATED,
} from "../constants";
import { testApp } from "../testing/mocks";
import { Calendly } from "./calendly";

const userDetails = {
  avatar_url: null,
  created_at: "2022-07-08T14:45:56.565637Z",
  current_organization:
    "https://api.calendly.com/organizations/46d075e3-faf1-4d77-bf29-b9984c3b6faf",
  email: "hamza.elkhoudiri@kustomer.com",
  name: "Hamza Elkhoudiri",
  scheduling_url: "https://calendly.com/hamza-elkhoudiri",
  slug: "hamza-elkhoudiri",
  timezone: "America/New_York",
  updated_at: "2022-07-08T14:46:17.057608Z",
  uri: "https://api.calendly.com/users/a5bb1cbe-c8b3-4926-b242-958c4b875254",
};

const createResponse = {
  callback_url: "http://examples.com/orgs/test-org/hooks/calendly.event",
  created_at: "2022-07-08T17:18:41.993961Z",
  creator:
    "https://api.calendly.com/users/a5bb1cbe-c8b3-4926-b242-958c4b875254",
  events: [INVITEE_CREATED, INVITEE_CANCELED, ROUTING_FORM_SUBMISSION_CREATED],
  organization:
    "https://api.calendly.com/organizations/46d075e3-faf1-4d77-bf29-b9984c3b6faf",
  retry_started_at: null,
  scope: "organization",
  state: "active",
  updated_at: "2022-07-08T17:18:41.993961Z",
  uri: "https://api.calendly.com/webhook_subscriptions/349e7227-fd24-4a3a-8b7e-bda0fac76a2d",
  user: null,
};

const collectionResponse = {
  collection: [
    {
      uri: "https://api.calendly.com/webhook_subscriptions",
      callback_url: "https://blah.foo/bar",
      created_at: "2019-08-24T14:15:22.123456Z",
      updated_at: "2019-08-24T14:15:22.123456Z",
      retry_started_at: "2019-08-24T14:15:22.123456Z",
      state: "active",
      events: [INVITEE_CREATED],
      scope: "user",
      organization: "https://api.calendly.com/organizations",
      user: "https://api.calendly.com/users",
      creator: "https://api.calendly.com/users",
    },
  ],
};

describe("Calendly", () => {
  const calendly = new Calendly("test_key", testApp);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getCurrentUserDetails", () => {
    it("should return the current user's details", async () => {
      const getCurrentUserMock = jest
        .spyOn(calendly, "getCurrentUserDetails")
        .mockResolvedValueOnce(userDetails);
      const res = await calendly.getCurrentUserDetails();
      expect(getCurrentUserMock).toHaveBeenCalledTimes(1);
      expect(res).toEqual(userDetails);
    });
  });

  describe("webhookUrl", () => {
    it("should generate the webhook url", async () => {
      const orgId = "test-org";
      expect(calendly.webhookUrl(orgId)).toEqual(
        `${testApp.manifest.url}/orgs/${orgId}/hooks/${SUBSCRIPTION_EVENT}`
      );
    });
  });

  describe("getWebhooks", () => {
    it("should get the webhooks", async () => {
      const userDetailsMock = jest
        .spyOn(calendly, "getCurrentUserDetails")
        .mockResolvedValueOnce(userDetails);
      const spy = jest
        .spyOn(axios, "get")
        .mockResolvedValueOnce({ data: { webhooks: collectionResponse } });

      await expect(calendly.getWebhooks()).resolves.toEqual(collectionResponse);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(userDetailsMock).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if request fails", async () => {
      jest
        .spyOn(calendly, "getCurrentUserDetails")
        .mockResolvedValueOnce(userDetails);
      const spy = jest
        .spyOn(axios, "get")
        .mockRejectedValueOnce(new Error("error"));

      await expect(calendly.getWebhooks()).rejects.toMatchObject({
        message: "error",
      });
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("getEventsNotAlreadyRegistered", () => {
    it("should get the webhook events not already registered with calendly", async () => {
      const webhooks = {
        collection: [
          {
            uri: "https://api.calendly.com/webhook_subscriptions",
            callback_url:
              "http://example123.com/orgs/test-org/hooks/calendly.event",
            created_at: "2019-08-24T14:15:22.123456Z",
            updated_at: "2019-08-24T14:15:22.123456Z",
            retry_started_at: "2019-08-24T14:15:22.123456Z",
            state: "active",
            events: [
              INVITEE_UPDATED,
              INVITEE_CANCELED,
              ROUTING_FORM_SUBMISSION_CREATED,
            ],
            scope: "user",
            organization: "https://api.calendly.com/organizations",
            user: "https://api.calendly.com/users",
            creator: "https://api.calendly.com/users",
          },
        ],
      };

      const spy = jest
        .spyOn(calendly, "getWebhooks")
        .mockResolvedValueOnce(webhooks);

      await expect(
        calendly.getEventsNotAlreadyRegistered("test-org")
      ).resolves.toEqual([INVITEE_CREATED]);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should return no events if they are already registered with calendly", async () => {
      const webhooks = {
        collection: [
          {
            uri: "https://api.calendly.com/webhook_subscriptions",
            callback_url:
              "http://example123.com/orgs/test-org/hooks/calendly.event",
            created_at: "2019-08-24T14:15:22.123456Z",
            updated_at: "2019-08-24T14:15:22.123456Z",
            retry_started_at: "2019-08-24T14:15:22.123456Z",
            state: "active",
            events: [
              INVITEE_CREATED,
              INVITEE_UPDATED,
              INVITEE_CANCELED,
              ROUTING_FORM_SUBMISSION_CREATED,
            ],
            scope: "user",
            organization: "https://api.calendly.com/organizations",
            user: "https://api.calendly.com/users",
            creator: "https://api.calendly.com/users",
          },
        ],
      };

      const spy = jest
        .spyOn(calendly, "getWebhooks")
        .mockResolvedValueOnce(webhooks);

      await expect(
        calendly.getEventsNotAlreadyRegistered("test-org")
      ).resolves.toEqual([]);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("registerWebhooks", () => {
    it("should register the webhooks with calendly", async () => {
      const eventsSpy = jest
        .spyOn(calendly, "getEventsNotAlreadyRegistered")
        .mockResolvedValueOnce([INVITEE_CREATED]);
      jest.spyOn(calendly, "getWebhooks").mockResolvedValueOnce({
        collection: [
          {
            uri: "https://api.calendly.com/webhook_subscriptions",
            callback_url: "http://localhost/orgs/test-org/hooks/calendly.event",
            created_at: "2019-08-24T14:15:22.123456Z",
            updated_at: "2019-08-24T14:15:22.123456Z",
            retry_started_at: "2019-08-24T14:15:22.123456Z",
            state: "active",
            events: [INVITEE_UPDATED, ROUTING_FORM_SUBMISSION_CREATED],
            scope: "user",
            organization: "https://api.calendly.com/organizations",
            user: "https://api.calendly.com/users",
            creator: "https://api.calendly.com/users",
          },
        ],
      });
      jest
        .spyOn(calendly, "getCurrentUserDetails")
        .mockResolvedValueOnce(userDetails);

      const createSpy = jest
        .spyOn(calendly, "createWebhooks")
        .mockResolvedValueOnce({
          callback_url:
            "http://examples.com/orgs/test-org/hooks/calendly.event",
          created_at: "2022-07-08T17:18:41.993961Z",
          creator:
            "https://api.calendly.com/users/a5bb1cbe-c8b3-4926-b242-958c4b875254",
          events: [
            "invitee.created",
            "invitee.canceled",
            "routing_form_submission.created",
          ],
          organization:
            "https://api.calendly.com/organizations/46d075e3-faf1-4d77-bf29-b9984c3b6faf",
          retry_started_at: null,
          scope: "organization",
          state: "active",
          updated_at: "2022-07-08T17:18:41.993961Z",
          uri: "https://api.calendly.com/webhook_subscriptions/349e7227-fd24-4a3a-8b7e-bda0fac76a2d",
          user: null,
        });

      await expect(calendly.registerWebhooks("test-org")).resolves.toEqual(
        createResponse
      );

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(eventsSpy).toHaveBeenCalledTimes(1);
    });

    it("should return not register any webhooks if they are alredy registered", async () => {
      const eventsSpy = jest
        .spyOn(calendly, "getEventsNotAlreadyRegistered")
        .mockResolvedValueOnce([]);

      await expect(calendly.registerWebhooks("test-org")).resolves.toEqual([]);
      expect(eventsSpy).toHaveBeenCalledTimes(1);
    });
  });
});
