<template>
    <ion-header class="header">
      <a href="/tabs/services"><ion-icon name="arrow-back-outline" class="icon1"></ion-icon></a>
      <h2 class="title">{{ headerTitle }}</h2>
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="23" viewBox="0 0 26 23" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M16 18H20.5858C21.3668 18 22 17.3668 22 16.5858C22 16.2107 21.851 15.851 21.5858 15.5858L20.5858 14.5858C20.2107 14.2107 20 13.702 20 13.1716L20 9.97067C20 5.56859 16.4314 2 12.0293 2C7.61789 2 4.04543 5.58319 4.05867 9.9946L4.06814 13.1476C4.06977 13.6922 3.84928 14.2139 3.45759 14.5922L2.42864 15.586C2.15471 15.8506 2 16.2151 2 16.5959C2 17.3714 2.62863 18 3.40408 18H8C8 20.2091 9.79086 22 12 22C14.2091 22 16 20.2091 16 18ZM19.5251 15.6464L20.3787 16.5H3.64147L4.49967 15.6711C5.18513 15.009 5.57099 14.0961 5.56813 13.1431L5.55867 9.9901C5.54792 6.40887 8.44807 3.5 12.0293 3.5C15.603 3.5 18.5 6.39702 18.5 9.97067L18.5 13.1716C18.5 14.0998 18.8687 14.9901 19.5251 15.6464ZM14.5 18H9.5C9.5 19.3807 10.6193 20.5 12 20.5C13.3807 20.5 14.5 19.3807 14.5 18Z" fill="white"/>
      </svg>

      <ion-card class="card-top">
          <ion-icon name="chevron-back-outline" class="arrow"></ion-icon>
          <p>Dec 1 - Dec 7</p>
          <ion-icon name="chevron-forward-outline" class="arrow"></ion-icon>     
      </ion-card>
    </ion-header>
</template>
  
<script setup lang="ts">
  import { IonCard, IonHeader, IonIcon } from '@ionic/vue';
  defineProps ({
    headerTitle: String,
  });
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Open+Sans');
  .header {
    background-color: var(--ion-color-blue-theme);
    height: 120px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 0 0 40px 40px;
    padding: 0 29px;
    box-shadow: none;
    text-align: center;
  }
  .icon1 {
    font-size: 30px;
    color: var(--ion-color-primary-contrast);
  }
  .title {
    color: var(--ion-color-primary-contrast);
    text-align: center;
    font-family: var(--ion-font-font2);
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
  .card-top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 20px;
    box-shadow: 0px 4px 3px 0px rgb(175, 175, 175);
    margin-right:  auto;
    margin-left: auto;
    width: 305px;
    height: 54px;
    flex-shrink: 0;
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
  }
  .card-top p {
    color: #000;
    text-align: center;
    font-family: Open Sans;
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
  .arrow {
    font-size: 30px;
    color: var(--ion-color-blue-theme);
  }

</style>
