<template>
    <ion-page>
        <HeaderReturn :headerTitle="headerTitle"></HeaderReturn>
        <ion-content :fullscreen="true">

            <Calendar />
            <div class="vh"></div>
            <BottomInputCard />
            
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
    import { IonPage, IonHeader, IonText, IonContent, IonIcon, IonFooter, IonToolbar, IonTitle } from '@ionic/vue';
    import BottomInputCard from '@/components/others/BottomInputCard.vue'
    import HeaderReturn from '@/components/header/HeaderReturn.vue';
    import Calendar from '@/components/calendar/Calendar.vue';

    // Header
    var headerTitle = "Apply Leave";

</script>

<style scoped>
    .vh {
            height: 50vh;
        }
</style>