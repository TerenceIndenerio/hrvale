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
                :leaveOptions="leaveOptions"
                @leave-application="handleLeaveApplication"
                
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
                leaveOptions: [],
                selectedDate1: "",
                selectedDate2: "",
                reason: "",
                selectedLeaveType: "", 
                leaveVal: '',
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

                    return dataResponse.data;
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
            handleLeaveApplication(selectedLeaveType, reason) {
                this.selectedLeaveType = selectedLeaveType;

                console.log("Selected Leave Type: ", selectedLeaveType);
                console.log("Reason: ", reason);
                console.log("Date: ", this.selectedDate1);
                console.log("Date: ", this.selectedDate2);
            },
        },
        async created() {
            const data = await this.fetchData();

            this.leaveOptions = data.data.map(leaveData => leaveData.name);

           
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