<template>
  <ion-page>
    <HeaderReturn :headerTitle="headerTitle" />
    <ion-content :fullscreen="true">
      <Refresher />

      <ion-card class="card">
        <ion-card class="card">
          <ion-item>
            <ion-input label="from:" v-model="selectedDateFrom" type="date"></ion-input>
          </ion-item>
        </ion-card>
        <ion-card class="card">
          <ion-item>
            <ion-input label="to:" v-model="selectedDateTo" type="date"></ion-input>
          </ion-item>
        </ion-card>

        <ion-button @click="handleSearch" class="flex-right" color="light"
          >Search</ion-button
        >
      </ion-card>

      <ion-card class="card result-container">
        <h4 class="text-center outlineColor">Result</h4>
        <div v-for="(result, index) in results" :key="index">
          <OTCard
            :otType="result.otType"
            :date="result.date"
            :totalHour="result.totalHour"
            :status="result.status"
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
  IonInput,
  IonItem,
  IonLabel,
  IonCard,
  IonButton,
} from "@ionic/vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import { defineComponent } from "vue";
import Refresher from "@/components/refresher/Refresher.vue";
import OTCard from "@/views/services/ot/components/OTCard.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import { GlobalConstants } from "@/config/constants";

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
    OTCard,
    IonButton,
  },
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    return {
      headerTitle: "Approval",
      results: [],
      headerTitle: "Apply OT",
      selectedDateFrom: null,
      selectedDateTo: null,
    };
  },
  methods: {
    async fetchAuthToken() {
      try {
        const response = await axios.post(baseURL + "auth/token", {
          clientId: "test_id",
          clientSecret: "test_secret",
          userId: 1,
        });
        this.authToken = response.data.token;
        localStorage.setItem("_token", this.authToken);
      } catch (error) {
        console.error("Error fetching authentication token: ", error);
        this.showErrorMessage("An error occurred: " + error.message);

        const errorMessage = error.response.data.error.message;
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

    async fetchRequest() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.fetchAuthToken();
        if (!this.authToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${this.authToken}`,
        };

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split("T")[0];
        const api =
          baseURL +
          `api/v2/ess/overtime?limit=50&offset=0&date=${formattedDate}&dateEnd=${formattedDate}`;
        const dataResponse = await axios.get(api, { headers });

        this.results = dataResponse.data.data.map((val) => ({
          otType: val.type,
          date: val.date,
          totalHour: val.totalHour,
          status: val.requestStatus,
        }));

        console.log(this.results);
        this.store.commit("loader/updateLoader", false);
      } catch (error) {
        console.error("Error fetching payroll period options: ", error);
        this.showErrorMessage("An error occurred: " + error.message);

        const errorMessage = error.response.data.error.message;
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

    async handleSearch() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.fetchAuthToken();
        if (!this.authToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${this.authToken}`,
        };

        const api =
          baseURL +
          `api/v2/ess/overtime?limit=50&offset=0&date=${this.selectedDateFrom}&dateEnd=${this.selectedDateTo}`;
        const dataResponse = await axios.get(api, { headers });

        this.results = dataResponse.data.data.map((val) => ({
          otType: val.type,
          date: val.date,
          totalHour: val.totalHour,
          status: val.requestStatus,
        }));

        console.log(this.results);
        this.store.commit("loader/updateLoader", false);
      } catch (error) {
        console.error("Error fetching payroll period options: ", error);
        this.showErrorMessage("An error occurred: " + error.message);

        const errorMessage = error.response.data.error.message;
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
  created() {
    this.fetchRequest();
  },
});
</script>

<style scoped>
.text-center {
  text-align: center;
  margin: auto;
}
.card {
  border-radius: 20px;
  max-width: 400px;
}
.result-container {
  padding: 10px 0;
}
.flex-right {
  float: right;
  margin: 10px 5%;
  width: 120px;
}
.outlineColor {
  border: 1px solid #828282;
  color: #828282;
  border-radius: 20px;
  width: 90%;
}
</style>
