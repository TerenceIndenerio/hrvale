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
      <div class="content-container">
        <ion-card
          class="neomorphic-card-1"
          :style="{ color: theme.primaryColor }"
        >
          <div class="card-inner">
            <!-- from -->
            <div class="card-inner-inner">
              <p :style="{ color: theme.primaryColor }" class="label">From</p>
              <div class="neomorphic-datepicker-1 date-picker">
                <ion-input v-model="selectedDateFrom" type="date"></ion-input>
              </div>
            </div>

            <!-- to -->
            <div class="card-inner-inner">
              <p :style="{ color: theme.primaryColor }" class="label">To</p>
              <div class="neomorphic-datepicker-1 date-picker">
                <ion-input v-model="selectedDateTo" type="date"></ion-input>
              </div>
            </div>
          </div>

          <div class="card-inner">
            <div class="card-inner-inner">
              <p :style="{ color: theme.primaryColor }" class="label">
                Request Date
              </p>
              <div class="neomorphic-datepicker-1 date-picker">
                <ion-input v-model="requestDate" type="date"></ion-input>
              </div>
            </div>
            <div class="card-inner-inner">
              <ion-button
                @click="handleSearch"
                class="neomorphic-btn-2 search-btn"
                color="none"
                :style="{ backgroundColor: theme.primaryColor }"
                ><ion-icon name="search"></ion-icon>Search</ion-button
              >
            </div>
          </div>
        </ion-card>

        <ion-card v-if="showCommentContainer" class="card comment-container">
          <p :style="{ color: theme.primaryColor }" class="label">Comment</p>
          <ion-textarea
            v-model="comment"
            placeholder="Enter your comment"
          ></ion-textarea>
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

        <div class="result-container" v-if="results">
          <OTCard
            v-for="result in results"
            :key="result.id"
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
        </div>
      </div>
      <ion-modal :is-open="isOpen" id="modal">
        <ion-card class="card-modal">
          <ion-icon
            @click="isOpen = false"
            name="close"
            :style="{ color: theme.primaryColor }"
            class="close-btn"
          ></ion-icon>

          <ion-grid class="modal-content">
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

      <ion-button
        @click="toggleCommentContainer"
        class="flex-right comment-btn-container neomorphic-btn-2"
        color="none"
        :style="{ backgroundColor: theme.primaryColor }"
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
    toggleCommentContainer() {
      this.showCommentContainer = !this.showCommentContainer;
    },
    async handleSubmit() {
      try {
        this.store.commit("loader/updateLoader", true);
        console.log(
          this.selectedDateFrom,
          this.selectedDateTo,
          this.requestDate
        );
        await this.checkTokenExpiration();

        this.storedToken = localStorage.getItem("token");

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

        const toast = await toastController.create({
          message: "Successfully Sent!",
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

        console.log("Response:", response.data);
      } catch (error) {
        this.store.commit("loader/updateLoader", false);
        console.error("Error submitting overtime request: ", error);
        this.showErrorMessage(error.response?.data?.error?.message);
      } finally {
        this.store.commit("loader/updateLoader", false);
        this.showCommentContainer = !this.showCommentContainer;
      }
    },

    async fetchRequest() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();

        this.storedToken = localStorage.getItem("token");

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

        this.showErrorMessage(error.response?.data?.error?.message);
        const errorMessage = error.response.data.error.message;
      }
    },

    async handleSearch() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();

        this.storedToken = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split("T")[0];
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

        this.showErrorMessage(error.response?.data?.error?.message);
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

    handleView(result) {
      this.selectedResult = result;
      this.isOpen = true;
    },

    fetchTheme() {
      const storedThemeData = localStorage.getItem("themeData");

      const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};

      this.theme = themeData;
    },
  },
  created() {
    this.fetchTheme();
    this.fetchRequest();
    this.loading = false;
  },
});
</script>

<style scoped>
* {
  font-size: 14px;
}
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
  margin-top: 50%;
  /* box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8), 0px -4px 8px rgba(0, 0, 0, 0.05); */
}
.card-inner {
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  justify-content: space-between;
  margin: 0;
}
.result-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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

.content-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 0;
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
  padding: 0 5px;
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
  z-index: 999;
}

#modal {
  --background: rgba(255, 0, 0, 0);
}

.search-btn {
  width: 100%;
  margin-top: 25px;
  width: 130px;
  height: 40px;
}
.label {
  font-family: "Inter";
  font-weight: 700;
}
.date-picker {
  height: 40px;
  width: 150px;
  text-align: center;
}
.card-title {
  text-align: center;
  margin: 10px 0;
  font-weight: bold;
  font-family: "Inter";
  font-size: 16px;
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
.modal-content {
  margin-top: 20px;
}
</style>
