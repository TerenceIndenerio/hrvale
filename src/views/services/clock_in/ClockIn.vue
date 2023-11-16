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
      <ClockinCard @clockInData="handleClockInData" :btnText="btnText" />
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
import { defineComponent, ref } from "vue";
import { GlobalConstants } from "@/config/constants";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import axios from "axios";
import { Geolocation } from "@capacitor/geolocation";

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
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    return {
      btnText: "Clock In",
      headerTitle: "Clock In/Out",
      clockin: "00:00",
      clockout: "00:00",
      date: "",
      time: "",
      timezoneName: "",
      timezoneOffset: "",
      employeeAlreadyPunchedIn: false,
    };
  },
  methods: {
    async checkState() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.fetchToken();

        const token = localStorage.getItem("_token");
        if (!token) {
          console.error("Token not available.");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        const apiUrl = baseURL + `api/v2/attendance/records/latest`;

        const getStateResponse = await axios.get(apiUrl, { headers });

        this.clockin = getStateResponse.data?.data?.punchIn?.userTime;
        this.clockout = getStateResponse.data?.data?.punchOut?.userTime;

        if (this.clockin === null) {
          this.clockin = "00:00";
        }
        if (this.clockout === null) {
          this.clockout = "00:00";
        }

        if (getStateResponse.data?.data?.state?.name === "Punched Out") {
          this.btnText = "Clock In";
        } else {
          this.btnText = "Clock Out";
        }
        this.store.commit("loader/updateLoader", false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error(
            "Session Expired. Token needs to be refreshed or user needs to re-authenticate."
          );
        } else {
          console.error("Error making the GET request:", error);
        }
      }
    },
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
      }
    },

    async getState(dataData) {
      try {
        const token = localStorage.getItem("_token");
        if (!token) {
          console.error("Token not available.");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        const apiUrl = baseURL + `api/v2/attendance/records/latest`;
        const payload = {
          date: dataData,
        };

        const getStateResponse = await axios.get(apiUrl, { headers });

        if (getStateResponse.data?.data?.state?.name === "Punched Out") {
          this.employeeAlreadyPunchedIn = false;
        } else {
          this.employeeAlreadyPunchedIn = true;
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error(
            "Session Expired. Token needs to be refreshed or user needs to re-authenticate."
          );
        } else {
          console.error("Error making the GET request:", error);
        }
      }
    },

    async handleClockInData(data) {
      try {
        const dataData = data.date;
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

        await this.getState(dataData);

        if (this.employeeAlreadyPunchedIn) {
          this.btnText = "Clock In";
          await axios.put(apiUrl, payload, { headers });
        } else {
          this.btnText = "Clock Out";
          await axios.post(apiUrl, payload, { headers });
        }

        const coordinates = await Geolocation.getCurrentPosition();
        console.log("Current position:", coordinates);

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
      } catch (error) {
        console.error(
          "Error making the API request: ",
          error.response?.data?.error?.message
        );

        const errorMessage = error.response.data.error.message || "Failed to load data";
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
        await toast.present();
      }
    },
    async printCurrentPosition() {
      const coordinates = await Geolocation.getCurrentPosition();
      console.log("Current position:", coordinates);
    },
  },
  async created() {
    await this.checkState();
  },
});
</script>

<style scoped>
.margin-top {
  margin-top: 70px;
}
</style>
