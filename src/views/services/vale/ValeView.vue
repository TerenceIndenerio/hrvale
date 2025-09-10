<template>
  <ion-page>
    <HeaderReturn
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    />
    <ion-content :fullscreen="true">
      <Refresher />
      <ion-card class="card">
        <div v-if="results.length === 0">
          <div class="no-data-text">
            <h5>No data available</h5>
          </div>
        </div>

        <div v-else>
          <div v-for="(result, index) in results" :key="index">
            <ion-col size="6">
              <ion-row>
                <ion-col size="6">
                  <p>Loan Amount:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.loanAmount.toLocaleString() }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Loan Date:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.loanDate }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Exceed Amount:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.exceedAmount.toLocaleString() }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Start of Payment:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.startOfPayment }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Interest Rate:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.interestRate.toLocaleString() }}</p>
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

              <ion-row>
                <ion-col size="6">
                  <p>Amortization:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.amortization.toLocaleString() }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Reason:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.reason }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Previous Balance:</p>
                </ion-col>
                <ion-col size="6">
                  <p> {{result.previousBalance.toLocaleString() }}
                  </p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Total Amount Paid:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.totalAmountPaid.toLocaleString() }}</p>
                </ion-col>
              </ion-row>
             
              <ion-row>
                <ion-col size="6">
                  <p>Total Loan:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.totalLoan.toLocaleString() }}</p>
                </ion-col>

              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Comment:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.comment }}</p>
                </ion-col>
              </ion-row>
            </ion-col>
          </div>
        </div>
      </ion-card>

      <ion-card class="card" v-if="!loading">
        <h4 class="outline">
          {{ amortization_result.length }} Amortizations Found
        </h4>
        <div v-if="amortization_result.length > 0">
          <div v-for="(result, index) in amortization_result" :key="index">
            <ion-card class="card">
              <h3 class="title">Amortization - #{{ index + 1 }}</h3>
              <ion-grid>
                <ion-col size="6">
                  <ion-row>
                    <ion-col size="6">
                      <p>Date:</p>
                    </ion-col>
                    <ion-col size="6">
                      <p>{{ result.paymentDate }}</p>
                    </ion-col>
                  </ion-row>

                  <ion-row>
                    <ion-col size="6">
                      <p>Loan Amount:</p>
                    </ion-col>
                    <ion-col size="6">
                      <p>{{ result.decoratedLoanAmount }}</p>
                    </ion-col>
                  </ion-row>

                  <ion-row>
                    <ion-col size="6">
                      <p>Payment:</p>
                    </ion-col>
                    <ion-col size="6">
                      <p>{{ result.decoratedAmount }}</p>
                    </ion-col>
                  </ion-row>

                  <ion-row>
                    <ion-col size="6">
                      <p>Balance:</p>
                    </ion-col>
                    <ion-col size="6">
                      <p>{{ result.balance.toLocaleString() }}</p>
                    </ion-col>
                  </ion-row>
                </ion-col>
              </ion-grid>
            </ion-card>
          </div>
        </div>
      </ion-card>
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
      headerTitle: "Vale Details",
      theme: {},
      loading: true,
      totalRec: 0,
      amortization_result: [],
      loading: true,
    };
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

        const api = `${baseURL}api/v2/vale`;

        const dataResponse = await axios.get(api, { headers });

        const responseData = dataResponse.data.data;

        const result = responseData.find((item) => item.id === Number(id));

        if (result) {
          this.results = [
  {
    id: result.id,
    loanAmount: parseFloat(result.loanAmount.replace(/,/g, '')) || 0.00, // Remove commas and convert to float
    loanDate: result.loanDate,
    amortization: result.amortization,
    effectiveLoan: result.effectiveLoan,
    status: result.status,
    interestRate: result.interest,
    startOfPayment: result.startOfPayment,
    totalAmountPaid: result.totalAmountPaid || "0.00",
    reason: result.reason,
    comment: result.comment,
    exceedAmount: parseFloat(result.exceedAmount.replace(/,/g, '')) || 0.00, // Remove commas and convert to float
    previousBalance: parseFloat(result.previousBalance) || 0.00,
    totalLoan: (parseFloat(result.loanAmount.replace(/,/g, '')) || 0.00) + (parseFloat(result.previousBalance) || 0.00), // Sum converted values
  },
];


          this.totalRec = this.results.length;
        } else {
          this.showErrorMessage(`No data found for ID: ${id}`);
        }
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
        this.loading = false;
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
    this.fetchAmortization(id);
  },
});
</script>

<style>
p {
  margin: 5px;
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

.container {
  max-height: 90vh;
  overflow-y: scroll;
}
.outline {
  border: 1px solid #828282;
  color: #828282;
  border-radius: 20px;
  width: 80%;
  text-align: center;
  margin: 20px auto;
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
</style>
