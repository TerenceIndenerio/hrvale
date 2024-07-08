interface Config {
  key: string;
  value: any;
}

import axios, { AxiosResponse } from "axios";

async function generateToken(
  username: string,
  password: string,
  client: string
): Promise<AxiosResponse> {
  const baseURL = `https://hrvale.bapplware.com/api`;
  return new Promise((resolve, reject) => {
    axios
      .post(baseURL + "/login", {
        username,
        password,
        client,
      })
      .then((res) => {
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("refreshtoken", res.data.refresh_token);

        const configs: Config[] = res.data.configs;

        localStorage.setItem("configs", JSON.stringify(configs));

        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export default generateToken;
