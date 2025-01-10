<template>
  <ion-modal :is-open="isOpen" @dismiss="closeModal">
    <ion-content>
      <div
        class="modal-container"
        :style="{ backgroundColor: theme.primaryColor }"
      >
        <h2 class="title" :style="{ color: theme.primaryFontColor }">
          Employee's Loan Details
        </h2>

        <ion-icon
          name="close-circle"
          @click="closeModal"
          class="close-btn"
          :style="{ color: theme.primaryFontColor }"
        ></ion-icon>
        <ion-card class="card">
          <ion-grid>
            <ion-col size="6">
              <ion-row>
                <ion-col size="6">
                  <p>Name:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ selectedResult.name }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Loan Date:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ selectedResult.loanDate }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Start of Payment:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ selectedResult.startPaymentDate }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Loan Type:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ selectedResult.loanType }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Principal Amount:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ selectedResult.loanAmount }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Schedule of Deduction:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ selectedResult.schedOfDeduction }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Amortization:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ selectedResult.amortization }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Reason:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ selectedResult.reason }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Status:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ selectedResult.status }}</p>
                </ion-col>
              </ion-row>
            </ion-col>
          </ion-grid>
        </ion-card>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script>
import {
  IonModal,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonToggle,
  toastController,
  IonToast,
  IonIcon,
} from "@ionic/vue";
import { defineComponent } from "vue";
import axios from "axios";
import { GlobalConstants } from "@/config/constants";

export default defineComponent({
  components: {
    IonModal,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonToggle,
    toastController,
    IonToast,
    IonIcon,
  },
  props: {
    isOpen: Boolean,
    selectedResult: Object,
    theme: Object,
  },
  data() {
    return {
      stopPayment: false,
      storedToken: null,
    };
  },
  methods: {
    closeModal() {
      this.$emit("dismiss");
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
    async togglePayment(id) {
      try {
        this.storedToken = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };
        const baseURL = localStorage.getItem("baseUrl");
        const api =
          baseURL +
          `api/payroll/employee-loan/stop-payment/update?id=${id}&stopPayment=${this.stopPayment}`;

        const dataResponse = await axios.put(api, { headers });
      } catch (error) {
        this.showErrorMessage(
          "An error occurred: " + error.response?.data?.error?.message
        );
      }
    },
  },
});
</script>

<style scoped>
.title {
  text-align: center;
}

.card {
  padding: 0 10px 0 10px;
  border-radius: 20px;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 30px;
}

.modal-container {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
