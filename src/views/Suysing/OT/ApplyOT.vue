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
          <div class="card-inner date-picker-container">
            <!-- from -->
            <p :style="{ color: theme.primaryColor }" class="label">
              Select Date
            </p>
            <div class="neomorphic-datepicker-1 date-picker">
              <ion-input
                v-model="selectedDateFrom"
                type="date"
                class="date-input"
              ></ion-input>
            </div>
          </div>

          <div class="card-inner">
            <ion-button
              @click="handleSearch"
              class="neomorphic-btn-2 search-btn"
              color="none"
              :style="{ backgroundColor: theme.primaryColor }"
              ><ion-icon name="search"></ion-icon>Search</ion-button
            >
          </div>
        </ion-card>

        <div class="result-container" v-if="results">
          <ion-card
            v-for="result in results"
            :key="result.id"
            class="neomorphic-card-1 card-content-container"
          >
            <ion-card-content>
              <ion-grid>
                <h3 class="card-title" :style="{ color: theme.primaryColor }">
                  <strong>Apply OT Details</strong>
                </h3>

                <ion-row>
                  <ion-col size="6">
                    <p><strong>Date:</strong></p>
                  </ion-col>
                  <ion-col size="6">
                    <p :style="{ color: theme.primaryColor }">
                      <strong>{{ result.date }}</strong>
                    </p>
                  </ion-col>
                </ion-row>

                <ion-row>
                  <ion-col size="6">
                    <p><strong>Schedule In:</strong></p>
                  </ion-col>
                  <ion-col size="6">
                    <p :style="{ color: theme.primaryColor }">
                      <strong>{{ result.scheduleIn }}</strong>
                    </p>
                  </ion-col>
                </ion-row>

                <ion-row>
                  <ion-col size="6">
                    <p><strong>Schedule Out:</strong></p>
                  </ion-col>
                  <ion-col size="6">
                    <p :style="{ color: theme.primaryColor }">
                      <strong>{{ result.scheduleOut }}</strong>
                    </p>
                  </ion-col>
                </ion-row>

                <ion-row>
                  <ion-col size="6">
                    <p><strong>Actual In:</strong></p>
                  </ion-col>
                  <ion-col size="6">
                    <p :style="{ color: theme.primaryColor }">
                      <strong>{{ result.actualIn }}</strong>
                    </p>
                  </ion-col>
                </ion-row>

                <ion-row>
                  <ion-col size="6">
                    <p><strong>Actual Out:</strong></p>
                  </ion-col>
                  <ion-col size="6">
                    <p :style="{ color: theme.primaryColor }">
                      <strong>{{ result.actualOut }}</strong>
                    </p>
                  </ion-col>
                </ion-row>

                <ion-row>
                  <ion-col size="6">
                    <p><strong>Fixed OT In:</strong></p>
                  </ion-col>
                  <ion-col size="6">
                    <p :style="{ color: theme.primaryColor }">
                      <strong>{{ result.fixedOtIn }}</strong>
                    </p>
                  </ion-col>
                </ion-row>

                <ion-row>
                  <ion-col size="6">
                    <p><strong>Fixed OT Out:</strong></p>
                  </ion-col>
                  <ion-col size="6">
                    <p :style="{ color: theme.primaryColor }">
                      <strong>{{ result.fixedOtOut }}</strong>
                    </p>
                  </ion-col>
                </ion-row>

                <ion-row>
                  <ion-col size="6">
                    <p><strong>OT Hours:</strong></p>
                  </ion-col>
                  <ion-col size="6">
                    <p :style="{ color: theme.primaryColor }">
                      <strong>{{ result.otHours }}</strong>
                    </p>
                  </ion-col>
                </ion-row>

                <ion-row>
                  <ion-col size="6">
                    <p><strong>Reason:</strong></p>
                  </ion-col>
                  <ion-col size="6">
                    <p :style="{ color: theme.primaryColor }">
                      <strong>{{ result.reason }}</strong>
                    </p>
                  </ion-col>
                </ion-row>

                <ion-row>
                  <ion-col size="6">
                    <p><strong>Status:</strong></p>
                  </ion-col>
                  <ion-col size="6">
                    <p :style="{ color: theme.primaryColor }">
                      <strong>{{ result.status }}</strong>
                    </p>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-button
                    @click="handleSubmit"
                    class="neomorphic-btn-2 apply-btn-container"
                    color="none"
                    :style="{ backgroundColor: theme.primaryColor }"
                  >
                    Submit
                  </ion-button>
                </ion-row>
              </ion-grid>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
      <div class="recent-container">
        <h5 :style="{ color: theme.primaryColor }">Recent Transaction</h5>
        <ion-button
          expand="full"
          color="None"
          class="recent-btn neomorphic-btn-2"
          @click="navigateToRecent()"
          :style="{
            outline: `2px solid ${theme.primaryColor}`,
            color: theme.primaryColor,
          }"
        >
          View All
        </ion-button>
      </div>

      <!-- alert successfully submitted -->
      <ion-modal :is-open="isSuccessful" id="modal">
        <ion-card class="card-modal">
          <ion-card-header>
            <ion-card-title class="modal-header">Success</ion-card-title>
          </ion-card-header>
          <ion-icon
            name="checkmark-circle"
            :style="{ color: theme.successColor }"
            class="close-btn"
          ></ion-icon>

          <ion-grid class="modal-content">
            <p>Apply OT Sent Successfully!</p>
            <ion-row>
              <ion-col>
                <ion-button @click="confirmSuccess">Okay</ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card>
      </ion-modal>
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
  IonSelect,
  IonSelectOption,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
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
    IonSelect,
    IonSelectOption,
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
      headerTitle: "Approval",
      results: [],
      headerTitle: "Apply OT",
      selectedDateFrom: formattedDate,
      selectedDateTo: formattedDate,
      requestDate: formattedDate,
      requestDateSelected: formattedDate,
      requestDates: [],
      isModalVisible: false,
      selectedResult: null,
      isOpen: false,
      theme: {},
      loading: true,
      comment: "",
      showCommentContainer: false,
      storedToken: null,
      selectedReason: null,
      reasonOptions: [],
      isSuccessful: false,
      date: null,
      dateEnd: null,
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

    toggleCommentContainer() {
      this.showCommentContainer = !this.showCommentContainer;
    },

    handleCheck({ date, checked }) {
      if (!this.checkedDates) {
        this.checkedDates = [];
      }

      if (checked) {
        this.checkedDates.push(date);
      } else {
        const index = this.checkedDates.indexOf(date);
        if (index > -1) {
          this.checkedDates.splice(index, 1);
        }
      }

      if (this.checkedDates.length > 0) {
        const sortedDates = this.checkedDates
          .slice()
          .sort((a, b) => new Date(a) - new Date(b));
        this.date = sortedDates[0];
        this.dateEnd = sortedDates[sortedDates.length - 1];
      } else {
        this.date = null;
        this.dateEnd = null;
      }
      console.log(this.date, this.dateEnd);
    },

    async handleSubmit() {
      try {
        this.store.commit("loader/updateLoader", true);

        await this.checkTokenExpiration();

        this.date = this.selectedDateFrom;
        this.dateEnd = this.selectedDateTo;

        this.storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");

        const apiUrl = `${baseURL}api/ess/overtime?limit=50&offset=0&date=${this.date}&dateEnd=${this.dateEnd}`;

        const response = await axios.get(apiUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.storedToken}`,
          },
        });

        if (response.status >= 200 && response.status < 300) {
          this.isSuccessful = true;
        }
      } catch (error) {
        this.store.commit("loader/updateLoader", false);
        console.error(
          "Error submitting overtime request: ",
          error.response?.data?.error?.message || error.message
        );

        if (error.response && error.response.status === 500) {
          this.showErrorMessage(error.response.data.error.message);
        }
      } finally {
        this.store.commit("loader/updateLoader", false);
        this.showCommentContainer = !this.showCommentContainer;
      }
    },

    async fetchReasonOptions() {
      try {
        await this.checkTokenExpiration();

        this.storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };

        const api =
          baseURL +
          `api/v2/reasons?limit=50&offset=0&sortField=r.id&sortOrder=DESC`;

        const response = await axios.get(api, { headers });

        this.reasonOptions = response.data.data
          .filter((item) => item.code == "overtime")
          .map((item) => ({
            id: item.id,
            type: item.type,
            content: item.content,
          }));
      } catch (error) {
        console.error("Error fetching reason options:", error);
      }
    },

    async fetchRequest() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();

        this.storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split("T")[0];
        const api =
          baseURL +
          `api/ess/overtime?limit=50&offset=0&date=${formattedDate}&dateEnd=${formattedDate}`;
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

        this.requestDate = formattedDate;

        this.requestDates = [this.requestDate];

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
        const baseURL = localStorage.getItem("baseUrl");
        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };

        this.selectedDateTo = new Date(
          new Date(this.selectedDateFrom).setDate(
            new Date(this.selectedDateFrom).getDate() + 1
          )
        )
          .toISOString()
          .split("T")[0];

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split("T")[0];
        const api =
          baseURL +
          `api/ess/overtime?limit=50&offset=0&date=${this.selectedDateFrom}&dateEnd=${this.selectedDateTo}`;
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

    navigateToRecent() {
      this.$router.push("/suysing_recentapplyot");
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

    confirmSuccess() {
      this.isSuccessful = false;

      setTimeout(() => {
        window.location.replace(`/suysing_applyot`);
      }, 1000);
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
  async created() {
    await this.checkTokenExpiration();
    this.fetchTheme();
    this.fetchRequest();
    this.fetchReasonOptions();
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

.apply-btn-container {
  margin-left: auto;
  border-radius: 10px;
  height: fit-content;
}

#modal {
  --background: rgba(255, 0, 0, 0);
}

.search-btn {
  width: 130px;
  height: 40px;
  margin-left: auto;
}
.label {
  font-family: "Inter";
  font-weight: 700;
}
.date-picker {
  height: 40px;
  width: 230px;
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

.date-input {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 120px;
}
.modal-content {
  margin: 0 0 10px 0;
  text-align: center;
}
#modal {
  --background: rgba(255, 0, 0, 0);
}
.modal-header {
  text-align: center;
  font-size: 18px;
}
.card-modal {
  border-radius: 20px;
  max-width: 400px;
  margin-top: 50%;
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
  z-index: 10;
}
.date-picker-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.card-content-container {
  min-width: 300px;
}
.recent-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: row;
  max-width: 500px;
  margin: 0 auto 50px auto;
}
.recent-container h5 {
  font-family: Poppins;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
}
.recent-btn {
  width: 100px;
  border-radius: 10px;
  padding: 0;
  height: 30px;
}
</style>
