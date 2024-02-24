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
              Attendance
            </h4>
          </span>
        </a>
      </ion-col>
      <ion-col class="card btn-text" expand="full" color="none">
        <a @click="navigateOTApply">
          <span class="ion-text-left">
            <ion-icon
              name="calendar-clear"
              class="icon-btn"
              :style="{ color: btnColor }"
            ></ion-icon>
            <h4 :style="{ color: btnTextColor }">OT</h4>
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
            <h4 :style="{ color: btnTextColor }">Payslip</h4>
          </span>
        </a>
      </ion-col>
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
            <h4 :style="{ color: btnTextColor }">Loan</h4>
          </span>
        </a>
      </ion-col>
      <ion-col class="card btn-text" expand="full" color="none">
        <a @click="navigateViewPayslip" disabled>
          <span class="ion-text-left">
            <ion-icon
              name="checkbox"
              class="icon-btn"
              :style="{ color: btnColor }"
            ></ion-icon>
            <h4 :style="{ color: btnTextColor }">Approval</h4>
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

a {
  text-decoration: none;
  width: 100%;
  height: 100%;
}
.button-container {
  margin: 0;
  padding-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  justify-content: space-evenly;
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
  font-weight: 800;
  line-height: normal;
}
.ion-text-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-right: auto;
  mix-blend-mode: multiply;
  margin-left: 5px;
  gap: 10px;
}
.card {
  padding: 0;
  height: 100px;
  border-radius: 20px;
  margin: 10px;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.637);
  overflow: hidden;
  display: flex;
  justify-content: left;
  align-items: center;
  width: 350px;
}
.btn-text h4 {
  padding: 0;
  margin: 0;
  color: var(--oil-11, #0d0d0d);
  font-family: Poppins;
  font-size: 10px;
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
