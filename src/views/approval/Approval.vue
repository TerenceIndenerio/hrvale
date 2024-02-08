<template>
  <ion-page>
    <HeaderUser
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :imgLogo="theme.clientLogo"
    ></HeaderUser>
    <ion-content :fullscreen="true" v-if="!loading">
      <Refresher />
      <div id="header"></div>
      <ion-card class="neomorphic-card-1 request-type-container">
        <ion-select
          label="Select Request Type"
          label-placement="floating"
          class="select-option neomorphic-input-2"
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

      <div
        v-for="(result, index) in results"
        :key="index"
        class="card-container"
      >
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
      loading: true,
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

    handleCheckButtonClick(action, code, requestDataId, requestId) {
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

    async fetchRequest() {
      try {
        this.store.commit("loader/updateLoader", true);

        const storedToken = localStorage.getItem("_token");

        if (!storedToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const api = baseURL + "api/v2/admin/requests?limit=50&offset=0";
        const dataResponse = await axios.get(api, { headers });

        if (dataResponse.data && Array.isArray(dataResponse.data.data)) {
          const uniqueRequestTypes = {};
          dataResponse.data.data.forEach((period) => {
            uniqueRequestTypes[period.requestType] = period.requestType;
          });

          this.requestTypeOption = Object.values(uniqueRequestTypes).map(
            (requestType) => ({
              label: requestType,
              value: requestType,
            })
          );

          this.results = dataResponse.data.data.map((period) => ({
            id: period.id,
            employee: period.employeeName,
            requestTypeId: period.requestTypeId,
            requestType: period.requestType,
            code: period.code,
            requestDataId: period.requestDataId,
            status: period.status,
            date: period.dateApplied,
          }));
        }

        this.store.commit("loader/updateLoader", false);
        this.loading = false;
      } catch (error) {
        console.error("Error fetching payroll period options: ", error);

        if (error.response && error.response.status === 401) {
          console.log("Session expired. Redirecting to login...");
          this.$router.push("/login");
        } else {
          this.showErrorMessage("An error occurred: " + error.message);

          const errorMessage =
            error.response?.data?.error?.message || error.message;
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
      }
    },
    // Approval Filter
    async handleApprovalTypeChange(selectedRequestType) {
      try {
        this.store.commit("loader/updateLoader", true);

        const storedToken = localStorage.getItem("_token");
        if (!storedToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const api = baseURL + "api/v2/admin/requests?limit=50&offset=0";
        const dataResponse = await axios.get(api, { headers });

        if (dataResponse.data && Array.isArray(dataResponse.data.data)) {
          this.results = dataResponse.data.data.map((period) => ({
            id: period.id,
            employee: period.employeeName,
            requestTypeId: period.requestTypeId,
            requestType: selectedRequestType,
            code: period.code,
            requestDataId: period.requestDataId,
            status: period.status,
            date: period.dateApplied,
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
          position: "top",

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
    // Leave Request
    async leaveRequest(requestId, action) {
      try {
        this.store.commit("loader/updateLoader", true);

        const storedToken = localStorage.getItem("_token");

        if (!storedToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const payloadVal = action === "approve" ? "approved" : "declined";
        const payload =
          action === "approve"
            ? { status: "approved" }
            : { status: "declined" };

        const api =
          baseURL +
          "api/v2/admin/update-request/" +
          requestId +
          "?status=" +
          payloadVal;

        const dataResponse = await axios.put(api, payload, { headers });

        const successMessage =
          action === "approve"
            ? "Request successfully approved!"
            : "Request successfully declined";

        const successToast = await toastController.create({
          message: successMessage,
          duration: 3000,
          position: "top",
          color: "success",
          buttons: [
            {
              icon: "checkmark-circle-outline",
              role: "cancel",
            },
          ],
        });

        await successToast.present();

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
    // OT
    async otRequest(requestId, action) {
      try {
        this.store.commit("loader/updateLoader", true);

        const storedToken = localStorage.getItem("_token");
        if (!storedToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const payloadVal = action === "approve" ? "approved" : "declined";
        const payload =
          action === "approve"
            ? { status: "approved" }
            : { status: "declined" };

        const api =
          baseURL +
          "api/v2/admin/overtime/" +
          requestId +
          "?status=" +
          payloadVal;
        const dataResponse = await axios.put(api, payload, { headers });

        const successMessage =
          action === "approve"
            ? "Overtime request successfully approved!"
            : "Overtime request successfully declined";

        const successToast = await toastController.create({
          message: successMessage,
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

        await successToast.present();

        this.store.commit("loader/updateLoader", false);
        this.fetchRequest();
      } catch (error) {
        console.error("Error updating overtime request: ", error);
        this.showErrorMessage("An error occurred: " + error.message);

        const errorMessage =
          error.response?.data?.error?.message || error.message;
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
    // Attendance
    async attendanceCorrection(requestId, action) {
      try {
        this.store.commit("loader/updateLoader", true);

        const storedToken = localStorage.getItem("_token");
        if (!storedToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const payloadVal = action === "approve" ? "approved" : "declined";
        const payload =
          action === "approve"
            ? { status: "approved" }
            : { status: "declined" };

        const api =
          baseURL +
          "api/v2/admin/update-request/" +
          requestId +
          "?status=" +
          payloadVal;
        const dataResponse = await axios.put(api, payload, { headers });

        const successToast = await toastController.create({
          message: `Successfully ${action} Attendance Correction!`,
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

        await successToast.present();

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
    // Vale
    async valeRequest(requestId, action) {
      try {
        this.store.commit("loader/updateLoader", true);

        const storedToken = localStorage.getItem("_token");
        if (!storedToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const payloadVal = action === "approve" ? "approved" : "declined";
        const payload =
          action === "approve"
            ? { status: "approved" }
            : { status: "declined" };

        const api =
          baseURL +
          "api/v2/admin/update-request/" +
          requestId +
          "?status=" +
          payloadVal;
        const dataResponse = await axios.put(api, payload, { headers });

        const successToast = await toastController.create({
          message: `Successfully ${action} vale!`,
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

        await successToast.present();

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
    this.checkTokenExpiration();
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
.card {
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8);
}

.select-option {
  width: fit-content;
  min-width: 300px;
  background-color: rgba(128, 128, 128, 0.184);
  border-radius: 20px;
  padding: 0 10px;
  margin: 10px auto;
}
.card-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
.request-type-container {
  margin: 20px auto;
}
</style>
