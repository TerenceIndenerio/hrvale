<template>
  <ion-page>
    <HeaderReturn
      :headerTitle="headerTitle"
      router-direction="none"
    ></HeaderReturn>
    <ion-content :fullscreen="true">
      <Refresher />

      <div v-if="showComponent">
        <ion-card class="result-container">
          <ion-button
            fill="clear"
            class="leave-entitlement-btn"
            color="medium"
            @click="navigateToLeaveEntitlement($event)"
          >
            <ion-icon name="calendar-outline"></ion-icon>
            Leave Entitlement
          </ion-button>

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
        </ion-card>

        <div class="flex-center btn-bottom">
          <ion-button class="btn" @click="navigateToApplyLeave"
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
import HeaderReturnWCard from "@/components/header/HeaderReturnWCard.vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import LeaveDashboardCard from "@/views/services/leave/components/LeaveDashboardCard.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import Button from "@/components/buttons/Button.vue";
import { useRouter } from "vue-router";
import { defineComponent } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import { GlobalConstants } from "@/config/constants";

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
    HeaderReturnWCard,
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

        this.store.commit("loader/updateLoader", false);
      }
    } catch (error) {
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
  margin-bottom: 10vh;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.result-container {
  margin: 20px auto 0 auto;
  max-width: 370px;
  border-radius: 20px;
  padding: 20px 0;
  height: 60vh;
  overflow-y: scroll;
  border: 5px solid rgba(220, 220, 220, 0.581);
  box-shadow: inset 10px 10px 15px #d9dade, inset -10px -10px 15px #ffffff,
    9.91px 9.91px 15px #d9dade, -9.91px -9.91px 15px #ffffff;
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
  display: flex;
  align-items: center;
  width: fit-content;
  margin: 0 auto 20px auto;
  justify-content: center;
  border: 3px solid #9b9b9b;
  border-radius: 10px;
}
</style>
