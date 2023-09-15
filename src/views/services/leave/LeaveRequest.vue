<template>
    <ion-page>
        <HeaderReturn :headerTitle="headerTitle"></HeaderReturn>
        <ion-content :fullscreen="true">
            
            <LeaveRequestCard 
                :outlineColor="cards.cardVal1.outlineColor" 
                :leaveType="cards.cardVal1.leaveType" 
                :username="cards.cardVal1.username"
                :datePosted="cards.cardVal1.datePosted"
                :leaveDate="cards.cardVal1.leaveDate"
                :duration="cards.cardVal1.duration"
                :leaveBal="cards.cardVal1.leaveBal"
                :reason="cards.cardVal1.reason"
            />

            <LeaveRequestCard 
                :outlineColor="cards.cardVal2.outlineColor" 
                :leaveType="cards.cardVal2.leaveType" 
                :username="cards.cardVal2.username"
                :datePosted="cards.cardVal2.datePosted"
                :leaveDate="cards.cardVal2.leaveDate"
                :duration="cards.cardVal2.duration"
                :leaveBal="cards.cardVal2.leaveBal"
                :reason="cards.cardVal2.reason"
            />

            <LeaveRequestCard 
                :outlineColor="cards.cardVal2.outlineColor" 
                :leaveType="cards.cardVal2.leaveType" 
                :username="cards.cardVal2.username"
                :datePosted="cards.cardVal2.datePosted"
                :leaveDate="cards.cardVal2.leaveDate"
                :duration="cards.cardVal2.duration"
                :leaveBal="cards.cardVal2.leaveBal"
                :reason="cards.cardVal2.reason"
            />

            <LeaveRequestCard 
                :outlineColor="cards.cardVal1.outlineColor" 
                :leaveType="cards.cardVal1.leaveType" 
                :username="cards.cardVal1.username"
                :datePosted="cards.cardVal1.datePosted"
                :leaveDate="cards.cardVal1.leaveDate"
                :duration="cards.cardVal1.duration"
                :leaveBal="cards.cardVal1.leaveBal"
                :reason="cards.cardVal1.reason"
            />

            
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
    import { IonPage, IonHeader, IonText, IonContent, IonIcon } from '@ionic/vue'
    import HeaderReturn from '@/components/header/HeaderReturn.vue'
    import LeaveRequestCard from '@/components/cards/LeaveRequestCard.vue'

    // Header
    var headerTitle = "Leave Request"

    // Card
    const cards = {
        "cardVal1": {
            outlineColor: "color: #27AE60; border: 1px solid #27AE60;", 
            leaveType: "Sick Leave", 
            username: "Al bumbay",
            datePosted: "Applied on 19 nov 2022",
            leaveDate: "19 Nov - 19 Nov 2022",
            duration: "1 day(s)",
            leaveBal: "0 day(s)",
            reason: "High fever",
        },
        "cardVal2": {
            outlineColor: "color: #2F80ED; border: 1px solid #2F80ED;", 
            leaveType: "Unpaid Leave", 
            username: "Al bumbay",
            datePosted: "Applied on 19 nov 2022",
            leaveDate: "19 Nov - 19 Nov 2022",
            duration: "1 day(s)",
            leaveBal: "0 day(s)",
            reason: "High fever",
        }
    };

</script>
