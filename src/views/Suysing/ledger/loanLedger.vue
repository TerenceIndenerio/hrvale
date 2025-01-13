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

      <div class="result-container">
        <ion-card
          class="card-content neomorphic-card-1"
          v-for="(result, index) in filteredResults"
          :key="index"
        >
          <ion-grid>
            <div class="loan-type-badge">
              <p :style="{ color: theme.primaryFontColor }">
                {{ result.loanType }}
              </p>
            </div>
            <ion-col size="6" class="card-content">
              <ion-row>
                <ion-col size="6">
                  <p>Loan Date:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.employee }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Loan Type:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.budget }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Loan Amount:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.balance }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Schedule of Deduction:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.year }}</p>
                </ion-col>
              </ion-row>
            </ion-col>
          </ion-grid>
        </ion-card>
      </div>

      <LoanBalanceModal
        :is-open="showModal"
        @dismiss="showModal = false"
        :selectedResult="selectedResult"
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
  },
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    return {
      headerTitle: "Ledger",
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
    };
  },

  created() {
    this.fetchTheme();
    this.fetchledger();
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
      const storedThemeData = localStorage.getItem("themeData");

      const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};

      this.theme = themeData;
    },

    async navigateToViewPage(result) {
      let id = result.id;
      this.$router.push({ path: "/loanbalanceview", query: { id } });
    },

    async fetchledger() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();

        this.storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };

        const api = `${baseURL}api/v1/loanable-amounts`;

        // Include loanBudgetId as a query parameter
        const params = {
          loanBudgetId: 4,
        };

        const dataResponse = await axios.get(api, { headers, params });

        if (dataResponse.data && Array.isArray(dataResponse.data.data)) {
          this.results = dataResponse.data.data.map((data) => ({
            id: data.id,
            employee: data.employee,
            budget: data.budget,
            balance: data.balance,
            year: data.year,
          }));
        }

        this.filteredResults = this.results;
      } catch (error) {
        this.showErrorMessage("An error occurred: " + error.message);
        console.log(error);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    filterResults() {
      let filtered = this.results;

      if (this.selectedLoanType) {
        filtered = filtered.filter(
          (result) => result.loanTypeId === this.selectedLoanType
        );
      }

      if (this.startDate) {
        filtered = filtered.filter(
          (result) => new Date(result.loanDate) >= new Date(this.startDate)
        );
      }

      if (this.endDate) {
        filtered = filtered.filter(
          (result) => new Date(result.loanDate) <= new Date(this.endDate)
        );
      }

      this.filteredResults = filtered;
    },

    navigateOtherLoans() {
      this.$router.push("/otherloans");
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
* {
  padding: 0;
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
.card h4 {
  margin: 10px;
}
.filter-container {
  display: flex;
  justify-content: center;
  padding: 10px;
  margin: 10px auto;
  flex-direction: column;
}

.result-container {
  width: fit-content;
  min-width: 300px;
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
  width: fit-content;
  min-width: 300px;
  background-color: rgba(255, 255, 255, 0.851);
  border-radius: 10px;
  padding: 0 15px;
  margin: 10px auto;
  border-radius: 30px;
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
}
.edit-btn {
  padding: 0;
  overflow: hidden;
  margin: 10px auto;
  width: 100%;
}
.card-content {
  margin: 20px auto;
  padding: 20px 10px 0 10px;
  width: 270px;
}
.loan-type-badge {
  position: absolute;
  right: 0;
  top: 0;
  padding: 5px 10px;
  border-radius: 20px 0 0 20px;
  background-color: #5d5d5d;
}
.card-content {
  padding: 30px 10px 0 10px;
}
.btn-container {
  margin: 0px auto 20px auto;
  z-index: 100;
}
.otherloan-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  overflow: hidden;
}
.date-container {
  display: flex;
  justify-content: center;
  gap: 10px;
}
.date-container .inner-container {
  width: 135px;
}
.date-input {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 120px;
}
</style>
