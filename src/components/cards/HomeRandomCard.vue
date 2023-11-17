<template>
  <ion-card>
    <ion-grid class="button-container">
      <ion-row>
        <ion-col expand="full" color="none">
          <a href="/leave">
            <div class="flex-center box-container">
              <ion-icon
                name="exit"
                class="icon-btn"
                :style="{ color: btnColor }"
              ></ion-icon>
            </div>
          </a>
        </ion-col>
        <ion-col expand="full" color="none">
          <a href="/clockin" class="clockin">
            <div class="flex-center box-container">
              <ion-icon
                name="time"
                class="icon-btn"
                :style="{ color: btnColor }"
              ></ion-icon>
            </div>
          </a>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col expand="full" color="none">
          <a href="/viewschedule">
            <div class="flex-center box-container">
              <ion-icon
                name="calendar"
                class="icon-btn"
                :style="{ color: btnColor }"
              ></ion-icon>
            </div>
          </a>
        </ion-col>
        <ion-col expand="full" color="none">
          <a href="/attendancecorrection">
            <div class="flex-center box-container">
              <ion-icon
                name="today"
                class="icon-btn"
                :style="{ color: btnColor }"
              ></ion-icon>
            </div>
          </a>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col expand="full" color="none">
          <a href="/soon">
            <div class="flex-center box-container">
              <ion-icon
                name="calendar-clear"
                class="icon-btn"
                :style="{ color: btnColor }"
              ></ion-icon>
            </div>
          </a>
        </ion-col>
        <ion-col class="card btn-text" expand="full" color="none">
          <a href="/soon" disabled>
            <div class="flex-center box-container">
              <ion-icon
                name="pricetags"
                class="icon-btn"
                :style="{ color: btnColor }"
              ></ion-icon>
            </div>
          </a>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-card>
</template>

<script lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonGrid,
  IonCol,
  IonRow,
} from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonButton,
    IonIcon,
    IonGrid,
    IonCol,
    IonRow,
  },
  props: {
    btnColor: String,
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
@import url("https://fonts.googleapis.com/css?family=Roboto");

a {
  text-decoration: none;
}
ion-card {
  align-items: center;
  border-radius: 10px;
}
.box-container {
  box-shadow: 0px 2px 5px 0px rgb(175, 175, 175);
  border-radius: 10px;
  padding: 10px;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.inline {
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  padding: 10px;
  gap: 10px;
  width: 100%;
  background-color: var(--ion-color-tertiary-contrast);
}
.button-container {
  padding: 20px;
}
.circle {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: aqua;
}
.inline p {
  color: var(--oil-11, #0d0d0d);
  text-align: center;
  font-family: Roboto;
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.icon-btn {
  font-size: 30px;
  /* color: var(--ion-color-blue-theme); */
}
</style>
