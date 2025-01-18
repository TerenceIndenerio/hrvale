<template>
  <ion-modal
    :is-open="isOpen"
    @did-dismiss="closeModal"
    class="modal-container"
  >
    <ion-header>
      <ion-toolbar
        color="none"
        :style="{ backgroundColor: theme.primaryColor }"
      >
        <ion-title :style="{ color: theme.primaryFontColor }"
          >Payslip Details</ion-title
        >
        <ion-buttons slot="end">
          <ion-button
            @click="closeModal"
            :style="{ color: theme.primaryFontColor }"
            >Close</ion-button
          >
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="modal-content">
        <ion-grid>
          <ion-row class="row-container">
            <ion-col class="column-container">
              <h5><strong>Income</strong></h5>
              <div v-for="income in viewPayslipData.income" :key="income.name">
                <div class="row">
                  <span>{{ income.name }}</span>
                  <span class="value">{{ formatAmount(income.amount) }}</span>
                </div>
              </div>
            </ion-col>

            <ion-col class="column-container">
              <h5><strong>Deductions</strong></h5>

              <div
                v-for="deduction in viewPayslipData.deductions"
                :key="deduction.name"
              >
                <div class="row">
                  <span>{{ deduction.name }}</span>
                  <span class="value">{{
                    formatAmount(deduction.amount)
                  }}</span>
                </div>
              </div>
            </ion-col>
          </ion-row>
          <div class="totals column-container">
            <div class="row">
              <span><strong>Gross Pay:</strong></span>
              <span class="value"
                ><strong>{{ formatAmount(grossPay) }}</strong></span
              >
            </div>
            <div class="row">
              <span><strong>Net Pay:</strong></span>
              <span class="value"
                ><strong>{{ formatAmount(netPay) }}</strong></span
              >
            </div>
          </div>
        </ion-grid>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script>
import {
  IonModal,
  IonContent,
  IonGrid,
  IonToolbar,
  IonButton,
  IonTitle,
  IonCol,
  IonRow,
  IonButtons,
  IonHeader,
} from "@ionic/vue";
export default {
  components: {
    IonModal,
    IonGrid,
    IonContent,
    IonToolbar,
    IonButton,
    IonTitle,
    IonCol,
    IonRow,
    IonButtons,
    IonHeader,
  },
  props: {
    isOpen: Boolean,
    incomeDetails: Array,
    deductionDetails: Array,
    grossPay: String,
    netPay: String,
    viewPayslipData: Object,
    theme: Object,
  },
  methods: {
    closeModal() {
      this.$emit("update:isOpen", false);
    },
    formatAmount(amount) {
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    },
  },
};
</script>

<style scoped>
.modal-container {
  border-radius: 20px;
  overflow: hidden;
  max-width: 500px;
  max-height: 600px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  --background: rgba(255, 0, 0, 0);

  border: 1px solid rgb(216, 216, 216);
}

.modal-content {
  padding: 10px;
}
.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.value {
  font-weight: bold;
  text-align: right;
}
.totals {
  margin-top: 20px;
}
.column-container {
  background-color: rgb(240, 240, 240);
  padding: 10px;
  margin: 5px;
  border-radius: 10px;
}
@media (max-width: 768px) {
  .row-container {
    display: flex;
    flex-direction: column;
    height: 700px;
  }
  .column-container {
    background-color: rgb(240, 240, 240);
    padding: 10px;
    margin: 5px auto;
    border-radius: 10px;
  }
}
</style>
