<template>
  <ion-grid class="button-container">
    <ion-row>
      <ion-col class="card btn-text" expand="full" color="none">
        <a
          @click="navigateVale"
          class="clockin btn-container"
          :style="{
            background: `linear-gradient(to right, ${theme.primaryGradientStartColor}, ${theme.primaryGradientEndColor})`,
            color: btnTextColor,
          }"
        >
          <img
            src="@/assets/images/hrvalewhiteicon.png"
            alt="Vale Icon"
            class="icon-btn"
            style="width: 30px; height: 30px"
          />
          <h4>Vale</h4>
        </a>
      </ion-col>
      <ion-col class="card btn-text" expand="full">
        <a
          @click="navigateclockin"
          class="clockin btn-container"
          :style="{
            background: `linear-gradient(to right, ${theme.primaryGradientStartColor}, ${theme.primaryGradientEndColor})`,
            color: btnTextColor,
          }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="ionicon icon-btn"
            viewBox="0 0 512 512"
            :style="{ color: btnSecondaryColor }"
          >
            <path
              fill="currentColor"
              d="M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208 208-93.13 208-208S370.87 48 256 48zm96 240h-96a16 16 0 01-16-16V128a16 16 0 0132 0v128h80a16 16 0 010 32z"
            />
          </svg>

          <h4>Clock In / Out</h4>
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
    btnSecondaryColor: String,
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
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

a {
  text-decoration: none;
  width: 100%;
  height: 100%;
}
.button-container {
  margin: 0;
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-right: auto;
  mix-blend-mode: multiply;
  margin-left: 12px;
  gap: 10px;
}
.card {
  padding: 0;
  height: 100px;
  border-radius: 10px;
  margin: 10px;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8);
  overflow: hidden;
  display: flex;
  justify-content: left;
  align-items: center;
  width: 200px;
}
.btn-text h4 {
  padding: 0;
  margin: 0;
  font-family: Poppins;
  font-size: 16px;
  font-style: normal;
  font-weight: 800;
}
.icon-circle {
  border-radius: 100%;
}
.clockin {
  display: flex;
  align-items: center;
}
.icon-btn {
  height: 40px;
  color: var(--ion-color-blue-theme);
}
.btn-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 15px;
}
</style>
