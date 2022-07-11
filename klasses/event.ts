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
  map: (event) => {
    console.log("*******EVENT123*****", event);
    return {
      custom: {
        canceledStr: event.status === "canceled" ? "Yes" : "No",
        cancelReasonStr: event.canceledReason || "N/A",
        canceledDateStr:
          event.status === "canceled" ? event.eventUpdatedAt : "N/A",
        endTimeAt: event.eventEndTime,
        eventDescriptionStr: event.eventDescription,
        eventDurationNum: event.eventDuration,
        eventLocationStr: event.eventLocation,
        eventNameStr: event.eventName,
        eventTypeStr: event.eventType,
        startTimeAt: event.eventStartTime,
      },
      data: event,
      title: event.eventName,
      externalId: event.uri,
    };
  },
};
