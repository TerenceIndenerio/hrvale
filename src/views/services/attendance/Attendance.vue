<template>
    <ion-page>
        <HeaderReturn :headerTitle="headerTitle" />
        <ion-content :fullscreen="true">
            <br>
            <Calendar />

            <div class="wdays-container flex-h">
                <p class="wdays-text">
                    Total working days
                </p>
                <div class="box flex-h">
                    <p class="wdays-num">
                        {{ wDaysNum }}
                    </p>
                </div>
            </div>

            <AbsentCard />
 
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
    import { IonPage, IonContent } from '@ionic/vue';
    import Calendar from '@/components/calendar/Calendar.vue'
    import HeaderReturn from '@/components/header/HeaderReturn.vue';
    import AbsentCard from '@/components/cards/AbsentCard.vue'

    // Header
    const headerTitle = "Attendance";
    // working days
    const wDaysNum = "24";

</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Open+Sans');
    .flex-h {
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    .wdays-container {
        width: 305px;
        height: 78px;
        flex-shrink: 0;
        border-radius: 20px;
        background: #FFF;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.50);
        margin: 0 auto;
    }
    .wdays-text {
        color: #000;
        text-align: center;
        font-family: Open Sans;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }
    .box {
        width: 45px;
        height: 45px;
        border-radius: 10px;
        background: #6D2B84;
    }
    .wdays-num {
        color: #FFF;
        text-align: center;
        font-family: Open Sans;
        font-size: 18px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }
</style>