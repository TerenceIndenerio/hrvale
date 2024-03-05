import axios from "axios";
import { PushNotifications } from "@capacitor/push-notifications";
import { GlobalConstants } from "@/config/constants";

const baseURL = GlobalConstants.HOST_URL;

export async function runBackgroundScript() {
  try {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      throw new Error("User not authenticated!");
    }

    if (PushNotifications) {
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === "prompt") {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== "granted") {
        throw new Error("User denied permissions!");
      }

      await PushNotifications.register();

      await PushNotifications.addListener("registration", (token) => {
        console.info("Registration token: ", token.value);
        sendNotifToken(token.value);
      });

      await PushNotifications.addListener(
        "pushNotificationReceived",
        (notification) => {
          console.log("Push notification received: ", notification);
        }
      );

      await PushNotifications.addListener(
        "pushNotificationActionPerformed",
        (notification) => {
          console.log(
            "Push notification action performed",
            notification.actionId,
            notification.inputValue
          );
        }
      );
    } else {
      console.warn("PushNotifications plugin is not available on the web.");
    }
  } catch (error) {
    console.error("Background script failed:", error.message);
  }
}

async function sendNotifToken(notifToken: string) {
  try {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      throw new Error("User not authenticated!");
    }

    const authToken = `Bearer ${storedToken}`;
    const apiUrl = baseURL + `api/v2/push-notification`;
    const headers = {
      Authorization: authToken,
    };

    const payload = {
      token: notifToken,
    };

    const response = await axios.post(apiUrl, payload, { headers });

    console.log("Notification token sent successfully:", response.data);
  } catch (error) {
    console.error("Sending notification token failed:", error.message);
  }
}
