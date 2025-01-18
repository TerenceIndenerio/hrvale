<template>
  <ion-card
    class="neomorphic-card-1 approval-card"
    @click="handleViewButtonClick"
  >
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
    <div class="leave-type">
      <p :class="statusClass">{{ status }}</p>
    </div>
    <ion-grid class="card-content">
      <div>
        <ion-row class="pad-w">
          <ion-col class="col-name">
            <p><strong>Date:</strong></p>
          </ion-col>

          <ion-col class="col-data">
            <p>{{ date }}</p>
          </ion-col>
        </ion-row>

        <ion-row class="pad-w">
          <ion-col class="col-name">
            <p><strong>Request Type:</strong></p>
          </ion-col>

          <ion-col class="col-data">
            <p>{{ requestType }}</p>
          </ion-col>
        </ion-row>

        <ion-row class="pad-w">
          <ion-col class="col-name"
            ><p><strong>Employee:</strong></p></ion-col
          >

          <ion-col class="col-data">
            <p>{{ employeeName }}</p>
          </ion-col>
        </ion-row>
      </div>

      <ion-row class="pad-w action-container" v-if="status === 'Pending'">
        <ion-button
          expand="block"
          color="none"
          class="btn decline-btn"
          @click="handleCheckButtonClickReject"
          :disabled="status === 'Approved' || status === 'Rejected'"
        >
          <ion-icon name="close-sharp" class="btn-icon"></ion-icon>DECLINE
        </ion-button>

        <ion-button
          expand="block"
          color="none"
          class="btn approved-btn"
          @click="handleCheckButtonClick"
          :disabled="status === 'Approved' || status === 'Rejected'"
        >
          <ion-icon name="checkmark-sharp" class="btn-icon"></ion-icon>APPROVE
        </ion-button>
      </ion-row>
    </ion-grid>
  </ion-card>
</template>

<script>
import {
  IonCard,
  IonCol,
  IonGrid,
  IonRow,
  IonIcon,
  IonButton,
  toastController,
} from "@ionic/vue";
import { getThemeData } from "@/theme/theme";

export default {
  components: {
    IonCard,
    IonCol,
    IonGrid,
    IonRow,
    IonIcon,
    IonButton,
  },
  props: {
    status: String,
    employeeName: String,
    requestType: String,
    code: String,
    requestDataId: Number,
    requestId: Number,
    date: String,
    empId: String,
  },

  data() {
    return {
      theme: {},
    };
  },
  computed: {
    statusClass() {
      return {
        "status-pending": this.status === "Pending",
        "status-approved": this.status === "Approved",
        "status-rejected": this.status === "Rejected",
        "status-rejected": this.status === "Declined",
      };
    },
    backgroundColor() {
      switch (this.status) {
        case "Pending":
          return { backgroundColor: "yellow" };
        case "Approved":
          return { backgroundColor: "green" };
        case "Rejected":
          return { backgroundColor: "red" };
        default:
          return { backgroundColor: this.theme.primaryColor };
      }
    },
  },
  methods: {
    async handleCheckButtonClick() {
      try {
        this.$emit(
          "checkButtonClick",
          "approve",
          this.code,
          this.requestDataId,
          this.requestId
        );
      } catch (error) {
        console.error("Error handling check button click: ", error);
        this.showErrorMessage(error.message);
      }
    },
    async handleCheckButtonClickReject() {
      try {
        this.$emit(
          "checkButtonClick",
          "reject",
          this.code,
          this.requestDataId,
          this.requestId
        );
      } catch (error) {
        console.error("Error handling check button click: ", error);
        this.showErrorMessage(error.message);
      }
    },
    async handleViewButtonClick() {
      try {
        this.$emit(
          "viewButtonClick",
          "view",
          this.code,
          this.requestDataId,
          this.requestId,
          this.employeeName,
          this.requestType,
          this.status,
          this.date,
          this.empId
        );
      } catch (error) {
        console.error("Error handling check button click: ", error);
        this.showErrorMessage(error.message);
      }
    },
  },
  created() {
    const storedThemeData = getThemeData();

    if (storedThemeData) {
      this.theme = storedThemeData;
    }
    this.theme = storedThemeData;
  },
};
</script>

<style scoped>
.inline-v {
  display: flex;
  flex-direction: column;
}
.flex-c {
  display: flex;
  justify-content: center;
  align-items: center;
}

p {
  padding: 0;
  margin: 5px 0;
}

/* specifics */
ion-grid {
  width: 100%;
}
.card {
  padding: 0;
  margin: 10px 7%;
  border-radius: 10px;
  height: fit-content;
  width: 80%;
}
.icon1 {
  font-size: 30px;
  color: black;
}
.leave-type {
  padding: 0;
  margin: 10px 0;
  border-radius: 20px 0 0 20px;
  width: fit-content;
  text-align: center;
  position: absolute;
  top: 0;
  right: 0;
}
.leave-type p {
  padding: 5px 10px;
  margin: 0;
  font-family: Poppins;
  font-size: 14px;
  font-weight: 700;
  line-height: 21px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
}

.btn1 {
  background-color: #d1efea;
  color: #319582;
}
.btn2 {
  background-color: rgba(254, 138, 138, 0.2);
  color: rgb(255, 120, 120);
}
.btn3 {
  background-color: #fff;
  color: #2f80ed;
  width: 50px;
}
.btn-round {
  --border-radius: 50px;
}
.btn-action {
  --padding-start: 0 !important;
  --padding-end: 0 !important;
  --padding-top: 0 !important;
  --padding-bottom: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  width: 40px;
  height: 30px;
}
.status-pending {
  background-color: #ffeb3b;
  color: rgb(132, 132, 132);
  border-radius: 20px 0 0 20px;
}

.status-approved {
  background-color: #8bc34a;
  color: rgb(255, 255, 255);
  border-radius: 20px 0 0 20px;
}

.status-rejected {
  background-color: #ff695e;
  color: rgb(54, 54, 54);
  border-radius: 20px 0 0 20px;
}

.outlineColor {
  border: 1px solid #828282;
  color: #828282;
}
.username-text {
  color: #000;
  font-family: Open Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.col-name {
  font-family: Poppins;
  font-size: 14px;
  font-weight: 700;
  line-height: 21px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
}
.col-name p {
  margin: 0;
}
.col-data {
  font-family: Poppins;
  font-size: 14px;
  font-weight: 700;
  line-height: 21px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
}
.col-data p {
  margin: 0;
}
.header-card {
  height: 40px;
  text-align: center;
}
.btn {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8), 0px -4px 8px rgba(0, 0, 0, 0.05);
}
.view-detail-btn {
  margin: 0;
}
.view-detail-btn-2 {
  width: 150px;
}

.btn-icon {
  margin: 0;
  padding: 0;
  font-size: 24px;
}
.action-container {
  margin: 10px 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 10px;
}
.card-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: fit-content;
  flex-direction: column;
  padding: 0px 0 0 0;
}
.approval-card {
  width: 300px;
  height: fit-content;
}

.decline-btn {
  background-color: #9d2e0f;
}
.approved-btn {
  background-color: #1b9d0f;
}
.icon-btn {
  color: gray;
  background-color: rgb(233, 233, 233);
  border-radius: 10px;
  height: 45px;
  width: 45px;
  background: linear-gradient(145deg, #f0f0f0, #cacaca);
  box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
}
</style>
