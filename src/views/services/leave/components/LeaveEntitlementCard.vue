<template>
  <ion-card class="card">
    <ion-grid>
      <ion-row class="pad-w">
        <ion-col class="col-name">
          <p>Leave Type:</p>
        </ion-col>
        <ion-col class="col-data">
          <p>{{ leaveType }}</p>
        </ion-col>
      </ion-row>

      <ion-row class="pad-w">
        <ion-col class="col-name">
          <p>Entitlement Type:</p>
        </ion-col>
        <ion-col class="col-data">
          <p>{{ entitlement }}</p>
        </ion-col>
      </ion-row>

      <ion-row class="pad-w">
        <ion-col class="col-name">
          <p>Valid From:</p>
        </ion-col>
        <ion-col class="col-data">
          <p>{{ validFrom }}</p>
        </ion-col>
      </ion-row>

      <ion-row class="pad-w">
        <ion-col class="col-name">
          <p>Valid To:</p>
        </ion-col>
        <ion-col class="col-data">
          <p>{{ validTo }}</p>
        </ion-col>
      </ion-row>

      <ion-row class="pad-w">
        <ion-col class="col-name">
          <p>Days:</p>
        </ion-col>
        <ion-col class="col-data">
          <p>{{ days }}</p>
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
} from "@ionic/vue";

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
    leaveType: String,
    entitlement: String,
    days: Number,
    validFrom: String,
    validTo: String,
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
  margin: 0;
}

/* specifics */
.card {
  padding: 5px 10px;
  margin: 10px 7%;
  border-radius: 10px;
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
  width: 80%;
  text-align: center;
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
.col-data {
  color: #0d0d0d;
  font-family: Open Sans;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 107.682%;
}
.header-card {
  height: 40px;
  text-align: center;
}
</style>
