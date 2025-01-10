<template>
  <ion-page>
    <HeaderReturn
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    />
    <ion-content :fullscreen="true" v-if="!loading">
      <Refresher />

      <div class="title">
        <h3 :style="{ color: theme.primaryColor }">
          <strong>Recent Transactions</strong>
        </h3>
      </div>

      <div class="result-container">
        <ion-card
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
            <ion-row v-for="(value, label) in result" :key="label">
              <ion-col size="6">
                <strong>
                  <p class="label">{{ formatLabel(label) }}:</p>
                </strong>
              </ion-col>
              <ion-col size="6">
                <p class="data" :style="{ color: theme.primaryColor }">
                  <strong>{{ value }}</strong>
                </p>
              </ion-col>
            </ion-row>
          </ion-grid>

          <ion-button
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
          </ion-button>
        </ion-card>
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
    this.fetchScheduleAdjustments();
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
          changeWorkShiftFrom: this.selectedWorkShift,
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
      workShiftCode
    ) {
      this.$router.push({
        path: "/scheduleadjustmentedit",
        query: {
          changeDateFrom: changeDateFrom,
          changeDateTo: changeDateTo,
          workShift: workShiftID,
          workShiftCode: workShiftCode,
          date: date,
          id: id,
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
  width: 320px;
  margin: 10px auto;
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
.label,
.data {
  font-size: 14px;
}
</style>
