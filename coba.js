const ONVIF = require("onvif-nvt"); // Install using 'npm install onvif-nvt'

// Device Configuration
const config = {
  address: "10.5.11.121", // Device IP
  port: 8000, // ONVIF port (default is 80)
  username: "admin", // Username
  password: "admin@321", // Password
};

async function listenToONVIFEvents() {
  try {
    // Initialize ONVIF client
    const onvif = new ONVIF({
      hostname: config.address,
      port: config.port,
      username: config.username,
      password: config.password,
    });

    console.log("Connecting to ONVIF device...");
    await onvif.init();

    console.log("ONVIF device initialized.");

    // Access the Event Service
    const eventService = await onvif.services.events();
    if (!eventService) {
      throw new Error("Event service not available on this device.");
    }

    console.log("Subscribing to events...");
    const subscription = await eventService.Subscribe({
      ConsumerReference: {
        Address: `http://${config.address}:8080/notifications`, // Replace with your listener endpoint
      },
      InitialTerminationTime: "PT1M", // Subscription expires after 1 minute
    });

    console.log("Subscribed to events:", subscription);

    // Renew subscription periodically
    setInterval(async () => {
      try {
        await eventService.Renew({ TerminationTime: "PT1M" });
        console.log("Subscription renewed.");
      } catch (renewErr) {
        console.error("Failed to renew subscription:", renewErr);
      }
    }, 30 * 1000); // Renew every 30 seconds

    console.log("Listening for events...");

    // HTTP Server to Listen for Notifications
    const http = require("http");
    const server = http.createServer((req, res) => {
      if (req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          console.log("Event Notification Received:", body);
          res.end("OK");
        });
      } else {
        res.end("Not Found");
      }
    });

    server.listen(8080, () => {
      console.log("Notification listener started on port 8080.");
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}

listenToONVIFEvents();
