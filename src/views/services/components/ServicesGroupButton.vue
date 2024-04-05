<template>
  <div class="button-container">
    <div class="card btn-text neomorphic-card-1" expand="full">
      <a
        @click="navigateLeave"
        :style="{
          background: `linear-gradient(to right, ${theme.primaryGradientStartColor}, ${theme.primaryGradientEndColor})`,
          color: theme.primaryFontColor,
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
            d="M336 376V272H191a16 16 0 010-32h145V136a56.06 56.06 0 00-56-56H88a56.06 56.06 0 00-56 56v240a56.06 56.06 0 0056 56h192a56.06 56.06 0 0056-56zM425.37 272l-52.68 52.69a16 16 0 0022.62 22.62l80-80a16 16 0 000-22.62l-80-80a16 16 0 00-22.62 22.62L425.37 240H336v32z"
          />
        </svg>

        <h4 :style="{ color: btnTextColor }">Leave</h4>
      </a>
    </div>
    <div class="card btn-text" expand="full" color="none">
      <a
        @click="navigateviewschedule"
        :style="{
          background: `linear-gradient(to right, ${theme.primaryGradientStartColor}, ${theme.primaryGradientEndColor})`,
          color: theme.primaryFontColor,
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
            d="M480 128a64 64 0 00-64-64h-16V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 00368 48v16H144V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 00112 48v16H96a64 64 0 00-64 64v12a4 4 0 004 4h440a4 4 0 004-4zM32 416a64 64 0 0064 64h320a64 64 0 0064-64V179a3 3 0 00-3-3H35a3 3 0 00-3 3zm344-208a24 24 0 11-24 24 24 24 0 0124-24zm0 80a24 24 0 11-24 24 24 24 0 0124-24zm-80-80a24 24 0 11-24 24 24 24 0 0124-24zm0 80a24 24 0 11-24 24 24 24 0 0124-24zm0 80a24 24 0 11-24 24 24 24 0 0124-24zm-80-80a24 24 0 11-24 24 24 24 0 0124-24zm0 80a24 24 0 11-24 24 24 24 0 0124-24zm-80-80a24 24 0 11-24 24 24 24 0 0124-24zm0 80a24 24 0 11-24 24 24 24 0 0124-24z"
          />
        </svg>
        <h4 :style="{ color: btnTextColor }">Schedule</h4>
      </a>
    </div>
    <div class="card btn-text" expand="full" color="none">
      <a
        @click="navigateattendancecorrection"
        :style="{
          background: `linear-gradient(to right, ${theme.primaryGradientStartColor}, ${theme.primaryGradientEndColor})`,
          color: theme.primaryFontColor,
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
            d="M416 64h-16V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 00368 48v16H144V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 00112 48v16H96a64 64 0 00-64 64v12a4 4 0 004 4h440a4 4 0 004-4v-12a64 64 0 00-64-64zM477 176H35a3 3 0 00-3 3v237a64 64 0 0064 64h320a64 64 0 0064-64V179a3 3 0 00-3-3zM224 307.43A28.57 28.57 0 01195.43 336h-70.86A28.57 28.57 0 0196 307.43v-70.86A28.57 28.57 0 01124.57 208h70.86A28.57 28.57 0 01224 236.57z"
          />
        </svg>

        <h4 :style="{ color: btnTextColor }">Attendance</h4>
      </a>
    </div>
    <div class="card btn-text" expand="full" color="none">
      <a
        @click="navigateOTApply"
        :style="{
          background: `linear-gradient(to right, ${theme.primaryGradientStartColor}, ${theme.primaryGradientEndColor})`,
          color: theme.primaryFontColor,
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
            d="M480 128a64 64 0 00-64-64h-16V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 00368 48v16H144V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 00112 48v16H96a64 64 0 00-64 64v12a4 4 0 004 4h440a4 4 0 004-4zM32 416a64 64 0 0064 64h320a64 64 0 0064-64V180a4 4 0 00-4-4H36a4 4 0 00-4 4z"
          />
        </svg>

        <h4 :style="{ color: btnTextColor }">OT</h4>
      </a>
    </div>

    <div class="card btn-text" expand="full" color="none">
      <a
        @click="navigateViewPayslip"
        :style="{
          background: `linear-gradient(to right, ${theme.primaryGradientStartColor}, ${theme.primaryGradientEndColor})`,
          color: theme.primaryFontColor,
        }"
        disabled
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon icon-btn"
          viewBox="0 0 512 512"
          :style="{ color: btnSecondaryColor }"
        >
          <path
            fill="currentColor"
            d="M483.82 32.45a16.28 16.28 0 00-11.23 1.37L448 46.1l-24.8-12.4a16 16 0 00-14.31 0l-25.11 12.41L359 33.7a16 16 0 00-14.36 0L320 46.07l-24.45-12.34a16 16 0 00-14.35-.06L256 46.12l-24.8-12.43a16.05 16.05 0 00-14.33 0L192 46.1l-24.84-12.41a16 16 0 00-19.36 3.94 16.25 16.25 0 00-3.8 10.65V288l.05.05H336a32 32 0 0132 32V424c0 30.93 33.07 56 64 56h12a52 52 0 0052-52V48a16 16 0 00-12.18-15.55zM416 240H288.5c-8.64 0-16.1-6.64-16.48-15.28A16 16 0 01288 208h127.5c8.64 0 16.1 6.64 16.48 15.28A16 16 0 01416 240zm0-80H224.5c-8.64 0-16.1-6.64-16.48-15.28A16 16 0 01224 128h191.5c8.64 0 16.1 6.64 16.48 15.28A16 16 0 01416 160z"
          />
          <path
            fill="currentColor"
            d="M336 424v-88a16 16 0 00-16-16H48a32.1 32.1 0 00-32 32.05c0 50.55 5.78 71.57 14.46 87.57C45.19 466.79 71.86 480 112 480h245.68a4 4 0 002.85-6.81C351.07 463.7 336 451 336 424z"
          />
        </svg>

        <h4 :style="{ color: btnTextColor }">Payslip</h4>
      </a>
    </div>
    <div class="card btn-text" expand="full" color="none">
      <a
        @click="navigateBenefits"
        :style="{
          background: `linear-gradient(to right, ${theme.primaryGradientStartColor}, ${theme.primaryGradientEndColor})`,
          color: theme.primaryFontColor,
        }"
        disabled
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon icon-btn"
          viewBox="0 0 512 512"
          :style="{ color: btnSecondaryColor }"
        >
          <path
            d="M200 144h40v-40a40 40 0 10-40 40zM352 104a40 40 0 00-80 0v40h40a40 40 0 0040-40z"
            fill="none"
          />
          <path
            fill="currentColor"
            d="M80 416a64 64 0 0064 64h92a4 4 0 004-4V292a4 4 0 00-4-4H88a8 8 0 00-8 8zM240 252V144h32v108a4 4 0 004 4h140a47.93 47.93 0 0016-2.75A48.09 48.09 0 00464 208v-16a48 48 0 00-48-48h-40.54a2 2 0 01-1.7-3A72 72 0 00256 58.82 72 72 0 00138.24 141a2 2 0 01-1.7 3H96a48 48 0 00-48 48v16a48.09 48.09 0 0032 45.25A47.93 47.93 0 0096 256h140a4 4 0 004-4zm32-148a40 40 0 1140 40h-40zm-74.86-39.9A40 40 0 01240 104v40h-40a40 40 0 01-2.86-79.89zM276 480h92a64 64 0 0064-64V296a8 8 0 00-8-8H276a4 4 0 00-4 4v184a4 4 0 004 4z"
          />
        </svg>

        <h4 :style="{ color: btnTextColor }">Benefits</h4>
      </a>
    </div>
    <div class="card btn-text" expand="full" color="none">
      <a
        @click="navigateloanBal"
        :style="{
          background: `linear-gradient(to right, ${theme.primaryGradientStartColor}, ${theme.primaryGradientEndColor})`,
          color: theme.primaryFontColor,
        }"
        disabled
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon icon-btn"
          viewBox="0 0 512 512"
          :style="{ color: btnSecondaryColor }"
        >
          <path
            fill="currentColor"
            d="M448 400H64a16 16 0 010-32h384a16 16 0 010 32zM416 448H96a16 16 0 010-32h320a16 16 0 010 32zM32 272H16v48a32 32 0 0032 32h48v-16a64.07 64.07 0 00-64-64z"
          />
          <path
            fill="currentColor"
            d="M480 240h16v-64h-16a96.11 96.11 0 01-96-96V64H128v16a96.11 96.11 0 01-96 96H16v64h16a96.11 96.11 0 0196 96v16h256v-16a96.11 96.11 0 0196-96zm-224 64a96 96 0 1196-96 96.11 96.11 0 01-96 96z"
          />
          <circle fill="currentColor" cx="256" cy="208" r="64" />
          <path
            fill="currentColor"
            d="M416 336v16h48a32 32 0 0032-32v-48h-16a64.07 64.07 0 00-64 64zM480 144h16V96a32 32 0 00-32-32h-48v16a64.07 64.07 0 0064 64zM96 80V64H48a32 32 0 00-32 32v48h16a64.07 64.07 0 0064-64z"
          />
        </svg>

        <h4 :style="{ color: btnTextColor }">Loan</h4>
      </a>
    </div>
    <div class="card btn-text" expand="full" color="none" v-if="isUserRoleESS">
      <a
        @click="navigateApproval"
        :style="{
          background: `linear-gradient(to right, ${theme.primaryGradientStartColor}, ${theme.primaryGradientEndColor})`,
          color: theme.primaryFontColor,
        }"
        disabled
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon icon-btn"
          viewBox="0 0 512 512"
          :style="{ color: btnSecondaryColor }"
        >
          <path
            fill="currentColor"
            d="M400 48H112a64.07 64.07 0 00-64 64v288a64.07 64.07 0 0064 64h288a64.07 64.07 0 0064-64V112a64.07 64.07 0 00-64-64zm-35.75 138.29l-134.4 160a16 16 0 01-12 5.71h-.27a16 16 0 01-11.89-5.3l-57.6-64a16 16 0 1123.78-21.4l45.29 50.32 122.59-145.91a16 16 0 0124.5 20.58z"
          />
        </svg>

        <h4 :style="{ color: btnTextColor }">Approval</h4>
      </a>
    </div>
  </div>
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
  computed: {
    isUserRoleESS() {
      const myDetails = JSON.parse(localStorage.getItem("myDetails"));
      return myDetails.isApprover;
    },
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
    navigateApproval() {
      this.$router.push("/tabs/approval");
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
  flex-wrap: wrap;
}
.button-container {
  display: flex;
  margin: 0;
  padding-top: 10px;
  display: flex;
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;
  max-width: 500px;
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
  width: 90px;
  height: 90px;
  position: relative;
  margin: 5px;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
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
.btn-text a {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
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
  height: 35px;
}
</style>
