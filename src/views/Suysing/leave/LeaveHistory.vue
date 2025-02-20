<template>
  <ion-page>
    <HeaderReturn
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    ></HeaderReturn>
    <ion-content :fullscreen="true">
      <Refresher />

      <div class="result-container">
        <div v-for="item in requests" :key="item.id">
          <LeaveDashboardCard
            :cardTitle="item.leaveType.name"
            :appliedDuration="item.dates.fromDate + ' to ' + item.dates.toDate"
            :reason="item.lastComment ? item.lastComment.comment : ''"
            :typeOfLeave="item.leaveType.name"
            :status="item.leaveBreakdown[0].name"
            :startDate="item.dates.fromDate"
            :endDate="item.dates.toDate"
            :colorBadge="getStatusColor(item.leaveBreakdown[0].name)"
            :primaryColor="theme.primaryColor"
            @view-details-clicked="navigateToLeaveRequests(item)"
            @retract-clicked="navigateToRetractLeave(item)"
          />
        </div>

        <ion-infinite-scroll threshold="100px" @ionInfinite="loadMoreData">
          <ion-infinite-scroll-content
            loading-spinner="bubbles"
            loading-text="Loading more data..."
          ></ion-infinite-scroll-content>
        </ion-infinite-scroll>

        <div class="margin-bottom"></div>
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
  IonTitle,
  IonIcon,
  IonButton,
  IonCard,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/vue";

import HeaderReturn from "@/components/header/HeaderReturn.vue";
import LeaveDashboardCard from "@/views/Suysing/leave/components/LeaveDashboardCard.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import Button from "@/components/buttons/Button.vue";
import { useRouter } from "vue-router";
import { defineComponent } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import { GlobalConstants } from "@/config/constants";
import { getThemeData } from "@/theme/theme";

export default defineComponent({
  name: "Leave Requests",
  components: {
    IonPage,
    IonHeader,
    IonContent,
    IonTitle,
    IonIcon,
    IonText,
    HeaderReturn,
    LeaveDashboardCard,
    IonButton,
    Refresher,
    IonCard,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  },
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    return {
      hasRecord: false,
      showComponent: false,
      leavesLength: 0,
      requests: [],
      headerTitle: "Leave History",
      timePeriod: "",
      userName: "",
      theme: {},
      loading: true,
      cardData: {
        date: "",
        employeeName: "",
        leaveType: "",
        dateText: "",
        leaveBalance: "",
        numberOfDays: "",
        status: "",
        comment: "",
        title: "",
        colorBadge: "",
      },
      offset: 0,
      limit: 10,
    };
  },
  methods: {
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

    async fetchData() {
      try {
        await this.checkTokenExpiration();
        const baseURL = localStorage.getItem("baseUrl");
        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
          console.log("Token is missing. Redirecting to login...");
          this.router.push("/login");
          return;
        }

        const isAllowRetracted = true;

        const api = `${baseURL}api/v2/leave/leave-requests?limit=${this.limit}&offset=${this.offset}&includeEmployees=onlyCurrent&isAllowRetracted=${isAllowRetracted}`;
        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const dataResponse = await axios.get(api, { headers });
        return dataResponse.data;
      } catch (error) {
        console.error(error);
      }
    },
    getTimeOfDay() {
      const currentTime = new Date().getHours();

      if (currentTime >= 5 && currentTime < 12) {
        return "Good Morning";
      } else if (currentTime >= 12 && currentTime < 17) {
        return "Good Afternoon";
      } else {
        return "Good Evening";
      }
    },
    navigateToLeaveRequests(item) {
      this.cardId = item.id;
      this.$router.push({
        path: "/leaveRequest",
        query: { cardId: this.cardId },
      });
    },
    navigateToRetractLeave(item) {
      this.cardId = item.id;
      this.$router.push({
        path: "/suysing_retractleave",
        query: { cardId: this.cardId },
      });
    },
    navigateToApplyLeave() {
      this.$router.push("/applyLeave");
    },
    navigateToLeaveEntitlement() {
      this.$router.push("/leaveEntitlement");
    },
    getStatusColor(status) {
      if (status === "Pending Approval") {
        return "warning";
      } else if (status === "Rejected") {
        return "danger";
      } else if (status === "Taken") {
        return "primary";
      } else {
        return "default";
      }
    },
    getTheme() {
      const storedThemeData = getThemeData();

      if (storedThemeData) {
        this.theme = storedThemeData;
      }
      this.theme = storedThemeData;
    },
    fetchTheme() {
      const storedThemeData = localStorage.getItem("themeData");

      const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};

      this.theme = themeData;
    },
    async loadMoreData(event) {
      this.offset += this.limit;

      const newData = await this.fetchData();

      if (newData && newData.data.length > 0) {
        this.requests = [...this.requests, ...newData.data];
      }

      event.target.complete();
    },
  },

  async created() {
    this.fetchTheme();

    try {
      this.store.commit("loader/updateLoader", true);
      const data = await this.fetchData();

      if (data && data.data.length > 0) {
        this.requests = data.data;
        this.showComponent = true;

        const leaveData = this.requests[0];
        this.cardData.employeeName = `${leaveData.employee.firstName} ${
          leaveData.employee.middleName || ""
        } ${leaveData.employee.lastName}`;
        this.cardData.leaveBalance = leaveData.leaveBalances[0].balance.balance;
        this.cardData.startDate = leaveData.leaveBalances[0].period.startDate;
        this.cardData.endDate = leaveData.leaveBalances[0].period.endDate;
      } else {
        this.hasRecord = false;
      }
    } catch (error) {
      this.loading = false;
      console.error(error);
    } finally {
      this.store.commit("loader/updateLoader", false);
      this.loading = false;
    }
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Inter");
.margin-top {
  margin-top: 50px;
}
.margin-bottom {
  margin-bottom: 5vh;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.result-container {
  margin: 10px auto 0 auto;
  max-width: 370px;
  padding-bottom: 100px;
}
.le-btn-contianer {
  width: 100%;
  display: flex;
  justify-content: center;
}
.btn {
  border-radius: 15px;
  width: fit-content;
  height: 50px;
  overflow: hidden;
  font-family: "Inter";
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  border: none;
  margin-bottom: 20px;
  --background: #12a3da;
}
.card-title {
  color: #3b3c3e;
  font-family: "Open Sans";
  font-size: 19px;
  font-style: normal;
  font-weight: bold;
  line-height: normal;
  margin-left: 10%;
}
.btn-bottom {
  position: fixed;
  bottom: 20px;
  width: 100%;
}
.leave-entitlement-btn {
  overflow: hidden;
  border-radius: 20px;
  width: 80%;
  height: 50px;
  margin: 10px 0;
}
.outline-container {
  margin: auto;
  /* border: 1px solid #828282; */
  padding: 10px 20px;
  color: #828282;
  border-radius: 20px;
  width: 70%;
  text-align: center;
}
.outline-container h4 {
  margin: 0;
}

.outlineColor {
  border: 1px solid #828282;
  color: #828282;
  border-radius: 20px;
  width: 90%;
}
.action-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px auto;
}
.action-btn {
  width: 100%;
  max-width: 300px;
  height: 120px;
  margin: 0 auto;
  border-radius: 10px;
}
.action-btn p {
  font-family: Poppins;
  font-size: 18px;
  font-weight: 700;
  line-height: 27px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  position: absolute;
  left: 0;
  top: 0;
}
.icon-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 20px;
  width: 30px;
  height: 30px;
}
</style>
