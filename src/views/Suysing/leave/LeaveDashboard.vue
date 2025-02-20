<template>
  <ion-page>
    <HeaderReturn
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    ></HeaderReturn>
    <ion-content :fullscreen="true">
      <Refresher />

      <div class="action-container">
        <ion-button
          class="action-btn"
          @click="navigateToLeaveHistory"
          color="none"
          :style="{
            backgroundColor: theme.primaryColor,
            color: theme.primaryFontColor,
          }"
        >
          <p
            :style="{
              color: theme.primaryFontColor,
            }"
          >
            Leave History
          </p>
          <svg
            width="33"
            height="40"
            viewBox="0 0 33 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="icon-btn"
          >
            <g filter="url(#filter0_d_3_2171)">
              <path
                d="M12.813 9.11111C12.813 8.63962 13.0024 8.18743 13.3397 7.85403C13.677 7.52063 14.1345 7.33333 14.6115 7.33333C15.0885 7.33333 15.546 7.52063 15.8833 7.85403C16.2206 8.18743 16.4101 8.63962 16.4101 9.11111V17.0578L18.5863 17.2889L27.4712 21.1822C28.4245 21.6089 29 22.5511 29 23.5822V31.3333C28.946 32.7911 27.777 33.9467 26.3022 34H14.6115C13.9281 34 13.2806 33.7333 12.813 33.2356L4 25.7689L5.33094 24.4C5.67266 24.0267 6.15827 23.8311 6.66187 23.8311H7.05755L12.813 26.8889V9.11111ZM14.6115 2C16.5195 2 18.3494 2.7492 19.6986 4.0828C21.0478 5.41639 21.8058 7.22513 21.8058 9.11111C21.8058 11.7778 20.3669 14.0356 18.2086 15.2622V13.0933C19.3058 12.1156 20.0072 10.6933 20.0072 9.11111C20.0072 7.69662 19.4387 6.34007 18.4268 5.33988C17.4149 4.33968 16.0425 3.77778 14.6115 3.77778C13.1805 3.77778 11.8081 4.33968 10.7962 5.33988C9.7843 6.34007 9.21583 7.69662 9.21583 9.11111C9.21583 10.6933 9.91727 12.1156 11.0144 13.0933V15.2622C8.85612 14.0356 7.41727 11.7778 7.41727 9.11111C7.41727 7.22513 8.17523 5.41639 9.52441 4.0828C10.8736 2.7492 12.7035 2 14.6115 2Z"
                fill="white"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_3_2171"
                x="0"
                y="0"
                width="33"
                height="40"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="2" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_3_2171"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_3_2171"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </ion-button>
        <ion-button
          class="action-btn"
          @click="navigateToLeaveEntitlement"
          color="none"
          :style="{
            backgroundColor: theme.primaryColor,
            color: theme.primaryFontColor,
          }"
        >
          <p
            :style="{
              color: theme.primaryFontColor,
            }"
          >
            Leave Entitlement
          </p>
          <svg
            width="33"
            height="40"
            viewBox="0 0 33 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="icon-btn"
          >
            <g filter="url(#filter0_d_3_2171)">
              <path
                d="M12.813 9.11111C12.813 8.63962 13.0024 8.18743 13.3397 7.85403C13.677 7.52063 14.1345 7.33333 14.6115 7.33333C15.0885 7.33333 15.546 7.52063 15.8833 7.85403C16.2206 8.18743 16.4101 8.63962 16.4101 9.11111V17.0578L18.5863 17.2889L27.4712 21.1822C28.4245 21.6089 29 22.5511 29 23.5822V31.3333C28.946 32.7911 27.777 33.9467 26.3022 34H14.6115C13.9281 34 13.2806 33.7333 12.813 33.2356L4 25.7689L5.33094 24.4C5.67266 24.0267 6.15827 23.8311 6.66187 23.8311H7.05755L12.813 26.8889V9.11111ZM14.6115 2C16.5195 2 18.3494 2.7492 19.6986 4.0828C21.0478 5.41639 21.8058 7.22513 21.8058 9.11111C21.8058 11.7778 20.3669 14.0356 18.2086 15.2622V13.0933C19.3058 12.1156 20.0072 10.6933 20.0072 9.11111C20.0072 7.69662 19.4387 6.34007 18.4268 5.33988C17.4149 4.33968 16.0425 3.77778 14.6115 3.77778C13.1805 3.77778 11.8081 4.33968 10.7962 5.33988C9.7843 6.34007 9.21583 7.69662 9.21583 9.11111C9.21583 10.6933 9.91727 12.1156 11.0144 13.0933V15.2622C8.85612 14.0356 7.41727 11.7778 7.41727 9.11111C7.41727 7.22513 8.17523 5.41639 9.52441 4.0828C10.8736 2.7492 12.7035 2 14.6115 2Z"
                fill="white"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_3_2171"
                x="0"
                y="0"
                width="33"
                height="40"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="2" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_3_2171"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_3_2171"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </ion-button>
        <ion-button
          class="action-btn"
          @click="navigateToApplyLeave"
          color="none"
          :style="{
            backgroundColor: theme.primaryColor,
            color: theme.primaryFontColor,
          }"
        >
          <p
            :style="{
              color: theme.primaryFontColor,
            }"
          >
            Apply Leave
          </p>
          <svg
            width="33"
            height="40"
            viewBox="0 0 33 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="icon-btn"
          >
            <g filter="url(#filter0_d_3_2171)">
              <path
                d="M12.813 9.11111C12.813 8.63962 13.0024 8.18743 13.3397 7.85403C13.677 7.52063 14.1345 7.33333 14.6115 7.33333C15.0885 7.33333 15.546 7.52063 15.8833 7.85403C16.2206 8.18743 16.4101 8.63962 16.4101 9.11111V17.0578L18.5863 17.2889L27.4712 21.1822C28.4245 21.6089 29 22.5511 29 23.5822V31.3333C28.946 32.7911 27.777 33.9467 26.3022 34H14.6115C13.9281 34 13.2806 33.7333 12.813 33.2356L4 25.7689L5.33094 24.4C5.67266 24.0267 6.15827 23.8311 6.66187 23.8311H7.05755L12.813 26.8889V9.11111ZM14.6115 2C16.5195 2 18.3494 2.7492 19.6986 4.0828C21.0478 5.41639 21.8058 7.22513 21.8058 9.11111C21.8058 11.7778 20.3669 14.0356 18.2086 15.2622V13.0933C19.3058 12.1156 20.0072 10.6933 20.0072 9.11111C20.0072 7.69662 19.4387 6.34007 18.4268 5.33988C17.4149 4.33968 16.0425 3.77778 14.6115 3.77778C13.1805 3.77778 11.8081 4.33968 10.7962 5.33988C9.7843 6.34007 9.21583 7.69662 9.21583 9.11111C9.21583 10.6933 9.91727 12.1156 11.0144 13.0933V15.2622C8.85612 14.0356 7.41727 11.7778 7.41727 9.11111C7.41727 7.22513 8.17523 5.41639 9.52441 4.0828C10.8736 2.7492 12.7035 2 14.6115 2Z"
                fill="white"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_3_2171"
                x="0"
                y="0"
                width="33"
                height="40"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="2" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_3_2171"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_3_2171"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonText,
  IonContent,
  IonTitle,
  IonIcon,
  IonButton,
  IonCard,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/vue";

import HeaderReturn from "@/components/header/HeaderReturn.vue";
import LeaveDashboardCard from "@/views/Suysing/leave/components/LeaveDashboardCard.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import Button from "@/components/buttons/Button.vue";
import { useRouter } from "vue-router";
import { defineComponent } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import { GlobalConstants } from "@/config/constants";
import { getThemeData } from "@/theme/theme";

export default defineComponent({
  name: "Leave Requests",
  components: {
    IonPage,
    IonHeader,
    IonContent,
    IonTitle,
    IonIcon,
    IonText,
    HeaderReturn,
    LeaveDashboardCard,
    IonButton,
    Refresher,
    IonCard,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  },
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    return {
      hasRecord: false,
      showComponent: false,
      leavesLength: 0,
      requests: [],
      headerTitle: "Leaves",
      timePeriod: "",
      userName: "",
      theme: {},
      loading: true,
      cardData: {
        date: "",
        employeeName: "",
        leaveType: "",
        dateText: "",
        leaveBalance: "",
        numberOfDays: "",
        status: "",
        comment: "",
        title: "",
        colorBadge: "",
      },
      offset: 0,
      limit: 10,
    };
  },
  methods: {
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
    navigateToApplyLeave() {
      this.$router.push("/suysing_applyLeave");
    },
    navigateToLeaveEntitlement() {
      this.$router.push("/suysing_leaveEntitlement");
    },
    navigateToLeaveHistory() {
      this.$router.push("/suysing_leavehistory");
    },

    getTheme() {
      const storedThemeData = getThemeData();

      if (storedThemeData) {
        this.theme = storedThemeData;
      }
      this.theme = storedThemeData;
    },
    fetchTheme() {
      const storedThemeData = localStorage.getItem("themeData");

      const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};

      this.theme = themeData;
    },
  },

  async created() {
    this.fetchTheme();
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Inter");
.margin-top {
  margin-top: 50px;
}
.margin-bottom {
  margin-bottom: 5vh;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.result-container {
  margin: 0 auto;
  max-width: 370px;
  padding-bottom: 100px;
}
.le-btn-contianer {
  width: 100%;
  display: flex;
  justify-content: center;
}
.btn {
  border-radius: 15px;
  width: fit-content;
  height: 50px;
  overflow: hidden;
  font-family: "Inter";
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  border: none;
  margin-bottom: 20px;
  --background: #12a3da;
}
.card-title {
  color: #3b3c3e;
  font-family: "Open Sans";
  font-size: 19px;
  font-style: normal;
  font-weight: bold;
  line-height: normal;
  margin-left: 10%;
}
.btn-bottom {
  position: fixed;
  bottom: 20px;
  width: 100%;
}
.leave-entitlement-btn {
  overflow: hidden;
  border-radius: 20px;
  width: 80%;
  height: 50px;
  margin: 10px 0;
}
.outline-container {
  margin: auto;
  /* border: 1px solid #828282; */
  padding: 10px 20px;
  color: #828282;
  border-radius: 20px;
  width: 70%;
  text-align: center;
}
.outline-container h4 {
  margin: 0;
}

.outlineColor {
  border: 1px solid #828282;
  color: #828282;
  border-radius: 20px;
  width: 90%;
}
.action-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px auto;
}
.action-btn {
  width: 100%;
  max-width: 300px;
  height: 120px;
  margin: 0 auto;
  border-radius: 10px;
}
.action-btn p {
  font-family: Poppins;
  font-size: 18px;
  font-weight: 700;
  line-height: 27px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  position: absolute;
  left: 0;
  top: 0;
}
.icon-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 20px;
  width: 50px;
  height: 50px;
}
</style>
