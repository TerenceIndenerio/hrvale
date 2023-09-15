<template>
    <ion-card class="card">
        <ion-grid>
            <ion-row>
                <ion-col class="inline-w" size="auto">
                    <ion-icon name="person-circle-outline" class="icon1"></ion-icon>
                </ion-col>
                <ion-col class="inline-w text-container">
                    <p class="username-text">
                        {{ username }}
                    </p>
                </ion-col>
                <ion-col class="inline-w text-container">
                    <p>
                        {{ datePosted }}
                    </p>
                </ion-col>
            </ion-row>
            <ion-row class="pad-w">
                <div class="leave-type outline" v-bind:style="outlineColor">
                    <p>
                        {{ leaveType }}
                    </p>
                </div>
            </ion-row>
            <ion-row class="pad-w">
                <ion-col class="col-name">
                    <p>
                        Leave Date
                    </p>
                    <p>
                        Duration
                    </p>
                    <p>
                        Leave Balance
                    </p>
                    <p>
                        Reason
                    </p>
                </ion-col>
                <ion-col class="col-data">
                    <p>
                        {{ leaveDate }}
                    </p>
                    <p>
                        {{ duration }}
                    </p>
                    <p>
                        {{ leaveBal }}
                    </p>
                    <p>
                        {{ reason }}
                    </p>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <button type="button" class="btn btn1">APPROVE</button>
                </ion-col>
                <ion-col>
                    <button type="button" class="btn btn2">REJECT</button>
                </ion-col>
                <ion-col size="auto">
                    <button type="button" class="btn btn3">EDIT</button>
                </ion-col>
            </ion-row>
        </ion-grid>
        
    </ion-card>
</template>

<script setup lang="ts">
    import { IonCard, IonCol, IonGrid, IonRow, IonBadge, IonIcon } from '@ionic/vue';

    defineProps ({
        outlineColor: String,
        leaveType: String,
        username: String,
        datePosted: String,
        leaveDate: String,
        duration: String,
        leaveBal: String,
        reason: String,
    });
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Inter');
    @import url('https://fonts.googleapis.com/css?family=Open+Sans');
    @import url('https://fonts.googleapis.com/css?family=Roboto');

    .inline-v {
        display: flex;
        flex-direction: column;
    }
    .inline-w {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    /* .outline {
        border: 1px solid black;
    } */
    .pad-w {
        padding: 0 20px;
    }
    p {
        padding: 0;
        margin: 5px 0;
    }

    /* specifics */
    .icon1 {
        font-size: 30px;
        color: black;
    }
    .leave-type {
        padding: 0;
        margin: 0;
        border-radius: 50px;

    }
    .leave-type p {
        padding: 5px 10px;
        margin: 0;
    }
    .btn {
        color: black;
        width: 100%;
        height: 35px;
        border-radius: 5px
    }
    .btn1 {
        background-color: #D1EFEA;
        color: #319582;
    }
    .btn2 {
        background-color: rgba(254, 138, 138, 0.20);
        color: #FF3535;
    }
    .btn3 {
        background-color: #fff;
        color: #2F80ED;
        width: 50px;
    }
    .username-text {
        color: #000;
        font-family: Open Sans;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }
    .col-name {
        color: #585B5F;
        font-family: Open Sans;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 107.682%;
    }
    .col-data {
        color: #0D0D0D;
        font-family: Open Sans;
        font-size: 12px;
        font-style: normal;
        font-weight: 600;
        line-height: 107.682%;
    }
</style>