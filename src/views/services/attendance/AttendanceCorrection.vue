<template>
  <ion-page>
    <HeaderReturn
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    />
    <ion-content :fullscreen="true" v-if="!loading">
      <Refresher />
      <ion-card class="neomorphic-card-1 search-container">
        <h5 :style="{ color: theme.primaryColor }" class="search-title">
          Select Date
        </h5>
        <div class="input-container">
          <div class="container-inner">
            <p :style="{ color: theme.primaryColor }" class="label">From</p>
            <div class="select-option neomorphic-input-2">
              <ion-input type="date" v-model="startDate" class="date-input" />
            </div>
          </div>

          <div class="container-inner">
            <p :style="{ color: theme.primaryColor }" class="label">To</p>
            <div class="select-option neomorphic-input-2">
              <ion-input type="date" v-model="endDate" class="date-input" />
            </div>
          </div>
        </div>

        <ion-button
          expand="full"
          class="pos-right search-btn-container neomorphic-btn-2"
          color="none"
          :style="{ backgroundColor: theme.primaryColor }"
          @click="fetchData"
        >
          Search
        </ion-button>
      </ion-card>

      <div class="result-container">
        <ion-card
          class="neomorphic-card-1 card-container"
          v-for="(result, index) in results"
          :key="index"
        >
          <div
            class="header-outline"
            :style="{ backgroundColor: theme.primaryColor }"
          >
            <p class="header-label">{{ result.day }} - {{ result.date }}</p>
          </div>

          <ion-grid v-if="hasSearched">
            <div class="card-content">
              <ion-row class="data-container">
                <ion-col size="6">
                  <p>Actual In:</p>
                </ion-col>
                <ion-col size="6">
                  <p>
                    <strong>{{ result.actualIn }}</strong>
                  </p>
                </ion-col>
              </ion-row>

              <ion-row class="data-container">
                <ion-col size="6">
                  <p>Actual Out:</p>
                </ion-col>
                <ion-col size="6">
                  <p>
                    <strong>{{ result.actualOut }}</strong>
                  </p>
                </ion-col>
              </ion-row>
            </div>
          </ion-grid>

          <!-- Default -->
          <ion-grid v-if="!hasSearched">
            <div class="card-content">
              <ion-row class="data-container">
                <ion-col size="6">
                  <p>Applied Date:</p>
                </ion-col>
                <ion-col size="6">
                  <p>
                    <strong>{{ result.appliedDate.split(" ")[0] }}</strong>
                  </p>
                </ion-col>
              </ion-row>

              <ion-row class="data-container">
                <ion-col size="6">
                  <p>Previous Actual In:</p>
                </ion-col>
                <ion-col size="6">
                  <p>
                    <strong>{{ result.previousActualIn }}</strong>
                  </p>
                </ion-col>
              </ion-row>

              <ion-row class="data-container">
                <ion-col size="6">
                  <p>Actual In:</p>
                </ion-col>
                <ion-col size="6">
                  <p>
                    <strong>{{ result.actualIn }}</strong>
                  </p>
                </ion-col>
              </ion-row>

              <ion-row class="data-container">
                <ion-col size="6">
                  <p>Previous Actual Out:</p>
                </ion-col>
                <ion-col size="6">
                  <p>
                    <strong>{{ result.previousActualOut }}</strong>
                  </p>
                </ion-col>
              </ion-row>

              <ion-row class="data-container">
                <ion-col size="6">
                  <p>Actual Out:</p>
                </ion-col>
                <ion-col size="6">
                  <p>
                    <strong>{{ result.actualOut }}</strong>
                  </p>
                </ion-col>
              </ion-row>

              <ion-row class="data-container">
                <ion-col size="6">
                  <p>Status:</p>
                </ion-col>
                <ion-col size="6">
                  <p>
                    <strong>{{ result.status }}</strong>
                  </p>
                </ion-col>
              </ion-row>
            </div>
          </ion-grid>

          <ion-button
            expand="full"
            color="light"
            class="edit-btn neomorphic-btn-2"
            @click="navigateToEditPage(result.id, result.date)"
            v-if="hasSearched"
          >
            <ion-icon name="create-outline"></ion-icon> Edit
          </ion-button>
        </ion-card>
      </div>
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
  IonInput,
  IonIcon,
} from "@ionic/vue";
import Refresher from "@/components/refresher/Refresher.vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import { defineComponent } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { GlobalConstants } from "@/config/constants";
import { mapState } from "vuex";

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
    IonInput,
    IonIcon,
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
      onLoadResult: [],
      theme: {},
      loading: true,
      storedToken: null,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      empNumber: "",
      hasSearched: false,
      results2: [],
    };
  },
  created() {
    this.empNumber = localStorage.getItem("empNumber");
    this.fetchTheme();
    this.applyAttendanceCorrection();
    this.loading = false;
  },

  methods: {
    // Expiration of token
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

    fetchTheme() {
      try {
        const storedThemeData = localStorage.getItem("configs");

        const themeData = storedThemeData ? JSON.parse(storedThemeData) : [];

        let themeConfiguration = null;

        for (const data of themeData) {
          if (data.configuration && data.configuration.theme) {
            themeConfiguration = data.configuration.theme;
            break;
          }
        }

        if (themeConfiguration) {
          this.theme = themeConfiguration;
        } else {
          console.error(
            "No theme data found in local storage or theme configuration not available."
          );
        }
      } catch (error) {
        console.error("Error fetching or parsing theme data:", error);
      }
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
    async applyAttendanceCorrection() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();
        const baseURL = localStorage.getItem("baseUrl");

        this.storedToken = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };
        const api =
          baseURL +
          `api/v2/ess/apply-attendance-correction?empNumber=${this.empNumber}`;

        const dataResponse = await axios.get(api, { headers });

        if (dataResponse.data && Array.isArray(dataResponse.data.data)) {
          this.results = dataResponse.data.data.map((period) => ({
            date: period.date,
            day: period.day,
            previousActualIn: period.previousActualIn,
            previousActualOut: period.previousActualOut,
            appliedDate: period.appliedDate.date,
            fixedOt: period.fixedOt,
            fixedOtIn: period.fixedOtIn,
            fixedOtOut: period.fixedOtOut,
            actualIn: period.applyActualIn,
            actualOut: period.applyActualOut,
            status: period.status,
          }));
        }
      } catch (error) {
        console.error("Error fetching payroll period options: ", error);
        this.showErrorMessage("An error occurred: " + error.message);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    async fetchData() {
      try {
        this.hasSearched = true;
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();
        const baseURL = localStorage.getItem("baseUrl");
        this.storedToken = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };

        const api =
          baseURL +
          `api/v2/daily-logs?limit=50&offset=0&date=${this.startDate}&dateEnd=${this.endDate}`;
        const dataResponse = await axios.get(api, { headers });

        if (dataResponse.data && Array.isArray(dataResponse.data.data)) {
          this.results = dataResponse.data.data.map((period) => ({
            id: period.id,
            date: period.date,
            day: period.day,
            actualIn: period.actualIn,
            actualOut: period.actualOut,
          }));
        }
      } catch (error) {
        console.error("Error fetching payroll period options: ", error);
        this.showErrorMessage("An error occurred: " + error.message);

        const errorMessage =
          error.response.data.error.message || "Failed to load data";
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    async showErrorMessage(message) {
      try {
        const toast = await toastController.create({
          message: message,
          duration: 3000,
          position: "top",
          color: "light",
          buttons: [
            {
              icon: "close-outline",
              role: "cancel",
            },
          ],
        });
        await toast.present();
      } catch (error) {
        console.error("Error displaying toast:", error);
      }
    },
    navigateToEditPage(idVal, date) {
      this.$router.push({
        path: "/attendancecorrectionedit",
        query: {
          id: idVal,
          endDate: this.endDate,
          startDate: this.startDate,
          date: date,
        },
      });
      console.log(date);
    },
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
p {
  margin: 0;
}

.flex-h {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.text-center {
  text-align: center;
}
.card {
  padding: 0 10px 0 10px;
  border-radius: 20px;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8), 0px -4px 8px rgba(0, 0, 0, 0.05);
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
.card-content {
  padding: 0 0 0 20px;
  margin-top: 30px;
}
.card h5 {
  margin: 0;
}
.result-container {
  max-width: 350px;
  margin: 0 auto;
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
  border-radius: 20px;
  margin: 5px;
  width: fit-content;
}
.input-container {
  display: flex;
  flex-direction: row;
}
.header-row {
  border-bottom: 1px solid #000;
  margin-bottom: 20px;
}
.outlineColor {
  border-radius: 20px;
}
.pos-right {
  float: right;
  right: 10px;
}
.search-btn-container {
  height: 30px;
  width: 100px;
}
.edit-btn {
  width: 100%;
  height: 30px;
  margin: 0 auto 5px auto;
}
.result-text {
  margin: 15px;
}

.search-container {
  margin: 10px auto 20px auto;
  padding: 10px;
}

.search-title {
  font-family: "Inter";
  font-weight: bold;
  text-align: center;
  margin: 0 0 10px 0;
}

.label {
  font-family: "Inter";
  font-weight: bold;
}
.container-inner p {
  padding-left: 20px;
}
.card-container {
  width: 270px;
  margin: 10px auto;
}
.header-outline {
  border-radius: 20px 0 0 20px;
  position: absolute;
  right: 0;
  top: 0;
  padding: 10px;
  width: fit-content;
}
.header-label {
  color: #fff;
  font-size: 12px;
}
.data-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.date-input {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 120px;
}
</style>
