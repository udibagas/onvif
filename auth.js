const { default: axios } = require("axios");
const md5 = require("md5");

const data = {
  loginType: "NORMAL",
  username: "admin",
  password: md5("Admin@321"),
  checkCode: "",
};

console.log(data);

axios
  .post("http://10.130.0.219:8098/login.do", data)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  });
