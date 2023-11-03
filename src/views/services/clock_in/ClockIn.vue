<template>
  <ion-page>
    <HeaderClockWCard
      :headerTitle="headerTitle"
      :clockin="clockin"
      :clockout="clockout"
    />
    <ion-content :fullscreen="true">
      <Refresher />
      <div class="margin-top"></div>
      <ClockinCard @clockInData="handleClockInData" />
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonToast,
  toastController,
} from "@ionic/vue";
import Refresher from "@/components/refresher/Refresher.vue";
import ClockinCard from "@/views/services/clock_in/components/ClockinCard.vue";
import HeaderClockWCard from "@/components/header/HeaderClockWCard.vue";
import { defineComponent } from "vue";
import { GlobalConstants } from "@/config/constants";
import { mapState } from "vuex";
import axios from "axios";

const baseURL = GlobalConstants.HOST_URL;

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ClockinCard,
    HeaderClockWCard,
    Refresher,
    IonToast,
    toastController,
  },
  data() {
    return {
      headerTitle: "Clock",
      clockin: "08:50 AM",
      clockout: "08:50 PM",
      date: "",
      time: "",
      timezoneName: "",
      timezoneOffset: "",
      employeeAlreadyPunchedIn: true,
    };
  },
  methods: {
    async fetchToken() {
      try {
        const response = await axios.post(baseURL + "auth/token", {
          clientId: "test_id",
          clientSecret: "test_secret",
          userId: 1,
        });
        const token = response.data.token;

        localStorage.setItem("_token", token);
      } catch (error) {
        console.error("Error fetching authentication token: ", error);
        this.showErrorMessage("An error occurred: " + error.message);

        const errorMessage =
          error.response.data.error.message || "Failed to load data";
        const fullErrorMessage = `An error occurred: ${errorMessage}`;
        const toast = await toastController.create({
          message: fullErrorMessage,
          duration: 3000,
          position: "top",
          icon: "alert-circle-outline",
          buttons: [
            {
              icon: "close-outline",
              role: "cancel",
            },
          ],
        });
        await toast.present();
      }
    },

    async handleClockInData(data) {
      try {
        this.$store.commit("loader/updateLoader", true);

        await this.fetchToken();

        const token = localStorage.getItem("_token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        const apiUrl = baseURL + `api/v2/attendance/records`;
        const payload = {
          date: data.date,
          time: data.time,
          timezoneName: data.timezoneName,
          timezoneOffset: data.timezoneOffset,
          note: null,
        };
        console.log(payload);

        // change the employeeAlreadyPunchedIn to true or false
        if (this.employeeAlreadyPunchedIn) {
          const response = await axios.put(apiUrl, payload, { headers });
        } else {
          const response = await axios.post(apiUrl, payload, { headers });
        }

        const toast = await toastController.create({
          message: "Successfully Sent!",
          duration: 3000,
          position: "top",
          icon: "alert-circle-outline",
          buttons: [
            {
              icon: "close-outline",
              role: "cancel",
            },
          ],
        });

        await toast.present();

        console.log("found: ", this.results);
        this.$store.commit("loader/updateLoader", false);
      } catch (error) {
        console.error(
          "Error making the API request: ",
          error.response.data.error.message
        );
        this.results = [];
        this.noResult = true;
        this.$store.commit("loader/updateLoader", false);

        const errorMessage =
          error.response.data.error.message || "Failed to load data";
        const fullErrorMessage = `Failed to load data, ${errorMessage}`;
        const toast = await toastController.create({
          message: fullErrorMessage,
          duration: 3000,
          position: "top",
          icon: "alert-circle-outline",
          buttons: [
            {
              icon: "close-outline",
              role: "cancel",
            },
          ],
        });
        const errorPunch =
          "Cannot Proceed Punch In Employee Already Punched In";
        await toast.present(data);
      }
    },
  },
});
</script>

<style scoped>
.margin-top {
  margin-top: 70px;
}
</style>
