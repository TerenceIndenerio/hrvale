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
              {{ valeDataResult.balance }}
            </h4>
          </div>
          <div class="loan-budget-text">
            <p :style="{ color: theme.primaryFontColor }">Loanable Amount</p>
          </div>
        </div>
      </ion-card>

      <div v-if="!loading">
        <ion-card class="card card-details">
          <h4 class="card-title">Details</h4>
          <div class="card-inner">
            <ion-col size="6">
              <ion-row>
                <ion-col size="6">
                  <p>Vale Request:</p>
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
                      @ionBlur="formatApprovalAmount"
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
                  <p>{{ valeDataResult.previousBalance }}</p>
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

              <ion-row>
                <ion-col size="6">
                  <p>Amortization:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ this.amortizationPercentage }}</p>
                </ion-col>
              </ion-row>

              <!-- Reason -->
              <ion-col class="reason-container">
                <ion-label>
                  <strong>Reason*</strong>
                </ion-label>
                <ion-card class="reason-select-container neomorphic-input-2">
                  <ion-select
                    placeholder="Select Reason"
                    label-placement="floating"
                    v-model="reason"
                    class="reason-select"
                  >
                    <div slot="label">Select Reason</div>
                    <ion-select-option
                      v-for="option in reasonOptions"
                      :key="option.content"
                      :value="option.content"
                    >
                      {{ option.content }}
                    </ion-select-option>
                  </ion-select>
                </ion-card>
              </ion-col>

              <!-- Other Reason Textarea -->
              <div
                class="ion-margin-bottom comment"
                v-if="this.reason === 'Others'"
              >
                <ion-label position="stacked"
                  ><strong>Reason:</strong></ion-label
                >
                <ion-textarea
                  v-model="reasonText"
                  rows="4"
                  class="neomorphic-textarea-1"
                  aria-label="Reason"
                  placeholder="Enter your reason here..."
                ></ion-textarea>
              </div>

              <!-- Comment Textarea -->
              <div class="ion-margin-bottom comment">
                <ion-label position="stacked"
                  ><strong>Comment:</strong></ion-label
                >
                <ion-textarea
                  v-model="comment"
                  rows="4"
                  class="neomorphic-textarea-1"
                  aria-label="Comment"
                  placeholder="Enter your comment here..."
                ></ion-textarea>
              </div>
            </ion-col>
          </div>

          <ion-button
            expand="full"
            color="none"
            class="apply-btn"
            :style="{ backgroundColor: theme.primaryColor }"
            @click="applyVale"
          >
            Submit
          </ion-button>
        </ion-card>

        <ion-modal :is-open="isOpen" id="modal">
          <ion-card class="card-modal">
            <ion-card-header>
              <ion-card-title class="modal-header"
                >Confirmation Required</ion-card-title
              >
            </ion-card-header>
            <ion-icon
              @click="isOpen = false"
              name="close"
              :style="{ color: theme.primaryColor }"
              class="close-btn"
            ></ion-icon>

            <ion-grid class="modal-content">
              <p>
                Your inputted loan amount exceeds the available loanable amount.
                Do you still wish to proceed? This is subject to approval.
              </p>
              <ion-row>
                <ion-col>
                  <ion-button @click="confirmProceed">Yes, Confirm</ion-button>
                </ion-col>
                <ion-col>
                  <ion-button @click="cancelProceed" color="light"
                    >No, Cancel</ion-button
                  >
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-card>
        </ion-modal>

        <!-- alert successfully submitted -->
        <ion-modal :is-open="isSuccessful" id="modal">
          <ion-card class="card-modal">
            <ion-card-header>
              <ion-card-title class="modal-header">Success</ion-card-title>
            </ion-card-header>
            <ion-icon
              name="checkmark-circle"
              :style="{ color: theme.successColor }"
              class="close-btn"
            ></ion-icon>

            <ion-grid class="modal-content">
              <p>Vale Applied Successfully!</p>
              <ion-row>
                <ion-col>
                  <ion-button @click="confirmSuccess">Okay</ion-button>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-card>
        </ion-modal>
      </div>
      <!-- </div> -->
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
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonItem,
  IonList,
  IonModal,
  IonCardTitle,
  IonCardHeader,
} from "@ionic/vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import { getThemeData } from "@/theme/theme";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { GlobalConstants } from "@/config/constants";
import { mapState } from "vuex";
import Refresher from "@/components/refresher/Refresher.vue";

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
    IonSelect,
    IonSelectOption,
    IonCheckbox,
    IonItem,
    IonList,
    IonModal,
    IonIcon,
    IonCardTitle,
    IonCardHeader,
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
      approvalAmount: "",
      reasonOptions: [],
      selectedReason: "",
      comment: null,
      reason: "",
      parsedOptions: [],
      selectedOption: "",
      selectedCheckbox: [],
      reasonText: null,
      isOpen: false,
      finalReason: null,
      isSuccessful: false,
      valeID: null,
      amortizationPercentage: 0,
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
      if (!this.reason || this.reason.trim() === "") {
        this.showErrorMessage("Please fill in all required fields.");
        return;
      }

      this.finalReason =
        this.reason === "Others" ? this.reasonText.trim() : this.reason.trim();

      if (!this.finalReason || !this.comment.trim()) {
        this.showErrorMessage("Please fill in all required fields.");
        return;
      }

      const approvalAmount = this.approvalAmount.replace(/,/g, "");
      const loanBalance = this.valeDataResult.balance;

      if (approvalAmount > loanBalance) {
        this.isOpen = true;
        this.showErrorMessage("Invalid Amount for Approval");
        this.invalidAmount = true;
      } else {
        await this.proceedWithAPI(this.finalReason);
      }

      this.updateTotalLoan();
    },

    async proceedWithAPI(reason) {
      try {
        this.store.commit("loader/updateLoader", true);
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const baseURL = localStorage.getItem("baseUrl");
        const api = `${baseURL}api/v2/apply-vale`;
        const loanAmount = parseFloat(
          this.approvalAmount.replace(/,/g, "")
        ).toString();

        const payload = {
          loanAmount: loanAmount,
          reason: reason,
          comment: this.comment.trim(),
        };

        const dataResponse = await axios.post(api, payload, { headers });

        if (dataResponse.status === 200) {
          this.isSuccessful = true;
          this.valeID = dataResponse.data.data.id;
        }
      } catch (error) {
        this.showErrorMessage(error.response?.data?.error?.message);
        console.log("message", error.response?.data?.error?.message);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    confirmSuccess() {
      this.isSuccessful = false;

      setTimeout(() => {
        window.location.replace(`/viewvale?id=${this.valeID}`);
      }, 1000);
    },

    confirmProceed() {
      this.isOpen = false;
      this.invalidAmount = false;
      this.proceedWithAPI(this.finalReason);
    },
    cancelProceed() {
      this.isOpen = false;
      this.invalidAmount = false;
    },

    async fetchLoanBudget() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();

        this.storedToken = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };
        const baseURL = localStorage.getItem("baseUrl");
        const api = baseURL + `api/v2/ess/loan-budget/${this.empNumber}`;

        const dataResponse = await axios.get(api, { headers });

        this.loanDataResult = {
          id: dataResponse.data.data.id,
          employee: dataResponse.data.data.employee,
          budget:
            parseFloat(dataResponse.data.data.budget).toLocaleString() || 0,
          balance:
            parseFloat(dataResponse.data.data.balance).toLocaleString() || 0,
          year: dataResponse.data.data.year,
        };
      } catch (error) {
        this.showErrorMessage(error.response.statusText);
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
        const baseURL = localStorage.getItem("baseUrl");
        const api = baseURL + `api/v2/apply-vale?limit=50&offset=0`;

        const dataResponse = await axios.get(api, { headers });

        this.valeDataResult = {
          creditableService: dataResponse.data.data.yearOfService,
          rulePerYearOfService: dataResponse.data.data.yearPerService,
          carryOverInterest: dataResponse.data.data.carryOverInterest,
          loanInterest: dataResponse.data.data.loanInterest,
          amortizationValue: dataResponse.data.data.amortizationValue,
          previousBalance: dataResponse.data.data.previousBalance,
          budget: dataResponse.data.data.budget,
          balance: dataResponse.data.data.loanableAmount || 0,
          availableAmount: dataResponse.data.data.availableAmount,
          amortizationType: dataResponse.data.data.amortizationType,
        };
      } catch (error) {
        this.showErrorMessage(error.response.data.error.message);
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

    formatApprovalAmount() {
      let numberValue = parseFloat(this.approvalAmount.replace(/,/g, ""));
      this.approvalAmount = numberValue.toLocaleString();
    },

    updateTotalLoan() {
      const amortizationType = this.valeDataResult.amortizationType;
      const approvalAmount = parseFloat(this.approvalAmount.replace(/,/g, ""));
      const previousBalance = parseFloat(
        this.valeDataResult.previousBalance.replace(/,/g, "")
      );
      const availableAmount = parseFloat(this.valeDataResult.availableAmount);
      const amortizationValue = parseFloat(
        this.valeDataResult.amortizationValue.replace(/,/g, "")
      );

      if (amortizationType === "percentage") {
        this.amortizationPercentage =
          approvalAmount * (amortizationValue / 100);
      } else if (amortizationType === "decimal") {
        this.amortizationPercentage = approvalAmount / amortizationValue;
      }

      this.totalLoan = approvalAmount + previousBalance;
      if (!isNaN(approvalAmount) && approvalAmount > 0) {
        if (approvalAmount <= availableAmount) {
          this.invalidAmount = false;
        }
      } else {
        this.totalLoan = previousBalance;
        this.showErrorMessage("Invalid Amount for Approval");
        this.invalidAmount = true;
      }
    },

    navigateToValeMain() {
      this.$router.go(-1);
    },
  },
  created() {
    this.empNumber = localStorage.getItem("empNumber");
    this.fetchTheme();
    this.fetchValeDetails();
    this.fetchLoanBudget();
    this.fetchReasonOptions();
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
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
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
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
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

.modal-content {
  margin: 0 0 10px 0;
  text-align: center;
}
#modal {
  --background: rgba(255, 0, 0, 0);
}
.modal-header {
  text-align: center;
}
.card-modal {
  border-radius: 20px;
  max-width: 400px;
  margin-top: 50%;
}
.close-btn {
  position: absolute;
  top: 5px;
  right: 10px;
  width: 30px;
  height: 30px;
  padding: 0;
  margin: 0;
  box-shadow: var(--neomorphism-convex-4);
  border-radius: 50%;
  background-color: rgb(246, 246, 246);
  overflow: hidden;
}
.container-bg {
  margin: 0;
  height: 100%;
  border-radius: 0;
  overflow-y: scroll;
}
</style>
