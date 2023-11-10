<template>
  <ion-grid class="button-container">
    <ion-row>
      <ion-col class="card btn-text" expand="full" color="none">
        <a href="/leave">
          <span class="ion-text-left">
            <ion-icon name="exit" class="icon-btn"></ion-icon>
            <h4>Leave</h4>
          </span>
        </a>
      </ion-col>
      <ion-col class="card btn-text" expand="full" color="none">
        <a href="/clockin" class="clockin">
          <span class="ion-text-left">
            <ion-icon name="time" class="icon-btn"></ion-icon>
            <h4>Clock In/Out</h4>
          </span>
        </a>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col class="card btn-text" expand="full" color="none">
        <a href="/viewschedule">
          <span class="ion-text-left">
            <ion-icon name="calendar" class="icon-btn"></ion-icon>
            <h4>Schedule</h4>
          </span>
        </a>
      </ion-col>
      <ion-col class="card btn-text" expand="full" color="none">
        <a href="/attendancecorrection">
          <span class="ion-text-left">
            <ion-icon name="today" class="icon-btn"></ion-icon>
            <h4>Attendance <br />Correction</h4>
          </span>
        </a>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col class="card btn-text" expand="full" color="none">
        <a href="/soon">
          <span class="ion-text-left">
            <ion-icon name="calendar-clear" class="icon-btn"></ion-icon>
            <h4>Apply OT</h4>
          </span>
        </a>
      </ion-col>
      <ion-col class="card btn-text" expand="full" color="none">
        <a href="/soon" disabled>
          <span class="ion-text-left">
            <ion-icon name="pricetags" class="icon-btn"></ion-icon>
            <h4>Vale</h4>
          </span>
        </a>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col class="card btn-text" expand="full" color="none">
        <a href="/soon" disabled>
          <span class="ion-text-left">
            <ion-icon name="receipt" class="icon-btn"></ion-icon>
            <h4>View Payslip</h4>
          </span>
        </a>
      </ion-col>
      <ion-col class="card btn-text" expand="full" color="none">
        <a href="/soon" disabled>
          <span class="ion-text-left">
            <ion-icon name="create" class="icon-btn"></ion-icon>
            <h4>PCR</h4>
          </span>
        </a>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col class="card btn-text" expand="full" color="none">
        <a href="/soon" disabled>
          <span class="ion-text-left">
            <ion-icon name="gift" class="icon-btn"></ion-icon>
            <h4>Benefits</h4>
          </span>
        </a>
      </ion-col>
      <ion-col class="card btn-text" expand="full" color="none">
        <a href="/soon" disabled>
          <span class="ion-text-left">
            <ion-icon name="cash" class="icon-btn"></ion-icon>
            <h4>Loan Balances</h4>
          </span>
        </a>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script setup lang="ts">
import { IonButton, IonCol, IonGrid, IonRow, IonIcon } from "@ionic/vue";
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans");

a {
  text-decoration: none;
  width: 100%;
  height: 100%;
}
.button-container {
  margin: 0;
  padding-top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
  flex-direction: row;
  justify-content: left;
  align-items: center;
  height: 100%;
  margin-right: auto;
  mix-blend-mode: multiply;
  margin-left: 10px;
  gap: 10px;
}
.card {
  padding: 0;
  height: 60px;
  border-radius: 10px;
  margin: 10px;
  box-shadow: 0px 2px 5px 0px rgb(175, 175, 175);
  overflow: hidden;
  display: flex;
  justify-content: left;
  align-items: center;
  max-width: 300px;
  width: 150px;
}
.btn-text h4 {
  padding: 0;
  margin: 0;
  color: var(--oil-11, #0d0d0d);
  font-family: Open Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
}
.icon-circle {
  border-radius: 100%;
}
.clockin {
  display: flex;
  align-items: center;
}
.icon-btn {
  font-size: 30px;
  color: var(--ion-color-blue-theme);
}
</style>
