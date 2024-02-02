<template>
  <ion-card class="card">
    <ion-grid>
      <ion-row>
        <div class="leave-type outline" v-bind:style="outlineColor">
          <p>{{ leaveType }}</p>
        </div>
      </ion-row>

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

      <!-- <ion-row class="pad-w">
        <ion-col class="col-name">
          <p>Number of Days:</p>
        </ion-col>

        <ion-col class="col-data">
          <p></p>
        </ion-col>
      </ion-row> -->

      <!-- <ion-row class="pad-w">
        <ion-col class="col-name">
          <p>Leave With Pay:</p>
        </ion-col>

        <ion-col class="col-data">
          <p></p>
        </ion-col>
      </ion-row> -->

      <!-- <ion-row class="pad-w">
        <ion-col class="col-name">
          <p>Reason:</p>
        </ion-col>

        <ion-col class="col-data">
          <p>{{ comment }}</p>
        </ion-col>
      </ion-row> -->
    </ion-grid>
  </ion-card>
</template>

<script>
import { IonCard, IonCol, IonGrid, IonRow, IonIcon } from "@ionic/vue";

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
  border-radius: 50px;
  margin: auto;
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
</style>
