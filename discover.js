const onvif = require("onvif"); // Install using 'npm install onvif'

// Create an ONVIF device instance
let device = new onvif.OnvifDevice({
  xaddr: "http://10.5.11.121:8000/onvif/device_service",
  user: "admin",
  pass: "admin@321",
});

async function subscribeToEvents() {
  try {
    // Initialize the device
    await device.init();

    console.log("Device initialized.");
    console.log(
      `Device Information: ${JSON.stringify(await device.getInformation())}`
    );

    // Get the event service URL
    const eventService = device.services.events;
    if (!eventService) {
      throw new Error("Event service is not available on this device.");
    }

    console.log("Subscribing to events...");

    // Subscribe to events
    const response = await eventService.subscribe();
    console.log("Subscription response:", response);

    console.log("Listening for events...");

    // Listen for incoming events
    eventService.on("event", (event) => {
      console.log("Event received:", JSON.stringify(event, null, 2));
    });

    console.log("Event subscription complete.");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Call the function to subscribe to events
subscribeToEvents();
