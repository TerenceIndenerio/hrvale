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

      <!-- Loan Type -->
      <div class="flex-center">
        <ion-card class="loantype-card neomorphic-card-1">
          <p :style="{ color: theme.primaryColor }">
            <strong>Loan Type</strong>
          </p>

          <ion-card class="neomorphic-input-2">
            <ion-select
              v-model="selectedLoanType"
              class="reason-select"
              aria-label="LoanType"
              label="Select Loan Type"
              label-placement="floating"
              @ion-change="validate(selectedLoanType)"
            >
              <ion-select-option
                v-for="loanType in loanTypes"
                :key="loanType.id"
                :value="loanType.id"
              >
                {{ loanType.loanTypeName }}
              </ion-select-option>
            </ion-select>
          </ion-card>
        </ion-card>
      </div>

      <div class="recent-container">
        <h5 :style="{ color: theme.primaryColor }">Recent Transaction</h5>
        <ion-button
          expand="full"
          color="None"
          class="recent-btn neomorphic-btn-2"
          @click="navigateToRecent()"
          :style="{
            outline: `2px solid ${theme.primaryColor}`,
            color: theme.primaryColor,
          }"
        >
          View All
        </ion-button>
      </div>

      <div v-if="isElegible">
        <!-- Loan Date & Start of Payment -->
        <ion-card class="neomorphic-card-1 selectdate-card">
          <div class="selectdate-container">
            <div class="selectdate-container-inner">
              <p :style="{ color: theme.primaryColor }" class="label">
                <strong>Loan Date</strong>
              </p>
              <div class="select-option neomorphic-input-2">
                <ion-input
                  type="date"
                  v-model="loanDate"
                  @ion-blur="printDate"
                />
              </div>
            </div>
          </div>

          <!-- Loanable Amount -->
          <p :style="{ color: theme.primaryColor }" class="label">
            <strong>Loanable Amount </strong>
          </p>
          <ion-card class="neomorphic-input-2">
            <p>{{ maxLoanAmount.toLocaleString() }}</p>
          </ion-card>

          <!-- Loan Amount -->
          <p :style="{ color: theme.primaryColor }" class="label">
            <strong>Loan Amount </strong>
          </p>

          <ion-card class="neomorphic-input-2">
            <ion-input
              label="Enter Loan Amount"
              type="number"
              label-placement="floating"
              placeholder="0"
              v-model="loanAmount"
              :readonly="isFixedLoan"
              @ion-change="validateMaxLoan()"
            ></ion-input>
          </ion-card>

          <ion-button
            expand="full"
            color="none"
            @click="onSubmit"
            class="submit-btn"
            :style="{ backgroundColor: theme.primaryColor }"
          >
            Submit
          </ion-button>
        </ion-card>

        <!-- Save Button -->
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
  IonLabel,
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
import LoanBalanceModal from "@/views/services/loanBalance/component/loadBalanceModal.vue";

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
    LoanBalanceModal,
    IonIcon,
    IonLabel,
  },
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    return {
      headerTitle: "Other Loans",
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
      showModal: false,
      selectedResult: null,
      loanTypes: [],
      selectedLoanType: null,
      filteredResults: [],
      isElegible: false,
      reasonOptions: [],
      selectedEmployee: null,
      startOfPayment: new Date().toISOString().split("T")[0],
      loanDate: new Date().toLocaleDateString("en-CA"),
      loanAmount: null,
      beginningPayment: null,
      amortization: null,
      amortizationAmount: null,
      paymentTerms: null,
      selectedReason: null,
      termsPaymentPeriod: 0,
      loanInterest: null,
      balance: null,
      selectedFrequency: null,
      maxLoanAmount: null,
      maximumLoanableOptionlabel: null,
      isFixedLoan: true,
      frequencyOption: [
        {
          id: 52,
          frequencyName: "30th",
        },
        {
          id: 2,
          frequencyName: "Every Payroll",
        },
        {
          id: 3,
          frequencyName: "15th",
        },
      ],
    };
  },

  created() {
    this.fetchTheme();
    this.fetchLoanBal();
    this.empNum = localStorage.getItem("empNumber");
    this.fetchReasonOptions();
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

    async fetchLoanBal() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();

        this.storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };
        const api = baseURL + `api/loanType?isEmployee=true`;

        const dataResponse = await axios.get(api, { headers });

        this.loanTypes = dataResponse.data.data.map((loan) => ({
          id: loan.id,
          loanTypeName: loan.loanTypeName,
        }));
      } catch (error) {
        this.showErrorMessage("An error occurred: " + error.message);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    async onSubmit() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();

        const empNumber = localStorage.getItem("empNumber");

        if (
          this.maximumLoanableOptionlabel !== "No Maximum Loanable Amount" &&
          this.maximumLoanableOptionlabel !== null
        ) {
          if (this.loanAmount > this.maxLoanAmount) {
            this.showErrorMessage("Exceeded Loan Amount!");
            return;
          }
        }

        if (!this.loanAmount || !this.selectedLoanType || !this.loanDate) {
          await this.showErrorMessage("Please complete all required fields.");
          console.log(this.loanAmount, this.selectedLoanType, this.loanDate);
          return;
        }

        const empID = Number(localStorage.getItem("empNumber"));

        const payload = {
          amortization: this.amortization,
          beginningPayment: 0,
          employee: empID,
          interest: this.loanInterest,
          loanAmount: this.loanAmount,
          loanDate: this.loanDate,
          loanType: this.selectedLoanType,
          paymentTerms: this.paymentTerms,
          reason: "",
        };

        this.storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };
        const api = `${baseURL}api/ess/other-loans`;

        const dataResponse = await axios.post(api, payload, { headers });

        if (dataResponse.status === 200) {
          await this.showErrorMessage("Other Loan Applied Successfully!");
          window.location.replace("/loanbalance");
        } else {
          await this.showErrorMessage(dataResponse.message);
        }
      } catch (error) {
        console.error(error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.error &&
          error.response.data.error.message
        ) {
          await this.showErrorMessage(error.response.data.error.message);
        } else {
          await this.showErrorMessage("An error occurred. Please try again.");
        }
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    async validate(loanTypeId, loanType) {
      await this.checkTokenExpiration();
      this.loanType = loanType;
      this.loanTypeId = loanTypeId;

      const empNumber = localStorage.getItem("empNumber");

      this.storedToken = localStorage.getItem("token");
      const baseURL = localStorage.getItem("baseUrl");
      const headers = {
        Authorization: `Bearer ${this.storedToken}`,
      };
      const api =
        baseURL +
        `api/payroll/employee-loan/validate?loanTypeId=${loanTypeId}&employee=${empNumber}`;

      try {
        const dataResponse = await axios.get(api, { headers });

        this.isElegible = dataResponse.data.status;

        if (dataResponse.data.status !== false) {
          this.termsPaymentPeriod = dataResponse.data.data.termsPaymentPeriod;
          this.loanInterest = dataResponse.data.data.loanInterest;
          this.amortization =
            dataResponse.data.data.amortizationValue !== null
              ? dataResponse.data.data.amortizationValue
              : 0;
          this.maxLoanAmount = dataResponse.data.data.maxLoanAmount;
          this.maximumLoanableOptionlabel =
            dataResponse.data.data.maximumLoanableOption.label;
          this.paymentTerms = dataResponse.data.data.termsPaymentPeriod;
          this.loanAmount = this.maxLoanAmount;
        } else {
          await this.showErrorMessage(
            "Employee is not eligible to apply this loan."
          );
        }
      } catch (error) {
        await this.showErrorMessage(
          "An error occurred while validating the loan."
        );
      }
    },

    validateMaxLoan() {
      if (
        this.maximumLoanableOptionlabel !== "No Maximum Loanable Amount" &&
        this.maximumLoanableOptionlabel !== null
      ) {
        if (this.loanAmount > this.maxLoanAmount) {
          this.showErrorMessage("Exceeded Loan Amount!");
          return;
        }
      }
    },

    calculateBalance() {
      this.balance = this.loanAmount - this.beginningPayment;
    },
    calculateAmortization() {
      if (this.amortization == 0) {
        this.amortization = 0;
      }
      this.amortizationAmount = this.loanAmount / this.amortization;
    },

    async fetchReasonOptions() {
      try {
        await this.checkTokenExpiration();

        this.storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };

        const api =
          baseURL +
          `api/v2/reasons?limit=50&offset=0&sortField=r.id&sortOrder=DESC`;

        const response = await axios.get(api, { headers });

        this.reasonOptions = response.data.data
          .filter((item) => item.code == "employee_loan")
          .map((item) => ({
            id: item.id,
            type: item.type,
            content: item.content,
          }));
      } catch (error) {
        console.error("Error fetching reason options:", error);
      }
    },

    async navigateToViewPage(result) {
      let id = result.id;
      this.$router.push({ path: "/loanbalanceview", query: { id } });
    },

    navigateToRecent() {
      this.$router.push("/suysing_recentotherloans");
    },

    fetchTheme() {
      const storedThemeData = localStorage.getItem("themeData");

      const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};

      this.theme = themeData;
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

    printDate() {
      console.log(this.loanDate);
    },
  },
});
</script>

<style scoped>
.employee-card {
  margin: 10px auto;
  width: 300px;
}
.loantype-card {
  margin: 10px auto;
  width: 300px;
}
.selectdate-card {
  width: fit-content;
  margin: 10px auto;
  padding: 10px 10px 20px 10px;
  width: 300px;
}
.selectdate-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
.selectdate-container-inner {
  width: 100%;
}
.input-num-card {
  margin: 10px auto;
  width: 300px;
}
.submit-btn {
  width: 120px;
  margin-top: 50px;
  border-radius: 10px;
  overflow: hidden;
  float: right;
}
.computed-value {
  background-color: rgb(233, 233, 233);
}
.note-text-container p {
  color: gray;
  text-align: center;
}
.read-num-card {
  min-width: 145px;
  width: fit-content;
}
.readonly-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.readonly-card {
  background-color: rgb(231, 231, 231);
}
.recent-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: row;
  max-width: 500px;
  margin: 30px auto;
}
.recent-container h5 {
  font-family: Poppins;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
}
.recent-btn {
  width: 100px;
  border-radius: 10px;
  padding: 0;
  height: 30px;
}
</style>
