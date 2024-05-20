<template>
  <ion-page>
    <HeaderReturn
      v-if="!loading"
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    />
    <ion-content>
      <Refresher />
      <!-- Request Number -->
      <ion-card class="card-req neomorphic-card-1">
        <h4 class="ion-text-center ref-code">
          {{ requestNumber }}
        </h4>

        <p class="ion-text-center">
          <span :style="{ color: theme.primaryColor }">
            <strong> Request Number </strong>
          </span>
        </p>
      </ion-card>

      <!-- Sched In and Out -->
      <div class="flex-center workshift-container">
        <ion-card
          class="ion-margin-bottom input-card work-shift neomorphic-card-1"
        >
          <div class="time-container-schedule">
            <div class="ion-margin-bottom sched-container">
              <ion-label :style="{ color: theme.primaryColor }">
                <strong>Change Date From:</strong>
              </ion-label>
              <p class="ion-text-center sched-val neomorphic-input-2">
                {{ this.changeDateFrom }}
              </p>
            </div>

            <div class="ion-margin-bottom sched-container">
              <ion-label :style="{ color: theme.primaryColor }">
                <strong>Change Workshift From:</strong>
              </ion-label>
              <p class="ion-text-center sched-val neomorphic-input-2">
                {{ this.workShiftCode }}
              </p>
            </div>
          </div>
        </ion-card>
      </div>

      <div class="option-container">
        <ion-card class="ion-margin-bottom actual-container neomorphic-card-1">
          <!-- Work Shift -->

          <ion-label :style="{ color: theme.primaryColor }"
            ><strong>Change Schedule To*</strong></ion-label
          >

          <ion-card class="workshift-select-container neomorphic-input-2">
            <ion-select
              placeholder="Select Work Shift"
              v-model="selectedSchedule"
              class="workshift-select"
              aria-label="Work Shift"
              @ionChange="
                this.fetchWorkShiftOptions(
                  selectedSchedule.regularWorkHourStart,
                  selectedSchedule.regularWorkHourEnd
                )
              "
            >
              <!-- Options for Work Shift -->
              <div slot="label">Select work-shift:</div>
              <ion-select-option
                v-for="option in scheduleOptions"
                :key="option.id"
                :value="option"
              >
                {{ option.workShiftCode }} - {{ option.scheduleDate }}
              </ion-select-option>
            </ion-select>
          </ion-card>
        </ion-card>
      </div>

      <!-- Regular work hr start and end -->
      <div class="flex-center regular-work-container">
        <ion-card class="ion-margin-bottom neomorphic-card-1 regular-work-card">
          <div class="ion-margin-bottom sched-container">
            <ion-label :style="{ color: theme.primaryColor }">
              <strong>Regular Work Hour Start:</strong>
            </ion-label>
            <p class="ion-text-center sched-val neomorphic-input-2">
              {{ this.regularWorkHourStart }}
            </p>
          </div>

          <div class="ion-margin-bottom sched-container">
            <ion-label :style="{ color: theme.primaryColor }">
              <strong>Regular Work Hour End:</strong>
            </ion-label>
            <p class="ion-text-center sched-val neomorphic-input-2">
              {{ this.regularWorkHourEnd }}
            </p>
          </div>
        </ion-card>
      </div>

      <!-- Reason Dropdown -->
      <div class="option-container">
        <ion-card class="ion-margin-bottom reason-card neomorphic-card-1">
          <ion-label :style="{ color: theme.primaryColor }">
            <strong>Reason*</strong>
          </ion-label>

          <ion-card class="reason-select-container neomorphic-input-2">
            <ion-select
              placeholder="Select Reason"
              v-model="selectedReason"
              class="reason-select"
              aria-label="Reason"
            >
              <div slot="label">Select Reason:</div>
              <ion-select-option
                v-for="option in reasonOptions"
                :key="option.value"
                :value="option"
              >
                {{ option.content }}
              </ion-select-option>
            </ion-select>
          </ion-card>
        </ion-card>
      </div>

      <!-- Save Button -->
      <ion-button
        expand="full"
        color="none"
        @click="saveCorrection"
        class="save-btn neomorphic-btn-1"
        :style="{ backgroundColor: theme.primaryColor }"
      >
        Save
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonContent,
  IonCol,
  IonGrid,
  IonCard,
  IonRow,
  IonCardContent,
} from "@ionic/vue";
import { defineComponent } from "vue";
import Refresher from "@/components/refresher/Refresher.vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import axios from "axios";
import { GlobalConstants } from "@/config/constants";
import { mapState } from "vuex";

import { toastController } from "@ionic/vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default defineComponent({
  components: {
    IonPage,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonButton,
    IonContent,
    HeaderReturn,
    Refresher,
    IonCol,
    IonGrid,
    IonCard,
    IonRow,
    IonCardContent,
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
      selectedWorkShift: [],
      scheduleIn: "8:00 AM",
      scheduleOut: "5:00 PM",
      actualIn: null,
      actualOut: null,
      selectedReason: null,
      comment: "",
      loading: true,
      storedToken: null,
      requestNumber: null,
      workShiftOptions: [],
      reasonOptions: [],
      idVal: null,
      changeDateFrom: null,
      changeDateTo: null,
      workShift: "",
      workShiftCode: "",
      selectedSchedule: null,
      scheduleOptions: [],
      regularWorkHourStart: "",
      regularWorkHourEnd: "",
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

    async fetchDataById(changeDateFrom, changeDateTo, workShift) {
      try {
        await this.checkTokenExpiration();
        const baseURL = localStorage.getItem("baseUrl");
        this.storedToken = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };
        const api =
          baseURL +
          `api/v1/employee/schedules?changeDateFrom=${changeDateFrom}&changeDateTo=${changeDateTo}`;
        const response = await axios.get(api, { headers });

        this.scheduleOptions = response.data.data.map((item) => ({
          id: item.id,
          workShiftCode: item.workShift.code,
          regularWorkHourStart: item.regularWorkHourStart,
          regularWorkHourEnd: item.regularWorkHourEnd,
          scheduleDate: new Date(item.scheduleDate.date).toLocaleDateString(
            "en-US",
            { timeZone: "Asia/Manila" }
          ),
        }));
      } catch (error) {
        console.error("Error fetching data by id:", error);
      }
    },

    async fetchWorkShiftOptions(regularWorkHourStart, regularWorkHourEnd) {
      try {
        await this.checkTokenExpiration();
        const baseURL = localStorage.getItem("baseUrl");
        this.storedToken = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };

        const api =
          baseURL +
          `api/v1/employee/schedules?changeDateFrom=${this.changeDateFrom}&changeDateTo=${this.changeDateTo}&changeWorkShiftFrom=${this.workShift}`;

        const response = await axios.get(api, { headers });

        this.regularWorkHourStart = regularWorkHourStart;
        this.regularWorkHourEnd = regularWorkHourEnd;
        console.log(this.workShift);
      } catch (error) {
        console.error("Error fetching work shift options:", error);
      }
    },

    async fetchReasonOptions() {
      try {
        await this.checkTokenExpiration();

        this.storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };

        const api =
          baseURL +
          `api/v2/reasons?limit=50&offset=0&sortField=r.id&sortOrder=DESC`;

        const response = await axios.get(api, { headers });

        this.reasonOptions = response.data.data
          .filter((item) => item.code == "schedule_adjustment")
          .map((item) => ({
            id: item.id,
            type: item.type,
            content: item.content,
          }));
      } catch (error) {
        console.error("Error fetching reason options:", error);
      }
    },

    async saveCorrection() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();
        const baseURL = localStorage.getItem("baseUrl");
        this.storedToken = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };

        const api = baseURL + `api/v1/schedule-adjustments`;

        const payload = {
          changeDateFrom: this.changeDateFrom,
          changeDateTo: this.changeDateTo,
          changeWorkShiftFrom: this.workShiftCode,
          changeWorkShiftTo: this.selectedSchedule.workShiftCode,
          reason: this.selectedReason.content,
        };

        const dataResponse = await axios.post(api, payload, { headers });
        const toast = await toastController.create({
          message: "Change DO Successfully Sent!",
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
        const toast = await toastController.create({
          message: error.message,
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
      } finally {
        this.store.commit("loader/updateLoader", false);
        this.$router.go(-1);
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

    generateRandomString(length) {
      return [...Array(length)]
        .map(() => Math.random().toString(36)[2])
        .join("");
    },

    requestNumberGenerator() {
      const randomString = this.generateRandomString(6);
      const currentDate = new Date();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const day = currentDate.getDate().toString().padStart(2, "0");
      const year = currentDate.getFullYear().toString().substr(2, 2);

      const formattedDate = `${month}${day}${year}`;
      this.requestNumber = randomString.toUpperCase() + formattedDate;
    },
  },
  created() {
    const idVal = this.$route.query.id;
    this.workShift = this.$route.query.workShift;
    this.changeDateFrom = this.$route.query.date;
    this.changeDateTo = this.$route.query.changeDateTo;
    this.workShiftCode = this.$route.query.workShiftCode;

    this.fetchTheme();
    this.fetchReasonOptions();
    this.requestNumberGenerator();
    this.fetchDataById(this.changeDateFrom, this.changeDateTo, this.workShift);
    this.loading = false;
  },
});
</script>

<style scoped>
.flex-center {
  display: flex;
  justify-content: center;
}
.input-card {
  padding: 10px 10px 0 10px;
  border-radius: 20px;
  width: fit-content;
}
.card-req {
  border-radius: 20px;
  margin: 20px auto;
  padding: 10px;
  min-width: 300px;
}
.save-btn {
  margin: 20px auto;
  width: 200px;
}

.sched-container {
  min-width: 150px;
  padding: 10px;
  width: fit-content;
  margin: 0;
  border-radius: 10px;
  text-align: center;
}
.sched-card {
  padding: 0;
  border-radius: 10px;
}
.sched-card ion-card-content {
  padding: 0 10px;
}

.workshift-container {
  margin-bottom: 20px;
}
.work-shift {
  padding: 10px;
  margin: 0;
}
.workshift-select-container {
  padding: 0 10px;
  margin: 5px 0;
  border-radius: 10px;
}
.workshift-select {
  width: fit-content;
  min-width: 100px;
}
.option-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 10px auto 20px auto;
}
.time-container-schedule {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 10px auto;
}
.actual-container {
  padding: 10px;
  width: fit-content;
  margin: 0;
  border-radius: 10px;
}
.actual-input-container {
  width: fit-content;
  padding: 0;
  margin: 0;
  padding: 7px;
}
.actual-input {
  width: fit-content;
  border: none;
  padding: 5px 10px;
}

.reason-card {
  padding: 10px;
  width: fit-content;
  min-width: 270px;
  max-width: 300px;
  margin: 0;
  border-radius: 10px;
}
.reason-select-container {
  padding: 0 10px;
  margin: 5px 0;
  width: fit-content;
  min-width: 150px;
  border-radius: 10px;
}
.reason-select {
  width: fit-content;
  max-width: 250px;
}
.comment {
  padding: 5px;
  border-radius: 10px;
  margin: 20px auto;
  width: fit-content;
}
.sched-val {
  color: gray;
  height: 20px;
}
.ref-code {
  margin: 10px auto 0 auto;
  border-bottom: 2px solid rgb(171, 171, 171);
  width: 60%;
}
.regular-work-card {
  display: flex;
  justify-content: center;
}
</style>
