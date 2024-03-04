import axios, { AxiosResponse } from "axios";

interface Config {
  id: number;
  configuration: {
    theme: {
      primaryColor: string;
      secondaryColor: string;
      primaryFontColor: string;
      secondaryFontColor: string;
    };
    apiHost: string;
  };
  name: string;
  clientId: number;
}

async function myFunction(): Promise<AxiosResponse> {
  const baseURL = `https://hrvale.bapplware.com/api`;
  return new Promise((resolve) => {
    axios
      .post(baseURL + "/login", {
        username: "Tester001",
        password: "Tester@001",
      })
      .then((res) => {
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("refreshtoken", res.data.refreshtoken);
        resolve(res);
      });
  });
}

async function fetchConfigs(): Promise<void> {
  try {
    const response = await myFunction();
    const configs: Config[] = response.data.configs;

    localStorage.setItem("configs", JSON.stringify(configs));
  } catch (error) {
    console.error("Error:", error);
  }
}

export { myFunction, fetchConfigs };
