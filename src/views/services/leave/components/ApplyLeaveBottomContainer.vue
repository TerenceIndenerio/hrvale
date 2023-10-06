<template>
    <div class="bottom container">
        <div class="inline-v">
            <h4 class="input-title">
                Type of leave
            </h4>
           
            <ion-item lines="none" class="fit-w box-container" color="#E8E8E8">
                <ion-select @ionChange="selectLeaveOption" label="Select Leave Type" label-placement="floating">
                    <ion-select-option
                        v-for="option in leaveOptions"
                        :key="option"
                        :value="option"
                        class="input-text" 
                        
                    >
                        {{ option }}    
                    </ion-select-option>
                </ion-select>
            </ion-item>
        </div>
        <div class="inline-v">
            <h4 class="input-title">
                Reason
            </h4>
            <div class="box-container text-pad">
                <ion-textarea color="#E8E8E8" label="Type your reason here" labelPlacement="floating" placeholder="Your reason..." v-model="reason"></ion-textarea>
            </div>
        </div>
        <div class="flex-center">
            <ion-button class="btn" @click="applyLeave">Apply Leave</ion-button>
        </div>
    </div>
</template>

<script>
import { IonSelect, IonSelectOption, IonButton, IonTextarea, IonItem } from '@ionic/vue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    props: {
        leaveOptions: Array,
    },
    components: {
        IonSelect,
        IonSelectOption,
        IonButton,
        IonTextarea,
        IonItem,
    },
    data() {
        return {
            buttonText: 'Apply Leave',
            selectedLeaveType: null,
            reason: null,
        }
    },
    methods: {
        applyLeave() {
            this.$emit('leave-application', this.selectedLeaveType, this.reason);
        },
        selectLeaveOption(event) {
            this.selectedLeaveType = event.target.value;
        },
        enterReason(e) {
            this.reason = e.target.value;
            console.log(this.reason);
        },
    }
});
</script>

<style scoped>
    .inline-v {
        display: flex;
        flex-direction: column;
    }
    .max-w {
        width: 100%;
    }
    .padding-r {
        padding-right: 10px;
    }
    .fit-w {
        width: 100%;
        height: fit-content;
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
        z-index: 10;
    }
    .container {
        border: 1px solid rgb(157, 157, 157);
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
        height: fit-content;
    }
    .btn {
        border-radius: 15px;
        width: fit-content;
        height: 50px;
        overflow: hidden;
        font-family: 'Inter';
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        border: none;
        margin-top: 20px;
        --background: #12A3DA;
    }
</style>