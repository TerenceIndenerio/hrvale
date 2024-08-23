<template>
  <ion-app>
    <ion-router-outlet />
    <Loader :isLoading="isLoading" />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import Loader from "@/components/others/Loader.vue";
import { useStore } from "vuex";
import { computed } from "vue";

// Access the Vuex store
const store = useStore();

// Compute the value of `isLoading` using a Vuex getter
const isLoading = computed(() => store.getters["loader/getLoader"]);
</script>
