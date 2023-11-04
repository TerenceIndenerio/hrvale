<template>
  <ion-page color="none" style="background-color: #fff">
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar color="none" style="background-color: #272341">
        <ion-tab-button tab="services" href="/tabs/services">
          <div class="services">
            <ion-icon name="grid" class="icon-color"></ion-icon>
          </div>
          <!-- <ion-label>SERVICES</ion-label> -->
        </ion-tab-button>

        <ion-tab-button tab="home" href="/tabs/home">
          <div class="home">
            <ion-icon name="home" class="icon-color"></ion-icon>
          </div>

          <!-- <ion-label>HOME</ion-label> -->
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/tab3">
          <div class="approval">
            <ion-icon name="checkmark-circle" class="icon-color"></ion-icon>
          </div>
          <!-- <ion-label>APPROVAL</ion-label> -->
        </ion-tab-button>

        <ion-tab-button tab="tab4" href="/tabs/tab4">
          <div class="more">
            <ion-icon name="cog" class="icon-color"></ion-icon>
          </div>
          <!-- <ion-label>MORE</ion-label> -->
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
} from "@ionic/vue";
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
ion-tab-button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
ion-tab-bar {
  height: 60px;
}
ion-label {
  margin-bottom: 10px;
}
ion-label {
  color: var(--ion-color-primary-contrast);
  font-family: Roboto;
  font-size: 8px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.icon-color {
  font-size: 35px;
  color: white;
}
</style>
