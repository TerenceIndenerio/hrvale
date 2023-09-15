<template>
    <div class="container">
        <!-- <h3>{{ cardTitle }}</h3> -->
        <ion-card class="card">
            <ion-grid>
                
                <ion-row>
                    <ion-col class="inline-v">
                        <h3 class="employee-name">{{ employeeName }}</h3>
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
                        <div class="inline-h" size="auto">
                            <div class="icon flex-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <path d="M6.87487 1.875C6.87487 0.839451 6.03543 0 4.9999 0C3.96438 0 3.12494 0.839451 3.12494 1.875C3.12494 2.91054 3.96438 3.74999 4.9999 3.74999C6.03543 3.74999 6.87487 2.91054 6.87487 1.875ZM4.56222 4.70897C3.40345 3.9996 1.52653 3.80468 0.58202 3.75097C0.264643 3.733 0 3.97479 0 4.28007V8.63162C0 8.9115 0.226363 9.1449 0.517373 9.15994C1.37009 9.20466 3.09525 9.36853 4.28761 9.96912C4.47062 10.0613 4.6876 9.93572 4.6876 9.73728V4.9328C4.68741 4.84159 4.64229 4.758 4.56222 4.70897ZM9.41778 3.75097C8.47347 3.80448 6.59636 3.9996 5.43778 4.70897C5.35771 4.758 5.31259 4.84491 5.31259 4.93612V9.73669C5.31259 9.93572 5.53017 10.0615 5.71376 9.96912C6.90592 9.36912 8.6301 9.20525 9.48263 9.16052C9.77364 9.14529 10 8.91189 10 8.63201V4.28007C9.9998 3.97479 9.73516 3.733 9.41778 3.75097Z" fill="#5690FF"/>
                                </svg>
                            </div>
                            <div class="inline-v">
                                <p class="reason-title">{{ reasonTitle }}</p>
                                <p class="reason-text">{{ reasonText }}</p>
                            </div>
                        </div>
                    </ion-col >
                    <ion-col class="flex-center">
                        <div class="box flex-center">
                            <h3 class="request-OT">3</h3>
                        </div>
                    </ion-col>
                    <ion-col>
                        <ion-badge class="status pending" v-bind:color="badgeColor">{{ status }}</ion-badge>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-card>
    </div>
</template>

<script setup lang="ts">
    import { IonCard, IonCol, IonGrid, IonRow, IonBadge } from '@ionic/vue';
    import { defineComponent } from 'vue';
    
    defineProps({
        cardTitle: String,
        employeeName: String,
        dateTitle: String,
        dateText: String,
        reasonTitle: String,
        reasonText: String,
        status: String,
        badgeColor: String,
        });
    
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Inter');

    *{
        margin: 0;
        padding: 0;
    }
    .card {
        padding: 10px 0  10px 20px;
        margin: 0 5%;
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
    }
    .container {
        padding: 5px;
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