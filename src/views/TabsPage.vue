<template>
  <ion-page color="none" style="background-color: #FFF;">
    <ion-tabs >
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar color="none" style="background-color: #272341;">
        <ion-tab-button tab="services" href="/tabs/services">
          
          <div class="services">
            <div class="services-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="7" height="8" viewBox="0 0 7 8" fill="none">
                <circle cx="3.31274" cy="3.97571" r="2.73541" stroke="#ABABAB"/>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="7" height="8" viewBox="0 0 7 8" fill="none">
                <circle cx="3.31274" cy="3.97571" r="2.73541" stroke="#ABABAB"/>
              </svg>
            </div>
            <div class="services-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="7" height="8" viewBox="0 0 7 8" fill="none">
                <circle cx="3.31274" cy="3.97571" r="2.73541" stroke="#ABABAB"/>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="7" height="8" viewBox="0 0 7 8" fill="none">
                <circle cx="3.31274" cy="3.97571" r="2.73541" stroke="#ABABAB"/>
              </svg>
            </div>
          </div>

          <ion-label>SERVICES</ion-label>

        </ion-tab-button>

        <ion-tab-button tab="home" href="/tabs/home">
          
          <div class="home">
            <img src="assets\images\home.png" alt="">
          </div>

          <ion-label>HOME</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/tab3">

          <!-- <ion-icon name="checkmark-circle-outline" style="font-size:30px;"></ion-icon> -->
          <div class="approval">
            <img src="assets\images\approval.png" alt="">
          </div>
          <ion-label>APPROVAL</ion-label>

        </ion-tab-button>

        <ion-tab-button tab="tab4" href="/tabs/tab4">

          <div class="more">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="2" viewBox="0 0 36 2" fill="none">
              <path d="M1.04712 1H34.5253" stroke="#ABABAB" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="3" viewBox="0 0 26 3" fill="none">
              <path d="M1.04712 1.46259H24.9529" stroke="#ABABAB" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="3" viewBox="0 0 19 3" fill="none">
              <path d="M1.04712 1.87115H17.7862" stroke="#ABABAB" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <ion-label>MORE</ion-label>

        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
</script>

<style scoped> 
*{
  padding: 0;
  margin: 0;
}
  ion-tab-button {
    /* height: 50px; */
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
  .services {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin: auto;
  }
  .services-icon {
    display: flex;
    gap: 5px;
  }
  .home {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: auto;
  }
  .approval {
    border-radius: 100%;
    height: 30px;
    margin: auto;
  }
  .more {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin: 5px 0;
    margin: auto;
  }
  ion-label {
    color: var(--ion-color-primary-contrast);
    font-family: Roboto;
    font-size: 8px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

  }
</style>