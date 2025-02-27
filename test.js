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
      .on("start", (commandLine) => {
        console.log("FFmpeg process started with command: " + commandLine);
      })
      .on("error", (err) => {
        console.error("Error occurred: " + err.message);
      })
      .on("end", () => {
        console.log("Snapshot captured successfully!");
      })
      .screenshots({
        timestamps: [0], // Capture the first frame (0 seconds)
        filename: outputFilePath,
        folder: "./", // Save in the current directory
        size: "640x480", // Optional: Set the resolution of the snapshot
      });
  })
  // .then((res) => {
  //   console.log(res);
  //   // Save the data to a file
  //   fs.writeFileSync("snapshot.jpg", res.body, { encoding: "binary" });
  //   console.log("Done!");
  // })
  .catch((error) => {
    console.error(error);
  });
