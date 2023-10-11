<template>
    <ion-page>
        <HeaderReturn :headerTitle="headerTitle"></HeaderReturn>
        <ion-content :fullscreen="true">
            <Refresher />
            <div class="flex-center">
                <ion-card class="card">
                    <p class="margin-l">From Date</p>
                    <Calendar @date-selected="updateSelectedDate1" />
                </ion-card>
                <ion-card class="card">
                    <p class="margin-l">To Date</p>
                    <Calendar @date-selected="updateSelectedDate2" />
                </ion-card> 
            </div>
            
            <div class="vh"></div>
            
            <ApplyLeaveBottomContainer
                :leaveOptionsWithIds="leaveOptionsWithIds"
                
                @apply-leave="sendLeaveRequest"
            />
        </ion-content>
    </ion-page>
</template>

<script>
    import { IonPage, IonContent, IonCard } from '@ionic/vue';
    import Calendar from '@/components/calendar/Calendar.vue';
    import ApplyLeaveBottomContainer from '@/views/services/leave/components/ApplyLeaveBottomContainer.vue';
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
            ApplyLeaveBottomContainer,
            Refresher,
            IonCard,
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
            }
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
            updateSelectedDate1(selectedDate) {
                this.selectedDate1 = selectedDate;
            },
            updateSelectedDate2(selectedDate) {
                this.selectedDate2 = selectedDate;
            },
            async sendLeaveRequest(selectedLeaveType, reason) {
                const apiUrl = 'https://hrp-staging-delta.bapplware.com/web/index.php/api/v2/leave/leave-requests';

                this.selectedLeaveType = selectedLeaveType.name;
                this.reason = reason
                this.leaveId = selectedLeaveType.id;

                console.log("Selected Leave Type Name: ", this.selectedLeaveType);
                console.log("Selected Leave Type ID: ", this.leaveId);
                console.log("Reason: ", this.reason);
                console.log("Date From: ", this.selectedDate1);
                console.log("Date To: ", this.selectedDate2);

                try {
                    const response = await axios.post(apiUrl, {
                        leaveType: this.selectedLeaveType,
                        fromDate: this.selectedDate1,
                        toDate: this.selectedDate2,
                        reason: this.reason,
                    });

                    console.log("Leave request sent successfully:", response.data);
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
    
    .vh {
            height: 50vh;
    }
    .card {
        border-radius: 20px;
        padding: 10px;
        text-align: center;
    }
    .card p {
        font-size: 20px;
        padding: 0;
        margin: 0 0 5px 0;

    }

</style>