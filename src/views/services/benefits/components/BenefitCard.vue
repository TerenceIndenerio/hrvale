<template>
  <ion-card class="card-container">
    <ion-grid>
      <ion-col class="flex-c">
        <div class="leave-type outlineColor">
          <p>{{ benefitType }}</p>
        </div>
      </ion-col>

      <ion-row class="pad-w">
        <ion-col class="col-name">
          <p>Benefit Code:</p>
        </ion-col>

        <ion-col class="col-data">
          <p>{{ benefitCode }}</p>
        </ion-col>
      </ion-row>

      <ion-row class="pad-w">
        <ion-col class="col-name">
          <p>Benefit Name:</p>
        </ion-col>

        <ion-col class="col-data">
          <p>{{ benefitName }}</p>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-card>
</template>

<script>
import { IonCard, IonCol, IonGrid, IonRow, IonButton } from "@ionic/vue";

export default {
  components: {
    IonCard,
    IonCol,
    IonGrid,
    IonRow,
    IonButton,
  },
  props: {
    benefitCode: String,
    benefitName: String,
    benefitType: String,
    result: Object,
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
  padding: 10px;
  border-radius: 30px;
  height: fit-content;
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
.border {
  width: 100%;
}
</style>
