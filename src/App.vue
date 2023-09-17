<template>
  <ion-app>
    <ion-router-outlet />
    <Loader :isLoading="$store.getters['loader/getLoader']" />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import Loader from '@/components/others/Loader.vue';
</script>
