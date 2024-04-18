<template>
    <ion-row class="top-text">
        <ion-col class="recent-transac">
            <h5> Transactions </h5>
        </ion-col>
        <ion-col class="see-all">
            <a> See all </a>
        </ion-col>
    </ion-row>
    <ion-row class="history-container">
        <ion-col class="history-col">
            <ion-card class="history-card">
                <h5> History goes here. </h5>
            </ion-card>
            <ion-card class="history-card">
                <h5> History goes here. </h5>
            </ion-card>
            <ion-card class="history-card">
                <h5> History goes here. </h5>
            </ion-card>
        </ion-col>
    </ion-row>
</template>

<script>
import { IonButton, IonCol, IonGrid, IonRow, IonIcon } from "@ionic/vue";
import { defineComponent } from "vue";
export default defineComponent({
  components: { 
    IonButton, 
    IonCol, 
    IonGrid, 
    IonRow, 
    IonIcon 
  },
})
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
.top-text {
    display: flex;
    margin: 10px 10px 0 10px;
    justify-content: center;
}
.recent-transac {
    margin: 0 100px 0 0;
    gap: 10px;
}
.recent-transac h5 {
    font-size: 15px;
    font-family: Poppins;
    font-weight: 700;
    color: #018593;
}
.see-all {
    margin: 12px 0 0 65px;
    gap: 10px;
}
.see-all a {
    font-size: 12px;
    font-family: Poppins;
    font-weight: 700;
    text-decoration: none;
    color: rgb(168, 168, 168);
}
.history-container {
    display: flex;
}
.history-card {
    margin: 0 12px 10px 12px;
    padding: 10px;
}
.history-card h5 {
    font-size: 12px;
    font-family: Poppins;
    font-weight: 500;
    color: rgb(168, 168, 168);
}
</style>
