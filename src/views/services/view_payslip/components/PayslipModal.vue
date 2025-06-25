<template>
  <ion-modal
    :is-open="isOpen"
    css-class="large-modal"
    @ionModalDidDismiss="closeModal"
  >
    <ion-content>
      <ion-grid>
        <!-- 13th Month Pay Section -->
        <ion-row
          v-if="isThirteenthMonth && thirteenthMonthData"
          style="background-color: lightgray"
        >
          <ion-col size="12">
            <ion-list>
              <ion-item-group>
                <ion-item-divider>
                  <h3
                    class="label-header"
                    :style="{ color: theme.primaryColor }"
                  >
                    <strong>13th Month Pay</strong>
                  </h3>
                </ion-item-divider>

                <ion-item lines="none">
                  <h5>
                    <strong>{{
                      formatPeriod(
                        thirteenthMonthData.payrollPeriod?.payrollPeriodFrom
                          ?.date,
                        thirteenthMonthData.payrollPeriod?.payrollPeriodTo?.date
                      )
                    }}</strong>
                  </h5>
                </ion-item>

                <ion-item lines="none">
                  <ion-label>
                    <strong>Total Earnings:</strong>
                  </ion-label>
                  <p slot="end" class="value">
                    {{ formatAmount(thirteenthMonthData.thirteenthMonthPay) }}
                  </p>
                </ion-item>

                <ion-item lines="none">
                  <ion-label>
                    <strong>13th Month Amount:</strong>
                  </ion-label>
                  <p slot="end" class="value">
                    <strong>{{
                      formatAmount(thirteenthMonthData.netBonus)
                    }}</strong>
                  </p>
                </ion-item>
              </ion-item-group>
            </ion-list>
          </ion-col>
        </ion-row>

        <ion-row
          v-if="selectedPaycycleId === 13 && viewPayslipData?.allowance"
          style="background-color: lightgray"
        >
          <ion-col size="12">
            <ion-list>
              <ion-item-group>
                <!-- Allowance Header -->
                <ion-item-divider>
                  <h3
                    class="label-header"
                    :style="{ color: theme.primaryColor }"
                  >
                    <strong>Allowance</strong>
                  </h3>
                </ion-item-divider>

                <!-- Allowance List -->
                <ion-item
                  v-for="(item, index) in viewPayslipData.allowance"
                  :key="'allowance-' + index"
                  lines="none"
                >
                  <ion-label>{{ item.name }}</ion-label>
                  <p slot="end" class="value">
                    {{ formatAmount(item.amount) }}
                  </p>
                </ion-item>

                <!-- Deductions Header -->
                <ion-item-divider>
                  <h3
                    class="label-header"
                    :style="{ color: theme.primaryColor }"
                  >
                    <strong>Deductions</strong>
                  </h3>
                </ion-item-divider>

                <!-- Deductions List -->
                <template
                  v-if="
                    viewPayslipData.deductions &&
                    viewPayslipData.deductions.length
                  "
                >
                  <ion-item
                    v-for="(deduction, index) in viewPayslipData.deductions"
                    :key="'deduction-' + index"
                    lines="none"
                  >
                    <ion-label>{{ deduction.name }}</ion-label>
                    <p slot="end" class="value">
                      {{ formatAmount(deduction.amount) }}
                    </p>
                  </ion-item>
                </template>
                <template v-else>
                  <ion-item lines="none">
                    <ion-label><strong>Deductions:</strong></ion-label>
                    <p slot="end" class="value">No available data</p>
                  </ion-item>
                </template>

                <br />
                <ion-item-divider>
                  <h3
                    class="label-header"
                    :style="{ color: theme.primaryColor }"
                  >
                    <strong>Totals</strong>
                  </h3>
                </ion-item-divider>

                <!-- Gross Allowance -->
                <ion-item lines="none">
                  <ion-label><strong>Gross Allowance:</strong></ion-label>
                  <p slot="end" class="value">{{ grossAllowance }}</p>
                </ion-item>

                <!-- Net Pay Allowance -->
                <ion-item lines="none">
                  <ion-label><strong>Net Pay Allowance:</strong></ion-label>
                  <p slot="end" class="value">{{ netPayAllowance }}</p>
                </ion-item>
              </ion-item-group>
            </ion-list>
          </ion-col>
        </ion-row>

        <!-- regular -->
        <div v-else>
          <ion-row class="details-container">
            <!-- Income Column -->
            <ion-col size="6" style="background-color: lightgray">
              <ion-list style="overflow-x: scroll">
                <ion-item-group>
                  <ion-item-divider>
                    <h3
                      class="label-header"
                      :style="{ color: theme.primaryColor }"
                    >
                      <strong>Income</strong>
                    </h3>
                  </ion-item-divider>
                  <!-- Header Row -->
                  <ion-item>
                    <ion-row style="width: 100%; font-weight: bold">
                      <ion-col size="4" class="responsive-text">
                        Description</ion-col
                      >
                      <ion-col size="2" class="responsive-text">Days</ion-col>
                      <ion-col size="2" class="responsive-text">Hours</ion-col>
                      <ion-col size="2" class="responsive-text"
                        >Minutes</ion-col
                      >
                      <ion-col size="2" class="responsive-text">Amount</ion-col>
                    </ion-row>
                  </ion-item>

                  <!-- Data Rows -->
                  <ion-item
                    v-for="income in viewPayslipData.income"
                    :key="income.name"
                  >
                    <ion-row style="width: 100%">
                      <ion-col size="4">
                        <div>{{ income.name }}</div>
                      </ion-col>
                      <ion-col size="2">
                        <p class="responsive-text">
                          {{ income.days || " - " }}
                        </p>
                      </ion-col>
                      <ion-col size="2">
                        <p class="responsive-text">
                          {{ income.hours || " - " }}
                        </p>
                      </ion-col>
                      <ion-col size="2">
                        <p class="responsive-text">
                          {{ income.minutes || " - " }}
                        </p>
                      </ion-col>
                      <ion-col size="2">
                        <p class="responsive-text-data">
                          {{ formatAmount(income.amount) }}
                        </p>
                      </ion-col>
                    </ion-row>
                  </ion-item>
                </ion-item-group>
              </ion-list>
            </ion-col>

            <!-- Deductions Column -->

            <ion-col size="6" style="background-color: lightgray">
              <ion-list>
                <ion-item-group>
                  <ion-item-divider>
                    <h3
                      class="label-header"
                      :style="{ color: theme.primaryColor }"
                    >
                      <strong>Deductions</strong>
                    </h3>
                  </ion-item-divider>

                  <ion-item
                    v-for="deduction in viewPayslipData.deductions"
                    :key="deduction.name"
                  >
                    <ion-label>{{ deduction.name }}</ion-label>
                    <p slot="end" class="value">
                      {{ formatAmount(deduction.amount) }}
                    </p>
                  </ion-item>
                </ion-item-group>
              </ion-list>
            </ion-col>
          </ion-row>

          <ion-row
            style="background-color: lightgray"
            class="details-container"
          >
            <ion-col size="6">
              <ion-item lines="none" class="summary-item">
                <ion-label>
                  <strong>(A) Gross Earnings:</strong>
                </ion-label>
                <p slot="end" class="label-bottom-data">
                  {{ formatAmount(grossPay) }}
                </p>
              </ion-item>
            </ion-col>

            <ion-col size="6">
              <ion-item lines="none" class="summary-item">
                <ion-label>
                  <strong>(B) Gross Deduction:</strong>
                </ion-label>
                <p slot="end" class="label-bottom-data">
                  {{ formatAmount(grossDeduction) }}
                </p>
              </ion-item>
            </ion-col>
          </ion-row>

          <!-- Totals Section -->
          <ion-row style="background-color: lightgray">
            <ion-col size="12">
              <ion-list>
                <ion-item-group>
                  <ion-item-divider>
                    <h3
                      class="label-header"
                      :style="{ color: theme.primaryColor }"
                    >
                      <strong>Totals</strong>
                    </h3>
                  </ion-item-divider>

                  <ion-item lines="none">
                    <ion-label>
                      <strong>Gross Pay:</strong>
                    </ion-label>
                    <p slot="end" class="value">
                      <strong>{{ formatAmount(grossPay) }}</strong>
                    </p>
                  </ion-item>

                  <ion-item lines="none">
                    <ion-label>
                      <strong>Net Pay (A - B):</strong>
                    </ion-label>
                    <p slot="end" class="value">
                      <strong>{{ formatAmount(netPay) }}</strong>
                    </p>
                  </ion-item>
                </ion-item-group>
              </ion-list>
            </ion-col>
          </ion-row>
        </div>
      </ion-grid>
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
  IonList,
  IonLabel,
  IonNote,
  IonItem,
  IonItemGroup,
  IonItemDivider,
} from "@ionic/vue";
import { onMounted } from "vue";
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
    IonList,
    IonLabel,
    IonNote,
    IonItem,
    IonItemGroup,
    IonItemDivider,
  },
  props: {
    isOpen: Boolean,
    incomeDetails: Array,
    deductionDetails: Array,
    grossPay: String,
    netPay: String,
    viewPayslipData: Object,
    theme: Object,
    grossDeduction: String,
    isThirteenthMonth: Boolean,
    selectedPaycycleId: Number,
    grossAllowance: String,
    netPayAllowance: String,
    thirteenthMonthData: {
      type: Object,
      default: () => ({}),
    },
    computed: {
      grossAllowance() {
        const allowances = this.viewPayslipData?.allowance || [];
        return allowances
          .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)
          .toFixed(2);
      },
      totalDeductions() {
        const deductions = this.viewPayslipData?.deductions || [];
        return deductions
          .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)
          .toFixed(2);
      },
      netPay() {
        return (
          parseFloat(this.grossAllowance) - parseFloat(this.totalDeductions)
        ).toFixed(2);
      },
    },
  },
  methods: {
    closeModal() {
      this.$emit("update:isOpen", false);
    },
    formatAmount(value) {
      if (!value) return "₱0.00";
      const num =
        typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
      return `₱${num.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
    formatPeriod(from, to) {
      if (!from || !to) return "N/A";
      const options = { year: "numeric", month: "long", day: "numeric" };
      const startDate = new Date(from).toLocaleDateString("en-PH", options);
      const endDate = new Date(to).toLocaleDateString("en-PH", options);
      return `${startDate} - ${endDate}`;
    },
    onMounted() {
      console.log(viewPayslipData);
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
  border: 3px solid rgba(187, 187, 187, 0.19);
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
  margin-top: 5px;
  background-color: rgb(240, 240, 240);
  padding: 10px;
  border-radius: 10px;
}
.column-container {
  background-color: rgb(240, 240, 240);
  padding: 10px 10px 70px 10px;
  margin: 5px;
  border-radius: 10px;
}
.label-header {
  margin: 5px 0;
}
.label-bottom {
  position: absolute;
  bottom: 0;
}
.label-bottom-data {
  padding-left: 30px;
}
.large-modal {
  --width: 90%;
  --height: 80%;
}

.columns {
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
}

.columns span {
  margin-right: 10px;
}
.responsive-text {
  font-size: clamp(12px, 2vw, 16px);
  white-space: nowrap;
  text-align: center;
}
.responsive-text-data {
  font-size: clamp(10px, 1vw, 16px);
  white-space: nowrap;
  text-align: center;
}

@media (max-width: 768px) {
  .modal-container {
    border: 1px solid rgba(216, 216, 216, 0.331);
    height: 100vh;
  }
  .row-container {
    display: block;
    flex-direction: column;
  }
  .totals {
    padding: 0;
    background-color: rgb(240, 240, 240, 0);
    margin-top: 30px;
  }
  .column-container {
    margin: 5px 0;
    width: 100%;
  }
  .row-container {
    display: flex;
    flex-direction: column;
  }
  .column-data {
    padding-left: 10px;
  }
  .details-container {
    display: flex;
    flex-direction: column;
    width: 200%;
  }
  .large-modal {
    --width: 95%;
    --height: 80%;
  }
}
</style>
