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
        <div class="flex-center">
            <ion-button class="btn" @click="navigateToLeaveRequests">Apply Leave</ion-button>
        </div>
    </div>
</template>

<script>
    import { IonList, IonItem, IonSelect, IonTextarea, IonSelectOption, IonButton } from '@ionic/vue';
    import { defineComponent } from 'vue';

    export default {
        components: {
            IonList, 
            IonItem, 
            IonSelect, 
            IonTextarea, 
            IonSelectOption, 
            IonButton,
        },
        data() {
            return {
                buttonText: 'Apply Leave',
                ApplyLeave: '/leaveRequest'
            }
        },
        methods: {
            navigateToLeaveRequests () {
                this.$router.push('/leaveRequest');
            },
        }

    };
    
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
    .flex-center {
        display: flex;
        justify-content: center;
        align-items: center;
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
        line-height: normal;
    }
    .btn {
        border-radius: 15px;
        width: 150px;
        height: 50px;
        overflow: hidden;
        font-family: Open Sans;
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        border: none;
        margin-top: 20px;
    }
</style>