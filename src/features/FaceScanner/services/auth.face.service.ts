import axios from 'axios';
import { alertController } from '@ionic/vue';
import generateToken from '@/store/token/accessToken';
import { Store } from 'vuex';

export const performFaceLogin = async (face: any, store: Store<any>) => {
  try {
    const { username, password, clientID } = face;
    if (!username || !password || !clientID) {
      throw new Error("Credentials not found for the recognized face.");
    }

    store.commit("loader/updateLoader", true);

    const response = await generateToken(username, password, clientID);
    const token = response.data.access_token;

    if (token) {
      localStorage.setItem("access_token", token);
      localStorage.setItem("refresh_token", response.data.refresh_token);

      await fetchStoredTheme();
      localStorage.setItem("hasSetup", "true");

      const userCredentials = { username, password, client: clientID };
      localStorage.setItem("userCredentials", JSON.stringify(userCredentials));

      await fetchToken();
      const userDetails = await fetchUserDetails();

      return {
        success: true,
        username,
        ...userDetails,
      };
    } else {
      throw new Error("Authentication failed. Invalid token.");
    }
  } catch (error: any) {
    console.error("Login error:", error.message);
    localStorage.setItem("hasSetup", "false");
    await alertError("Authentication failed. Please check credentials or network.");
    return { success: false };
  } finally {
    store.commit("loader/updateLoader", false);
  }
};

const fetchToken = async () => {
  try {
    const storedToken = localStorage.getItem("access_token");
    const baseURL = localStorage.getItem("baseUrl");
    if (!storedToken || !baseURL) throw new Error("Missing storedToken or baseURL");
    const response = await axios.post(`${baseURL}auth/token`, { secret: storedToken });
    localStorage.setItem("token", response.data.token);
  } catch (error) {
    console.log("Error fetching token:", error);
  }
};

const fetchUserDetails = async () => {
  try {
    const storedToken = localStorage.getItem("token");
    const baseURL = localStorage.getItem("baseUrl");
    const headers = { Authorization: `Bearer ${storedToken}` };
    const api = `${baseURL}api/v2/user/me`;
    const { data } = await axios.get(api, { headers });

    localStorage.setItem("empNumber", data.data.employee.empNumber);
    localStorage.setItem("myDetails", JSON.stringify(data.data));

    return {
      firstName: data.data.employee.firstName,
      lastName: data.data.employee.lastName,
    };
  } catch (error: any) {
    console.log("Error fetching user details:", error.message);
    return { firstName: '', lastName: '' };
  }
};

const fetchStoredTheme = async () => {
  try {
    const storedThemeData = localStorage.getItem("configs");
    const configs = storedThemeData ? JSON.parse(storedThemeData) : [];
    const brandingConfig = configs.find((item: any) => item.name === "branding");
    const authConfigs = configs.find((item: any) => item.name === "authentication");

    if (brandingConfig) {
      const { theme, services, client } = brandingConfig.configuration;
      if (theme) {
        localStorage.setItem("themeData", JSON.stringify(theme));
        localStorage.setItem("servicesConfig", JSON.stringify(services));
        localStorage.setItem("client", JSON.stringify(client));
      }
    }
    if (authConfigs) {
      localStorage.setItem("baseUrl", authConfigs.configuration.apiHost);
    }
  } catch (error) {
    console.error("Error fetching or parsing theme data:", error);
    localStorage.setItem("hasSetup", "false");
  }
};

const alertError = async (message: string) => {
  const alert = await alertController.create({
    header: "Invalid Credentials",
    message,
    buttons: ["Close"],
  });
  await alert.present();
};