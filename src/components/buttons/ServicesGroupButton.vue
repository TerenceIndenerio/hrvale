<template>
  <ion-grid class="button-container">
    <ion-row>
      <ion-col class="card btn-text" expand="full" color="none">
        <a href="/leave">
          <span class="ion-text-left">
            <img src="/assets/images/image7.png" alt="" class="icon-circle" />
            <h4>Leave</h4>
          </span>
        </a>
      </ion-col>
      <ion-col class="card btn-text" expand="full" color="none">
        <a href="/clockin" class="clockin">
          <span class="ion-text-left">
            <img src="/assets/images/image2.png" alt="" class="icon-circle" />
            <h4>Clock In</h4>
          </span>
        </a>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col class="card btn-text" expand="full" color="none">
        <a href="/viewschedule">
          <span class="ion-text-left">
            <img src="/assets/images/image4.png" alt="" class="icon-circle" />
            <h4>Schedule</h4>
          </span>
        </a>
      </ion-col>
      <ion-col class="card btn-text" expand="full" color="none">
        <a href="/attendancecorrection">
          <span class="ion-text-left">
            <img src="/assets/images/image7.png" alt="" class="icon-circle" />
            <h4>Attendance</h4>
          </span>
        </a>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col class="card btn-text" expand="full" color="none">
        <a href="/soon">
          <span class="ion-text-left">
            <img src="/assets/images/image7.png" alt="" class="icon-circle" />
            <h4>OT</h4>
          </span>
        </a>
      </ion-col>
      <ion-col class="card btn-text" expand="full" color="none">
        <a href="/soon" disabled>
          <span class="ion-text-left">
            <img src="/assets/images/image7.png" alt="" class="icon-circle" />
            <h4>Vale</h4>
          </span>
        </a>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script setup lang="ts">
import { IonButton, IonCol, IonGrid, IonRow } from "@ionic/vue";
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
  margin-left: 5px;
}
.card {
  padding: 0;
  height: 55px;
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
</style>
