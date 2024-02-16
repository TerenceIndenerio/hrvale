// import axios, { AxiosResponse } from "axios";

// async function myFunction(): Promise<AxiosResponse> {
//   const baseURL = `https://hrvale.bapplware.com/api`;
//   return new Promise((resolve) => {
//     axios
//       .post(baseURL + "/login", {
//         username: "Tester81-staging",
//         password: "Tester@81",
//       })
//       .then((res) => {
//         localStorage.setItem("access_token", res.data.access_token);
//         localStorage.setItem("refresh_token", res.data.refresh_token);
//         resolve(res);
//       });
//   });
// }

// export default myFunction;

// export { myFunction };

import axios, { AxiosResponse } from "axios";

async function generateToken(
  username: string,
  password: string
): Promise<AxiosResponse> {
  const baseURL = `https://hrvale.bapplware.com/api`;
  return new Promise((resolve, reject) => {
    axios
      .post(baseURL + "/login", {
        username,
        password,
      })
      .then((res) => {
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("refresh_token", res.data.refresh_token);
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export default generateToken;
