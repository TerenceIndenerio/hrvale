<template>
  <ion-card class="neomorphic-card-1 approval-card">
    <div class="leave-type">
      <p :class="statusClass">{{ status }}</p>
    </div>
    <ion-grid class="card-content">
      <div @click="handleViewButtonClick">
        <ion-row class="pad-w">
          <ion-col class="col-name">
            <p>Date:</p>
          </ion-col>

          <ion-col class="col-data">
            <p>{{ date }}</p>
          </ion-col>
        </ion-row>

        <ion-row class="pad-w">
          <ion-col class="col-name">
            <p>Request Type:</p>
          </ion-col>

          <ion-col class="col-data">
            <p>{{ requestType }}</p>
          </ion-col>
        </ion-row>

        <ion-row class="pad-w">
          <ion-col class="col-name">
            <p>Employee:</p>
          </ion-col>

          <ion-col class="col-data">
            <p>{{ employeeName }}</p>
          </ion-col>
        </ion-row>
      </div>

      <ion-row class="pad-w action-container" v-if="status === 'Pending'">
        <ion-col class="col-name">
          <ion-button
            expand="block"
            color="light"
            class="btn"
            @click="handleCheckButtonClick"
            :disabled="status === 'Approved' || status === 'Rejected'"
          >
            <ion-icon name="checkmark-sharp" class="btn-icon"></ion-icon>APPROVE
          </ion-button>
        </ion-col>

        <ion-col class="col-data">
          <ion-button
            expand="block"
            color="light"
            class="btn"
            @click="handleCheckButtonClickReject"
            :disabled="status === 'Approved' || status === 'Rejected'"
          >
            <ion-icon name="close-sharp" class="btn-icon"></ion-icon>DECLINE
          </ion-button>
        </ion-col>
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
  margin: 0;
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
}
.btn {
  color: black;
  width: 100%;
  height: 35px;
  border-radius: 5px;
}
.btn1 {
  background-color: #d1efea;
  color: #319582;
}
.btn2 {
  background-color: rgba(254, 138, 138, 0.2);
  color: rgb(255, 120, 120) 5;
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
  color: #585b5f;
  font-family: Open Sans;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 107.682%;
}
.col-name p {
  margin: 0;
}
.col-data {
  color: #0d0d0d;
  font-family: Open Sans;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 107.682%;
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
  margin-top: 10px;
  z-index: 1000;
}
.card-content {
  margin: 25px 0 0 0;
}
.approval-card {
  width: 300px;
}
</style>
