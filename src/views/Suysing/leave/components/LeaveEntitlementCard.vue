<template>
  <ion-card class="neomorphic-card-1 leave-entitlement-card">
    <div class="leave-type" :style="{ backgroundColor: theme.primaryColor }">
      <p :style="{ color: theme.primaryFontColor }">{{ leaveType }}</p>
    </div>
    <ion-grid class="card-content">
      <ion-row class="pad-w">
        <ion-col class="col-name">
          <p>Leave Type:</p>
        </ion-col>
        <ion-col class="col-data">
          <p :style="{ color: theme.primaryColor }">{{ leaveType }}</p>
        </ion-col>
      </ion-row>

      <ion-row class="pad-w">
        <ion-col class="col-name">
          <p>Leave Days:</p>
        </ion-col>
        <ion-col class="col-data">
          <p :style="{ color: theme.primaryColor }">{{ entitlement }}</p>
        </ion-col>
      </ion-row>

      <ion-row class="pad-w">
        <ion-col class="col-name">
          <ion-checkbox label-placement="end"
            ><p>Calendar Days</p></ion-checkbox
          >
        </ion-col>
        <ion-col class="col-data"> </ion-col>
      </ion-row>

      <ion-row class="pad-w">
        <ion-col class="col-name">
          <ion-checkbox label-placement="end"
            ><p>Working Days</p>
          </ion-checkbox>
        </ion-col>
        <ion-col class="col-data"> </ion-col>
      </ion-row>

      <ion-row class="pad-w">
        <ion-col class="col-name">
          <p>Leave Balance:</p>
        </ion-col>
        <ion-col class="col-data">
          <p :style="{ color: theme.primaryColor }">
            {{ entitlement - daysUsed }}
          </p>
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
  IonCheckbox,
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
    IonCheckbox,
  },
  props: {
    leaveType: String,
    entitlement: Number,
    days: Number,
    validFrom: String,
    validTo: String,
    daysUsed: Number,
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
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 20px 0 0 20px;
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
  font-family: Poppins;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
}
.col-data {
  font-family: Poppins;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
}
.header-card {
  height: 40px;
  text-align: center;
}

.leave-entitlement-card {
  width: 300px;
  margin: 20px auto;
}
.card-content {
  margin-top: 20px;
}
</style>
