export const event = {
  name: "calendly-sdk-event",
  scheme: {
    icon: "calendar",
    color: "#3e9cf0",
    metadata: {
      properties: {
        canceledStr: {
          displayName: "Canceled",
        },
        cancelReasonStr: {
          displayName: "Cancel Reason",
        },
        canceledDateStr: {
          displayName: "Canceled Date",
        },
        endTimeAt: {
          displayName: "End Time",
        },
        eventDescriptionStr: {
          displayName: "Event Description",
        },
        eventDurationNum: {
          displayName: "Event Duration",
        },
        eventLocationStr: {
          displayName: "Event Location",
        },
        eventNameStr: {
          displayName: "Event Name",
        },
        eventTypeStr: {
          displayName: "Event Type",
        },
        startTimeAt: {
          displayName: "Start Time",
        },
      },
    },
  },
  map: (event, externalId?: string) => {
    console.log("********EVENT*****", event);
    return {
      custom: {},
      data: event.calendly,
      title: `Event ${event.calendly.id}`,
      externalId,
    };
  },
};
