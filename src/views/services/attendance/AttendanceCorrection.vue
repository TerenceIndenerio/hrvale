<template>
  <ion-page>
    <HeaderReturn :headerTitle="headerTitle" />
    <ion-content :fullscreen="true">
      <Refresher />
      <ion-card class="card text-center">
        <h3>Attendance Correction</h3>

        <ion-select
          label="Select Payroll Period"
          label-placement="floating"
          class="box-container select-option"
          @ionChange="handlePayrollPeriodChange"
        >
          <ion-select-option
            v-for="option in payrollPeriodOption"
            :key="option.value"
            :value="option.value"
            class="non-center"
          >
            {{ option.label }}
          </ion-select-option>
        </ion-select>
      </ion-card>

      <ion-card class="card">
        <h4 class="text-center outlineColor">Result</h4>
        <div v-for="(result, index) in results" :key="index">
          <AttendanceCard
            :userDate="result.userDate"
            :punchIn="result.punchIn"
            :punchOut="result.punchOut"
            :schedIn="result.timeIn"
            :schedOut="result.timeOut"
          />
        </div>
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
} from "@ionic/vue";
import Refresher from "@/components/refresher/Refresher.vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import AttendanceCard from "@/views/services/attendance/components/AttendanceCard.vue";
import { defineComponent } from "vue";
import axios from "axios";
import { GlobalConstants } from "@/config/constants";
import { mapState } from "vuex";

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
    AttendanceCard,
    IonToast,
    toastController,
  },
  data() {
    return {
      headerTitle: "Attendance",
      payrollPeriodOption: [],
      authToken: null,
      noResult: false,
      results: [],
    };
  },
  computed: {
    ...mapState("loader", ["loading"]),
  },
  created() {
    this.fetchAuthToken();
  },
  methods: {
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
    async fetchAuthToken() {
      try {
        const response = await axios.post(baseURL + "auth/token", {
          clientId: "test_id",
          clientSecret: "test_secret",
          userId: 1,
        });
        this.authToken = response.data.token;
        localStorage.setItem("_token", this.authToken);
        this.fetchPayrollPeriodOptions();
      } catch (error) {
        console.error("Error fetching authentication token: ", error);
        this.showErrorMessage("An error occurred: " + error.message);

        const errorMessage =
          error.response.data.error.message || "Failed to load data";
        const fullErrorMessage = `An error occurred: ${errorMessage}`;
        const toast = await toastController.create({
          message: fullErrorMessage,
          duration: 3000,
          position: "bottom",
          icon: "alert-circle-outline",
          buttons: [
            {
              icon: "close-outline",
              role: "cancel",
            },
          ],
        });
        await toast.present();
      }
    },
    async fetchPayrollPeriodOptions() {
      try {
        if (!this.authToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${this.authToken}`,
        };

        const api = baseURL + "api/payroll/maintenance/payroll-period";
        const dataResponse = await axios.get(api, { headers });

        if (dataResponse.data && Array.isArray(dataResponse.data.data)) {
          this.payrollPeriodOption = dataResponse.data.data.map((period) => ({
            value: period.PayrollPeriodId,
            startDate: period.rawPayrollperiodFrom,
            endDate: period.rawPayrollperiodTo,
            label: `${period.PayrollPeriodFrom} - ${period.payrollperiodTo}`,
          }));
        }
      } catch (error) {
        console.error("Error fetching payroll period options: ", error);
        this.showErrorMessage("An error occurred: " + error.message);

        const errorMessage =
          error.response.data.error.message || "Failed to load data";
        const fullErrorMessage = `Failed to load data, ${errorMessage}`;
        const toast = await toastController.create({
          message: fullErrorMessage,
          duration: 3000,
          position: "bottom",
          icon: "alert-circle-outline",
          buttons: [
            {
              icon: "close-outline",
              role: "cancel",
            },
          ],
        });
        await toast.present();
      }
    },
    handlePayrollPeriodChange(event) {
      const selectedValue = event.detail.value;
      const selectedPeriod = this.payrollPeriodOption.find(
        (option) => option.value === selectedValue
      );

      if (selectedPeriod) {
        const apiUrl =
          baseURL +
          `api/v2/attendance/employees/1/records?date=${selectedPeriod.startDate}&endDate=${selectedPeriod.endDate}`;

        this.makeApiRequest(apiUrl);
      } else {
        this.noResult = true;
      }
    },
    async makeApiRequest(apiUrl) {
      try {
        if (!this.authToken) {
          throw new Error("Authentication token is missing.");
        }
        this.$store.commit("loader/updateLoader", true);
        const headers = {
          Authorization: `Bearer ${this.authToken}`,
        };

        const response = await axios.get(apiUrl, { headers });

        this.results = response.data.data.map((record) => {
          return {
            id: record.id,
            userDate: record.punchIn.userDate,
            punchIn: record.punchIn.userTime,
            punchOut: record.punchOut.userTime,
            timeIn: record.schedule.timeIn,
            timeOut: record.schedule.timeOut,
          };
        });

        const toast = await toastController.create({
          message: "Successfully Loaded!",
          duration: 3000,
          position: "bottom",
          icon: "alert-circle-outline",
          buttons: [
            {
              icon: "close-outline",
              role: "cancel",
            },
          ],
        });

        await toast.present();

        console.log("found: ", this.results);
        this.$store.commit("loader/updateLoader", false);
      } catch (error) {
        console.error("Error making the API request: ", error);
        this.showErrorMessage("An error occurred: " + error.message);
        this.results = [];
        this.noResult = true;
        this.$store.commit("loader/updateLoader", false);

        const errorMessage =
          error.response.data.error.message || "Failed to load data";
        const fullErrorMessage = `Failed to load data, ${errorMessage}`;
        const toast = await toastController.create({
          message: fullErrorMessage,
          duration: 3000,
          position: "bottom",
          icon: "alert-circle-outline",
          buttons: [
            {
              icon: "close-outline",
              role: "cancel",
            },
          ],
        });
        await toast.present();
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
  padding: 0 10px 20px 10px;
  border-radius: 20px;
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
  background-color: rgba(128, 128, 128, 0.184);
  border-radius: 10px;
  padding: 0 10px;
  margin: auto;
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
</style>
