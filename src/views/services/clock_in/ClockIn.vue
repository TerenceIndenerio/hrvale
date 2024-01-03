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
        @clockInClicked="handleClockInData"
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
    async getCurrentDatetime() {
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

        const apiUrl = baseURL + `api/v2/attendance/current-datetime`;

        const response = await axios.get(apiUrl, { headers });

        if (response.data && response.data.data) {
          const { utcDate, utcTime } = response.data.data;
          const utcDateTimeString = `${utcDate}T${utcTime}Z`;
          const utcDateTime = new Date(utcDateTimeString);
          const timezoneName = "Asia/Manila";
          const timezoneOffset = 8;
          const localDateString = `${utcDateTime.getFullYear()}-${String(
            utcDateTime.getMonth() + 1
          ).padStart(2, "0")}-${String(utcDateTime.getDate()).padStart(
            2,
            "0"
          )}`;

          const localTimeString = `${String(utcDateTime.getHours()).padStart(
            2,
            "0"
          )}:${String(utcDateTime.getMinutes()).padStart(2, "0")}`;

          // this.date = "2023-01-01";
          // this.time = "16:08";
          this.date = localDateString;
          this.time = localTimeString;
          this.timezoneName = timezoneName;
          this.timezoneOffset = timezoneOffset;
        }
      } catch (error) {
        console.error(
          "Error fetching current datetime:",
          error.response?.data?.error?.message || error.message
        );
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
        const apiUrl = baseURL + `api/v3/attendance/employees/records`;
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

    async handleClockInData() {
      try {
        console.log("Clock in button clicked!");
        // const dataData = data.date;

        await this.checkTokenExpiration();

        const token = localStorage.getItem("_token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        const apiUrl = baseURL + `api/v3/attendance/employees/records`;

        // Get current coordinates
        const coordinates = await Geolocation.getCurrentPosition();

        const payload = {
          date: this.date,
          time: this.time,
          timezoneName: this.timezoneName,
          timezoneOffset: this.timezoneOffset,
          note: null,
          latitude: coordinates.coords.latitude,
          longitude: coordinates.coords.longitude,
        };

        // await this.getState(dataData);

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

        this.coordinatesText = `Latitude: ${coordinates.coords.latitude}, Longitude: ${coordinates.coords.longitude}`;

        console.log("Current position:", coordinates);

        await toast.present();
      } catch (error) {
        console.error(
          "Error making the API request: ",
          error.response?.data?.error?.message
        );

        this.showErrorMessage(
          "An error occurred: " + error.response?.data?.error?.message
        );
      }
    },

    async showErrorMessage(message) {
      try {
        const toast = await toastController.create({
          message: message,
          duration: 3000,
          position: "top",
          color: "danger",
          buttons: [
            {
              icon: "close-outline",
              role: "cancel",
            },
          ],
        });
        await toast.present();
      } catch (error) {
        console.error("Error displaying toast:", error);
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
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.coordinatesText = `Latitude: ${coordinates.coords.latitude}, Longitude: ${coordinates.coords.longitude}`;
    } catch (error) {
      console.error("Error getting coordinates:", error.message);
      this.$router.push("/gpsoff");
      return;
    }

    this.checkTokenExpiration();
    await this.getCurrentDatetime();
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
  margin-top: 50px;
}
</style>
