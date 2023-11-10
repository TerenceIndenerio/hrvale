<template>
  <ion-page>
    <HeaderUser :headerTitle="headerTitle"></HeaderUser>
    <ion-content :fullscreen="true">
      <Refresher />
      <ion-card class="card">
        <ion-select
          label="Select Request Type"
          label-placement="floating"
          class="box-container select-option"
          @ionChange="handleApprovalTypeChange"
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
        <div
          v-for="(result, index) in results"
          :key="index"
          class="card-container"
        >
          <ApprovalCard
            :status="result.status"
            :employeeName="result.employee"
            :requestType="result.requestType"
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
} from "@ionic/vue";
import { defineComponent } from "vue";
import HeaderUser from "@/components/header/HeaderUser.vue";
import ApprovalCard from "@/views/approval/component/ApprovalCard.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import axios from "axios";
import { GlobalConstants } from "@/config/constants";
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
  },
  data() {
    return { headerTitle: "Approval", requestTypeOption: [], results: [] };
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

        console.log(localStorage.getItem("_token", this.authToken));
      } catch (error) {
        console.error("Error fetching authentication token: ", error);
        this.showErrorMessage("An error occurred: " + error.message);

        const errorMessage =
          error.response.data.error.message || "Failed to load data";
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
        await this.fetchAuthToken();
        if (!this.authToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${this.authToken}`,
        };

        const api = baseURL + "api/v2/admin/requests?limit=50&offset=0";
        const dataResponse = await axios.get(api, { headers });

        console.log(dataResponse);
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
            employee: period.employee,
            requestTypeId: period.requestTypeId,
            requestType: period.requestType,
            status: period.status,
          }));
        }

        console.log("result:", this.results);
      } catch (error) {
        console.error("Error fetching payroll period options: ", error);
        this.showErrorMessage("An error occurred: " + error.message);

        const errorMessage =
          error.response.data.error.message || "Failed to load data";
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
  handleApprovalTypeChange() {
    console.log("hi");
  },
  created() {
    this.fetchRequest();
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
