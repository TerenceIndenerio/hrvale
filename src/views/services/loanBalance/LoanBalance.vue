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
      <ion-card class="card filter-container" :style="{backgroundColor: theme.primaryColor}">
        <ion-select
          v-model="selectedLoanType"
          @ionChange="searchByLoanType(selectedLoanType)"
          label-placement="floating"
          label="Select Loan Type"
          class="box-container select-option"
        >
          <ion-select-option
            v-for="loanType in loanTypes"
            :key="loanType.loanTypeId"
            :value="loanType.loanTypeId"
          >
            {{ loanType.loanType }}
          </ion-select-option>
        </ion-select>
      </ion-card>

      <ion-card class="card result-container" :style="{backgroundColor: theme.primaryColor}">
        <h4 class="text-center outlineColor" :style="{color: theme.primaryFontColor, border: '2px solid ' + theme.primaryFontColor}">Result</h4>
        <ion-card class="card-inner" v-for="(result, index) in filteredResults" :key="index">
          <ion-grid>
            <ion-col size="6">
              <ion-row>
                <ion-col size="6">
                  <p>Loan Type:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.loanType }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Loan Amount:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.loanAmount }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Schedule of Deduction:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.schedOfDeduction }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Status:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.status }}</p>
                </ion-col>
              </ion-row>
            </ion-col>
          </ion-grid>

          <ion-button
            expand="full"
            color="light"
            class="edit-btn"
            @click="navigateToViewPage(result)"
          >
            View
          </ion-button>
        </ion-card>
      </ion-card>

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
      headerTitle: "Loan Balance",
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
    this.getTheme();
    this.fetchLoanBal();
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

    async navigateToViewPage(result) {
      let id = result.id
      this.$router.push({ path: "/loanbalanceview", query: { id } });
    },

    async fetchLoanBal() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();

        this.storedToken = localStorage.getItem("_token");

        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };
        const api = baseURL + `api/v2/ess/employee/loan-balances`;

        const dataResponse = await axios.get(api, { headers });

        if (dataResponse.data && Array.isArray(dataResponse.data.data)) {
          this.results = dataResponse.data.data.map((data) => ({
            id: data.id,
            name: data.name,
            loanDate: data.loanDate.date.split(" ")[0],
            startPaymentDate: data.startPaymentDate.date.split(" ")[0],
            loanType: data.loanTypeName,
            loanTypeId: data.loanTypeId,
            loanAmount: data.loanAmount,
            schedOfDeduction: data.frequencyName,
            principalAmount: data.loanDate,
            amortization: data.amortization,
            reason: data.reason,
            status: data.status,
          }));

          const uniqueLoanTypes = {};

          this.results.forEach((result) => {
            const { loanType, loanTypeId } = result;

            if (!uniqueLoanTypes[loanTypeId]) {
              uniqueLoanTypes[loanTypeId] = true;
              this.loanTypes.push({ loanType, loanTypeId });
            }
          });
        }

        this.filteredResults = this.results;
      } catch (error) {
        this.showErrorMessage("An error occurred: " + error.message);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    searchByLoanType(selectedLoanType) {
      if (selectedLoanType) {
        this.filteredResults = this.results.filter(
          (result) => result.loanTypeId === selectedLoanType
        );
      } else {
        this.filteredResults = this.results;
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
.card h4 {
  margin: 10px;
}
.filter-container {
  display: flex;
  justify-content: center;
  padding: 10px 5px;
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
  padding: 0 10px;
  margin: 10px auto;
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
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}
</style>
