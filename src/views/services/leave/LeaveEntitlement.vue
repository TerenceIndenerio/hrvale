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
        <ion-card class="select-date-container card-round">
          <ion-select v-model="selectedApi">
            <div slot="label">Select Date:</div>
            <ion-select-option
              v-for="(option, index) in leavePeriodOptions"
              :key="index"
              :value="option.value"
            >
              {{ option.text }}
            </ion-select-option>
          </ion-select>
        </ion-card>

        <div v-for="(entitlement, index) in entitlements" :key="index">
          <LeaveEntitlementCard
            :leaveType="entitlement.leaveType"
            :entitlement="entitlement.entitlement"
            :validFrom="entitlement.validFrom"
            :validTo="entitlement.validTo"
            :days="entitlement.days"
          />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonCard,
  IonSelect,
  IonSelectOption,
  IonContent,
} from "@ionic/vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import LeaveEntitlementCard from "@/views/services/leave/components/LeaveEntitlementCard.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import { defineComponent, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import { GlobalConstants } from "@/config/constants";
import { getThemeData } from "@/theme/theme";

const baseURL = GlobalConstants.HOST_URL;

export default defineComponent({
  name: "LeaveEntitlements",
  components: {
    IonPage,
    IonCard,
    HeaderReturn,
    LeaveEntitlementCard,
    Refresher,
    IonSelect,
    IonSelectOption,
    IonContent,
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
      entitlements: [],
      headerTitle: "Leave Entitlements",
      selectedApi: null,
      leavePeriodOptions: [],
      theme: {},
      loading: true,
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
    async fetchLeavePeriods() {
      try {
        this.store.commit("loader/updateLoader", true);

        const storedToken = localStorage.getItem("_token");

        if (!storedToken) {
          console.log("Token is missing. Redirecting to login...");
          this.router.push("/login");
          return;
        }

        const currentLeavePeriodResponse = await axios.get(
          baseURL + "api/v2/leave/leave-periods",
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        const { startDate, endDate } =
          currentLeavePeriodResponse.data.meta.currentLeavePeriod;
        this.selectedApi = `${startDate} - ${endDate}`;

        await this.makeGetRequest(startDate, endDate, storedToken);

        const response = await axios.get(
          baseURL + "api/v2/leave/leave-periods",
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        const leavePeriods = response.data.data;
        this.leavePeriodOptions = leavePeriods.map((period, index) => ({
          value: `${period.startDate} - ${period.endDate}`,
          text: `${period.startDate} - ${period.endDate}`,
        }));
        this.showComponent = true;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.error(error);
      }
    },
    async makeGetRequest(fromDate, toDate) {
      try {
        this.store.commit("loader/updateLoader", true);

        const storedToken = localStorage.getItem("_token");

        if (!storedToken) {
          console.log("Token is missing. Redirecting to login...");
          this.router.push("/login");
          return;
        }

        const apiUrl =
          baseURL +
          `api/v2/leave/leave-entitlements?limit=50&offset=0&fromDate=${fromDate}&toDate=${toDate}`;

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const dataResponse = await axios.get(apiUrl, { headers });

        this.entitlements = dataResponse.data.data.map((entitlement) => {
          return {
            leaveType: entitlement.leaveType.name,
            entitlement: entitlement.entitlementType.name,
            validFrom: entitlement.fromDate,
            validTo: entitlement.toDate,
            days: entitlement.entitlement,
          };
        });

        this.store.commit("loader/updateLoader", false);
      } catch (error) {
        this.store.commit("loader/updateLoader", false);
        console.error(error);
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
  watch: {
    selectedApi(newVal) {
      const selectedOption = this.leavePeriodOptions.find(
        (option) => option.value === newVal
      );
      if (selectedOption) {
        const fromDate = selectedOption.text.split(" - ")[0];
        const toDate = selectedOption.text.split(" - ")[1];
        this.makeGetRequest(fromDate, toDate);
      }
    },
  },
  async mounted() {
    await this.fetchLeavePeriods();
    this.getTheme();
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
  width: 90%;
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
.select-date-container {
  height: fit-content;
  padding: 0 20px;
}
</style>
