<template>
    <ion-page>
        <HeaderWAddToCart :headerTitle="headerTitle" />
        <ion-content :fullscreen="true">
            <br>
            <br>
            <div class="flex-center">
                <ValeImage />
            </div>
            <p class="group-name">
                Recent Purchased
            </p>
            <div class="mini-card-container">
                <ValeRecentPurchasedCard 
                :employeeName="OTReqCardVal.Recent_Purchased.employeeName" 
                :dateTitle="OTReqCardVal.Recent_Purchased.dateTitle" 
                :dateText="OTReqCardVal.Recent_Purchased.dateText" 
                :purchasedVal="OTReqCardVal.Recent_Purchased.purchasedVal"/>

                <ValeRecentPurchasedCard 
                :employeeName="OTReqCardVal.Recent_Purchased.employeeName" 
                :dateTitle="OTReqCardVal.Recent_Purchased.dateTitle" 
                :dateText="OTReqCardVal.Recent_Purchased.dateText" 
                :purchasedVal="OTReqCardVal.Recent_Purchased.purchasedVal"/>

                <ValeRecentPurchasedCard 
                :employeeName="OTReqCardVal.Recent_Purchased.employeeName" 
                :dateTitle="OTReqCardVal.Recent_Purchased.dateTitle" 
                :dateText="OTReqCardVal.Recent_Purchased.dateText" 
                :purchasedVal="OTReqCardVal.Recent_Purchased.purchasedVal"/>

                <ValeRecentPurchasedCard 
                :employeeName="OTReqCardVal.Recent_Purchased.employeeName" 
                :dateTitle="OTReqCardVal.Recent_Purchased.dateTitle" 
                :dateText="OTReqCardVal.Recent_Purchased.dateText" 
                :purchasedVal="OTReqCardVal.Recent_Purchased.purchasedVal"/>
            </div>
            <p class="group-name">
                History
            </p>
            <div class="inline-v">
                <ValeHistoryCard 
                :dateTitle="OTReqCardVal.History.dateTitle" 
                :dateText="OTReqCardVal.History.dateText" 
                :reasonTitle="OTReqCardVal.History.reasonTitle" 
                :reasonText="OTReqCardVal.History.reasonText" 
                :status="OTReqCardVal.History.status"
                :badgeColor="OTReqCardVal.History.badgeColor"
                :purchasedVal="OTReqCardVal.History.purchasedVal"/>

                <ValeHistoryCard 
                :dateTitle="OTReqCardVal.History.dateTitle" 
                :dateText="OTReqCardVal.History.dateText" 
                :reasonTitle="OTReqCardVal.History.reasonTitle" 
                :reasonText="OTReqCardVal.History.reasonText" 
                :status="OTReqCardVal.History.status"
                :badgeColor="OTReqCardVal.History.badgeColor"
                :purchasedVal="OTReqCardVal.History.purchasedVal"/>
                
                <ValeHistoryCard 
                :dateTitle="OTReqCardVal.History.dateTitle" 
                :dateText="OTReqCardVal.History.dateText" 
                :reasonTitle="OTReqCardVal.History.reasonTitle" 
                :reasonText="OTReqCardVal.History.reasonText" 
                :status="OTReqCardVal.History.status"
                :badgeColor="OTReqCardVal.History.badgeColor"
                :purchasedVal="OTReqCardVal.History.purchasedVal"/>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
    import { IonPage, IonContent } from '@ionic/vue';
    import HeaderWAddToCart from '@/components/header/HeaderWAddToCart.vue';
    import ValeImage from '@/views/services/vale/component/ValeImage.vue';
    import ValeRecentPurchasedCard from '@/components/cards/ValeRecentPurchasedCard.vue';
    import ValeHistoryCard from '@/components/cards/ValeHistoryCard.vue'
    // Header
    const headerTitle = "Vale";
    const OTReqCardVal = {
        "Recent_Purchased" : {
            dateTitle : "Date Purchase",
            dateText : "October 01,2019",
            purchasedVal: "P 5,000",
        },
        "History" : {
            dateTitle : "Date applied",
            dateText : "October 01,2019",
            reasonTitle : "Reason",
            reasonText : "Emergency",
            status : "pending",
            badgeColor : "warning",
            purchasedVal: "P 5,000",
        }
    }
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Inter');
    .inline-v {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100vw;
    }
    .flex-center {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .mini-card-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
    .group-name {
        color: #3B3C3E;
        font-family: Inter;
        font-size: 19px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        margin: 10px 0 10px 20px;

    }
</style>