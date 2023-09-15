<template>
    <ion-page>
        <HeaderClockWCard 
            :headerTitle="header.headerTitle"
            :clockin="header.clockin" 
            :clockout="header.clockout"
        />
        <ion-content :fullscreen="true">
        <br>
        <br>
        
        <HomeClockInCard />
        
      </ion-content>
    </ion-page>
  </template>
  
<script setup lang="ts">
    import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
    import HomeClockInCard from '@/components/cards/HomeClockInCard.vue';
    import HeaderClockWCard from '@/components/header/HeaderClockWCard.vue';
  
    // Header
    const header = {
        headerTitle : "Clock",
        clockin : "08:50 AM",
        clockout : "08:50 PM",
    }

</script>