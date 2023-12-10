<template>
  <ion-page>
    <HeaderReturn
      v-if="!loading"
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    ></HeaderReturn>
    <ion-content :fullscreen="true">
      <Refresher />
      <div v-if="showComponent">
        <ion-card class="card-round">
          <div class="flex-c">
            <p class="username-text">
              <strong>{{ employeeName }}</strong>
            </p>
          </div>
          <div class="flex-h">
            <p class="leave-text">Leave Request for:</p>
            <p class="leave-text-val">
              <strong>{{ leaveReqFor }}</strong>
            </p>
          </div>
        </ion-card>

        <div v-for="(cardData, index) in requests" :key="index">
          <LeaveRequestCard
            :dateText="cardData.date"
            :leaveType="cardData.leaveType"
            :leaveBalance="cardData.leaveBalance"
            :duration="cardData.duration"
            :status="cardData.status"
            :comment="cardData.comment"
            :outlineColor="cardData.outlineColor"
          />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonText,
  IonContent,
  IonCard,
  IonIcon,
} from "@ionic/vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import LeaveRequestCard from "@/views/services/leave/components/LeaveRequestCard.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import { defineComponent } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import { GlobalConstants } from "@/config/constants";
import { getThemeData } from "@/theme/theme";

const baseURL = GlobalConstants.HOST_URL;

export default defineComponent({
  name: "Leave Requests",
  components: {
    IonPage,
    IonHeader,
    IonContent,
    IonText,
    IonCard,
    IonIcon,
    HeaderReturn,
    LeaveRequestCard,
    Refresher,
  },
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    return {
      cardId: 0,
      api: "",
      showComponent: false,
      requests: [],
      headerTitle: "Leave Requests",
      data: [],
      employeeName: "",
      leaveReqFor: "",
      theme: {},
      loading: true,
      cardData: {
        date: "",
        employeeName: "",
        leaveType: "",
        dateText: "",
        leaveBalance: "",
        duration: "",
        status: "",
        comment: "",
        outlineColor: "",
      },
    };
  },
  methods: {
    async fetchData() {
      try {
        this.store.commit("loader/updateLoader", true);

        const storedToken = localStorage.getItem("_token");

        if (!storedToken) {
          console.log("Token is missing. Redirecting to login...");
          this.router.push("/login");
          return;
        }

        const _cardId = this.cardId;

        const api = `${baseURL}api/v2/leave/leave-requests/${_cardId}/leaves?limit=50&offset=0`;
        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const dataResponse = await axios.get(api, { headers });

        return dataResponse.data;
      } catch (error) {
        console.error(error);
        return null;
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
  async created() {
    this.getTheme();
    this.cardId = this.$route.query.cardId;
    const data = await this.fetchData();
    setTimeout(() => {
      this.showComponent = true;
    }, 1000);

    for (const leaveData of data.data) {
      const cardData = {
        date: `${leaveData.dates.fromDate}`,
        employeeName: `${data.meta.employee.firstName} ${
          data.meta.employee.middleName || ""
        } ${data.meta.employee.lastName}`,
        leaveType: leaveData.leaveType.name,
        leaveBalance: leaveData.leaveBalance.balance.balance.toString(),
        duration: leaveData.lengthHours.toString(),
        status: leaveData.leaveStatus.name,
        comment: leaveData.lastComment,
        outlineColor:
          leaveData.leaveType.name === "Vacation Leave"
            ? "border: 1px solid #27AE60; color: #27AE60;"
            : "border: 1px solid #2F80ED; color: #2F80ED;",
      };
      this.requests.push(cardData);
      this.employeeName = `${data.meta.employee.firstName} ${
        data.meta.employee.middleName || ""
      } ${data.meta.employee.lastName}`;
      this.leaveReqFor = `${data.data[0].dates.fromDate} - ${leaveData.dates.fromDate} `;
    }

    this.store.commit("loader/updateLoader", false);
    this.loading = false;
  },
});
</script>

<style scoped>
p {
  padding: 0;
  margin: 0;
}
ion-card {
  padding: 10px 20px;
}
.flex-h {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 10px 0;
  padding: 0;
}
.flex-c {
  display: flex;
  justify-content: center;
}
.employee-icon {
  font-size: 30px;
  color: black;
}
.card-round {
  border-radius: 20px;
  width: fit-content;
  margin: 10px auto;
}
.username-text,
.leave-text {
  color: #000;
  font-family: Open Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.leave-text-val {
  margin-left: 0px;
}
</style>
