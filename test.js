const onvif = require("node-onvif"); // Install using 'npm install onvif'
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

// Device Configuration
let device = new onvif.OnvifDevice({
  xaddr: "http://10.131.0.98:8000/onvif/device_service",
  user: "admin",
  pass: "admin@321",
});

device
  .init()
  .then((info) => {
    // Show the detailed information of the device.
    console.log(JSON.stringify(info, null, "  "));

    let profile = device.getCurrentProfile();
    console.dir(profile, { depth: null });

    const outputFilePath = "snapshot.jpg";

    // Create an FFmpeg command
    ffmpeg(profile.stream.rtsp)
      .inputOptions(["-rtsp_transport", "tcp"]) // Force TCP transport
      .outputOptions([
        "-vframes",
        "1", // Capture only 1 frame
        "-vcodec",
        "mjpeg", // Use MJPEG codec
        "-q:v",
        "2", // Set quality (1 = highest, 31 = lowest)
      ])
      .on("start", (commandLine) => {
        console.log("FFmpeg command:", commandLine);
      })
      .on("stderr", (stderrLine) => {
        console.log("FFmpeg stderr:", stderrLine);
      })
      .on("error", (err) => {
        console.error("Error:", err.message);
      })
      .on("end", () => {
        console.log("Snapshot captured!");
      })
      .save("snapshot.jpg");
  })
  .catch((error) => {
    console.error(error);
  });
