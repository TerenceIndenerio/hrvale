import axios, { AxiosResponse } from "axios";

async function newToken(): Promise<AxiosResponse> {
  const baseURL = `https://hrvale.bapplware.com/api/v1/`;
  const storedToken = localStorage.getItem("refresh_token");
  console.log(storedToken);
  if (!storedToken) {
    // Handle the case where the token is not available
    throw new Error("Token not found in localStorage");
  }

  const headers = {
    Authorization: `Bearer ${storedToken}`,
    // Add any other headers if needed
  };

  return new Promise((resolve, reject) => {
    axios
      .post(baseURL + "token", {}, { headers })
      .then((res) => {
        // Update the stored token if needed
        localStorage.setItem("access_token", res.data.token);
        console.log(res.data.token);
        resolve(res);
      })
      .catch((error) => {
        // Handle errors
        reject(error);
      });
  });
}

export { newToken };
