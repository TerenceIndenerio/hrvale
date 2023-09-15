<template>
  <ion-page>
    <HeaderUser :headerTitle="headerTitle"></HeaderUser>
    <ion-content :fullscreen="true">
      <Loader />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import { defineComponent } from 'vue';
import HeaderUser from '@/components/header/HeaderUser.vue';
import Loader from '@/components/others/Loader.vue'
  // Header
  var headerTitle = "Other Page";
    
</script>
