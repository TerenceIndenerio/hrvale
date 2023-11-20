<template>
  <ion-page>
    <HeaderReturn
      v-if="!loading"
      :headerTitle="headerTitle"
      router-direction="none"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    ></HeaderReturn>
    <ion-content :fullscreen="true" v-if="!loading">
      <Refresher />

      <ion-card class="box-container">
        <h3>In: {{ regularWorkHourStart }}</h3>

        <h3>Out: {{ regularWorkHourEnd }}</h3>
      </ion-card>

      <div class="calendar-container" v-if="selectedMonth">
        <ion-datetime
          class="date border-style"
          presentation="date"
          display-timezone="false"
          v-model="selectedDate"
          :highlighted-dates="highlightedDates"
          readonly
        ></ion-datetime>
      </div>

      <div class="calendar-container">
        <ion-datetime
          class="calendar-select"
          presentation="date"
          display-timezone="false"
          display-day="false"
          v-model="selectedMonth"
          @ionChange="handleMonthChange"
          :prefer-wheel="true"
        ></ion-datetime>
      </div>
      <div class="hint">
        <p>Note: Please Select a date here.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonContent, IonButton, IonCard } from "@ionic/vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import { IonDatetime } from "@ionic/vue";
import { defineComponent } from "vue";
import axios from "axios";
import { GlobalConstants } from "@/config/constants";
import { getThemeData } from "@/theme/theme";

const baseURL = GlobalConstants.HOST_URL;

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonDatetime,
    HeaderReturn,
    IonButton,
    IonCard,
    Refresher,
  },
  data() {
    return {
      selectedMonth: new Date().toISOString(),
      selectedDate: new Date().toISOString(),
      headerTitle: "Schedule",
      buttonText: "Request Schedule",
      empNumber: 1,
      month: 0,
      scheduleData: [],
      regularWorkHourStart: "00:00",
      regularWorkHourEnd: "00:00",
      theme: {},
      loading: true,
    };
  },
  computed: {
    highlightedDates() {
      return this.scheduleData.map((entry) => ({
        date: entry.scheduleDate.date.split(" ")[0],
        backgroundColor: entry.workShift.scheduleColor,
      }));
    },
  },
  methods: {
    async requestData() {
      try {
        const authPayload = {
          clientId: "test_id",
          clientSecret: "test_secret",
          userId: 1,
        };
        const authResponse = await axios.post(baseURL + "auth/token", authPayload);
        const authToken = `Bearer ${authResponse.data.token}`;
        const currentMonth = new Date().getMonth() + 1;
        const apiUrl =
          baseURL +
          `api/v2/ess/employee-schedule?empNumber=${this.empNumber}&month=${this.month}`;
        const headers = {
          Authorization: authToken,
        };

        const response = await axios.get(apiUrl, { headers });

        this.scheduleData = response.data.data;

        const extractedData = this.scheduleData.map((entry) => ({
          regularWorkHourStart: entry.regularWorkHourStart,
          regularWorkHourEnd: entry.regularWorkHourEnd,
          scheduleColor: entry.workShift.scheduleColor,
          date: entry.scheduleDate.date.split(" ")[0],
        }));
      } catch (error) {
        console.error("Error:", error);
      }
    },
    handleMonthChange(event) {
      const selectedDate = new Date(event.detail.value);
      const datePart = new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];

      const day = selectedDate.getDate();
      const month = selectedDate.getMonth() + 1;
      const selectedMonth = event.detail.value;

      this.selectedDate = datePart;
      this.day = day;
      this.month = month;
      this.selectedMonth = selectedMonth;

      console.log(day);

      const selectedData = this.scheduleData.find(
        (entry) => entry.scheduleDate.date.split(" ")[0] === datePart
      );
      if (selectedData) {
        this.regularWorkHourStart = selectedData.regularWorkHourStart;
        this.regularWorkHourEnd = selectedData.regularWorkHourEnd;
      } else {
        this.regularWorkHourStart = "00:00";
        this.regularWorkHourEnd = "00:00";
      }
      this.requestData();
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
    this.getTheme();
    const data = await this.requestData();
    this.loading = false;
  },
});
</script>

<style scoped>
.calendar-container {
  margin: 10px auto;
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
}
.calendar-select {
  border-radius: 20px;
  height: 100px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 7px solid rgba(220, 220, 220, 0.581);
  box-shadow: inset -10px -10px 15px #ffffff, 9.91px 9.91px 15px #d9dade,
    -9.91px -9.91px 15px #ffffff;
}
.date {
  margin: auto;
  border-radius: 20px;
  height: fit-content;
  width: fit-content;
}
.border-style {
  border: 5px solid rgba(220, 220, 220, 0.581);
  box-shadow: inset 10px 10px 15px #d9dade, inset -10px -10px 15px #ffffff,
    9.91px 9.91px 15px #d9dade, -9.91px -9.91px 15px #ffffff;
}
.sched-container {
  text-align: center;
  border-radius: 30px;
  padding: 0;
}
.sched-container h2 {
  margin: 10px 0 0 0;
  font-weight: bold;
}
.sched-container h3 {
  margin: 0;
}
.box-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  align-items: center;
  flex-direction: row;
  height: fit-content;
  margin: 0 5%;
  border-radius: 20px;
  margin-top: 10px;
}
.box {
  min-width: 100px;
  width: 100%;
  max-width: 200px;
  height: fit-content;
  padding: 10px 20px;
  margin: 10px 0 0 0;
  border-radius: 10px;
  border: 3px solid rgba(220, 220, 220, 0.581);
  border-radius: 20px;
  overflow: hidden;
}
.hint {
  text-align: center;
}
.hint p {
  color: rgba(128, 128, 128, 0.695);
}
</style>
