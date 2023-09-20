<template>
    <ion-page>
        <HeaderWAddToCart :headerTitle="headerTitle" />
        <ion-content :fullscreen="true">
            <br>
            <br>
            <div class="flex-center">
                <!-- <ValeImage /> -->
            </div>
            <p class="group-name">
                Recent Purchased
            </p>
            <div class="mini-card-container">
                <ValeRecentPurchasedCard
                :dateTitle="valeReqCardVal.Recent_Purchased.dateTitle" 
                :dateText="valeReqCardVal.Recent_Purchased.dateText" 
                :purchasedVal="valeReqCardVal.Recent_Purchased.purchasedVal"/>

                <ValeRecentPurchasedCard
                :dateTitle="valeReqCardVal.Recent_Purchased.dateTitle" 
                :dateText="valeReqCardVal.Recent_Purchased.dateText" 
                :purchasedVal="valeReqCardVal.Recent_Purchased.purchasedVal"/>

                <ValeRecentPurchasedCard
                :dateTitle="valeReqCardVal.Recent_Purchased.dateTitle" 
                :dateText="valeReqCardVal.Recent_Purchased.dateText" 
                :purchasedVal="valeReqCardVal.Recent_Purchased.purchasedVal"/>

                <ValeRecentPurchasedCard
                :dateTitle="valeReqCardVal.Recent_Purchased.dateTitle" 
                :dateText="valeReqCardVal.Recent_Purchased.dateText" 
                :purchasedVal="valeReqCardVal.Recent_Purchased.purchasedVal"/>
            </div>
            <p class="group-name">
                History
            </p>
            <div class="inline-v">
                <ValeHistoryCard 
                :dateTitle="valeReqCardVal.History.dateTitle" 
                :dateText="valeReqCardVal.History.dateText" 
                :reasonTitle="valeReqCardVal.History.reasonTitle" 
                :reasonText="valeReqCardVal.History.reasonText" 
                :status="valeReqCardVal.History.status"
                :badgeColor="valeReqCardVal.History.badgeColor"
                :purchasedVal="valeReqCardVal.History.purchasedVal"/>

                <ValeHistoryCard 
                :dateTitle="valeReqCardVal.History.dateTitle" 
                :dateText="valeReqCardVal.History.dateText" 
                :reasonTitle="valeReqCardVal.History.reasonTitle" 
                :reasonText="valeReqCardVal.History.reasonText" 
                :status="valeReqCardVal.History.status"
                :badgeColor="valeReqCardVal.History.badgeColor"
                :purchasedVal="valeReqCardVal.History.purchasedVal"/>
                
                <ValeHistoryCard 
                :dateTitle="valeReqCardVal.History.dateTitle" 
                :dateText="valeReqCardVal.History.dateText" 
                :reasonTitle="valeReqCardVal.History.reasonTitle" 
                :reasonText="valeReqCardVal.History.reasonText" 
                :status="valeReqCardVal.History.status"
                :badgeColor="valeReqCardVal.History.badgeColor"
                :purchasedVal="valeReqCardVal.History.purchasedVal"/>
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
    const valeReqCardVal = {
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