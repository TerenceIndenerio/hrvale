<template>
  <ion-page>
    <HeaderUser :headerTitle="headerTitle" :headerColor="theme.primaryColor"></HeaderUser>
    <ion-content :fullscreen="true">
      <Refresher />
      <ion-card class="card">
        <ion-select
          label="Select Request Type"
          label-placement="floating"
          class="box-container select-option"
          @ionChange="handleApprovalTypeChange($event.detail.value)"
        >
          <ion-select-option
            v-for="option in requestTypeOption"
            :key="option.value"
            :value="option.value"
            class="non-center"
          >
            {{ option.label }}
          </ion-select-option>
        </ion-select>
      </ion-card>

      <ion-card class="card">
        <div v-for="(result, index) in results" :key="index" class="card-container">
          <ApprovalCard
            :status="result.status"
            :employeeName="result.employee"
            :requestType="result.requestType"
            :code="result.code"
            :requestDataId="result.requestDataId"
            :requestId="result.id"
            :date="result.date"
            @checkButtonClick="handleCheckButtonClick"
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
  IonCard,
  IonSelect,
  IonSelectOption,
  toastController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import HeaderUser from "@/components/header/HeaderUser.vue";
import ApprovalCard from "@/views/approval/component/ApprovalCard.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import { GlobalConstants } from "@/config/constants";
import { getThemeData } from "@/theme/theme";

const baseURL = GlobalConstants.HOST_URL;

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    HeaderUser,
    Refresher,
    IonCard,
    ApprovalCard,
    IonSelect,
    IonSelectOption,
    toastController,
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
      requestTypeOption: [],
      results: [],
      theme: {},
    };
  },
  methods: {
    handleCheckButtonClick(action, code, requestDataId, requestId) {
      console.log(`Check button clicked for request type: ${code}`);
      console.log(`code: ${code}`);
      console.log(`Request Data ID: ${requestDataId}`);
      console.log(`Status: ${action}`);
      console.log(`Status: ${requestId}`);

      switch (code) {
        case "leave":
          this.leaveRequest(requestId, action);
          break;
        case "overtime":
          this.otRequest(requestId, action);
          break;
        case "attendance_correction":
          this.attendanceCorrection(requestId, action);
          break;
        case "vale":
          this.valeRequest(requestId, action);
          break;
        default:
          break;
      }
    },

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

        const api = baseURL + "api/v2/admin/requests?limit=50&offset=0";
        const dataResponse = await axios.get(api, { headers });

        if (dataResponse.data && Array.isArray(dataResponse.data.data)) {
          const uniqueRequestTypes = {};
          dataResponse.data.data.forEach((period) => {
            uniqueRequestTypes[period.requestTypeId] = period.requestType;
          });

          this.requestTypeOption = Object.values(uniqueRequestTypes).map(
            (requestType) => ({
              label: requestType,
              value: requestType,
            })
          );

          this.results = dataResponse.data.data.map((period) => ({
            id: period.id,
            employee: period.employee,
            requestTypeId: period.requestTypeId,
            requestType: period.requestType,
            code: period.code,
            requestDataId: period.requestDataId,
            status: period.status,
            date: new Date(period.dateApplied.date).toLocaleDateString(),
          }));
        }
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

    async handleApprovalTypeChange(selectedRequestType) {
      try {
        this.store.commit("loader/updateLoader", true);

        await this.fetchAuthToken();
        if (!this.authToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${this.authToken}`,
        };

        const api = baseURL + "api/v2/admin/requests?limit=50&offset=0";
        const dataResponse = await axios.get(api, { headers });

        if (dataResponse.data && Array.isArray(dataResponse.data.data)) {
          const uniqueRequestTypes = {};
          dataResponse.data.data.forEach((period) => {
            uniqueRequestTypes[period.requestTypeId] = period.requestType;
          });

          this.requestTypeOption = Object.values(uniqueRequestTypes).map(
            (requestType) => ({
              label: requestType,
              value: requestType,
            })
          );

          this.results = dataResponse.data.data.map((period) => ({
            id: period.id,
            employee: period.employee,
            requestTypeId: period.requestTypeId,
            requestType: selectedRequestType,
            code: period.code,
            requestDataId: period.requestDataId,
            status: period.status,
            date: new Date(period.dateApplied.date).toLocaleDateString(),
          }));
        }

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

    async leaveRequest(requestId, action) {
      try {
        this.store.commit("loader/updateLoader", true);

        await this.fetchAuthToken();

        if (!this.authToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${this.authToken}`,
        };

        const payloadVal = action === "approve" ? "approved" : "declined";
        const payload =
          action === "approve" ? { status: "approved" } : { status: "declined" };

        const api =
          baseURL + "api/v2/admin/update-request/" + requestId + "?status=" + payloadVal;
        // const payload = action === "approve" ? { status: "approved" } : { status: "declined" };
        const dataResponse = await axios.put(api, payload, { headers });

        const toast = await toastController.create({
          message: `Successfully ` + action + ` leave request!`,
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

        this.store.commit("loader/updateLoader", false);
        this.fetchRequest();
      } catch (error) {
        console.error("Error updating Attendance Correction: ", error);
        this.showErrorMessage("An error occurred: " + error.message);

        const errorMessage = error.response?.data?.error?.message;
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

    async otRequest(requestId, action) {
      try {
        this.store.commit("loader/updateLoader", true);

        await this.fetchAuthToken();
        if (!this.authToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${this.authToken}`,
        };
        console.log(this.authToken);
        const payloadVal = action === "approve" ? "approved" : "declined";
        const payload =
          action === "approve" ? { status: "approved" } : { status: "declined" };

        const api =
          baseURL + "api/v2/admin/overtime/" + requestId + "?status=" + payloadVal;
        const dataResponse = await axios.put(api, payload, { headers });

        const toast = await toastController.create({
          message: "Successfully " + action + " overtime request!",
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

        this.store.commit("loader/updateLoader", false);
        this.fetchRequest();
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

    async attendanceCorrection(requestId, action) {
      try {
        this.store.commit("loader/updateLoader", true);

        await this.fetchAuthToken();

        if (!this.authToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${this.authToken}`,
        };

        const payloadVal = action === "approve" ? "approved" : "declined";
        const payload =
          action === "approve" ? { status: "approved" } : { status: "declined" };

        const api =
          baseURL + "api/v2/admin/update-request/" + requestId + "?status=" + payloadVal;
        const dataResponse = await axios.put(api, payload, { headers });

        const toast = await toastController.create({
          message: `Successfully ` + action + ` Attendance Correction!`,
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

        this.store.commit("loader/updateLoader", false);
        this.fetchRequest();
      } catch (error) {
        console.error("Error updating Attendance Correction: ", error);
        this.showErrorMessage("An error occurred: " + error.message);

        const errorMessage = error.response?.data?.error?.message;
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

    async valeRequest(requestId, action) {
      try {
        this.store.commit("loader/updateLoader", true);

        await this.fetchAuthToken();

        if (!this.authToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${this.authToken}`,
        };

        const payloadVal = action === "approve" ? "approved" : "declined";
        const payload =
          action === "approve" ? { status: "approved" } : { status: "declined" };

        const api =
          baseURL + "api/v2/admin/update-request/" + requestId + "?status=" + payloadVal;
        const dataResponse = await axios.put(api, payload, { headers });

        const toast = await toastController.create({
          message: `Successfully ` + action + ` vale!`,
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

        this.store.commit("loader/updateLoader", false);
        this.fetchRequest();
      } catch (error) {
        console.error("Error updating Attendance Correction: ", error);
        this.showErrorMessage("An error occurred: " + error.message);

        const errorMessage = error.response?.data?.error?.message;
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
  },

  created() {
    this.fetchRequest();

    const storedThemeData = getThemeData();

    if (storedThemeData) {
      this.theme = storedThemeData;
    }
    this.theme = storedThemeData;
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
.card {
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.card h1 {
  font-size: 70px;
  font-family: "Open Sans";
}

.select-option {
  width: fit-content;
  min-width: 300px;
  background-color: rgba(128, 128, 128, 0.184);
  border-radius: 10px;
  padding: 0 10px;
  margin: 10px auto;
}
.card-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
