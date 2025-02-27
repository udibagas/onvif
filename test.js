const onvif = require("node-onvif"); // Install using 'npm install onvif'
const fs = require("fs");

// Device Configuration
let device = new onvif.OnvifDevice({
  xaddr: "http://10.5.11.121:8000/onvif/device_service",
  user: "admin",
  pass: "admin@321",
});

device
  .init()
  .then((info) => {
    // Show the detailed information of the device.
    console.log(JSON.stringify(info, null, "  "));

    let profile = device.getCurrentProfile();
    console.dir(profile_list, { depth: null });
    return device.fetchSnapshot();
  })
  .then((res) => {
    // Save the data to a file
    fs.writeFileSync("snapshot.jpg", res.body, { encoding: "binary" });
    console.log("Done!");
  })
  .catch((error) => {
    console.error(error);
  });
