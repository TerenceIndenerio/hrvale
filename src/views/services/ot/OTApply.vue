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
            :date="result.date"
            :status="result.status"
            :scheduleIn="result.scheduleIn"
            :scheduleOut="result.scheduleOut"
            :actualIn="result.actualIn"
            :actualOut="result.actualOut"
            :day="result.day"
            :fixedOtIn="result.fixedOtIn"
            :fixedOtOut="result.fixedOtOut"
            :otHours="result.otHours"
            :reason="result.reason"
            @view="handleView(result)"
          />

          <ion-modal :is-open="isOpen" id="example-modal">
            <div class="modal-header">
              <h4>View Details</h4>

              <ion-button
                @click="setOpen(false)"
                color="dark"
                fill="clear"
                style="border-radius: 20px"
              >
                <ion-icon name="close"></ion-icon>
              </ion-button>
            </div>

            <ion-card class="card-modal">
              <ion-grid>
                <ion-row>
                  <ion-col>
                    <p><strong>Date:</strong></p>
                  </ion-col>
                  <ion-col>
                    <p>{{ selectedResult.date }}</p>
                  </ion-col>
                </ion-row>

                <ion-row>
                  <ion-col>
                    <p><strong>OT Hours:</strong></p>
                  </ion-col>
                  <ion-col>
                    <p>{{ selectedResult.otHours }}</p>
                  </ion-col>
                </ion-row>

                <ion-row>
                  <ion-col>
                    <p><strong>Schedule In:</strong></p>
                  </ion-col>
                  <ion-col>
                    <p>{{ selectedResult.scheduleIn }}</p>
                  </ion-col>
                </ion-row>

                <ion-row>
                  <ion-col>
                    <p><strong>Schedule Out:</strong></p>
                  </ion-col>
                  <ion-col>
                    <p>{{ selectedResult.scheduleOut }}</p>
                  </ion-col>
                </ion-row>

                <ion-row>
                  <ion-col>
                    <p><strong>Actual In:</strong></p>
                  </ion-col>
                  <ion-col>
                    <p>{{ selectedResult.actualIn }}</p>
                  </ion-col>
                </ion-row>

                <ion-row>
                  <ion-col>
                    <p><strong>Actual Out:</strong></p>
                  </ion-col>
                  <ion-col>
                    <p>{{ selectedResult.actualOut }}</p>
                  </ion-col>
                </ion-row>

                <ion-row>
                  <ion-col>
                    <p><strong>Fixed OT:</strong></p>
                  </ion-col>
                  <ion-col>
                    <p>{{ selectedResult.fixedOtIn }}</p>
                  </ion-col>
                </ion-row>

                <ion-row>
                  <ion-col>
                    <p><strong>Fixed OT:</strong></p>
                  </ion-col>
                  <ion-col>
                    <p>{{ selectedResult.fixedOtOut }}</p>
                  </ion-col>
                </ion-row>

                <ion-row>
                  <ion-col>
                    <p><strong>Reason:</strong></p>
                  </ion-col>
                  <ion-col>
                    <p>{{ selectedResult.reason }}</p>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-card>
          </ion-modal>
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
} from "@ionic/vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import { defineComponent } from "vue";
import Refresher from "@/components/refresher/Refresher.vue";
import OTCard from "@/views/services/ot/components/OTCard.vue";
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
    OTCard,
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
      headerTitle: "Approval",
      results: [],
      headerTitle: "Apply OT",
      selectedDateFrom: formattedDate,
      selectedDateTo: formattedDate,
      isModalVisible: false,
      selectedResult: null,
      isOpen: false,
      theme: {},
      loading: true,
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
          date: val.date,
          scheduleIn: val.scheduleIn,
          scheduleOut: val.scheduleOut,
          actualIn: val.actualIn,
          actualOut: val.actualOut,
          day: val.day,
          fixedOtIn: val.fixedOtIn,
          fixedOtOut: val.fixedOtOut,
          otHours: val.otHours,
          reason:
            val.reasonOptions && val.reasonOptions.length > 0
              ? val.reasonOptions[0].content
              : "",
        }));

        function formatTime(dateTimeString) {
          const time = new Date(dateTimeString);
          return time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        }

        this.store.commit("loader/updateLoader", false);
      } catch (error) {
        this.store.commit("loader/updateLoader", false);
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
          date: val.date,
          scheduleIn: val.scheduleIn,
          scheduleOut: val.scheduleOut,
          actualIn: val.actualIn,
          actualOut: val.actualOut,
          day: val.day,
          fixedOtIn: val.fixedOtIn,
          fixedOtOut: val.fixedOtOut,
          otHours: val.otHours,
          reason:
            val.reasonOptions && val.reasonOptions.length > 0
              ? val.reasonOptions[0].content
              : "",
        }));

        function formatTime(dateTimeString) {
          const time = new Date(dateTimeString);
          return time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        }

        console.log(this.results);
        this.store.commit("loader/updateLoader", false);
      } catch (error) {
        this.store.commit("loader/updateLoader", false);
        console.error("Error fetching payroll period options: ", error);
        this.showErrorMessage("An error occurred: " + error.message);
      }
    },

    async showErrorMessage(message) {
      try {
        const toast = await toastController.create({
          message: message,
          duration: 3000,
          position: "bottom",
          color: "danger",
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

    handleView(result) {
      this.selectedResult = result;
      console.log("Selected", this.selectedResult);
      console.log("Selected", result);
      this.isOpen = true;
    },

    setOpen(val) {
      this.isOpen = val;
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
    this.getTheme();
    this.fetchRequest();
    this.loading = false;
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

.card-modal {
  border-radius: 20px;
  max-width: 400px;
  margin-top: 0;
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

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 0 5px 0 20px;
}

ion-modal#example-modal {
  --width: 350px;
  --min-width: 250px;
  --height: fit-content;
  --border-radius: 20px;
}
</style>
