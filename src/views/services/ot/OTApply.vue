<template>
    <ion-page>
        <HeaderReturn :headerTitle="headerTitle" />
        <ion-content :fullscreen="true">
            <br>
            <Calendar />

            
            <div class="vh"></div>

            <OTBottomInput :wDaysNum="wDaysNum" :buttonText="buttonText" :url="url" />
 
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
    import { IonPage, IonContent } from '@ionic/vue';
    import Calendar from '@/components/calendar/Calendar.vue'
    import HeaderReturn from '@/components/header/HeaderReturn.vue';
    import Button from '@/components/buttons/Button.vue'
    import OTBottomInput from '@/components/others/OTBottomInput.vue';

    // Header
    const headerTitle = "OT Request";
    // working days
    const wDaysNum = "04";
    //button
    const buttonText = "Request for OT"
    const url = "/otrequest"

</script>

<style scoped>
    .vh {
        height: 50vh;
    }
    
</style>