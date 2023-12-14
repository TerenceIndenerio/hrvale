<template>
  <ion-page>
    <HeaderClockWCard
      :headerTitle="headerTitle"
      :clockin="clockin"
      :clockout="clockout"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
      v-if="!loading"
    />
    <ion-content :fullscreen="true" v-if="!loading">
      <Refresher />
      <div class="margin-top"></div>
      <ClockinCard
        @clockInData="handleClockInData"
        :btnText="btnText"
        :btnColor="theme.primaryColor"
        :btnTextColor="theme.primaryFontColor"
      />
      <ion-card class="flex-center" v-if="coordinatesText">
        <p>{{ coordinatesText }}</p>
      </ion-card>
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
  IonCard,
} from "@ionic/vue";
import Refresher from "@/components/refresher/Refresher.vue";
import ClockinCard from "@/views/services/clock_in/components/ClockinCard.vue";
import HeaderClockWCard from "@/components/header/HeaderClockWCard.vue";
import { defineComponent, ref } from "vue";
import { GlobalConstants } from "@/config/constants";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import axios from "axios";
import { getThemeData } from "@/theme/theme";
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
    IonCard,
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
      theme: {},
      loading: true,
      coordinatesText: "",
    };
  },
  methods: {
    // Exppiration of token
    async checkTokenExpiration() {
      const storedToken = localStorage.getItem("_token");

      if (!storedToken) {
        console.error("Token not available.");
        console.log("Token is missing. Redirecting to login...");
        this.router.push("/login");
        return;
      }

      const tokenData = JSON.parse(atob(storedToken.split(".")[1]));
      const expirationTime = tokenData.exp * 1000;

      if (Date.now() > expirationTime) {
        console.log("Token expired. Redirecting to login...");
        this.router.push("/login");
      }
    },
    async checkState() {
      try {
        this.store.commit("loader/updateLoader", true);

        await this.checkTokenExpiration();

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

        const currentDate = new Date().toISOString().split("T")[0];

        if (getStateResponse.data?.data?.punchIn?.userDate !== currentDate) {
          this.clockin = "00:00";
        }
        if (getStateResponse.data?.data?.punchOut?.userDate !== currentDate) {
          this.clockout = "00:00";
        }

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
        this.loading = false;
      } catch (error) {
        this.loading = false;
        if (error.response && error.response.status === 401) {
          console.error(
            "Session Expired. Token needs to be refreshed or user needs to re-authenticate."
          );
        } else {
          console.error("Error making the GET request:", error);
        }
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

        await this.checkTokenExpiration();

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

        let toastMessage = "";
        if (this.employeeAlreadyPunchedIn) {
          this.btnText = "Clock In";
          toastMessage = "Clocked Out";
          await axios.put(apiUrl, payload, { headers });
        } else {
          this.btnText = "Clock Out";
          toastMessage = "Clocked In";
          await axios.post(apiUrl, payload, { headers });
        }

        const toast = await toastController.create({
          message: `Successfully ${toastMessage}!`,
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
        // geolocation
        const coordinates = await Geolocation.getCurrentPosition();

        // Update the coordinatesText data property
        this.coordinatesText = `Latitude: ${coordinates.coords.latitude}, Longitude: ${coordinates.coords.longitude}`;

        console.log("Current position:", coordinates);

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
    getTheme() {
      const storedThemeData = getThemeData();

      if (storedThemeData) {
        this.theme = storedThemeData;
      }
      this.theme = storedThemeData;
    },
  },
  async created() {
    // geolocation
    const coordinates = await Geolocation.getCurrentPosition();

    // Update the coordinatesText data property
    this.coordinatesText = `Latitude: ${coordinates.coords.latitude}, Longitude: ${coordinates.coords.longitude}`;

    console.log("Current position:", coordinates);
    this.checkTokenExpiration();
    await this.checkState();
    this.getTheme();
  },
});
</script>

<style scoped>
.flex-center {
  display: flex;
  justify-content: center;
}
.margin-top {
  margin-top: 70px;
}
</style>
