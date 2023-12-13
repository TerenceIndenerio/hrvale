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
        <ion-card>
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
                <ion-select-option value="morning">Morning</ion-select-option>
                <ion-select-option value="afternoon">Afternoon</ion-select-option>
                <ion-select-option value="night">Rest Day (sunday)</ion-select-option>
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

                <ion-select-option value="late">Late Arrival</ion-select-option>
                <ion-select-option value="early">Early Departure</ion-select-option>
                <ion-select-option value="other">Other</ion-select-option>
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
            class="custom-textarea"
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
    };
  },
  methods: {
    saveCorrection() {
      console.log("Saving correction...");
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
  border-radius: 10px;
  width: fit-content;
}
.card {
  border-radius: 10px;
}
.save-btn {
  margin: 0;
}
.sched-card {
  padding: 0;
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
}
.reason-select-container {
  padding: 0 10px;
  margin: 5px 0;
  width: fit-content;
}
.reason-select {
  width: fit-content;
}
.comment {
  padding: 5px;
}
</style>
