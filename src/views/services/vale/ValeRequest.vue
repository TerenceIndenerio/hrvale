<template>
    <ion-page>
        <HeaderReturnWSearchVale :headerTitle="headerTitle" />
        <ion-content :fullscreen="true" >
            <br>
            <br>

            <ion-text>
                <h1 class="card-title">
                    {{ cardTitle1 }}
                </h1>  
            </ion-text>
            
            <ValeReqCard 
                :employeeName="valeReqCardVal.Request.employeeName" 
                :dateTitle="valeReqCardVal.Request.dateTitle" 
                :dateText="valeReqCardVal.Request.dateText" 
                :reasonTitle="valeReqCardVal.Request.reasonTitle" 
                :reasonText="valeReqCardVal.Request.reasonText" 
                :status="valeReqCardVal.Request.status"
                :badgeColor="valeReqCardVal.Request.badgeColor"
            />

            <ion-text>
                <h1 class="card-title">
                    {{ cardTitle2 }}
                </h1>  
            </ion-text>

            <ValeReqCard 
                :employeeName="valeReqCardVal.History.employeeName" 
                :dateTitle="valeReqCardVal.History.dateTitle" 
                :dateText="valeReqCardVal.History.dateText" 
                :reasonTitle="valeReqCardVal.History.reasonTitle" 
                :reasonText="valeReqCardVal.History.reasonText" 
                :status="valeReqCardVal.History.status"
                :badgeColor="valeReqCardVal.History.badgeColor"
            />
            <ValeReqCard 
                :employeeName="valeReqCardVal.History.employeeName" 
                :dateTitle="valeReqCardVal.History.dateTitle" 
                :dateText="valeReqCardVal.History.dateText" 
                :reasonTitle="valeReqCardVal.History.reasonTitle" 
                :reasonText="valeReqCardVal.History.reasonText" 
                :status="valeReqCardVal.History.status"
                :badgeColor="valeReqCardVal.History.badgeColor"
            />
            <ValeReqCard 
                :employeeName="valeReqCardVal.History.employeeName" 
                :dateTitle="valeReqCardVal.History.dateTitle" 
                :dateText="valeReqCardVal.History.dateText" 
                :reasonTitle="valeReqCardVal.History.reasonTitle" 
                :reasonText="valeReqCardVal.History.reasonText" 
                :status="valeReqCardVal.History.status"
                :badgeColor="valeReqCardVal.History.badgeColor"
            />

        </ion-content>
    </ion-page>
</template>
  
<script setup lang="ts">
    import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonCard, IonText } from '@ionic/vue';
    import HeaderReturnWSearchVale from '@/components/header/HeaderReturnWSearchVale.vue';
    import ValeReqCard from '@/views/services/Vale/component/ValeReqCard.vue';

    const headerTitle = "Vale Request"
    const cardTitle1 = "Request"
    const cardTitle2 = "History"

    const valeReqCardVal = {
        "Request" : {
            employeeName : "Al Guzman",
            dateTitle : "Date applied",
            dateText : "October 01,2019",
            reasonTitle : "Reason",
            reasonText : "Emergency",
            status : "awaiting",
            badgeColor: "success",
        },
        "History" : {
            employeeName : "Al Guzman",
            dateTitle : "Date applied",
            dateText : "October 01,2019",
            reasonTitle : "Reason",
            reasonText : "Emergency",
            status : "reject",
            badgeColor : "danger",
        }
    }
    
    
</script>

<style scoped>
   @import url('https://fonts.googleapis.com/css?family=Open+Sans');

   .header {
    background-color: var(--ion-color-blue-theme);
    height: 120px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 0 0 40px 40px;
    padding: 0 29px;
    box-shadow: none;
    text-align: center;
}
.icon1 {
    font-size: 30px;
    color: var(--ion-color-primary-contrast);
}
.icon2 {
    font-size: 30px;
    color: var(--ion-color-primary-contrast);
}
.title {
    color: var(--ion-color-primary-contrast);
    text-align: center;
    font-family: var(--ion-font-font2);
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}
.space {
  margin: 7px;
}

.flex-inline {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin: 0;
    padding: 0;
    height: 20px;
}
.text-bold {
    color: #000;
    font-family: Open Sans;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
}

.text-orange {
    color: #F2994A;
    font-family: Open Sans;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
}
.card-top {
    padding: 0 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    box-shadow: 0px 4px 3px 0px rgb(175, 175, 175);
    width: fit-content;
    margin-right:  auto;
    margin-left: auto;

    position: absolute;
    top: 80px;

}
.card-bottom {
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    box-shadow: 0px 4px 3px 0px rgb(175, 175, 175);
    width: fit-content;
    margin-right:  auto;
    margin-left: auto;
    margin-top: 50px;
    gap: 10px;
}
.img {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.time {
  
  display: flex;
  flex-direction: row;
  gap: 10px;
}
.box {
  background-color: #FEEDED;
  height: 50px;
  width: 50px;
  border-radius: 5px;
}
.box h2 {
  display: flex;
  justify-content: right;
  align-items: center;
  height: 100%;
  padding: 5px;
  color: #00003D;
  margin: 0;
}
.time-text {
  color: #000;
}
.text-clock {
  color: #000;
  text-align: center;
  font-family: Open Sans;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.btn-clock {
  border-radius: 15px;
  background-color: #12A3DA;
  color: #FFF;
  width: 232px;
  height: 50px;
  overflow: hidden;
  font-family: Open Sans;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.btn-center {
    text-align: center;
    margin-top: 30px;
}

.card-title {
    color: #3B3C3E;
    font-family: 'Open Sans';
    font-size: 19px;
    font-style: normal;
    font-weight: bold;
    line-height: normal;
    margin-left: 10%;
}
  </style>
  