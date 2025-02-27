const WebSocket = require("ws");

// Replace with your WebSocket URL
const wsUrl = "ws://10.130.0.219:8098/ws/563/rjg1szqd/websocket";

// Authentication token (if required)
// const authToken = "your-auth-token"; // Obtain this from the API or login process

const ws = new WebSocket(wsUrl, {
  headers: {
    // Authorization: `Bearer ${authToken}`, // Add token-based authentication
    cookie: "SESSION=MTAwNWNkYzEtYmRhMy00MzhjLTlhMjYtZDRmNGU1M2Y4NWFk",
    connection: "Upgrade",
    upgrade: "websocket",
    // "sec-websocket-key": "ng+ORIqxSl7fftoFOiZdWg==",
    // "sec-websocket-version": "13",
    // "sec-websocket-extensions": "permessage-deflate; client_max_window_bits",
    // "content-type": "application/json",
  },
});

// Handle connection open event
ws.on("open", () => {
  console.log("WebSocket connection established.");
});

// Handle incoming messages
ws.on("message", (data) => {
  // console.log("Message received:", data.toString());
  let [header, ...res] = data.toString().split("{");

  if (res.length == 0) {
    return;
  }

  // Parse and prcess the data
  try {
    res = "{" + res.join("{").replaceAll("\\", "").slice(0, -7);
    const parsedData = JSON.parse(res);
    console.dir(parsedData, { depth: null });
    const [
      time,
      area,
      device,
      eventPoint,
      eventDescription,
      cardNumber,
      person,
      readerName,
      verificationMode,
    ] = parsedData.rows[0].data;
    console.log("--------------------------------------------------");
    console.log(`Time: ${time}`);
    console.log(`Area: ${area}`);
    console.log(`Device: ${device}`);
    console.log(`Event Point: ${eventPoint}`);
    console.log(`Event Description: ${eventDescription}`);
    console.log(`Card Number: ${cardNumber}`);
    console.log(`Person: ${person}`);
    console.log(`Reader Name: ${readerName}`);
    console.log(`Verification Mode: ${verificationMode}`);
    console.log("--------------------------------------------------");
  } catch (err) {
    console.error("Failed to parse message:", err);
  }
});

// ws.on("upgrade", function upgrade(request, socket, head) {
//   console.log(request);
// });

// Handle errors
ws.on("error", (error) => {
  console.error("WebSocket error:", error);
});

// Handle connection close
ws.on("close", (code, reason) => {
  console.log(`WebSocket connection closed. Code: ${code}, Reason: ${reason}`);
});
