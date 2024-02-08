<template>
  <ion-page>
    <HeaderReturn
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    />
    <ion-content :fullscreen="true">
      <Refresher />
      <div class="neomorphic-card-1 card-container">
        <div v-if="results.length === 0">
          <div class="no-data-text">
            <h5 :style="{ color: theme.primaryColor }">No data available</h5>
          </div>
        </div>

        <div v-else>
          <div
            v-for="(result, index) in results"
            :key="index"
            class="card-inner content-container neomorphic-input-1"
          >
            <ion-col size="6">
              <ion-row>
                <ion-col size="6">
                  <p>Name:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.name }}</p>
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
                  <p>Start of Payment:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.startPaymentDate }}</p>
                </ion-col>
              </ion-row>

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
                  <p>Principal Amount:</p>
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
                  <p>Amortization:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.amortization }}</p>
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
                  <p>Status:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ result.status }}</p>
                </ion-col>
              </ion-row>
            </ion-col>
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

const baseURL = GlobalConstants.HOST_URL;

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

        this.storedToken = localStorage.getItem("_token");

        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };

        const api = baseURL + `api/v2/ess/employee/loan-balances`;

        const response = await axios.get(api, { headers });

        const allData = response.data.data;

        // Filter the data based on the provided id
        const matchingEntries = allData.filter(
          (entry) => entry.id === parseInt(id, 10)
        );

        if (matchingEntries.length > 0) {
          // If matching entries are found, set them as the result
          this.results = matchingEntries.map((foundEntry) => ({
            id: foundEntry.id,
            name: foundEntry.name,
            loanDate: foundEntry.loanDate.date.split(" ")[0],
            startPaymentDate: foundEntry.startPaymentDate.date.split(" ")[0],
            loanType: foundEntry.loanTypeName,
            loanAmount: foundEntry.loanAmount,
            schedOfDeduction: foundEntry.frequencyName,
            principalAmount: foundEntry.loanDate,
            amortization: foundEntry.amortization,
            reason: foundEntry.reason,
            status: foundEntry.status,
          }));

          this.totalRec = this.results.length;
        } else {
          // If no matching entries are found, show an error message
          this.showErrorMessage("No data found for the provided ID.");
        }
      } catch (error) {
        this.showErrorMessage("An error occurred: " + error.message);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    getTheme() {
      const storedThemeData = getThemeData();

      if (storedThemeData) {
        this.theme = storedThemeData;
      }
      this.theme = storedThemeData;
    },
  },
  created() {
    this.empNumber = localStorage.getItem("empNumber");
    this.checkTokenExpiration();
    this.getTheme();
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
  margin: 10px auto;
  padding: 10px 20px;
  border-radius: 50px;
}
</style>
