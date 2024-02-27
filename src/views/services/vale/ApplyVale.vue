<template>
  <ion-page>
    <HeaderReturn
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    />
    <ion-content :fullscreen="true">
      <Refresher />

      <ion-card
        class="card loan-budget-container"
        v-if="!loading"
        :style="{ backgroundColor: theme.primaryColor }"
      >
        <div class="loanbalance-container">
          <div class="loan-budget-val">
            <p :style="{ color: theme.primaryFontColor }">PHP</p>
            <h4 :style="{ color: theme.primaryFontColor }">
              {{ loanDataResult.balance }}
            </h4>
          </div>
          <div class="loan-budget-text">
            <p :style="{ color: theme.primaryFontColor }">
              Available Loan Balance
            </p>
          </div>
        </div>
      </ion-card>

      <div v-if="!loading">
        <ion-card
          class="card card-details"
          :style="{ backgroundColor: theme.primaryColor }"
        >
          <h4 class="card-title" :style="{ color: theme.primaryFontColor }">
            Details
          </h4>
          <div class="card-inner">
            <ion-col size="6">
              <ion-row>
                <ion-col size="6">
                  <p>Creditable years of Service:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ valeDataResult.creditableService }} years</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Rule/Year of Service:</p>
                </ion-col>
                <ion-col size="6">
                  <p>Php {{ valeDataResult.rulePerYearOfService }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Carry over interest:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ valeDataResult.carryOverInterest }}%</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Percentage (%):</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ valeDataResult.loanInterest }}%</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Amount of Approval:</p>
                </ion-col>
                <ion-col size="6">
                  <div
                    :class="{
                      'amountApproval-input': true,
                      'invalid-input': invalidAmount,
                    }"
                  >
                    <ion-input
                      v-model="approvalAmount"
                      placeholder="Enter amount"
                      @ionChange="updateTotalLoan()"
                    ></ion-input>
                  </div>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Previous Balance:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ formatWithCommas(valeDataResult.previousBalance) }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Total Loan:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ formatWithCommas(totalLoan) }}</p>
                </ion-col>
              </ion-row>

              <ion-col size="6">
                <ion-label>Reasons*:</ion-label>
              </ion-col>

              <ion-col class="reason-container">
                <ion-card class="reason-card">
                  <ion-textarea
                    v-model="reason"
                    placeholder="Enter your reason here..."
                  ></ion-textarea>
                </ion-card>
              </ion-col>
            </ion-col>
          </div>
          <ion-button
            expand="full"
            color="none"
            class="apply-btn"
            :style="{ backgroundColor: theme.secondaryColor }"
            @click="applyVale"
          >
            Apply Loan
          </ion-button>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonContent,
  IonIcon,
  IonFooter,
  IonToolbar,
  IonTitle,
  IonButton,
  IonCard,
  IonRow,
  IonCol,
  IonGrid,
  IonLabel,
  toastController,
  IonTextarea,
  IonInput,
} from "@ionic/vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import { getThemeData } from "@/theme/theme";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { GlobalConstants } from "@/config/constants";
import { mapState } from "vuex";
import Refresher from "@/components/refresher/Refresher.vue";

const baseURL = GlobalConstants.HOST_URL;
const empNumber = GlobalConstants.EMPLOYEE_ID;

export default {
  components: {
    IonPage,
    HeaderReturn,
    IonContent,
    IonButton,
    IonCard,
    IonRow,
    IonCol,
    IonGrid,
    IonLabel,
    toastController,
    IonTextarea,
    IonInput,
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
      empNumber: "",
      headerTitle: "Apply Vale",
      theme: {},
      loading: false,
      selfChecked: false,
      motherChecked: false,
      fatherChecked: false,
      spouseChecked: false,
      childChecked: false,
      siblingsChecked: false,
      reason: "",
      approvalAmount: "",
      valeDataResult: {
        creditableService: "",
        rulePerYearOfService: "",
        carryOverInterest: "",
        loanInterest: "",
        amortizationValue: "",
        previousBalance: "",
      },
      totalLoan: 0,
      loanDataResult: {
        budget: 0,
        balance: 0,
      },
      invalidAmount: false,
    };
  },
  methods: {
    formatWithCommas(value) {
      if (typeof value === "number") {
        const parts = value.toFixed(2).toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
      } else {
        return "0.00";
      }
    },
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
      const storedThemeData = localStorage.getItem("themeData");

      const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};

      this.theme = themeData;
    },
    async applyVale() {
      try {
        this.updateTotalLoan();
        if (!this.invalidAmount) {
          this.storedToken = localStorage.getItem("token");

          const headers = {
            Authorization: `Bearer ${this.storedToken}`,
          };

          const api = baseURL + `api/payroll/vale`;

          const currentDate = new Date().toISOString().split("T")[0];

          const payload = {
            empNumber: this.empNumber,
            loanAmount: this.approvalAmount,
            loanDate: currentDate,
            reason: this.reason,
          };

          const dataResponse = await axios.post(api, payload, { headers });

          await new Promise((resolve) => {
            this.$router.go(-1);
            setTimeout(resolve, 1000);
          });
          let id = dataResponse.data.data.id;

          this.$router.push({ path: "/viewvale", query: { id } });
        }
      } catch (error) {
        if (!this.invalidAmount) {
          this.showErrorMessage(error.response?.data?.error?.message);
        }
      } finally {
        this.showAlertMessage("Vale Applied Successfully!");
        this.store.commit("loader/updateLoader", false);
      }
    },
    async fetchLoanBudget() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();

        this.storedToken = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };

        const api = baseURL + `api/v2/ess/loan-budget/${this.empNumber}`;

        const dataResponse = await axios.get(api, { headers });

        this.loanDataResult = {
          id: dataResponse.data.data.id,
          employee: dataResponse.data.data.employee,
          budget: parseFloat(dataResponse.data.data.budget).toLocaleString(),
          balance: parseFloat(dataResponse.data.data.balance).toLocaleString(),
          year: dataResponse.data.data.year,
        };
      } catch (error) {
        this.showErrorMessage(error.message);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },
    async fetchValeDetails() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();

        this.storedToken = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };
        const api = baseURL + `api/v2/ess/apply/vale-details`;

        const dataResponse = await axios.get(api, { headers });

        this.valeDataResult = {
          creditableService: dataResponse.data.data.creditableService,
          rulePerYearOfService: dataResponse.data.data.rulePerYearOfService,
          carryOverInterest: dataResponse.data.data.carryOverInterest,
          loanInterest: dataResponse.data.data.loanInterest,
          amortizationValue: dataResponse.data.data.amortizationValue,
          previousBalance: dataResponse.data.data.previousBalance,
        };
      } catch (error) {
        this.showErrorMessage(error.message);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },
    async showAlertMessage(message) {
      try {
        const toast = await toastController.create({
          message: message,
          duration: 3000,
          position: "top",
          color: "success",
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
    updateTotalLoan() {
      const approvalAmount = parseInt(this.approvalAmount);
      const previousBalance = parseInt(this.valeDataResult.previousBalance);

      if (!isNaN(approvalAmount) && approvalAmount > 0) {
        const totalLoan = approvalAmount + previousBalance;
        this.totalLoan = isNaN(totalLoan) ? 0 : totalLoan;
        this.invalidAmount = false;
      } else {
        this.totalLoan = previousBalance;
        this.showErrorMessage("Invalid Amount for Approval");
        this.invalidAmount = true;
      }
    },
  },
  created() {
    this.empNumber = localStorage.getItem("empNumber");
    this.fetchTheme();
    this.fetchValeDetails();
    this.fetchLoanBudget();
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans");

p {
  margin: 5px;
}

.vh {
  height: 50vh;
}
.max-credit-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  margin-top: 10%;
}
.max-credit-container h4 {
  color: #010101;
  text-align: center;
  font-family: Open Sans;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.max-credit-container h1 {
  color: #d8c51a;
  text-align: center;
  font-family: Open Sans;
  font-size: 60px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin: 0;
}
.card {
  padding: 0 10px 0 10px;
  border-radius: 20px;
  /* box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
                    -8px -8px 16px rgba(255, 255, 255, 0.8), 
                    0px -4px 8px rgba(0, 0, 0, 0.05),
                    -8px -8px 16px rgba(0, 0, 0, 0.1); */
}

.apply-btn {
  padding: 0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
  height: 50px;
}
.checkbox-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  gap: 10px;
}
.card {
  border-radius: 10px;
  padding: 5px;
}
.card ion-textarea {
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
  height: 150px;
  width: 100%;
  padding: 0 10px;
}
.amountApproval-input {
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 0 10px;
}
.loan-budget-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 5px;
  text-align: center;
  min-width: 270px;
  width: fit-content;
  padding: 20px;
  margin: 5px auto 20px auto;
  border-radius: 10px 10px 50% 50%;
}
.loan-budget-val {
  display: flex;
  justify-content: center;
  align-items: center;
}
.loan-budget-val p {
  font-size: 12px;
  margin: 0 5px 0 0;
}
.loan-budget-text p {
  font-size: 16px;
}

.loan-budget-container h4 {
  margin: 0;
  font-size: 35px;
}

.line_bottom {
  border: 1px solid rgb(139, 139, 139);
  width: 80%;
}
.card-details {
  border-radius: 20px;
  padding: 10px;
}
.card-inner {
  margin: 10px 5px 20px 5px;
  background-color: #fff;
  border-radius: 10px;
}
.card-title {
  margin: 0;
  text-align: center;
}
.loanbalance-container {
  padding: 5px 10px;
  border-radius: 10px;
  overflow: hidden;
}
.loan-budget-text p {
  margin: 0;
}

.invalid-input {
  border: 1px solid red;
}
</style>
