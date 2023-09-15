<template>
    <ion-page>
        <HeaderWCardDate :headerTitle="headerTitle" />
        <ion-content :fullscreen="true">
            <br>
            <br>
            <br>

            <HomeDashboardCardt 
                :cardTitle = "homeDashboardCardt.yesterday.cardTitle"
                :appliedDuration="homeDashboardCardt.yesterday.appliedDuration"
                :reason="homeDashboardCardt.yesterday.reason"
                :typeOfLeave="homeDashboardCardt.yesterday.typeOfLeave"
                :status = "homeDashboardCardt.yesterday.status"
                :colorBadge="homeDashboardCardt.yesterday.colorBadge"
            />

            <ScheduleOverviewCard />

            <Button :buttonText="buttonText" />
        
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
    import { IonPage, IonContent } from '@ionic/vue';
    import HeaderWCardDate from '@/components/header/HeaderWCardDate.vue';
    import HomeDashboardCardt from '@/components/cards/HomeDashboardCardt.vue';
    import ScheduleOverviewCard from '@/components/cards/ScheduleOverviewCard.vue';
    import Button from '@/components/buttons/Button.vue';
    // Header
    const headerTitle = "Schedule";
    const buttonText = "Request Schedule"

    const homeDashboardCardt = {
        "yesterday" : {
            cardTitle : "YESTERDAY",
            appliedDuration : "12 Oct, 2019 to 15 Oct, 2019",
            reason : "Having fever from last night",
            typeOfLeave : "Sick Leave",
            status : "Pending",
            colorBadge : "warning",
        }
    }

</script>
  