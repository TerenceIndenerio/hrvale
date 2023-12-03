<template>
  <ion-page>
    <HeaderReturn
      v-if="!loading"
      :headerTitle="headerTitle"
      router-direction="none"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    ></HeaderReturn>
    <ion-content :fullscreen="true">
      <Refresher />

      <div v-if="showComponent">
        <div class="result-container">
          <div class="le-btn-contianer">
            <ion-button
              class="leave-entitlement-btn"
              color="none"
              :style="{ backgroundColor: theme.secondaryColor }"
              @click="navigateToLeaveEntitlement($event)"
            >
              <ion-icon name="calendar-outline"></ion-icon>
              Leave Entitlement
            </ion-button>
          </div>

          <div v-for="item in requests" :key="item.id">
            <LeaveDashboardCard
              :cardTitle="item.leaveType.name"
              :appliedDuration="
                item.dates.fromDate + ' to ' + item.dates.toDate
              "
              :reason="item.lastComment ? item.lastComment.comment : ''"
              :typeOfLeave="item.leaveType.name"
              :status="item.leaveBreakdown[0].name"
              :colorBadge="getStatusColor(item.leaveBreakdown[0].name)"
              @view-details-clicked="navigateToLeaveRequests(item)"
            />
          </div>
          <div class="margin-bottom"></div>
        </div>

        <div class="flex-center btn-bottom">
          <ion-button
            class="btn"
            @click="navigateToApplyLeave"
            color="none"
            :style="{
              backgroundColor: theme.primaryColor,
              color: theme.primaryFontColor,
            }"
            >Apply Leave</ion-button
          >
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
  IonTitle,
  IonAlert,
  IonIcon,
  IonButton,
  IonCard,
} from "@ionic/vue";

import HeaderReturn from "@/components/header/HeaderReturn.vue";
import LeaveDashboardCard from "@/views/services/leave/components/LeaveDashboardCard.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import Button from "@/components/buttons/Button.vue";
import { useRouter } from "vue-router";
import { defineComponent } from "vue";
import { useStore } from "vuex";
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
    IonTitle,
    IonIcon,
    IonText,
    HeaderReturn,
    LeaveDashboardCard,
    IonButton,
    Refresher,
    IonCard,
  },
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    return {
      showComponent: false,
      leavesLength: 0,
      requests: [],
      headerTitle: "Leave Dashboard",
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
    };
  },
  methods: {
    async fetchData() {
      try {
        this.store.commit("loader/updateLoader", true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const response = await axios.post(baseURL + "auth/token", {
          clientId: "test_id",
          clientSecret: "test_secret",
          userId: 1,
        });
        const token = response.data.token;
        const api =
          baseURL +
          "api/v2/leave/leave-requests?limit=50&offset=0&includeEmployees=onlyCurrent";
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const dataResponse = await axios.get(api, { headers });

        return dataResponse.data;
      } catch (error) {
        console.error(error);
        return null;
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
    navigateToApplyLeave() {
      this.$router.push("/applyLeave");
    },
    navigateToLeaveEntitlement() {
      this.$router.push("/leaveEntitlement");
    },
    getStatusColor(status) {
      if (status === "Pending Approval") {
        return "warning";
      } else if (status === "Reject") {
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
  },

  async created() {
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
        this.getTheme();

        this.store.commit("loader/updateLoader", false);
        this.loading = false;
      }
    } catch (error) {
      this.loading = false;
      console.error(error);
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
  margin: 0 auto;
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
</style>
