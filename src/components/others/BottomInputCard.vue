<template>
    <div class="bottom container">
        <div class="inline-v">
            <h4 class="input-title">
                Type of leave
            </h4>
            <ion-list class="list-container box-container flex-r" >
                <ion-item lines="none" class="max-w" color="#E8E8E8">
                    <ion-select>
                        <div slot="label" class="input-text">Unpaid Leave</div>
                        <ion-select-option value="Item 1">Item 1</ion-select-option>
                        <ion-select-option value="Item 2">Item 2</ion-select-option>
                        <ion-select-option value="Item 3">Item 3</ion-select-option>
                    </ion-select>
                </ion-item>
            </ion-list>
        </div>
        <div class="inline-v">
            <h4 class="input-title">
                Reason
            </h4>
            <div class="box-container text-pad">
                <ion-textarea color="#E8E8E8" label="Type your reason here" labelPlacement="floating" placeholder="Your reason..."></ion-textarea>
            </div>
        </div>
        <Button :buttonText="buttonText" :url="ApplyLeave"></Button>
    </div>
</template>

<script setup lang="ts">
    import { IonPage, IonHeader, IonText, IonContent, IonIcon, IonFooter, IonToolbar, IonTitle, IonList, IonItem, IonSelect, IonTextarea, IonSelectOption } from '@ionic/vue';
    import Button from '@/components/buttons/Button.vue'
     //Button
     var buttonText= 'Apply Leave'

    //link to ApplyLeave page
    const ApplyLeave = "/leaveRequest"
</script>

<style scoped>
    .inline-v {
        display: flex;
        flex-direction: column;
    }
    .max-w {
        width: 100%;
    }
    .flex-r {
        display: flex;
        justify-content: left;
        align-items: center;
    }
    .text-pad {
        padding: 0 10px;
    }
    /* specifics */
    .bottom {
        overflow-y: auto;
        position: fixed;
        bottom:0px;
        width: 100%;
        padding: 20px;
    }
    .container {
        border-top: 1px solid rgb(157, 157, 157);
        height: 50%;
        width: 100%;
        border-radius: 50px 50px 0 0;
        background-color: #fff;
    }
    .list-container {
        height: 50px;
    }
    .box-container {
        border-radius: 9px;
        background-color: #E8E8E8;
    }
    .input-title {
        color: #3B3C3E;
        font-family: Inter;
        font-size: 19px;
        font-style: normal;
        font-weight: bold;
        line-height: normal;
    }
    .input-text {
        color: #3B3C3E;
        font-family: Inter;
        font-size: 17px;
        font-style: normal;
        /* font-weight: 500; */
        line-height: normal;
    }
</style>