<template>
  <ion-page>
    <HeaderReturn
      v-if="!loading"
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    />
    <ion-content>
      <ion-card class="card">
        <!-- Request Number -->
        <ion-card class="card">
          <p class="ion-text-center ion-margin-bottom">
            <strong>Request Number:</strong> {{ requestNumber }}
          </p>
        </ion-card>

        <!-- Work Shift -->
        <div class="flex-center">
          <ion-card class="ion-margin-bottom input-card work-shift">
            <ion-label><strong>Work Shift</strong></ion-label>
            <ion-card class="workshift-select-container">
              <ion-select
                placeholder="Select Work Shift"
                v-model="selectedWorkShift"
                class="workshift-select"
                aria-label="Work Shift"
              >
                <!-- Options for Work Shift -->
                <ion-select-option value="option_1">Option 1</ion-select-option>
                <ion-select-option value="option_2">Option 2</ion-select-option>
                <ion-select-option value="option_3">Option 3</ion-select-option>
              </ion-select>
            </ion-card>
          </ion-card>
        </div>

        <!-- Schedule In and Out -->
        <ion-card class="sched-card">
          <ion-card-content>
            <ion-grid>
              <ion-row>
                <!-- Left Column -->
                <ion-col size="6">
                  <p class="ion-margin-bottom"><strong>Schedule In:</strong></p>
                  <p class="ion-margin-bottom"><strong>Schedule Out:</strong></p>
                </ion-col>

                <!-- Right Column -->
                <ion-col size="6">
                  <p class="ion-text-center ion-margin-bottom">{{ scheduleIn }}</p>
                  <p class="ion-text-center ion-margin-bottom">{{ scheduleOut }}</p>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>

        <!-- Actual In and Out using input time -->
        <div class="time-container">
          <ion-card class="ion-margin-bottom actual-container">
            <ion-label><strong>Actual In:</strong></ion-label>
            <ion-card class="actual-input-container"
              ><input type="time" v-model="actualIn" class="actual-input"
            /></ion-card>
          </ion-card>

          <ion-card class="ion-margin-bottom actual-container">
            <ion-label><strong>Actual Out:</strong></ion-label>
            <ion-card class="actual-input-container"
              ><input type="time" v-model="actualOut" class="actual-input"
            /></ion-card>
          </ion-card>
        </div>

        <!-- Reason Dropdown -->
        <div class="flex-center">
          <ion-card class="ion-margin-bottom reason-card">
            <ion-label>Reason</ion-label>
            <ion-card class="reason-select-container">
              <ion-select
                placeholder="Select Reason"
                v-model="selectedReason"
                class="reason-select"
                aria-label="Reason"
              >
                <!-- Options for Reason -->

                <ion-select-option value="option_1">Option 1</ion-select-option>
                <ion-select-option value="option_2">Option 2</ion-select-option>
                <ion-select-option value="option_3">Option 3</ion-select-option>
              </ion-select>
            </ion-card>
          </ion-card>
        </div>

        <!-- Comment Textarea -->
        <ion-card class="ion-margin-bottom comment">
          <ion-label position="stacked"><strong>Comment:</strong></ion-label>
          <ion-textarea
            v-model="comment"
            rows="4"
            class="textarea"
            aria-label="Comment"
            placeholder="Enter your comment here..."
          ></ion-textarea>
        </ion-card>

        <!-- Save Button -->
        <ion-button
          expand="full"
          color="primary"
          @click="saveCorrection"
          class="save-btn"
        >
          Save
        </ion-button>
      </ion-card>
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
import { getThemeData } from "@/theme/theme";
import { toastController } from "@ionic/vue";

const baseURL = GlobalConstants.HOST_URL;

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
  data() {
    return {
      headerTitle: "Attendance",
      requestNumber: "ABC123",
      selectedWorkShift: null,
      scheduleIn: "8:00 AM",
      scheduleOut: "5:00 PM",
      actualIn: null,
      actualOut: null,
      selectedReason: null,
      comment: "",
      loading: true,
      storedToken: null,
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
    async saveCorrection() {
      try {
        await this.checkTokenExpiration();

        this.storedToken = localStorage.getItem("_token");

        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };

        const api = baseURL + `api/v2/ess/apply-attendance-correction`;

        const payload = {
          applyActualIn: "01:00",
          applyActualOut: "01:00",
          applyScheduleIn: "08:00",
          applyScheduleOut: "18:00",
          code: "S5",
          comment: this.comment,
          empNumber: 1,
          reason: "Testing APPLY CORRECTION",
          reasonId: 2,
          requestNo: "20231412-AC-3CGFD",
          status: "pending",
          workShiftId: 2,
        };

        const dataResponse = await axios.post(api, payload, { headers });
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
  created() {
    this.getTheme();
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
.card {
  border-radius: 20px;
}
.save-btn {
  margin: 0;
  height: 50px;
}
.sched-card {
  padding: 0;
  border-radius: 10px;
}
.sched-card ion-card-content {
  padding: 0 10px;
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
}
.time-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}
.actual-container {
  padding: 10px;
  width: fit-content;
  margin: 0;
  border-radius: 10px;
}
.actual-input-container {
  width: fit-content;
  padding: 5px;
  margin: 5px;
}
.actual-input {
  width: fit-content;
}

.reason-card {
  padding: 10px;
  width: fit-content;
  margin: 0;
  border-radius: 10px;
}
.reason-select-container {
  padding: 0 10px;
  margin: 5px 0;
  width: fit-content;
  border-radius: 10px;
}
.reason-select {
  width: fit-content;
}
.comment {
  padding: 5px;
  border-radius: 10px;
}
.textarea {
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 0 5px;
}
</style>
