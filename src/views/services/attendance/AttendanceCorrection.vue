<template>
  <ion-page>
    <HeaderReturn
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    />
    <ion-content :fullscreen="true" v-if="!loading">
      <Refresher />
      <ion-card
        class="card text-center"
        :style="{ backgroundColor: theme.primaryColor }"
      >
        <h3 :style="{ color: theme.primaryFontColor }">Logs</h3>

        <ion-card class="select-option">
          <ion-input label="from:" type="date" v-model="startDate" />
        </ion-card>

        <ion-card class="select-option">
          <ion-input label="to:" type="date" v-model="endDate" />
        </ion-card>

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

      <ion-card
        class="card result-container"
        :style="{ backgroundColor: theme.primaryColor }"
      >
        <h4
          class="text-center outlineColor result-text"
          :style="{
            color: theme.primaryFontColor,
            border: `2px solid` + theme.primaryFontColor,
          }"
        >
          Result
        </h4>
        <ion-card
          class="card-inner"
          v-for="(result, index) in results"
          :key="index"
        >
          <ion-card-header>
            <ion-card-subtitle>
              {{ result.day }} - {{ result.date }}
            </ion-card-subtitle>
            <div>
              <p></p>
            </div>
          </ion-card-header>

          <ion-grid>
            <ion-col size="6">
              <ion-row>
                <ion-col size="6">
                  <p>Schedule In:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.scheduleIn }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Schedule Out:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.scheduleOut }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Fixed OT In:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.fixedOtIn }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Fixed OT Out:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.fixedOtOut }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Actual In:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.actualIn }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Actual Out:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.actualOut }}</p>
                </ion-col>
              </ion-row>
            </ion-col>
          </ion-grid>

          <ion-button
            expand="full"
            color="light"
            class="edit-btn"
            @click="navigateToEditPage(result.date)"
          >
            <ion-icon name="create-outline"></ion-icon> Edit
          </ion-button>
        </ion-card>
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
    };
  },
  created() {
    this.empNumber = localStorage.getItem("empNumber");
    this.getTheme();
    this.applyAttendanceCorrection();
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

        this.storedToken = localStorage.getItem("_token");

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
            scheduleIn: period.applyScheduleIn,
            scheduleOut: period.applyScheduleOut,
            day: period.day,
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
        this.store.commit("loader/updateLoader", true);
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
    navigateToEditPage(dateVal) {
      this.$router.push({
        path: "/attendancecorrectionedit",
        query: {
          date: dateVal,
        },
      });
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
.card ion-card-content {
  padding: 10px;
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
  min-width: 300px;
  border-radius: 20px;
  padding: 0 20px;
  margin: 5px;
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
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 10px;
}
.edit-btn {
  padding: 0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}
.result-text {
  margin: 15px;
}
</style>
