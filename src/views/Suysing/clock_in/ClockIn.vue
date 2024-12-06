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
import HeaderClockWCard from "@/views/Suysing/clock_in/components/HeaderClockWCard.vue";
import { defineComponent, ref } from "vue";
import { GlobalConstants } from "@/config/constants";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import axios from "axios";
import { Geolocation } from "@capacitor/geolocation";

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
      toastMessage: "",
      hasClockedIn: false,
    };
  },
  methods: {
    // Expiration of token
    async checkTokenExpiration() {
      const storedToken = localStorage.getItem("token");

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

    getCurrentTime() {
      try {
        const currentTime = new Date();
        const timezoneName = "Asia/Manila";
        const timezoneOffset = currentTime.getTimezoneOffset() / 60;

        const localDateString = `${currentTime.getFullYear()}-${String(
          currentTime.getMonth() + 1
        ).padStart(2, "0")}-${String(currentTime.getDate()).padStart(2, "0")}`;

        const localTimeString = `${String(currentTime.getHours()).padStart(
          2,
          "0"
        )}:${String(currentTime.getMinutes()).padStart(2, "0")}`;

        this.date = localDateString;
        this.time = localTimeString;
        this.timezoneName = timezoneName;
        this.timezoneOffset = timezoneOffset;
      } catch (error) {
        console.error("Error fetching current time:", error.message);
      }
    },

    async checkState() {
      try {
        this.store.commit("loader/updateLoader", true);
        const baseURL = localStorage.getItem("baseUrl");
        await this.checkTokenExpiration();

        const token = localStorage.getItem("token");
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

        if (
          getStateResponse.data?.data?.state?.name === "Punched Out" &&
          getStateResponse.data?.data?.punchIn?.utcDate === currentDate
        ) {
          this.btnText = "Clock In";
          this.toastMessage = "Clocked In";
        } else if (
          getStateResponse.data?.data?.state?.name === "Punched In" &&
          getStateResponse.data?.data?.punchIn?.utcDate === currentDate
        ) {
          this.btnText = "Clock Out";
          this.toastMessage = "Clocked Out";
        }
      } catch (error) {
        this.loading = false;
        if (error.response && error.response.status === 401) {
          console.error(
            "Session Expired. Token needs to be refreshed or user needs to re-authenticate."
          );
        } else {
          console.error("Error making the GET request:", error);
        }
      } finally {
        this.store.commit("loader/updateLoader", false);
        this.loading = false;
      }
    },

    async getState(dataData) {
      try {
        const token = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
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
        await this.checkTokenExpiration();
        const baseURL = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        const apiUrl = baseURL + `api/v3/attendance/employees/records`;
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

        if (this.employeeAlreadyPunchedIn) {
          await axios.put(apiUrl, payload, { headers });
        } else {
          await axios.post(apiUrl, payload, { headers });
        }

        this.checkState();
        this.showAlert(this.toastMessage);
      } catch (error) {
        console.error(
          "Error making the API request: ",
          error.response?.data?.error?.message
        );

        this.showErrorMessage(error.response?.data?.error?.message);
      }
    },

    async showAlert(message) {
      try {
        const toast = await toastController.create({
          message: `Successfully ${message}!`,
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
        console.log(error.message);
      }
    },

    async showErrorMessage(message) {
      try {
        const toast = await toastController.create({
          message: message,
          duration: 3000,
          position: "top",
          color: "light",
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

    fetchTheme() {
      const storedThemeData = localStorage.getItem("themeData");

      const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};

      this.theme = themeData;
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

    this.getCurrentTime();

    setInterval(this.getCurrentTime, 1000);

    this.checkTokenExpiration();

    await this.checkState();
    this.fetchTheme();
  },
  beforeDestroy() {
    clearInterval(this.updateInterval);
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
.box-container {
  width: fit-content;
  margin: 0 auto;
  padding: 0 20px;
}
</style>
