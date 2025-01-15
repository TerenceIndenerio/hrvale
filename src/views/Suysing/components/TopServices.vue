<template>
  <div class="button-container">
    <div
      :class="[
        'top-card card-left btn-text',
        { soon: !isClockInOutAllowed, hidden: !isClockInOutShown },
      ]"
      expand="full"
    >
      <a
        @click="navigateclockin"
        class="btn-container"
        style="background-color: #5489bb; color: white"
      >
        <h4>Clock In / Out</h4>
        <div class="inner-btn-container">
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
          <div class="time-container">
            <p v-if="clockData?.state" style="color: #aeff78">
              {{ clockData.state.name }}:
            </p>
            <p
              v-if="
                clockData?.state?.name === 'Punched In' &&
                isCurrentDate(clockData.punchIn?.userDate)
              "
            >
              {{ clockData.punchIn?.userTime || "00:00" }}
            </p>
            <p
              v-else-if="
                clockData?.state?.name === 'Punched Out' &&
                isCurrentDate(clockData.punchOut?.userDate)
              "
            >
              {{ clockData.punchOut?.userTime || "00:00" }}
            </p>
            <p v-else>No Data</p>
          </div>
        </div>
      </a>
    </div>

    <div
      :class="[
        'top-card card-right btn-text',
        { soon: !isClockInOutAllowed, hidden: !isClockInOutShown },
      ]"
      expand="full"
    >
      <a
        @click="navigateviewschedule"
        class="btn-container"
        style="background-color: #f9764c; color: white"
      >
        <h4>Schedule</h4>
        <div class="inner-btn-container">
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
          <div class="date-container">
            <p v-if="currentSchedule">{{ currentSchedule }}</p>
            <p v-else>No Upcoming Schedule.</p>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import { IonButton, IonCol, IonGrid, IonRow, IonIcon } from "@ionic/vue";
import { defineComponent } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default defineComponent({
  components: { IonButton, IonCol, IonGrid, IonRow, IonIcon },
  props: {
    btnColor: String,
    btnTextColor: String,
    btnSecondaryColor: String,
    theme: Object,
    clockData: Object,
  },
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    return {
      currentSchedule: null,
    };
  },
  computed: {
    servicesConfig() {
      return JSON.parse(localStorage.getItem("servicesConfig"));
    },
    isValeAllowed() {
      return this.servicesConfig?.vale?.hidden ?? false;
    },
    isClockInOutAllowed() {
      return this.servicesConfig?.clockInOut?.hidden ?? false;
    },
    isClockInOutShown() {
      return this.servicesConfig?.clockInOut?.allowed ?? false;
    },
  },
  async created() {
    await this.fetchSchedule();
  },
  methods: {
    isCurrentDate(date) {
      if (!date) return false;
      const currentDate = new Date().toISOString().split("T")[0];
      return date === currentDate;
    },
    navigateSoon() {
      this.$router.push("/soon");
    },
    navigateLeave() {
      this.$router.push("/leave");
    },
    navigateclockin() {
      if (this.isClockInOutAllowed) {
        this.$router.push("/suysing_clockin");
      } else {
        this.navigateSoon();
      }
    },
    navigateviewschedule() {
      this.$router.push("/suysing_scheduleview");
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
      if (this.isValeAllowed) {
        const storedClient = JSON.parse(localStorage.getItem("client"));

        if (storedClient === "suysing") {
          this.$router.push(`/vale${storedClient}`);
        } else {
          this.$router.push(`/vale`);
        }
      } else {
        this.navigateSoon();
      }
    },

    // Expiration of token
    async checkTokenExpiration() {
      const storedToken = localStorage.getItem("token");

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

    async fetchSchedule() {
      try {
        await this.checkTokenExpiration();

        const baseURL = localStorage.getItem("baseUrl");
        const storedToken = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const currentDate = new Date().toISOString().split("T")[0];

        const api = `${baseURL}api/v2/calendar/details?empNumber=129&dateFrom=${currentDate}&dateTo=${currentDate}`;

        const dataResponse = await axios.get(api, { headers });

        const matchedData = dataResponse.data.data.filter((item) => {
          const startDate = item.start.split("T")[0];
          return startDate === currentDate;
        });

        this.currentSchedule =
          matchedData.length > 0 ? matchedData[0].title : null;
      } catch (error) {
        console.error("Error fetching schedule: ", error);
      }
    },
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
p {
  font-family: Poppins;
  font-size: 14px;
  font-weight: 500;
  line-height: 14px;
  letter-spacing: -0.5px;
  text-align: center;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
}
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
  flex-direction: row;
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
.top-card {
  padding: 0;
  height: 150px;
  margin: 5px;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8);
  overflow: hidden;
  width: 100%;
}
.card-left {
  border-radius: 20px 0 0 20px;
}
.card-right {
  border-radius: 0 20px 20px 0;
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

.icon-btn {
  height: 20px;
  width: 20px;
  color: var(--ion-color-blue-theme);
}
.btn-container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 0 10px;
}

.vale-colorfilter {
  width: 40px;
  height: 40px;
  position: absolute;
  mask-image: url("@/assets/images/hrvalewhiteicon.png");
  mask-size: cover;
  mask-position: center;
  mix-blend-mode: multiply;
}
.color-filter-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.not-available-label {
  background-color: rgba(255, 255, 255, 0.593);
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  color: black;
  border-radius: 30px;
  padding: 35px 0;
}
.soon {
  opacity: 0.5;
}
.hidden {
  display: none;
}

.inner-btn-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 0 5px;
}
.time-container p {
  margin: 0;
  padding: 0;
  color: white;
}
.time-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}
.date-container p {
  margin: 0;
  padding: 0;
  color: white;
  font-size: 10px;
}
.date-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  max-width: 70px;
}
</style>
