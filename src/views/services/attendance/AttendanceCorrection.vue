<template>
  <ion-page>
    <HeaderReturn
      v-if="!loading"
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    />
    <ion-content :fullscreen="true" v-if="!loading">
      <Refresher />
      <ion-card class="card text-center">
        <h3>Logs</h3>

        <!-- Use input date for selecting payroll start date -->
        <input
          type="date"
          v-model="startDate"
          class="box-container select-option"
          @input="handleDateChange"
        />

        <!-- Use input date for selecting payroll end date -->
        <input
          type="date"
          v-model="endDate"
          class="box-container select-option"
          @input="handleDateChange"
        />
        <!-- Button for search -->
        <ion-button
          expand="full"
          class="pos-right search-btn-container"
          color="none"
          :style="{ backgroundColor: theme.secondaryColor }"
          @click="fetchData"
        >
          Search
        </ion-button>
      </ion-card>

      <ion-card class="card" v-for="(result, index) in results" :key="index">
        <ion-card-header>
          <ion-card-subtitle>{{ result.day }} - {{ result.date }}</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-col size="6">
                <!-- Adjust the size based on your preference -->
                <p>Schedule In:</p>
                <p>Schedule Out:</p>
                <p>Fixed OT In:</p>
                <p>Fixed OT Out:</p>
              </ion-col>
              <ion-col size="6">
                <!-- Display the corresponding values in the right column -->
                <p>{{ result.scheduleIn }}</p>
                <p>{{ result.scheduleOut }}</p>
                <p>{{ result.fixedOtIn }}</p>
                <p>{{ result.fixedOtOut }}</p>
              </ion-col>
            </ion-row>
          </ion-grid>

          <!-- Add a button below the grid -->
          <ion-button
            expand="full"
            color="light"
            class="edit-btn"
            router-link="/AttendanceCorrectionEdit"
          >
            Edit
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonCard,
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonRow,
  IonCol,
  IonToast,
  toastController,
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
} from "@ionic/vue";
import Refresher from "@/components/refresher/Refresher.vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import { defineComponent } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { GlobalConstants } from "@/config/constants";
import { mapState } from "vuex";
import { getThemeData } from "@/theme/theme";

const baseURL = GlobalConstants.HOST_URL;

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonCard,
    HeaderReturn,
    IonSelect,
    IonSelectOption,
    Refresher,
    IonGrid,
    IonRow,
    IonCol,
    IonToast,
    toastController,
    IonButton,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
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
      payrollPeriodOption: [],
      authToken: null,
      noResult: false,
      results: [],
      theme: {},
      loading: true,
      storedToken: null,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    };
  },
  created() {
    this.getTheme();
    this.loading = false;
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

    getTheme() {
      const storedThemeData = getThemeData();

      if (storedThemeData) {
        this.theme = storedThemeData;
      }
      this.theme = storedThemeData;
    },

    handleDateChange() {
      // Update the startDate and endDate based on the selectedPayrollDate
      const startDate = new Date(this.startDate).toISOString().split("T")[0];
      const endDate = new Date(this.endDate).toISOString().split("T")[0];

      // Now you can use startDate and endDate as needed
      console.log("Selected Start Date:", startDate);
      console.log("Selected End Date:", endDate);
    },

    showErrorMessage(message) {
      this.$ionic.toastController
        .create({
          message: message,
          duration: 3000,
          position: "bottom",
          color: "danger",
        })
        .then((toast) => {
          toast.present();
        });
    },

    async fetchData() {
      try {
        await this.checkTokenExpiration();

        this.storedToken = localStorage.getItem("_token");

        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };

        const api =
          baseURL +
          `api/v2/daily-logs?limit=50&offset=0&date=${this.startDate}&dateEnd=${this.endDate}`;
        const dataResponse = await axios.get(api, { headers });

        if (dataResponse.data && Array.isArray(dataResponse.data.data)) {
          this.results = dataResponse.data.data.map((period) => ({
            name: period.name,
            date: period.date,
            scheduleIn: period.scheduleIn,
            scheduleOut: period.scheduleOut,
            day: period.day,
            fixedOt: period.fixedOt,
            fixedOtIn: period.fixedOtIn,
            fixedOtOut: period.fixedOtOut,
          }));
        }
      } catch (error) {
        console.error("Error fetching payroll period options: ", error);
        this.showErrorMessage("An error occurred: " + error.message);

        const errorMessage = error.response.data.error.message || "Failed to load data";
      }
    },
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
.flex-h {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.text-center {
  text-align: center;
}
.card {
  padding: 0 10px 5px 10px;
  border-radius: 20px;
}
.card ion-card-header {
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.card ion-card-header ion-card-subtitle {
  border: 1px solid gray;
  padding: 10px 20px;
  border-radius: 20px;
  margin: 10px 0 0 0;
}
.card ion-card-content {
  padding: 10px;
}
.card h5 {
  margin: 0;
}
.payroll-container {
  width: fit-content;
  min-width: 305px;
  height: fit-content;
  flex-shrink: 0;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.5);
  margin: 0 auto;
  padding: 10px;
}
.wdays-text {
  color: #000;
  text-align: center;
  font-family: Open Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.box {
  width: 45px;
  height: 45px;
  border-radius: 10px;
  background: #6d2b84;
}
.wdays-num {
  color: #fff;
  text-align: center;
  font-family: Open Sans;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.select-option {
  width: fit-content;
  min-width: 300px;
  border-radius: 10px;
  padding: 10px 10px;
  margin: 5px;
}
.header-row {
  border-bottom: 1px solid #000;
  margin-bottom: 20px;
}
.outlineColor {
  border: 1px solid #828282;
  color: #828282;
  border-radius: 20px;
}
.pos-right {
  float: right;
  right: 10px;
}
.search-btn-container {
  overflow: hidden;
  border-radius: 20px;
  padding: 0 20px;
}
.edit-btn {
  padding: 0;
}
</style>
