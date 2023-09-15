<template>
    <ion-header class="header">
        <a href="/tabs/services"><ion-icon name="arrow-back-outline" class="icon1"></ion-icon></a>
        <h2 class="title">{{ headerTitle }}</h2>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="19" viewBox="0 0 24 19" fill="none">
            <path d="M21.0299 11.875H8.8155L9.08821 13.0625H20.2723C20.914 13.0625 21.3896 13.5932 21.2474 14.1505L21.0175 15.0514C21.7963 15.3881 22.3333 16.0991 22.3333 16.9219C22.3333 18.0798 21.27 19.0165 19.9657 18.9998C18.723 18.9839 17.7011 18.0857 17.6675 16.9793C17.6492 16.3749 17.9211 15.8271 18.3677 15.4375H9.63233C10.0647 15.8147 10.3333 16.3402 10.3333 16.9219C10.3333 18.1024 9.228 19.0531 7.88875 18.9977C6.69958 18.9485 5.73246 18.0928 5.66996 17.034C5.62171 16.2163 6.10479 15.4956 6.83875 15.1197L3.91179 2.375H1C0.447708 2.375 0 1.97626 0 1.48437V0.890625C0 0.39874 0.447708 0 1 0H5.27204C5.74708 0 6.15654 0.297654 6.25175 0.712129L6.63367 2.375H22.9996C23.6413 2.375 24.1169 2.9057 23.9747 3.46301L22.005 11.1818C21.9015 11.5873 21.4968 11.875 21.0299 11.875ZM16.7929 7.125H15V4.89844C15 4.65251 14.7761 4.45312 14.5 4.45312H13.5C13.2239 4.45312 13 4.65251 13 4.89844V7.125H11.2071C10.7617 7.125 10.5386 7.60467 10.8536 7.88518L13.6465 10.3726C13.8417 10.5465 14.1583 10.5465 14.3536 10.3726L17.1465 7.88518C17.4614 7.60467 17.2383 7.125 16.7929 7.125Z" fill="white"/>
        </svg>

        <ion-card class="card">
            <div class="card-text-container">
                <h3 class="text1">Avail Credits</h3>
                <h3 class="text2">10,000.00</h3>
            </div>
        </ion-card>
    </ion-header>
</template>

<script setup lang="ts">
    import { IonHeader, IonIcon, IonCard } from '@ionic/vue';

    defineProps({
        headerTitle:String,
        timePeriod :String,
        userName:String,
        leavesNum:String,
        });
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Inter');
    @import url('https://fonts.googleapis.com/css?family=Open+Sans');
    @import url('https://fonts.googleapis.com/css?family=Roboto');
    /* specifics */
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

    .card {
        border-radius: 20px;
        display: flex;
        flex-direction: row;
        width: 70vw;
        margin: 0 auto;
        /* padding-left: 10px; */
        position: absolute;
        left: 0;
        right: 0;
        top: 90px;
        padding: 10px 0px;
    }
    .container-center {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        /* margin-left: 10px; */
    }
    .card-text-container {
        text-align: center;
        width: 100%;
    }
    .card-text-container h3,h4 {
        padding: 0;
        margin: 0;
    }
    .card-text-container .text1 {
        color: #010101;
        text-align: center;
        font-family: Open Sans;
        font-size: 12px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    }
    .card-text-container .text2 {
        color: #D8C51A;
        text-align: center;
        font-family: Open Sans;
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    }
    .container-right {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10px;
        border-radius: 20px;
        background-color: #EED709;
        padding: 0px 10px;
    }
    .container-right h1 {
        color: #FFF;
        text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.50);
        font-size: 32px;
        font-weight: 800;
        margin: 0;
    }
    .container-right p {
        color: #797979;
        text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.00);
        font-family: Open Sans;
        font-size: 12px;
        font-style: normal;
        font-weight: 800;
        line-height: normal;
    }
</style>
