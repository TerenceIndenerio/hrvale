<template>
  <ion-page>
    <HeaderUser
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :imgLogo="theme.clientLogo"
    ></HeaderUser>

    <ion-content :fullscreen="true" v-if="!loading">
      <Refresher />
      <ion-card>
        <ion-card-content>
          <ion-label>Notification Token:</ion-label>
          <ion-text>{{ notificationToken }}</ion-text>
          <br />
          <ion-label>Notification Received:</ion-label>
          <ion-text>{{ notification }}</ion-text>
          <br />
          <ion-label>Notification ID:</ion-label>
          <ion-text>{{ notifID }}</ion-text>
          <br />
          <ion-label>Notification Input Value:</ion-label>
          <ion-text>{{ notifVal }}</ion-text>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
import { ref, onMounted } from "vue";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonLabel,
  IonText,
} from "@ionic/vue";
import HeaderUser from "@/components/header/HeaderUser.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import { PushNotifications } from "@capacitor/push-notifications";
import { getThemeData } from "@/theme/theme";
import axios from "axios";
import { GlobalConstants } from "@/config/constants";

export default {
  components: {
    IonPage,
    IonContent,
    IonCard,
    IonCardContent,
    IonLabel,
    IonText,
    HeaderUser,
    Refresher,
  },
  data() {
    return {
      headerTitle: "Notification Token",
      notificationToken: "",
      notification: "",
      notifID: "",
      notifVal: "",
      loading: false,
      theme: {},
      notifToken: null,
    };
  },
  methods: {
    async addListeners() {
      await PushNotifications.addListener("registration", (token) => {
        console.info("Registration token: ", token.value);
        this.notificationToken = token.value;
        this.notifToken = token.value;
        this.sendNotifToken();
      });

      await PushNotifications.addListener(
        "pushNotificationReceived",
        (notification) => {
          console.log("Push notification received: ", notification);
          this.notification = JSON.stringify(notification);
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
          this.notifID = notification.actionId;
          this.notifVal = notification.inputValue;
        }
      );
    },

    async registerNotifications() {
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === "prompt") {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== "granted") {
        throw new Error("User denied permissions!");
      }

      await PushNotifications.register();
    },

    async sendNotifToken() {
      try {
        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const authToken = `Bearer ${storedToken}`;

        const apiUrl = baseURL + `api/v2/push-notification`;
        const headers = {
          Authorization: authToken,
        };

        const payload = {
          token: this.notifToken,
        };

        const response = await axios.post(apiUrl, payload, { headers });
      } catch (error) {
        console.log(error.message);
      }
    },
  },
  created() {
    this.addListeners();
    this.registerNotifications();
    this.theme = getThemeData();
  },
};
</script>
