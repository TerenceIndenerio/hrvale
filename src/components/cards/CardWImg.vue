<template>
  <div class="container">
    <ion-card class="card">
      <div class="inline-v text-container">
        <h3 class="cardHeader">{{ cardHeader }}</h3>

        <div class="flex-center"></div>
        <div class="p-container">
          <p class="cardText">{{ cardText }}</p>
        </div>
      </div>
    </ion-card>
  </div>
</template>

<script setup lang="ts">
import { IonCard, IonCol, IonGrid, IonRow, IonBadge } from "@ionic/vue";
import { defineComponent } from "vue";

defineProps({
  cardHeader: String,
  cardText: String,
  img_src: String,
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Inter");
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
@import url("https://fonts.googleapis.com/css?family=Roboto");

* {
  margin: 0;
  padding: 0;
}

.card {
  padding: 0 10px;
  margin: 0;
  border-radius: 10px;
  height: fit-content;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8), 0px -4px 8px rgba(0, 0, 0, 0.05);
}
.inline-v {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.inline-h {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.container {
  padding: 10px;
}
.text-container {
  padding: 15px 0;
}
.float-right {
  position: absolute;
  right: 0;
  left: 0;
  width: 100%;
}
/* specifics */

.cardText {
  color: var(--ion-text-color);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-indent: 20px;
  text-align: justify;
}
.p-container {
  margin: 0 20px;
  display: flex;
  justify-content: center;
}
.cardHeader {
  color: var(--ion-text-color);
  font-family: Open Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-indent: 10px;
}
.img-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.img {
  height: fit-content;
  width: fit-content;
  max-height: 150px;
  max-width: auto;
}
</style>
