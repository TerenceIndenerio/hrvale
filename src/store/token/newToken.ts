import axios, { AxiosResponse } from "axios";

async function newToken(): Promise<AxiosResponse> {
  const baseURL = `https://hrvale.bapplware.com/api/v1/`;
  const storedToken = localStorage.getItem("refreshtoken");
  console.log("stored refresh", storedToken);
  if (!storedToken) {
    throw new Error("Token not found in localStorage");
  }

  const headers = {
    Authorization: `Bearer ${storedToken}`,
  };

  return new Promise((resolve, reject) => {
    axios
      .post(baseURL + "token", {}, { headers })
      .then((res) => {
        localStorage.setItem("access_token", res.data.token);
        console.log("response:", res.data.token);
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export { newToken };
