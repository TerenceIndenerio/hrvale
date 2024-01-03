<template>
  <ion-page>
    <HeaderReturn
      v-if="!loading"
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    ></HeaderReturn>
    <ion-content :fullscreen="true" v-if="!loading">
      <Refresher />
      <FullCalendar :options="options" />
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonButton,
  IonCard,
  IonItem,
  IonList,
  IonNote,
  IonCardContent,
  IonLabel,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import { IonDatetime } from "@ionic/vue";
import { defineComponent } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { GlobalConstants } from "@/config/constants";
import { getThemeData } from "@/theme/theme";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

const baseURL = GlobalConstants.HOST_URL;
const empNumber = GlobalConstants.EMPLOYEE_ID;

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonDatetime,
    HeaderReturn,
    IonButton,
    IonCard,
    Refresher,
    IonItem,
    IonList,
    IonNote,
    IonCardContent,
    IonLabel,
    IonCardHeader,
    IonCardTitle,
    FullCalendar,
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
      loading: true,
      theme: {},

      options: {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
        initialView: "dayGridMonth",
      },
      calendarEvents: [
        { title: "Event 1", start: "2023-01-01" },
        { title: "Event 2", start: "2023-01-02" },
      ],
    };
  },
  methods: {
    getTheme() {
      const storedThemeData = getThemeData();

      if (storedThemeData) {
        this.theme = storedThemeData;
      }
    },
  },
  async created() {
    this.getTheme();
    const currentMonth = new Date().getMonth() + 1;
    console.log("Component created");
    console.log("Calendar events:", this.calendarEvents);
    this.loading = false;
  },
});
</script>

<style scoped>
.fc-dayGridMonth-view .fc-day-header {
  background-color: #f2f2f2;
}

.fc-dayGridMonth-view .fc-day {
  border: 1px solid #ddd;
}
</style>
