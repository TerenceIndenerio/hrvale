<template>
    <div class="container">
        <ion-card class="card">
            <ion-grid>
                <ion-row>
                    <ion-col class="inline-v text-container">
                        <h3 class="cardHeader">{{ cardHeader }}</h3>
                        <div class="inline-h">
                            <div class="icon flex-center">
                            </div>
                            <div class="inline-v">
                                <p class="cardText">{{ cardText }}</p>
                            </div>
                        </div>
                    </ion-col >
                    <ion-col class="flex-center">
                        <img v-bind:src="img_src" alt="">
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-card>
    </div>
</template>

<script setup lang="ts">
    import { IonCard, IonCol, IonGrid, IonRow, IonBadge } from '@ionic/vue';
    import { defineComponent } from 'vue';
    
    defineProps({
        cardHeader: String,
        cardText: String,
        img_src: String,
        });
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Inter');
    @import url('https://fonts.googleapis.com/css?family=Open+Sans');
    @import url('https://fonts.googleapis.com/css?family=Roboto');
    
    *{
        margin: 0;
        padding: 0;
    }
    
    .card {
        padding: 10px 0  10px 20px;
        margin: 0;
        border-radius: 20px;
        /* box-shadow: 0px 4px 3px 0px rgb(175, 175, 175); */
        height: 137px;
    }
    .inline-v {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .inline-h {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }
    .flex-center {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .container {
        padding: 10px;
    }
    .text-container {
        padding: 15px 0;
    }

    /* specifics */
    
    .cardText {
        color: var(--ion-text-color);
        font-family: Open Sans;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }
    .cardHeader {
        color: var(--ion-text-color);
        font-family: Open Sans;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    }
    
</style>