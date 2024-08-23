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
        <h4 class="text-center neomorphic-input-2 record-label">
          {{ totalRec }} Record(s) Found
        </h4>

        <div
          v-for="(result, index) in results"
          :key="index"
          class="session-card"
        >
          <div class="neomorphic-card-1 card-content-container">
            <ion-card-header>
              <ion-card-title>{{ result.name }}</ion-card-title>
              <ion-card-subtitle>
                {{ formatDate(result.startDate.date) }} -
                {{ formatDate(result.endDate.date) }}
              </ion-card-subtitle>
            </ion-card-header>

            <div class="card-content">
              <ion-item>
                <ion-label><strong>Location:</strong></ion-label>
                <ion-text>{{ result.deliveryLocation }}</ion-text>
              </ion-item>

              <ion-item>
                <ion-label><strong>Method:</strong></ion-label>
                <ion-text>{{ result.deliveryMethod }}</ion-text>
              </ion-item>

              <ion-item>
                <ion-label><strong>Status:</strong></ion-label>
                <ion-text>{{ result.status }}</ion-text>
              </ion-item>

              <ion-button
                expand="block"
                fill="outline"
                @click="handleViewTraining(result.trainingMaterials, result.id)"
              >
                View Training Materials
              </ion-button>

              <ion-button
                expand="block"
                color="primary"
                @click="openAssessmentModal"
              >
                Take Assessment
              </ion-button>
            </div>
          </div>
        </div>
      </div>
    </ion-content>

    <!-- Include the modal component -->
    <AssessmentModal ref="assessmentModal" />
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonText,
} from "@ionic/vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import { defineComponent } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import { GlobalConstants } from "@/config/constants";
import { toastController } from "@ionic/vue";
import AssessmentModal from "@/views/services/trainings/components/AssessmentModal.vue";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonInput,
    IonItem,
    HeaderReturn,
    IonLabel,
    Refresher,
    IonButton,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonText,
    AssessmentModal,
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
      headerTitle: "My Trainings",
      selectedDateFrom: formattedDate,
      selectedDateTo: formattedDate,
      isModalVisible: false,
      selectedResult: null,
      isOpen: false,
      theme: {},
      loading: true,
      totalRec: 0,
      paygradeId: 0,
      empNumber: "",
    };
  },
  methods: {
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

    async fetchRequest() {
      try {
        this.loading = true;
        this.store.commit("loader/updateLoader", true);
        const baseURL = localStorage.getItem("baseUrl");
        await this.checkTokenExpiration();

        const storedToken = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const api = baseURL + `api/v2/training/session?limit=50&offset=0`;

        const response = await axios.get(api, { headers });

        this.results = response.data.data;
        this.totalRec = this.results.length;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.error("Error fetching training sessions: ", error);

        this.showErrorMessage(error.response?.data?.error?.message);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
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

    fetchTheme() {
      const storedThemeData = localStorage.getItem("themeData");

      const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};

      this.theme = themeData;
    },

    handleViewTraining(trainingMaterials, id) {
      this.router.push({
        path: "/viewemployeesession",
        query: { id: id },
      });
    },

    openAssessmentModal() {
      this.$refs.assessmentModal.openModal();
    },
  },
  created() {
    this.empNumber = localStorage.getItem("empNumber");
    this.checkTokenExpiration();
    this.fetchTheme();
    this.fetchRequest();

    this.loading = false;
    console.log(this.results.length);
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
  margin: 0 auto;
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
.record-label {
  color: #828282;
  border-radius: 20px;
  padding: 5px 10px;
  width: fit-content;
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
}
.search-container {
  min-width: 330px;
}
ion-modal#example-modal {
  --width: 350px;
  --min-width: 250px;
  --height: fit-content;
  --border-radius: 20px;
}
.no-data-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.result-container {
  padding: 16px;
}

.summary-card {
  margin: 0 auto 16px auto;
  --ion-card-background: #f8f9fa;
}

.session-card {
  margin-bottom: 16px;
  --ion-card-background: #ffffff;
  --ion-card-border-radius: 12px;
  --ion-card-box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.text-center {
  text-align: center;
}

ion-card-title {
  font-size: 1.2em;
  font-weight: bold;
}

ion-card-subtitle {
  color: #6c757d;
}

ion-item {
  --inner-padding-top: 4px;
  --inner-padding-bottom: 4px;
}

ion-button {
  margin-top: 8px;
}
.card-content-container {
  width: 300px;
}
</style>
