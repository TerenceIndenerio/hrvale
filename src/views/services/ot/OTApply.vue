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
      <div class="container">
        <ion-card class="card search-container">
          <ion-card class="card date-container">
            <ion-input label="from:" v-model="selectedDateFrom" type="date"></ion-input>
          </ion-card>
          <ion-card class="card date-container">
            <ion-input label="to:" v-model="selectedDateTo" type="date"></ion-input>
          </ion-card>

          <ion-card class="card date-container">
            <ion-input
              label="Request Date:"
              v-model="requestDate"
              type="date"
            ></ion-input>
          </ion-card>

          <ion-button
            @click="handleSearch"
            class="flex-right btn-container"
            color="none"
            :style="{ backgroundColor: theme.secondaryColor }"
            >Search</ion-button
          >
        </ion-card>

        <ion-card v-if="showCommentContainer" class="card comment-container">
          <ion-textarea v-model="comment" placeholder="Enter your comment"></ion-textarea>
          <br />
          <ion-button
            @click="handleSubmit"
            class="flex-right btn-container"
            color="none"
            :style="{ backgroundColor: theme.secondaryColor }"
          >
            Submit
          </ion-button>
        </ion-card>

        <ion-card class="card result-container">
          <h4 class="text-center outlineColor">Result</h4>

          <OTCard
            v-for="result in results"
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
                @click="isOpen = false"
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
        </ion-card>
      </div>
      <ion-button
        @click="toggleCommentContainer"
        class="flex-right btn-container comment-btn-container"
        color="none"
        :style="{ backgroundColor: theme.secondaryColor }"
      >
        Comment
      </ion-button>
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
  IonTextarea,
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
    IonTextarea,
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
      requestDate: formattedDate,
      isModalVisible: false,
      selectedResult: null,
      isOpen: false,
      theme: {},
      loading: true,
      comment: "",
      showCommentContainer: false,
      storedToken: null,
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
    toggleCommentContainer() {
      this.showCommentContainer = !this.showCommentContainer;
    },
    async handleSubmit() {
      try {
        this.store.commit("loader/updateLoader", true);
        console.log(this.selectedDateFrom, this.selectedDateTo, this.requestDate);
        await this.checkTokenExpiration();

        this.storedToken = localStorage.getItem("_token");

        const apiUrl = baseURL + `api/v2/ess/overtime`;

        const payload = {
          comment: this.comment,
          fromDate: this.selectedDateFrom,
          reasons: [],
          requestDate: this.requestDate,
          toDate: this.selectedDateTo,
        };

        const response = await axios.post(apiUrl, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.storedToken}`,
          },
        });

        console.log("Response:", response.data);
      } catch (error) {
        this.store.commit("loader/updateLoader", false);
        console.error("Error submitting overtime request: ", error);
        this.showErrorMessage("An error occurred: " + error.message);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    async fetchRequest() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();

        this.storedToken = localStorage.getItem("_token");
        console.log("token:", this.storedToken);

        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
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
      }
    },

    async handleSearch() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();

        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
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
      this.isOpen = true;
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
  width: fit-content;
}

.card-modal {
  border-radius: 20px;
  max-width: 400px;
  margin-top: 0;
}
.result-container {
  padding: 10px 0;
  width: fit-content;
  min-width: 300px;
}
.flex-right {
  float: right;
  margin: 10px 5%;
  width: 120px;
}
.btn-container {
  margin: 0 10px 10px 10px;
  border-radius: 10px;
  overflow: hidden;
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

.container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.date-container {
  width: 300px;
  margin: 10px auto;
  padding: 0 10px;
}
.search-container {
  min-width: 330px;
}
.comment-container {
  width: fit-content;
  height: fit-content;
  padding: 10px;
  margin: 0;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
ion-textarea {
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 5px;
  width: 300px;
  height: 100px;
}
.comment-container ion-textarea ::after {
  height: 70px;
}
.comment-container .btn-container {
  margin: 0;
}

.comment-btn-container {
  position: fixed;
  bottom: 0;
  right: 0;
  /* transform: translateX(-50%); */
  z-index: 999; /* Set a z-index to ensure it's above other elements */
}

ion-modal#example-modal {
  --width: 350px;
  --min-width: 250px;
  --height: fit-content;
  --border-radius: 20px;
}
</style>
