<template>
  <ion-card class="neomorphic-card-1 leave-request-card">
    <div class="leave-type" :style="{ backgroundColor: theme.primaryColor }">
      <p :style="{ color: theme.primaryFontColor }">{{ leaveType }}</p>
    </div>
    <ion-grid class="card-content">
      <ion-row class="pad-w">
        <ion-col class="col-name">
          <p>Status:</p>
        </ion-col>

        <ion-col class="col-data">
          <p>{{ status }}</p>
        </ion-col>
      </ion-row>

      <ion-row class="pad-w">
        <ion-col class="col-name">
          <p>Leave Date:</p>
        </ion-col>

        <ion-col class="col-data">
          <p>{{ dateText }}</p>
        </ion-col>
      </ion-row>

      <ion-row class="pad-w">
        <ion-col class="col-name">
          <p>Leave Bal (Days):</p>
        </ion-col>

        <ion-col class="col-data">
          <p>{{ leaveBalance }}</p>
        </ion-col>
      </ion-row>

      <ion-row class="pad-w">
        <ion-col class="col-name">
          <p>Duration (Hours):</p>
        </ion-col>

        <ion-col class="col-data">
          <p>{{ duration }}</p>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-card>
</template>

<script>
import { IonCard, IonCol, IonGrid, IonRow, IonIcon } from "@ionic/vue";
import { getThemeData } from "@/theme/theme";

export default {
  components: {
    IonCard,
    IonCol,
    IonGrid,
    IonRow,
    IonIcon,
  },
  props: {
    employeeName: String,
    dateText: String,
    outlineColor: String,
    leaveType: String,
    leavePeriod: String,
    duration: String,
    leaveBalance: String,
    reason: String,
    duration: String,
    comment: String,
    status: String,
    lengthDays: Number,
  },
  data() {
    return {
      theme: {},
    };
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
@import url("https://fonts.googleapis.com/css?family=Inter");
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
@import url("https://fonts.googleapis.com/css?family=Roboto");

.inline-v {
  display: flex;
  flex-direction: column;
}
.inline-w {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.pad-w {
  padding: 0 10px;
}
p {
  padding: 0;
  margin: 5px 0;
}
ion-col p {
  margin: 0;
}
/* specifics */
.card {
  padding: 10px 10px 0 10px;
  margin: 10px 7%;
  border-radius: 20px;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8), 0px -4px 8px rgba(0, 0, 0, 0.05);
}
.icon1 {
  font-size: 30px;
  color: black;
}
.leave-type {
  padding: 0;
  margin: 0;
  border-radius: 20px 0 0 20px;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
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
.col-data {
  color: #0d0d0d;
  font-family: Open Sans;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 107.682%;
}
.card-content {
  margin-top: 20px;
}
.leave-request-card {
  width: 300px;
  margin: 20px auto;
}
</style>
