<template>
  <ion-page>
    <HeaderReturn
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    />
    <ion-content :fullscreen="true">
      <Refresher />
      <div class="card-container">
        <div v-if="results.length === 0" class="no-data-text">
          <h5 :style="{ color: theme.primaryColor }">
            <strong>Fetching Data</strong>
          </h5>
        </div>

        <div v-else>
          <div
            v-for="(result, index) in results"
            :key="index"
            class="loan-card neomorphic-card-1"
          >
            <ion-grid>
              <ion-row
                v-for="(value, label) in formatResult(result)"
                :key="label"
                class="row-container"
              >
                <ion-col size="6">
                  <p class="label-text">{{ label }}:</p>
                </ion-col>
                <ion-col size="6">
                  <p class="value-text">{{ value }}</p>
                </ion-col>
              </ion-row>
            </ion-grid>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonCard,
  IonButton,
  IonButtons,
  IonModal,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonCol,
  IonRow,
  IonGrid,
  IonIcon,
  IonCardSubtitle,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
} from "@ionic/vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import { defineComponent } from "vue";
import Refresher from "@/components/refresher/Refresher.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import { GlobalConstants } from "@/config/constants";
import { toastController } from "@ionic/vue";
import { getThemeData } from "@/theme/theme";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonInput,
    IonItem,
    HeaderReturn,
    IonLabel,
    Refresher,
    IonCard,
    IonButton,
    IonButtons,
    IonModal,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonCol,
    IonRow,
    IonGrid,
    IonIcon,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCardContent,
  },
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    return {
      results: [],
      headerTitle: "Loan Details",
      theme: {},
      loading: true,
      totalRec: 0,
    };
  },

  methods: {
    // Exppiration of token
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
    formatResult(result) {
      return {
        "Employee Name": result.name,
        "Loan Type": result.loanType,
        "Loan Date": result.loanDate,
        "Start of Payment": result.startPaymentDate,
        "Payment Terms": result.paymentTerms,
        Amortization: result.amortization,
        "Principal Amount": result.loanAmount,
        "Interest (%)": result.interestRate,
        "Interest Amount": result.interestAmount,
        "Total Loan Amount": result.totalLoanAmount,
        "Beginning Payment": result.beginningPayment,
        "Ending Balance": result.endingBalance,
        Reason: result.reason,
        "Total Amortization": result.totalAmortization,
        Status: result.status,
      };
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

    async fetchdata(id) {
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
          `api/ess/other-loans?limit=50&offset=0&sortField=el.id&sortOrder=DESC`;

        const response = await axios.get(api, { headers });

        const allData = response.data.data;

        const matchingEntries = allData.filter(
          (entry) => entry.id === parseInt(id, 10)
        );

        if (matchingEntries.length > 0) {
          this.results = matchingEntries.map((entry) => ({
            id: entry.id,
            name: entry.name,
            loanDate: entry.loanDate?.date?.split(" ")[0] ?? "",
            startPaymentDate: entry.startPaymentDate?.date?.split(" ")[0] ?? "",
            loanType: entry.loanTypeName,
            loanAmount: entry.loanAmount,
            schedOfDeduction: entry.frequencyName,
            amortization: entry.amortization,
            reason: entry.reason,
            status: entry.status,

            // Newly added fields
            paymentTerms: entry.paymentTerms,
            principalAmount: entry.principalAmount ?? entry.loanAmount,
            interestRate: entry.interestRate,
            interestAmount: entry.interestAmount,
            totalLoanAmount: entry.totalLoanAmount,
            beginningPayment: entry.beginningPayment,
            endingBalance: entry.endingBalance,
            totalAmortization: entry.totalAmortization,
          }));

          this.totalRec = this.results.length;
        } else {
          this.showErrorMessage("No data found for the provided ID.");
        }
      } catch (error) {
        this.showErrorMessage("An error occurred: " + error.message);
        console.log(error);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    fetchTheme() {
      const storedThemeData = localStorage.getItem("themeData");

      const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};

      this.theme = themeData;
    },
  },
  created() {
    this.empNumber = localStorage.getItem("empNumber");
    this.checkTokenExpiration();
    this.fetchTheme();
    const id = this.$route.query.id;
    this.fetchdata(id);
  },
});
</script>

<style>
p {
  margin: 5px;
  color: gray;
  font-family: "Poppins";
  font-size: 14px;
}
.title {
  text-align: center;
  margin: 20px auto 0 auto;
  width: 80%;
}

.card {
  padding: 0 10px 0 10px;
  border-radius: 20px;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8), 0px -4px 8px rgba(0, 0, 0, 0.05),
    -8px -8px 16px rgba(0, 0, 0, 0.1);
}

.card-inner {
  margin: 10px auto;
  border-radius: 10px;
  padding: 0 10px 0 10px;
}

.container {
  max-height: 90vh;
  overflow-y: scroll;
}
.outlineColor {
  border: 1px solid #828282;
  color: #828282;
  border-radius: 20px;
  margin-top: 30px;
}
.modal-container {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}
.no-data-text {
  text-align: center;
}
.content-container {
  background-color: #fff;
}
.card-container {
  padding: 16px;
}

.loan-card {
  margin-bottom: 20px;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background: #f9f9f9;
  margin: 0 auto;
  width: 100% !important;
  max-width: 400px;
}

.label-text {
  font-weight: bold;
  color: #333;
}

.value-text {
  color: #444;
}

.no-data-text {
  text-align: center;
  padding: 20px;
}
.row-container {
  border-bottom: 1px solid rgba(128, 128, 128, 0.215);
  padding: 10px 0;
}
</style>
