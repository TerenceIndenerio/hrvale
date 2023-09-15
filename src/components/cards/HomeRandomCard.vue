<template>
    <ion-card>

      <a class="inline" href="/leave">
        <div class="circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="26" viewBox="0 0 28 26" fill="none">
                <rect x="0.75" y="6.18372" width="25.9156" height="18.9999" fill="#EFEEEE" stroke="#2C2A73" stroke-width="1.5"/>
                <rect x="7.78912" y="0.75" width="11.8373" height="24.4336" fill="#F2994A" stroke="#2C2A73" stroke-width="1.5"/>
            </svg>
        </div>
        <p>
            Leave Report
        </p>
      </a>

      <a class="inline" href="/attendance">
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="49" height="49" viewBox="0 0 49 49" fill="none">
                <circle cx="24.1021" cy="24.1021" r="24.1021" fill="#C0EDE5"/>
                <path d="M10.3402 37.9284L23.3189 15.4486L36.2976 37.9284H10.3402Z" fill="#F2994A" stroke="#2C2A73" stroke-width="1.5"/>
            </svg>
        </div>
        <p>
            Attendance
        </p>
      </a>
        
    </ion-card>
  </template>
  
  <script lang="ts">
    import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton } from '@ionic/vue';
    import { defineComponent } from 'vue';
  
    export default defineComponent({
      components: { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton },
    });
    
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css?family=Open+Sans');
  @import url('https://fonts.googleapis.com/css?family=Roboto');

  a{
    text-decoration: none;
  }
  ion-card {
    align-items: center;
    border-radius: 10px;
    /* box-shadow: 0px 4px 3px 0px rgb(175, 175, 175); */
  }
  .inline {
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    padding: 10px;
    gap: 10px;
    width: 100%;
    background-color: var(--ion-color-tertiary-contrast);
  }
  .circle {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: aqua;
  }
  .inline p {
    color: var(--oil-11, #0D0D0D);
    text-align: center;
    font-family: Roboto;
    font-size: 15px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
  </style>