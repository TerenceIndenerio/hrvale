<template>
  <ion-app>
    <ion-router-outlet />
    <Loader :isLoading="$store.state.isLoading" />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import Loader from '@/components/others/Loader.vue';
</script>
