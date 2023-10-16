<template>
    <ion-page>
        <HeaderReturn :headerTitle="headerTitle"></HeaderReturn>
        <ion-content :fullscreen="true">
            <Refresher />
            <ion-card class="card-container">
            
                <ion-card class="card leaveBal-container">
                    <p class="leave-bal">
                        Leave Balance: <strong>0.00</strong> Day(s)
                    </p>
                </ion-card>

                <ion-card class="card">
                    <p class="margin-l">
                        Leave Type
                    </p>
                    <ion-select label="Select Leave Type" label-placement="floating" class="box-container select-option" v-model="selectedLeaveType">
                        <ion-select-option
                            v-for="option in leaveOptionsWithIds"
                            :key="option.id"
                            :value="option.name"
                            class="input-text"
                        >
                            {{ option.name }}
                        </ion-select-option>
                    </ion-select>
                </ion-card>

                <div class="flex-w">
                    <ion-card class="card date-container">
                        <p class="margin-l">From Date*</p>
                        <input type="date" name="fromDate" id="fromDate" class="date-picker" v-model="fromDate">
                    </ion-card>

                    <ion-card class="card date-container">
                        <p class="margin-l">To Date*</p>
                        <input type="date" name="toDate" id="toDate" class="date-picker" v-model="toDate">
                    </ion-card>
                </div>

                <ion-card class="card" id="partialDay" v-show="showPartialDays">
                    <p class="margin-l">
                        Partial Days
                    </p>
                    <ion-select label="Select Partial Days" label-placement="floating" v-model="partialSelectedValue" class="box-container select-option">
                        <ion-select-option v-for="option in partialDaysOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </ion-select-option>
                    </ion-select>

                </ion-card>

                 <!-- Start day Only -->
                <ion-card class="card" id="partialDay" v-show="showStartDayOnly">
                    <p class="margin-l">
                        Start Day
                    </p>
                    <ion-select label="Select" label-placement="floating" v-model="startDaySelectedValue" class="box-container select-option">
                        <ion-select-option v-for="option in startDayOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </ion-select-option>
                    </ion-select>

                </ion-card>
                <ion-card class="card" id="specificTime" v-show="showsSpecificTimeStartDay">
                    <p class="margin-l">
                        Specific Time
                    </p>
                    <div class="specific-time-container">
                        <ion-card class="card specific-time-card">
                            <label for="fromTime">From*:</label>
                            <input type="time" id="fromTime" name="fromTime" class="specific-time" v-model="fromTimeStartDay">
                        </ion-card>
                        <ion-card class="card specific-time-card">
                            <label for="toTime">To*:</label>
                            <input type="time" id="toTime" name="toTime" class="specific-time" v-model="toTimeStartDay">
                        </ion-card>
                    </div>
                </ion-card>
                
                <!-- End day Only -->
                <ion-card class="card" id="partialDay" v-show="showEndDayOnly">
                    <p class="margin-l">
                        End Day
                    </p>
                    <ion-select label="Select" label-placement="floating" v-model="endDaySelectedValue" class="box-container select-option">
                        <ion-select-option v-for="option in endDayOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </ion-select-option>
                    </ion-select>

                </ion-card>
                <ion-card class="card" id="specificTime" v-show="showsSpecificTimeEndDay">
                    <p class="margin-l">
                        Specific Time
                    </p>
                    <div class="specific-time-container">
                        <ion-card class="card specific-time-card">
                            <label for="fromTime">From*:</label>
                            <input type="time" id="fromTime" name="fromTime" class="specific-time" v-model="fromTimeEndDay">
                        </ion-card>
                        <ion-card class="card specific-time-card">
                            <label for="toTime">To*:</label>
                            <input type="time" id="toTime" name="toTime" class="specific-time" v-model="toTimeEndDay">
                        </ion-card>
                    </div>
                </ion-card>

                <ion-card class="card" id="duration" v-show="showDuration">
                    <p class="margin-l">
                        Duration
                    </p>
                    <ion-select label="Select Duration" label-placement="floating" v-model="durationSelectedValue" class="box-container select-option">
                        <ion-select-option v-for="duration in durations" :key="duration.id" :value="duration.key">
                            {{ duration.label }}
                        </ion-select-option>
                    </ion-select>
                </ion-card>

                <ion-card class="card" id="specificTime" v-show="showsSpecificTime">
                    <p class="margin-l">
                        Specific Time
                    </p>
                    <div class="specific-time-container">
                        <ion-card class="card specific-time-card">
                            <label for="fromTime">From*:</label>
                            <input type="time" id="fromTime" name="fromTime" class="specific-time" v-model="fromTimeDuration">
                        </ion-card>
                        <ion-card class="card specific-time-card">
                            <label for="toTime">To*:</label>
                            <input type="time" id="toTime" name="toTime" class="specific-time" v-model="toTimeDuration">
                        </ion-card>
                    </div>
                    
                </ion-card>

                <ion-card class="card">
                    <div class="inline-v">
                        <p class="margin-l">
                            Reason
                        </p>
                        <div class="box-container">
                            <ion-textarea color="#E8E8E8" label="Type your reason here" labelPlacement="floating" placeholder="Your reason..." v-model="reason" class="reason-container"></ion-textarea>
                        </div>
                    </div>
                </ion-card>

                <div class="flex-center">
                    <ion-button class="btn" @click="sendLeaveRequest">Apply Leave</ion-button>
                </div>
                
        </ion-card>
        </ion-content>
    </ion-page>
</template>

<script>
    import { IonPage, IonContent, IonCard, IonButton, IonSelectOption, IonSelect, IonTextarea, IonItem } from '@ionic/vue';
    import Calendar from '@/components/calendar/Calendar.vue';
    import HeaderReturn from '@/components/header/HeaderReturn.vue';
    import { defineComponent, ref } from 'vue';
    import Refresher from '@/components/refresher/Refresher.vue'
    import axios from 'axios';


    export default defineComponent({
        components: {
            IonPage,    
            IonContent, 
            HeaderReturn,
            Calendar,
            Refresher,
            IonCard,
            IonButton,
            IonSelectOption,
            IonSelect,
            IonTextarea,
            IonItem,
        },
        data() {
            return {
                headerTitle: 'Apply Leave',
                leaveOptionsWithIds: [],
                selectedDate1: "",
                selectedDate2: "",
                reason: "",
                selectedLeaveType: "",
                leaveVal: "",
                leaveId: "",
                fromDate: "",
                toDate: "",
                fromTimeDuration: "",
                toTimeDuration: "",
                fromTimeStartDay: "",
                toTimeStartDay: "",
                fromTimeEndDay: "",
                toTimeEndDay: "",
                showDuration: false,
                showEndDayOnly: false,
                showStartDayOnly: false,
                showsSpecificTime: false,
                showsSpecificTimeEndDay: false,
                showsSpecificTimeStartDay: false,
                partialSelectedValue: null,
                durationSelectedValue: null,
                startDaySelectedValue: null,
                endDaySelectedValue: null,
                durations: [
                    { key: 'full_day', label: 'Full Day' },
                    { key: 'half_day_morning', label: 'Half Day - Morning' },
                    { key: 'half_day_afternoon', label: 'Half Day - Afternoon' },
                    { key: 'specify_time', label: 'Specific Time' },
                ],
                partialDaysOptions: [
                    { value: 'value1', label: 'All Days' },
                    { value: 'value2', label: 'Start Day Only' },
                    { value: 'value3', label: 'End Day Only' },
                    { value: 'value4', label: 'Start and End Day' },
                ],
                endDayOptions: [
                    { value: 'value5', label: 'Half Day - Morning' },
                    { value: 'value6', label: 'Half Day - Afternoon' },
                    { value: 'value7', label: 'Specific Time' },
                ],
                startDayOptions: [
                    { value: 'value5', label: 'Half Day - Morning' },
                    { value: 'value6', label: 'Half Day - Afternoon' },
                    { value: 'value7', label: 'Specific Time' },
                ],
            }
        },
        watch: {
            startDaySelectedValue(newVal) {
                this.showsSpecificTimeStartDay = newVal === 'value7';
            },
            endDaySelectedValue(newVal) {
                this.showsSpecificTimeEndDay = newVal === 'value7';
            },
            partialSelectedValue(newVal) {
                const options = {
                    value1: { showDuration: true, showStartDayOnly: false, showEndDayOnly: false },
                    value2: { showStartDayOnly: true, showDuration: false, showEndDayOnly: false },
                    value3: { showEndDayOnly: true, showDuration: false, showStartDayOnly: false },
                    value4: { showEndDayOnly: true, showDuration: false, showStartDayOnly: true },
                };
                const selectedOption = options[newVal] || {};
                Object.assign(this, selectedOption);
            },
            durationSelectedValue(newVal) {
                this.showsSpecificTime = newVal === 'specify_time';
            },
        },
        computed: {
            showPartialDays() {
                if (this.fromDate && this.toDate) {
                    const fromDateObj = new Date(this.fromDate);
                    const toDateObj = new Date(this.toDate);
                    const fromDay = fromDateObj.setHours(0, 0, 0, 0);
                    const toDay = toDateObj.setHours(0, 0, 0, 0);
                    const oneDay = 24 * 60 * 60 * 1000;
                    const daysDifference = Math.floor((toDay - fromDay) / oneDay);

                    this.showDuration = daysDifference === 0;

                    return daysDifference > 0;
                }
                return false;
            },
        },
        methods: {
            async fetchData() {
                try {
                    const response = await axios.post(
                        'https://hrp-staging-delta.bapplware.com/web/index.php/auth/token',
                        {
                            clientId: 'test_id',
                            clientSecret: 'test_secret',
                            userId: 1
                        }
                    );
                    const token = response.data.token;

                    localStorage.setItem('_token', token);

                    const headers = {
                        Authorization: `Bearer ${token}`
                    };

                    const api = 'https://hrp-staging-delta.bapplware.com/web/index.php/api/v2/leave/leave-types';
                    const dataResponse = await axios.get(api, { headers });
                    console.log(dataResponse.data)
                    return dataResponse.data.data.map(leaveData => ({
                        name: leaveData.name,
                        id: leaveData.id,
                    }));
                } catch (error) {
                    console.error('Error fetching token or data:', error);
                    return null;
                }
            },
            async sendLeaveRequest() {
                try {
                    const token = localStorage.getItem('_token');
                    const headers = {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    };
                    const api = 'https://hrp-staging-delta.bapplware.com/web/index.php/api/v2/leave/leave-requests';

                    const requestData = {
                        leaveType: this.selectedLeaveType,
                        fromDate: this.fromDate,
                        toDate: this.toDate,
                        reason: this.reason,
                        partialSelectedValue: this.partialSelectedValue,
                        durationSelectedValue: this.durationSelectedValue,
                        startDaySelectedValue: this.startDaySelectedValue,
                        endDaySelectedValue: this.endDaySelectedValue,
                        fromTimeDuration: this.fromTimeDuration,
                        toTimeDuration: this.toTimeDuration,
                        fromTimeStartDay: this.fromTimeStartDay,
                        toTimeStartDay: this.toTimeStartDay,
                        fromTimeEndDay: this.fromTimeEndDay,
                        toTimeEndDay: this.toTimeEndDay,
                    };

                    const response = await axios.post(api, requestData, { headers });
                    console.log('Leave request response:', response.data);
                    
                } catch (error) {
                    console.error('Error sending leave request:', error);
                }
            },
        },
        async created() {
            const data = await this.fetchData();
            this.leaveOptionsWithIds = data;
        }
    });

</script>

<style scoped>
    .flex-center {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .flex-w {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .inline-v {
        display: flex;
        flex-direction: column;
    }
    .fit-w {
        width: 100%;
        height: fit-content;
    }
    .vh {
            height: 50vh;
    }
    .card-container {
        border-radius: 20px;
        padding: 10px 0 20px 0;
    }
    .card {
        border-radius: 20px;
        padding: 10px;
    }
    .date-container {
        width: fit-content;
    }
    
    .card p {
        font-size: 16px;
        padding: 0;
        margin: 0 0 5px 0;
    }
    .leaveBal-container {
        width: fit-content;
        margin: 0 auto;
    }
    .leave-bal {
        font-size: 12px;
    }
    .date-picker {
        border-radius: 20px;
        padding: 5px 10px;
        width: fit-content;
        min-width: 100px;
        height: 30px;
        padding: 0;
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
    
    .select-option {
        width: 100%;
        padding: 0 10px;
    }
    .specific-time-card {
        width: fit-content;
    }
    .specific-time {
        border-radius: 10px;
        width: fit-content;
        min-width: 100px;
    }
    .specific-time-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .input-text {
        color: #3B3C3E;
        font-family: Inter;
        font-size: 17px;
        font-style: normal;
        line-height: normal;
        height: fit-content;
    }
    .reason-container {
        height: 90px;
        overflow-y: scroll;
        padding: 0 10px;
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