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
        v-if="!loading"
      />

      <div class="note">
        <p>
          Reminder: Punch out will not show unless you completed break punch in
          and out
        </p>
      </div>

      <!-- Button to open modal -->
      <ion-button
        class="break-details-btn"
        color="medium"
        @click="this.openModal"
      >
        <ion-icon name="reader-outline"></ion-icon> Break Details
      </ion-button>

      <!-- Modal -->
      <ion-modal :is-open="isModalOpen" @didDismiss="closeModal">
        <ion-header :style="{ backgroundColor: theme.primaryColor }">
          <ion-toolbar>
            <ion-title>
              Break Details
              <ion-icon name="reader-outline"></ion-icon>
            </ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          <ion-list v-if="breakDetails">
            <ion-item>
              <ion-icon
                slot="start"
                name="time-outline"
                size="medium"
                :style="{ color: theme.primaryColor }"
              ></ion-icon>
              <ion-label>
                <strong :style="{ color: theme.primaryColor }"
                  >AM Break In:</strong
                >
                <p>
                  {{ breakDetails.punchInAmBreak.amTime || "" }}
                </p>
              </ion-label>
            </ion-item>

            <ion-item>
              <ion-icon
                slot="start"
                name="time-outline"
                size="medium"
                :style="{ color: theme.primaryColor }"
              ></ion-icon>
              <ion-label>
                <strong :style="{ color: theme.primaryColor }"
                  >AM Break Out:</strong
                >
                <p>
                  {{ breakDetails.punchOutAmBreak.amTime || "" }}
                </p>
              </ion-label>
            </ion-item>

            <ion-item>
              <ion-icon
                slot="start"
                name="time-outline"
                size="medium"
                :style="{ color: theme.primaryColor }"
              ></ion-icon>
              <ion-label>
                <strong :style="{ color: theme.primaryColor }"
                  >Lunch In:</strong
                >
                <p>
                  {{ breakDetails.punchInLunchBreak.lunchTime || "" }}
                </p>
              </ion-label>
            </ion-item>

            <ion-item>
              <ion-icon
                slot="start"
                name="time-outline"
                size="medium"
                :style="{ color: theme.primaryColor }"
              ></ion-icon>
              <ion-label>
                <strong :style="{ color: theme.primaryColor }"
                  >Lunch Out:</strong
                >
                <p>
                  {{ breakDetails.punchOutLunchBreak.lunchTime || "" }}
                </p>
              </ion-label>
            </ion-item>

            <ion-item>
              <ion-icon
                slot="start"
                name="time-outline"
                size="medium"
                :style="{ color: theme.primaryColor }"
              ></ion-icon>
              <ion-label>
                <strong :style="{ color: theme.primaryColor }"
                  >PM Break In:</strong
                >
                <p>
                  {{ breakDetails.punchInPmBreak.pmTime || "" }}
                </p>
              </ion-label>
            </ion-item>

            <ion-item>
              <ion-icon
                slot="start"
                name="time-outline"
                size="medium"
                :style="{ color: theme.primaryColor }"
              ></ion-icon>
              <ion-label>
                <strong :style="{ color: theme.primaryColor }"
                  >PM Break Out:</strong
                >
                <p>
                  {{ breakDetails.punchOutPmBreak.pmTime || "" }}
                </p>
              </ion-label>
            </ion-item>
          </ion-list>

          <h4 v-else class="No-data-break-details"><strong>No Data</strong></h4>
        </ion-content>
      </ion-modal>
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
  IonModal,
  IonList,
  IonItem,
  IonButtons,
  IonButton,
  IonLabel,
  IonIcon,
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
    IonModal,
    IonList,
    IonItem,
    IonButtons,
    IonButton,
    IonLabel,
    IonIcon,
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
      breakTime: false,
      breakDetails: null,
      isModalOpen: false,
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
      }
    },

    async breaktimeConfig() {
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

        const apiUrl = `${baseURL}api/v1/attendance/break-time-config`;

        const getStateResponse = await axios.get(apiUrl, { headers });

        if (getStateResponse.data?.data?.hasBreaktime) {
          await this.checkStateBreaktime();
          this.isPmBreakDone = getStateResponse.data?.data?.isPmBreakDone;
        }
      } catch (error) {
        console.error("Error fetching break-time config:", error.message);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    async checkStateBreaktime() {
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
        const apiUrl = baseURL + `api/v1/attendance/break-time/latest`;
        const getStateResponse = await axios.get(apiUrl, { headers });

        const breakData = getStateResponse.data.data;

        const currentDate = new Date().toISOString().split("T")[0];

        if (
          breakData.punchInAmBreak.amDate === currentDate ||
          breakData.punchOutAmBreak.amDate === currentDate ||
          breakData.punchInLunchBreak.lunchDate === currentDate ||
          breakData.punchOutLunchBreak.lunchDate === currentDate ||
          breakData.punchInPmBreak.pmDate === currentDate ||
          breakData.punchOutPmBreak.pmDate === currentDate
        ) {
          this.breakDetails = breakData;
        } else {
          this.breakDetails = null;
        }

        if (breakData.state.name === "Punched In") {
          this.btnText = "Punch Out";
          this.toastMessage = "Punch Out Break";
        } else {
          this.btnText = "Punch In";
          this.toastMessage = "Punch In Break";
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.store.commit("loader/updateLoader", false);
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

        if (!this.isPmBreakDone) {
          const breakTimeApiUrl = `${baseURL}api/v1/break-time`;
          console.log("Using Break Time");
          await axios.post(breakTimeApiUrl, payload, { headers });
          await this.breaktimeConfig();
        } else {
          const attendanceApiUrl = `${baseURL}api/v3/attendance/employees/records`;
          console.log("Using Attendance");
          if (this.employeeAlreadyPunchedIn) {
            await axios.put(attendanceApiUrl, payload, { headers });
          } else {
            await axios.post(attendanceApiUrl, payload, { headers });
          }
          await this.checkState();
        }

        this.showAlert(this.toastMessage);
      } catch (error) {
        console.error(
          "Error making the API request: ",
          error.response?.data?.error?.message
        );

        this.showErrorMessage(error.response?.data?.error?.message);
      }
    },
    // /api/v1/break-time
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

    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
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
    await this.breaktimeConfig();
    this.fetchTheme();
    this.loading = false;
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
.note {
  text-align: center;
}
.break-details-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
}
.No-data-break-details {
  text-align: center;
}
</style>
