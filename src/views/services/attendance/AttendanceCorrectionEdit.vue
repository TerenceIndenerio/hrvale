<template>
  <ion-page>
    <HeaderReturn
      v-if="!loading"
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    />
    <ion-content>
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

        <div class="time-container">
          <div class="ion-margin-bottom sched-container">
            <ion-label :style="{ color: theme.primaryColor }">
              <strong>Schedule In:</strong>
            </ion-label>
            <p class="ion-text-center sched-val neomorphic-input-2">
              {{ this.selectedWorkShift.regularWorkHourStart }}
            </p>
          </div>

          <div class="ion-margin-bottom sched-container">
            <ion-label :style="{ color: theme.primaryColor }">
              <strong>Schedule Out:</strong>
            </ion-label>
            <p class="ion-text-center sched-val neomorphic-input-2">
              {{ this.selectedWorkShift.regularWorkHourEnd }}
            </p>
          </div>
        </div>
      </ion-card>

      <!-- Sched In and Out -->

      <!-- Work Shift -->
      <div class="flex-center workshift-container">
        <ion-card
          class="ion-margin-bottom input-card work-shift neomorphic-card-1"
        >
          <ion-label :style="{ color: theme.primaryColor }"
            ><strong>Work Shift*</strong></ion-label
          >
          <ion-card class="workshift-select-container neomorphic-input-2">
            <ion-select
              placeholder="Select Work Shift"
              v-model="selectedWorkShift"
              class="workshift-select"
              aria-label="Work Shift"
            >
              <!-- Options for Work Shift -->
              <div slot="label">Select work-shift:</div>
              <ion-select-option
                v-for="option in workShiftOptions"
                :key="option.id"
                :value="option"
              >
                {{ option.code }}
              </ion-select-option>
            </ion-select>
          </ion-card>
        </ion-card>
      </div>

      <!-- Actual In and Out -->
      <div class="time-container">
        <ion-card class="ion-margin-bottom actual-container neomorphic-card-1">
          <ion-label :style="{ color: theme.primaryColor }"
            ><strong>Actual In*:</strong></ion-label
          >
          <div class="actual-input-container">
            <input
              type="time"
              v-model="actualIn"
              class="actual-input neomorphic-input-2"
            />
          </div>
        </ion-card>

        <ion-card class="ion-margin-bottom actual-container neomorphic-card-1">
          <ion-label :style="{ color: theme.primaryColor }"
            ><strong>Actual Out*:</strong></ion-label
          >
          <div class="actual-input-container">
            <input
              type="time"
              v-model="actualOut"
              class="actual-input neomorphic-input-2"
            />
          </div>
        </ion-card>
      </div>

      <!-- Reason Dropdown -->
      <div class="flex-center">
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

      <!-- Comment Textarea -->
      <div class="ion-margin-bottom comment">
        <ion-label position="stacked" :style="{ color: theme.primaryColor }"
          ><strong>Comment:</strong></ion-label
        >
        <ion-textarea
          v-model="comment"
          rows="4"
          class="neomorphic-textarea-1"
          aria-label="Comment"
          placeholder="Enter your comment here..."
        ></ion-textarea>
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
      headerTitle: "Attendance",
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
      dateVal: null,
    };
  },
  methods: {
    // Exppiration of token
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
    async fetchWorkShiftOptions() {
      try {
        await this.checkTokenExpiration();
        const baseURL = localStorage.getItem("baseUrl");
        this.storedToken = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };

        const api = baseURL + `api/v2/admin/work-shifts?limit=50&offset=0`;

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

        this.reasonOptions = response.data.data.map((item) => ({
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

        const api = baseURL + `api/v2/ess/apply-attendance-correction`;

        const payload = {
          applyActualIn: this.actualIn,
          applyActualOut: this.actualOut,
          applyScheduleIn: this.selectedWorkShift.regularWorkHourStart,
          applyScheduleOut: this.selectedWorkShift.regularWorkHourEnd,
          code: this.selectedWorkShift.code,
          comment: this.comment,
          empNumber: 1,
          reason: this.selectedReason.content,
          reasonId: this.selectedReason.id,
          requestNo: this.requestNumber,
          status: "pending",
          workShiftId: this.selectedWorkShift.id,
        };

        const dataResponse = await axios.post(api, payload, { headers });
        const toast = await toastController.create({
          message: "Attendance Correction Successfully Sent!",
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
          message: "An error occurred: " + error.message,
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
        console.log("Stored theme data:", storedThemeData);

        const themeData = storedThemeData ? JSON.parse(storedThemeData) : [];
        console.log("Parsed theme data:", themeData);

        if (themeData.length > 0) {
          const themeConfiguration = themeData[0]?.configuration?.theme;
          console.log("Theme configuration:", themeConfiguration);

          this.theme = themeConfiguration;
          console.log("Theme:", this.theme);
        } else {
          console.error("No theme data found in local storage.");
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
    this.fetchTheme();
    this.fetchWorkShiftOptions();
    this.fetchReasonOptions();
    this.dateVal = this.$route.query.date;
    this.requestNumberGenerator();
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
  padding: 0;
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
.time-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 10px auto 20px auto;
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
  min-width: 150px;
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
</style>
