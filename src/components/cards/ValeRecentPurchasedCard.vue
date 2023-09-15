<template>
    <div class="container">
        <ion-card class="card">
            <ion-grid>
                <ion-row>
                    <ion-col class="inline-v flex-center" size="auto">
                        <!-- <h3 class="employee-name">{{ employeeName }}</h3> -->
                        <div class="inline-h">
                            <div class="icon flex-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <path d="M0 9.0625C0 9.58008 0.479911 10 1.07143 10H8.92857C9.52009 10 10 9.58008 10 9.0625V3.75H0V9.0625ZM7.14286 5.23438C7.14286 5.10547 7.26339 5 7.41071 5H8.30357C8.45089 5 8.57143 5.10547 8.57143 5.23438V6.01562C8.57143 6.14453 8.45089 6.25 8.30357 6.25H7.41071C7.26339 6.25 7.14286 6.14453 7.14286 6.01562V5.23438ZM7.14286 7.73438C7.14286 7.60547 7.26339 7.5 7.41071 7.5H8.30357C8.45089 7.5 8.57143 7.60547 8.57143 7.73438V8.51562C8.57143 8.64453 8.45089 8.75 8.30357 8.75H7.41071C7.26339 8.75 7.14286 8.64453 7.14286 8.51562V7.73438ZM4.28571 5.23438C4.28571 5.10547 4.40625 5 4.55357 5H5.44643C5.59375 5 5.71429 5.10547 5.71429 5.23438V6.01562C5.71429 6.14453 5.59375 6.25 5.44643 6.25H4.55357C4.40625 6.25 4.28571 6.14453 4.28571 6.01562V5.23438ZM4.28571 7.73438C4.28571 7.60547 4.40625 7.5 4.55357 7.5H5.44643C5.59375 7.5 5.71429 7.60547 5.71429 7.73438V8.51562C5.71429 8.64453 5.59375 8.75 5.44643 8.75H4.55357C4.40625 8.75 4.28571 8.64453 4.28571 8.51562V7.73438ZM1.42857 5.23438C1.42857 5.10547 1.54911 5 1.69643 5H2.58929C2.73661 5 2.85714 5.10547 2.85714 5.23438V6.01562C2.85714 6.14453 2.73661 6.25 2.58929 6.25H1.69643C1.54911 6.25 1.42857 6.14453 1.42857 6.01562V5.23438ZM1.42857 7.73438C1.42857 7.60547 1.54911 7.5 1.69643 7.5H2.58929C2.73661 7.5 2.85714 7.60547 2.85714 7.73438V8.51562C2.85714 8.64453 2.73661 8.75 2.58929 8.75H1.69643C1.54911 8.75 1.42857 8.64453 1.42857 8.51562V7.73438ZM8.92857 1.25H7.85714V0.3125C7.85714 0.140625 7.69643 0 7.5 0H6.78571C6.58929 0 6.42857 0.140625 6.42857 0.3125V1.25H3.57143V0.3125C3.57143 0.140625 3.41071 0 3.21429 0H2.5C2.30357 0 2.14286 0.140625 2.14286 0.3125V1.25H1.07143C0.479911 1.25 0 1.66992 0 2.1875V3.125H10V2.1875C10 1.66992 9.52009 1.25 8.92857 1.25Z" fill="#9D409F"/>
                                </svg>
                            </div>
                            <div class="inline-v">
                                <p class="date-title">{{ dateTitle }}</p>
                                <p class="date-text">{{ dateText }}</p>
                            </div>
                        </div>
                        
                        <p class="val-text">{{ purchasedVal }}</p>
                    </ion-col >
                    
                    <ion-col>
                        <div class="flex-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="16" viewBox="0 0 11 16" fill="none">
                                <path d="M9.74365 8.64502L3.10303 15.2856C2.64404 15.7446 1.90186 15.7446 1.44775 15.2856L0.344238 14.1821C-0.114746 13.7231 -0.114746 12.981 0.344238 12.5269L5.05127 7.81982L0.344238 3.11279C-0.114746 2.65381 -0.114746 1.91162 0.344238 1.45752L1.44287 0.344238C1.90186 -0.114746 2.64404 -0.114746 3.09814 0.344238L9.73877 6.98486C10.2026 7.44385 10.2026 8.18604 9.74365 8.64502Z" fill="#34B9D7"/>
                            </svg>
                        </div>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-card>
    </div>
</template>

<script>
    import { IonCard, IonCol, IonGrid, IonRow, IonBadge } from '@ionic/vue';
    import { defineComponent } from 'vue';
    
    export default defineComponent({
  components: {
    IonCard,
    IonCol,
    IonGrid,
    IonRow,
    IonBadge,
  },
  props: {
    cardTitle: String,
    employeeName: String,
    dateTitle: String,
    dateText: String,
    reasonTitle: String,
    reasonText: String,
    status: String,
    badgeColor: String,
    purchasedVal: String,
  },
});

    
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Inter');

    *{
        margin: 0;
        padding: 0;
    }
    .card {
        padding: 10px 0  10px 10px;
        border-radius: 20px;
        
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
        height: 100%;
    }
    .container {
        padding: 5px;
        width: 150px;
        /* height: 55px; */
        flex-shrink: 0;
    }
    .box {
        background-color: #6D2B84;
        width:60px;
        height: 60px;
        border-radius: 10px;
    }
    /* badge */
    .status {
        float: right;
        border-radius: 20px 0px 0px 20px;
        padding: 5px 10px;
    }
    .pending {
        color: var(--ion-color-primary-contrast);
        /* background-color: var(--ion-color-warning); */
    }

    /* specifics */
    .employee-name {
        color: #3B3C3E;
        font-family: Inter;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
    }
    .date-text {
        color: #3B3C3E;
        font-family: Inter;
        font-size: 10px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
    }
    .date-title {
        color: #7B808B;
        font-family: Inter;
        font-size: 8px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }
    .val-text {
        color: #F2994A;
        text-align: center;
        font-family: Open Sans;
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    }
    .reason-title {
        color: #7B808B;
        font-family: Inter;
        font-size: 8px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }
    .reason-text {
        color: #3B3C3E;
        font-family: Inter;
        font-size: 10px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
    }
    .request-OT {
        color: #FFF;
        text-align: center;
        font-family: Open Sans;
        font-size: 18px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }
</style>