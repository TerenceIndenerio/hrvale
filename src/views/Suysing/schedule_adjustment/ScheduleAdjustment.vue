<template>
  <ion-page>
    <HeaderReturn
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    />
    <ion-content :fullscreen="true" v-if="!loading">
      <Refresher />
      <ion-card class="neomorphic-card-1 search-container">
        <h5 :style="{ color: theme.primaryColor }" class="search-title">
          Select Date
        </h5>
        <div class="input-container">
          <div class="container-inner">
            <p :style="{ color: theme.primaryColor }" class="label">From</p>
            <div class="select-option neomorphic-input-2">
              <ion-input type="date" v-model="startDate" class="date-input" />
            </div>
          </div>

          <div class="container-inner">
            <p :style="{ color: theme.primaryColor }" class="label">To</p>
            <div class="select-option neomorphic-input-2">
              <ion-input type="date" v-model="endDate" class="date-input" />
            </div>
          </div>
        </div>

        <ion-button
          expand="full"
          class="search-btn-container neomorphic-btn-2"
          color="none"
          :style="{ backgroundColor: theme.primaryColor }"
          @click="fetchSchedules"
        >
          Search
        </ion-button>
      </ion-card>

      <div class="result-container">
        <div
          class="neomorphic-card-1 card-container"
          v-for="(result, index) in results"
          :key="index"
        >
          <div
            class="header-outline"
            :style="{ backgroundColor: theme.primaryColor }"
            v-if="!isDefault"
          >
            <p class="header-label">{{ result.workShift }}</p>
          </div>

          <ion-grid>
            <ion-row
              class="card-content"
              @click="
                navigateToEditPage(
                  result.id,
                  this.startDate,
                  this.endDate,
                  result.date,
                  this.selectedWorkShift,
                  result.workShift,
                  getDayOfWeek(result.changeDateTo)
                )
              "
            >
              <!-- Checkbox Column -->
              <ion-col size="3" class="ion-align-self-center">
                <ion-checkbox></ion-checkbox>
              </ion-col>

              <!-- Date Column -->
              <ion-col size="5">
                <strong>
                  <p :style="{ color: theme.primaryColor }">
                    {{ result.changeDateTo }}
                  </p>
                </strong>
              </ion-col>

              <!-- Day of the Week Column -->
              <ion-col size="4">
                <strong>
                  <p>{{ getDayOfWeek(result.changeDateTo) }}</p>
                </strong>
              </ion-col>
            </ion-row>
          </ion-grid>

          <!-- <ion-button
            expand="full"
            color="light"
            class="edit-btn neomorphic-btn-2"
            @click="
              navigateToEditPage(
                result.id,
                this.startDate,
                this.endDate,
                result.date,
                this.selectedWorkShift,
                result.workShift
              )
            "
            v-if="!isDefault"
          >
            <ion-icon name="create-outline"></ion-icon> Edit
          </ion-button> -->
        </div>
      </div>

      <div class="recent-container">
        <h5 :style="{ color: theme.primaryColor }">Recent Transaction</h5>
        <ion-button
          expand="full"
          color="None"
          class="recent-btn neomorphic-btn-2"
          @click="navigateToRecent()"
          :style="{
            outline: `2px solid ${theme.primaryColor}`,
            color: theme.primaryColor,
          }"
        >
          View All
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonCard,
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonRow,
  IonCol,
  IonToast,
  toastController,
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonInput,
  IonIcon,
  IonCheckbox,
} from "@ionic/vue";
import Refresher from "@/components/refresher/Refresher.vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import { defineComponent } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { GlobalConstants } from "@/config/constants";
import { mapState } from "vuex";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonCard,
    HeaderReturn,
    IonSelect,
    IonSelectOption,
    Refresher,
    IonGrid,
    IonRow,
    IonCol,
    IonToast,
    toastController,
    IonButton,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonInput,
    IonIcon,
    IonCheckbox,
  },
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    return {
      headerTitle: "Change DO",
      payrollPeriodOption: [],
      authToken: null,
      noResult: false,
      results: [],
      onLoadResult: [],
      theme: {},
      loading: true,
      storedToken: null,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      empNumber: "",
      workShiftOptions: [],
      selectedWorkShift: 85,
      isDefault: true,
    };
  },
  created() {
    this.isDefault = true;
    this.empNumber = localStorage.getItem("empNumber");
    this.fetchTheme();
    this.fetchWorkShiftOptions();
    this.loading = false;
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
    formatLabel(label) {
      return label
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
    },

    getDayOfWeek(dateString) {
      const date = new Date(dateString);
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return days[date.getDay()];
    },

    // Schedules
    async fetchSchedules() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();
        const baseURL = localStorage.getItem("baseUrl");
        this.storedToken = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };

        const api = `${baseURL}api/v1/employee/schedules`;
        const queryParams = new URLSearchParams({
          changeDateFrom: this.startDate,
          changeDateTo: this.endDate,
          // changeWorkShiftFrom: this.selectedWorkShift,
        });

        const response = await axios.get(`${api}?${queryParams.toString()}`, {
          headers,
        });

        const results = response.data.data.map((schedule) => ({
          day: new Date(schedule.scheduleDate.date).toLocaleDateString(
            "en-US",
            { weekday: "long" }
          ),
          date: schedule.date,
          scheduleIn: schedule.lunchBreakStart,
          scheduleOut: schedule.lunchBreakEnd,
          workShift: schedule.workShift.code,
          changeDateTo: schedule.date,
        }));

        this.results = results;
        this.isDefault = false;
      } catch (error) {
        this.showErrorMessage(error.message);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },
    //schedule-adjustments
    async fetchScheduleAdjustments() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();
        const baseURL = localStorage.getItem("baseUrl");
        this.storedToken = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };

        const api = `${baseURL}api/v1/schedule-adjustments`;

        const response = await axios.get(`${api}`, {
          headers,
        });

        const results = response.data.data.map((schedule) => ({
          changeDateFrom: schedule.changeDateFrom,
          changeDateTo: schedule.changeDateTo,
          changeWorkShiftCodeFrom: schedule.changeWorkShiftCodeFrom,
          changeWorkShiftCodeTo: schedule.changeWorkShiftCodeTo,
          reason: schedule.reason,
          status: schedule.status,
        }));

        this.results = results;
      } catch (error) {
        console.log(error);
        this.showErrorMessage(error.message);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    async fetchWorkShiftOptions() {
      try {
        await this.checkTokenExpiration();
        const baseURL = localStorage.getItem("baseUrl");
        this.storedToken = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };

        const api = baseURL + `api/v2/admin/work-shifts`;

        const response = await axios.get(api, { headers });

        this.workShiftOptions = response.data.data.map((item) => ({
          id: item.id,
          code: item.code,
          regularWorkHourStart: item.regularWorkHourStart,
          regularWorkHourEnd: item.regularWorkHourEnd,
        }));
      } catch (error) {
        console.error("Error fetching work shift options:", error);
      }
    },

    navigateToRecent() {
      this.$router.push("/suysing_recentscheduleadjustment");
    },

    fetchTheme() {
      try {
        const storedThemeData = localStorage.getItem("configs");

        const themeData = storedThemeData ? JSON.parse(storedThemeData) : [];

        let themeConfiguration = null;

        for (const data of themeData) {
          if (data.configuration && data.configuration.theme) {
            themeConfiguration = data.configuration.theme;
            break;
          }
        }

        if (themeConfiguration) {
          this.theme = themeConfiguration;
        } else {
          console.error(
            "No theme data found in local storage or theme configuration not available."
          );
        }
      } catch (error) {
        console.error("Error fetching or parsing theme data:", error);
      }
    },

    showErrorMessage(message) {
      this.$ionic.toastController
        .create({
          message: message,
          duration: 3000,
          position: "bottom",
          color: "danger",
        })
        .then((toast) => {
          toast.present();
        });
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

    navigateToEditPage(
      id,
      changeDateFrom,
      changeDateTo,
      date,
      workShiftID,
      workShiftCode,
      dayOfTheWeek
    ) {
      this.$router.push({
        path: "/suysing_scheduleadjustmentedit",
        query: {
          changeDateFrom: changeDateFrom,
          changeDateTo: changeDateTo,
          workShift: workShiftID,
          workShiftCode: workShiftCode,
          date: date,
          id: id,
          dayOfTheWeek: dayOfTheWeek,
        },
      });
    },
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
p {
  margin: 0;
}

.flex-h {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.text-center {
  text-align: center;
}
.card {
  padding: 0 10px 0 10px;
  border-radius: 20px;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8), 0px -4px 8px rgba(0, 0, 0, 0.05);
}
.card ion-card-header {
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.card ion-card-header ion-card-subtitle {
  border: 1px solid gray;
  padding: 10px 20px;
  border-radius: 20px;
  margin: 10px 0 0 0;
}
.card-content {
  padding: 0 0 0 0px;
  /* margin: 30px auto 10px auto; */
}
.card h5 {
  margin: 0;
}
.result-container {
  max-width: 350px;
  margin: 0 auto;
}
.payroll-container {
  width: fit-content;
  min-width: 305px;
  height: fit-content;
  flex-shrink: 0;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.5);
  margin: 0 auto;
  padding: 10px;
}
.wdays-text {
  color: #000;
  text-align: center;
  font-family: Open Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.box {
  width: 45px;
  height: 45px;
  border-radius: 10px;
  background: #6d2b84;
}
.wdays-num {
  color: #fff;
  text-align: center;
  font-family: Open Sans;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.select-option {
  border-radius: 20px;
  margin: 5px;
  width: 150px;
}
.input-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.header-row {
  border-bottom: 1px solid #000;
  margin-bottom: 20px;
}
.outlineColor {
  border-radius: 20px;
}
.search-btn-container {
  height: 30px;
  width: 100px;
  float: right;
}
.edit-btn {
  width: 100%;
  height: 30px;
  margin: 0 auto 5px auto;
}
.result-text {
  margin: 15px;
}

.search-container {
  margin: 10px auto 20px auto;
  padding: 10px;
}

.search-title {
  font-family: "Inter";
  font-weight: bold;
  text-align: center;
  margin: 0 0 10px 0;
}

.label {
  font-family: "Inter";
  font-weight: bold;
}
.container-inner p {
  padding-left: 20px;
}
.card-container {
  width: 300px;
  margin: 10px auto;
  padding: 10px;
}
.header-outline {
  border-radius: 20px 0 0 20px;
  position: absolute;
  right: 0;
  top: 0;
  padding: 10px;
  width: fit-content;
}
.header-label {
  color: #fff;
  font-size: 12px;
}
.date-input {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 120px;
}
.underline {
  border: 1px solid rgb(233, 233, 233);
  width: 100%;
}
.recent-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: row;
  max-width: 500px;
  margin-bottom: 50px;
}
.recent-container h5 {
  font-family: Poppins;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
}
.recent-btn {
  width: 100px;
  border-radius: 10px;
  padding: 0;
  height: 30px;
}
</style>
