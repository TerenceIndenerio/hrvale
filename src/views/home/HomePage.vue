<template>
  <ion-page>
    <HeaderUser :headerTitle="headerTitle"></HeaderUser>
    <ion-content :fullscreen="true">
      <CardWImg :cardHeader="cardHeader" :cardText="cardText" :img_src="img_src" />
      <HomeClockInCard />
      <HomeRandomCard />
      
      <ion-refresher slot="fixed" @ionRefresh="doRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent } from '@ionic/vue';
import HeaderUser from '@/components/header/HeaderUser.vue';
import CardWImg from '@/components/cards/CardWImg.vue';
import HomeClockInCard from '@/components/cards/HomeClockInCard.vue';
import HomeRandomCard from '@/components/cards/HomeRandomCard.vue';
import Loader from '@/components/others/Loader.vue'
// Header
var headerTitle = "Home";
// Update Card
var cardHeader = "Update"
var cardText = "is simply dummy text of the printing & typesetting industry."
var img_src = "assets/images/card_img1.png"
const doRefresh = (event) => {
  location.reload();
  setTimeout(() => {
    // Stop the refresher
    event.target.complete();
  }, 2000);
};
</script>