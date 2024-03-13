<template>
  <ion-modal :is-open="isOpen" @dismiss="closeModal">
    <ion-content>
      <div
        class="modal-container"
        :style="{ backgroundColor: theme.primaryColor }"
      >
        <h2 class="title" :style="{ color: theme.primaryFontColor }">
          Vale Details
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
                  <p>Loan Date:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ selectedResult.loanDate }}</p>
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
                  <p>Loan Amount:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ selectedResult.loanAmount }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Effective Loan:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ selectedResult.effectiveLoan }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Interest Rate:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ selectedResult.interestRate }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Start of Payment:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ selectedResult.startOfPayment }}</p>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="6">
                  <p>Total Amount Paid:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ selectedResult.totalAmountPaid }}</p>
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

              <ion-row>
                <ion-col size="6">
                  <p>Reason:</p>
                </ion-col>
                <ion-col size="6">
                  <p>{{ selectedResult.reason }}</p>
                </ion-col>
              </ion-row>
            </ion-col>
          </ion-grid>
        </ion-card>
        <!-- Amortization -->
        <h4
          class="title outlineColor"
          :style="{ color: theme.primaryFontColor }"
        >
          {{ amortizationResult.length }} Amortizations Found
        </h4>
        <div v-if="amortizationResult.length > 0" class="container">
          <div v-for="(result, index) in amortizationResult" :key="index">
            <ion-card class="card">
              <h3 class="title">Amortization - #{{ index + 1 }}</h3>
              <ion-grid>
                <ion-col size="6">
                  <ion-row>
                    <ion-col size="6">
                      <p>Date:</p>
                    </ion-col>
                    <ion-col size="6">
                      <p>{{ result.paymentDate }}</p>
                    </ion-col>
                  </ion-row>

                  <ion-row>
                    <ion-col size="6">
                      <p>Loan Amount:</p>
                    </ion-col>
                    <ion-col size="6">
                      <p>{{ result.decoratedLoanAmount }}</p>
                    </ion-col>
                  </ion-row>

                  <ion-row>
                    <ion-col size="6">
                      <p>Payment:</p>
                    </ion-col>
                    <ion-col size="6">
                      <p>{{ result.decoratedAmount }}</p>
                    </ion-col>
                  </ion-row>

                  <ion-row>
                    <ion-col size="6">
                      <p>Balance:</p>
                    </ion-col>
                    <ion-col size="6">
                      <p>{{ result.balance }}</p>
                    </ion-col>
                  </ion-row>
                </ion-col>
              </ion-grid>
            </ion-card>
          </div>
        </div>
      </div>
      <!-- End -->
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
    amortizationResult: Array,
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

    getTheme() {
      const storedThemeData = getThemeData();

      if (storedThemeData) {
        this.theme = storedThemeData;
      }
      this.theme = storedThemeData;
    },

    async navigateToViewPage(result) {
      this.selectedResult = result;
      await this.fetchAmortization(result.id);
      this.showModal = true;
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
  },
});
</script>

<style scoped>
p {
  margin: 5px;
}
.title {
  text-align: center;
  margin: 20px auto 0 auto;
  width: 80%;
}

.card {
  padding: 0 10px 0 10px;
  border-radius: 20px;
  /* box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
              -8px -8px 16px rgba(255, 255, 255, 0.8), 
              0px -4px 8px rgba(0, 0, 0, 0.05),
              -8px -8px 16px rgba(0, 0, 0, 0.1);  */
}

.container {
  max-height: 90vh;
  overflow-y: scroll;
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 30px;
}

.outlineColor {
  border: 1px solid #828282;
  color: #828282;
  border-radius: 20px;
  margin-top: 30px;
}
.modal-container {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
