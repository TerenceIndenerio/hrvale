<template>
    
    <ion-text>
        <h1 class="card-title">
            Overview
        </h1>  
    </ion-text>
    
    <ion-card class="card">
        <ion-grid>
            
            <ion-row>
                <ion-col class="total-hrs-text1" size="auto">Total Hours</ion-col>
                <ion-col v-for="col in 5" :key="col"></ion-col>
                <ion-col><ion-icon name="ellipsis-vertical-outline"></ion-icon></ion-col>
            </ion-row>
            
            <ion-row>
                <ion-col v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day">{{ day }}</ion-col>
            </ion-row>
            
            <ion-row>
                <ion-col v-for="hour in 7" :key="hour">1:30</ion-col>
            </ion-row>

        </ion-grid>
    </ion-card>

    <ion-card class="card">
        <ion-grid>

            <ion-row>
                <ion-col class="total-hrs-text2" size="auto">Break</ion-col>
                <ion-col v-for="col in 5" :key="col"></ion-col>
                <ion-col><ion-icon name="ellipsis-vertical-outline"></ion-icon></ion-col>
            </ion-row>

            <ion-row>
                <ion-col v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day">{{ day }}</ion-col>
            </ion-row>
            
            <ion-row>
                <ion-col v-for="hour in 7" :key="hour">1:30</ion-col>
            </ion-row>

        </ion-grid>
    </ion-card>

</template>
  
  <script setup lang="ts">
      import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonIcon, IonText, IonCol, IonRow, IonGrid  } from '@ionic/vue';
  </script>
    
  <style scoped>
  @import url('https://fonts.googleapis.com/css?family=Open+Sans');
  @import url('https://fonts.googleapis.com/css?family=Roboto');

  .card {
      border-radius: 5px;
      
  }
  .status {
      float: right;
      border-radius: 20px 0px 0px 20px;
      padding: 5px 10px;
  }
  .pending {
      color: var(--ion-color-primary-contrast);
      background-color: var(--ion-color-warning);
  }
  .card-text-container h3,h4 {
      padding: 0;
      margin: 0;
  }
  .card-title {
      color: #3B3C3E;
      font-family: 'Open Sans';
      font-size: 19px;
      font-style: normal;
      font-weight: bold;
      line-height: normal;
      margin-left: 10px;
  }
  .icon-item-container {
      margin-right: 10px;
  }
  .text-item-container p {
      margin: 0;
      color: #7B808B;
      font-family: var(--ion-font-font1);
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
  }
  .text-item-container h4 {
      color: #3B3C3E;
      font-family: var(--ion-font-font1);
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
  }
  .total-hrs-text1 {
    color: #B530CC;
    font-family: Open Sans;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
  .total-hrs-text2 {
    color: #2D54EE;
    font-family: Open Sans;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
  ion-col {
    text-align: center;
    width: 100%;
  }

  </style>