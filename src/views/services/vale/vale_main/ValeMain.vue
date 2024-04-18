<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <Refresher/>
      <ion-card
        class="card loan-budget-container"
        v-if="!loading"
        :style="{
            'background-image': 
                'linear-gradient(to right bottom, #92d8e2, #7ecad5, #69bcc7, #54aeba, #3ba0ad, #2c929f, #1b8491, #007783, #006670, #00555e, #00454d, #00363c)',
          }"
      >
      <ion-button
        color="none"
        class="return-btn"
        :style="{ 'background-color': 'white' }"
        @click="navigateToServices"
      >
        <ion-icon 
            name="arrow-back"
            class="back-icon"
        >
        </ion-icon>
      </ion-button>
        <div class="loanbalance-container">
          <div class="loan-budget-text">
            <p :style="{ color: theme.primaryFontColor }">
              Available Vale Credits
            </p>
          </div>
          <div class="loan-budget-val">
            <p :style="{ color: theme.primaryFontColor }">PHP</p>
            <h4 :style="{ color: theme.primaryFontColor }">
              {{ loanDataResult.balance }}
            </h4>
          </div>
        </div>
      </ion-card>
      <ValeTypes
        :btnColor="theme.primaryColor"
        :btnTextColor="theme.primaryFontColor"
        :btnSecondaryColor="theme.primaryFontColor"
        :theme="theme"
      />
      <ValeHistory
        :btnColor="theme.primaryColor"
        :btnTextColor="theme.primaryFontColor"
        :btnSecondaryColor="theme.primaryFontColor"
        :theme="theme"
      />
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
import ValeTypes from "@/views/services/vale/vale_main/components/ValeTypesGroupButton.vue";
import ValeHistory from "@/views/services/vale/vale_main/components/ValeHistory.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import { defineComponent } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { GlobalConstants } from "@/config/constants";
import { mapState } from "vuex";
import { getThemeData } from "@/theme/theme";
import { PushNotifications } from "@capacitor/push-notifications";

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
    ValeTypes,
    ValeHistory,
  },
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    return {
      headerTitle: "Vale",
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
      totalRec: 0,
      amortization_result: null,
      selectedAmortizationResult: null,
      combinedResults: [],
      empNumber: "",
      loanDataResult: {
        budget: 0,
        balance: 0,
      },
    };
  },
  computed: {
    filteredResults() {
      if (!this.selectedLoanType) {
        return this.results;
      }
      return this.results.filter(
        (result) => result.loanType === this.selectedLoanType
      );
    },
  },

  created() {
    this.empNumber = localStorage.getItem("empNumber");
    this.fetchTheme();
    this.fetchdata();
    this.fetchLoanBudget();
    this.loading = false;
  },

  methods: {
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

    async navigateToViewPage(result) {
      let id = result.id;
      this.$router.push({ path: "/viewvale", query: { id } });
    },

    async fetchdata() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();

        this.storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };
        const api =
          baseURL +
          `api/payroll/vale?limit=50&offset=0&sortField=v.id&sortOrder=DESC`;

        const dataResponse = await axios.get(api, { headers });

        if (dataResponse.data && Array.isArray(dataResponse.data.data)) {
          this.results = dataResponse.data.data.map((data) => ({
            id: data.id,
            loanAmount: data.loanAmount,
            loanDate: data.loanDate,
            amortization: data.amortization,
            effectiveLoan: data.effectiveLoan,
            status: data.status,
            interestRate: data.interest,
            startOfPayment: data.startOfPayment,
            totalAmountPaid: data.totalAmountPaid,
            reason: data.reason,
          }));
        }

        this.totalRec = this.results.length;
      } catch (error) {
        this.showErrorMessage("An error occurred: " + error.message);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    async fetchAmortization(id) {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();

        this.storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };

        const api = baseURL + `api/v2/vale/amortizations?valeId=${id}`;

        const dataResponse = await axios.get(api, { headers });

        this.amortization_result = dataResponse.data.data.map((data) => ({
          amount: data.amount,
          balance: data.balance,
          decoratedAmount: data.decoratedAmount,
          decoratedLoanAmount: data.decoratedLoanAmount,
          id: data.id,
          loanAmount: data.loanAmount,
          paymentDate: data.paymentDate,
          status: data.status,
        }));
      } catch (error) {
        this.showErrorMessage("An error occurred: " + error.message);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    async fetchLoanBudget() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();

        this.storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
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

    navigateToServices() {
      this.$router.push("/tabs/services");
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
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

p {
  margin: 0;
}
.ion-content {
    margin-top: 0;
    flex-wrap: flex;
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
  border-radius: 0px;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8), 0px -4px 8px rgba(0, 0, 0, 0.05),
    -8px -8px 16px rgba(0, 0, 0, 0.1);
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
  margin: 10px 0 0 0;
}
.card ion-card-content {
  padding: 10px;
}
.card h5 {
  margin: 0;
}
.filter-container {
  display: flex;
  justify-content: center;
  padding: 10px 5px;
}
.loan-budget-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 5px;
  text-align: center;
  min-width: 350px;
  padding: 100px;
  margin: 0;
}
.loan-budget-val {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0 0 0;
}
.loan-budget-val p {
  font-size: 12px;
  margin: 0 10px 15px 0;
  font-weight: 600;
}
.loan-budget-text p {
  font-size: 12px;
  font-family: Poppins;
}
.loan-budget-container h4 {
  margin: 0;
  font-size: 30px;
  font-family: Poppins;
  font-weight: 900;
}

.line_bottom {
  border: 1px solid rgb(139, 139, 139);
  width: 80%;
}

.result-container {
  width: fit-content;
  min-width: 300px;
  margin: 20px auto 50px auto;
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
  margin: 10px auto;
}
.header-row {
  border-bottom: 1px solid #000;
  margin-bottom: 20px;
}
.outlineColor {
  border: 1px solid #828282;
  color: #828282;
  border-radius: 20px;
  width: fit-content;
  padding: 0 30px;
  margin: 10px auto;
}
.pos-right {
  float: right;
  right: 10px;
}
.return-btn {
  border-radius: 100px;
  overflow: hidden;
  position: absolute;
  top: 10px;
  left: 10px;
  right: 0;
  margin: 10px 0 0 5px;
  width: 70%;
  height: 30px;
  max-width: 48px;
}
.back-icon {
    font-size: 20px;
    color: #018593;
}
.loanbalance-container {
  padding: 5px 10px;
  overflow: hidden;
}
</style>
