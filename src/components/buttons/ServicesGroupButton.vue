<template>
  <ion-grid class="button-container">
    <ion-row>
      <ion-col class="card btn-text" expand="full" color="none">
        <a @click="navigateLeave">
          <span class="ion-text-left">
            <ion-icon
              name="exit"
              class="icon-btn"
              :style="{ color: btnColor }"
            ></ion-icon>
            <h4 :style="{ color: btnTextColor }">Leave</h4>
          </span>
        </a>
      </ion-col>
      <ion-col class="card btn-text" expand="full" color="none">
        <a @click="navigateclockin" class="clockin">
          <span class="ion-text-left">
            <ion-icon
              name="time"
              class="icon-btn"
              :style="{ color: btnColor }"
            ></ion-icon>
            <h4 :style="{ color: btnTextColor }">Clock In/Out</h4>
          </span>
        </a>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col class="card btn-text" expand="full" color="none">
        <a @click="navigateviewschedule">
          <span class="ion-text-left">
            <ion-icon
              name="calendar"
              class="icon-btn"
              :style="{ color: btnColor }"
            ></ion-icon>
            <h4 :style="{ color: btnTextColor }">Schedule</h4>
          </span>
        </a>
      </ion-col>
      <ion-col class="card btn-text" expand="full" color="none">
        <a @click="navigateattendancecorrection">
          <span class="ion-text-left">
            <ion-icon
              name="today"
              class="icon-btn"
              :style="{ color: btnColor }"
            ></ion-icon>
            <h4 :style="{ color: btnTextColor }">
              Attendance <br />Correction
            </h4>
          </span>
        </a>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col class="card btn-text" expand="full" color="none">
        <a @click="navigateOTApply">
          <span class="ion-text-left">
            <ion-icon
              name="calendar-clear"
              class="icon-btn"
              :style="{ color: btnColor }"
            ></ion-icon>
            <h4 :style="{ color: btnTextColor }">Apply OT</h4>
          </span>
        </a>
      </ion-col>
      <ion-col class="card btn-text" expand="full" color="none">
        <a @click="navigateVale" disabled>
          <span class="ion-text-left">
            <ion-icon
              name="pricetags"
              class="icon-btn"
              :style="{ color: btnColor }"
            ></ion-icon>
            <h4 :style="{ color: btnTextColor }">Vale</h4>
          </span>
        </a>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col class="card btn-text" expand="full" color="none">
        <a @click="navigateBenefits" disabled>
          <span class="ion-text-left">
            <ion-icon
              name="gift"
              class="icon-btn"
              :style="{ color: btnColor }"
            ></ion-icon>
            <h4 :style="{ color: btnTextColor }">Benefits</h4>
          </span>
        </a>
      </ion-col>
      <ion-col class="card btn-text" expand="full" color="none">
        <a @click="navigateloanBal" disabled>
          <span class="ion-text-left">
            <ion-icon
              name="cash"
              class="icon-btn"
              :style="{ color: btnColor }"
            ></ion-icon>
            <h4 :style="{ color: btnTextColor }">Loan Balances</h4>
          </span>
        </a>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col class="card btn-text" expand="full" color="none">
        <a @click="navigateViewPayslip" disabled>
          <span class="ion-text-left">
            <ion-icon
              name="receipt"
              class="icon-btn"
              :style="{ color: btnColor }"
            ></ion-icon>
            <h4 :style="{ color: btnTextColor }">View Payslip</h4>
          </span>
        </a>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>
<script>
import { IonButton, IonCol, IonGrid, IonRow, IonIcon } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { IonButton, IonCol, IonGrid, IonRow, IonIcon },
  props: {
    btnColor: String,
    btnTextColor: String,
    theme: Object,
  },
  methods: {
    navigateSoon() {
      this.$router.push("/soon");
    },
    navigateLeave() {
      this.$router.push("/leave");
    },
    navigateclockin() {
      this.$router.push("/clockin");
    },
    navigateviewschedule() {
      this.$router.push("/viewschedule");
    },
    navigateattendancecorrection() {
      this.$router.push("/attendancecorrection");
    },
    navigateOTApply() {
      this.$router.push("/applyot");
    },
    navigateloanBal() {
      this.$router.push("/loanbalance");
    },
    navigateBenefits() {
      this.$router.push("/benefits");
    },
    navigateViewPayslip() {
      this.$router.push("/pincode");
    },
    navigateVale() {
      this.$router.push("/vale");
    },
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans");

a {
  text-decoration: none;
  width: 100%;
  height: 100%;
}
.button-container {
  margin: 0;
  padding-top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
}
.title {
  margin-left: 10px;

  width: 120px;
  height: 30px;
  flex-shrink: 0;

  color: var(--oil-11, #0d0d0d);
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-family: Open Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.ion-text-left {
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  height: 100%;
  margin-right: auto;
  mix-blend-mode: multiply;
  margin-left: 10px;
  gap: 10px;
}
.card {
  padding: 0;
  height: 50px;
  border-radius: 10px;
  margin: 10px;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8);
  overflow: hidden;
  display: flex;
  justify-content: left;
  align-items: center;
  width: 140px;
}
.btn-text h4 {
  padding: 0;
  margin: 0;
  color: var(--oil-11, #0d0d0d);
  font-family: Open Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
}
.icon-circle {
  border-radius: 100%;
}
.clockin {
  display: flex;
  align-items: center;
}
.icon-btn {
  font-size: 30px;
  color: var(--ion-color-blue-theme);
}
</style>
