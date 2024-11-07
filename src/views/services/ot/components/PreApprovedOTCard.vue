<template>
  <ion-card class="neomorphic-card-1 ot-card">
    <ion-grid>
      <ion-col class="flex-c">
        <div class="date-outline">
          <p :style="{ color: theme.primaryColor }" class="date-label">
            {{ date }}
          </p>
        </div>
      </ion-col>

      <ion-row class="pad-w">
        <ion-col class="col-name">
          <p>Time In:</p>
        </ion-col>

        <ion-col class="col-data">
          <p>{{ type }}</p>
        </ion-col>
      </ion-row>

      <ion-row class="pad-w">
        <ion-col class="col-name">
          <p>Time In:</p>
        </ion-col>

        <ion-col class="col-data">
          <p>{{ timeIn }}</p>
        </ion-col>
      </ion-row>

      <ion-row class="pad-w">
        <ion-col class="col-name">
          <p>Time Out:</p>
        </ion-col>

        <ion-col class="col-data">
          <p>{{ timeOut }}</p>
        </ion-col>
      </ion-row>

      <ion-row class="pad-w">
        <ion-col class="col-name">
          <p>Total Overtime:</p>
        </ion-col>

        <ion-col class="col-data">
          <p>{{ totalOvertime }} hours</p>
        </ion-col>
      </ion-row>

      <ion-row class="pad-w">
        <ion-col class="col-name">
          <p>Status:</p>
        </ion-col>

        <ion-col class="col-data">
          <p>{{ status }}</p>
        </ion-col>
      </ion-row>

      <div class="flex-row">
        <ion-button
          expand="full"
          color="none"
          class="neomorphic-btn-2 view-btn"
          @click="handleView"
        >
          View
        </ion-button>
      </div>
    </ion-grid>
  </ion-card>
</template>

<script>
import { IonCard, IonCol, IonGrid, IonRow, IonButton } from "@ionic/vue";
import { getThemeData } from "@/theme/theme";

export default {
  components: {
    IonCard,
    IonCol,
    IonGrid,
    IonRow,
    IonButton,
  },
  props: {
    type: String,
    date: String, // Mapping 'date' field
    timeIn: String, // Mapping 'timeIn' field
    timeOut: String, // Mapping 'timeOut' field
    totalOvertime: Number, // Mapping 'totalOvertime' field
    reason: String, // Mapping 'reason' field
    status: String, // Mapping 'status' field
    result: Object, // Object containing full result details
  },
  data() {
    return {
      theme: {},
    };
  },
  methods: {
    handleView() {
      this.$emit("view", this.result); // Emit event with full result object
    },

    getTheme() {
      const storedThemeData = getThemeData();

      if (storedThemeData) {
        this.theme = storedThemeData;
      }
    },
  },
  created() {
    this.getTheme(); // Fetch and apply theme when component is created
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
.flex-row {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  width: 100%;
}

p {
  padding: 0;
  margin: 5px 0;
}

/* specifics */
.card-container {
  padding: 0;
  border-radius: 10px;
  height: fit-content;
}
.icon1 {
  font-size: 30px;
  color: black;
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
  color: #ff3535;
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
.date-outline {
  box-shadow: var(--neomorphism-concave-2);
  padding: 0;
  margin: 0;
  border-radius: 50px;
  width: 80%;
  text-align: center;
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
  margin: 0 0 0 15px;
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
.border {
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
}
.date-label {
  font-family: "Inter";
  font-weight: 700;
}
.ot-card {
  width: 270px;
}
.view-btn {
  width: 100%;
  padding: 0;
  border-radius: 20px;
  height: fit-content;
  color: #000000;
  margin-top: 15px;
}
</style>
