<template>
    <ion-page>
        <HeaderReturnWCard 
            :headerTitle="headerTitle"
            :timePeriod="cardData.timePeriod" 
            :userName="cardData.employeeName"
            :leavesNum="cardData.leaveBalance"
            router-direction="none"
        />
        <ion-content :fullscreen="true">
            
            <Refresher />
            <div class="margin-top"></div>

            <div v-if="showComponent">
                <ion-button
                    fill="clear"
                    class="leave-entitlement-btn"
                    color="medium"
                    @click="navigateToLeaveEntitlement($event)"
                >
                    <ion-icon name="calendar-outline"></ion-icon>
                    Leave Entitlement
                </ion-button>

                <LeaveDashboardCard 
                    :cardTitle = "cardData.title"
                    :appliedDuration="cardData.date"
                    :reason="cardData.comment"
                    :typeOfLeave="cardData.leaveType"
                    :status = "cardData.status"
                    :colorBadge="cardData.colorBadge"
                    @view-details-clicked="navigateToLeaveRequests"
                />
            

                <div class="flex-center btn-bottom">
                    <ion-button class="btn" @click="navigateToApplyLeave">Apply Leave</ion-button>
                </div>
            </div>
            
        </ion-content>
    </ion-page>
</template>

<script>
    import { IonPage, IonHeader, IonText, IonContent, IonTitle, IonAlert, IonIcon, IonButton } from '@ionic/vue'
    import HeaderReturnWCard from '@/components/header/HeaderReturnWCard.vue'
    import LeaveDashboardCard from '@/views/services/leave/components/LeaveDashboardCard.vue'
    import Refresher from '@/components/refresher/Refresher.vue'
    import Button from '@/components/buttons/Button.vue';
    import { useRouter } from 'vue-router';
    import { defineComponent } from 'vue';
    import axios from 'axios';

    export default defineComponent({
        name: 'Leave Requests',
        components: {
            IonPage,
            IonHeader,
            IonContent,
            IonTitle,
            IonIcon,
            IonText,
            HeaderReturnWCard,
            LeaveDashboardCard,
            IonButton,
            Refresher,
        },
        setup() {
            return {
                isLoading: false,
                router: useRouter(),
            }
        },
        data() {
            return {
                showComponent: false,
                leavesLength: 0,
                requests: [],
                headerTitle: 'Leave Dashboard',
                timePeriod: '',
                userName: '',
                leavesNum: '',
                cardData: {
                    date: '',
                    employeeName: '',
                    leaveType: '',
                    dateText: '',
                    leaveBalance: '',
                    numberOfDays: '',
                    status: '',
                    comment: '',
                    title: '',
                    colorBadge: '',
                },
            };
        },
        methods: {
            async fetchData() {
                try {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    const response = await axios.post(
                    'https://hrp-staging-delta.bapplware.com/web/index.php/auth/token',
                    {
                        clientId: 'test_id',
                        clientSecret: 'test_secret',
                        userId: 1
                    }
                    );
                    console.log(response.data);
                    const token = response.data.token;
                    const api = 'https://hrp-staging-delta.bapplware.com/web/index.php/api/v2/leave/leave-requests?limit=50&offset=0&includeEmployees=onlyCurrent';
                    const headers = {
                    Authorization: `Bearer ${token}`
                    };
                    const dataResponse = await axios.get(api, { headers });

                    console.log('staging:', token);
                    console.log('IONIC:', localStorage.getItem('_token'));

                    return dataResponse.data;
                } catch (error) {
                    console.error(error);
                    return null;
                }
            },
            getTimeOfDay() {
                const currentTime = new Date().getHours();

                if (currentTime >= 5 && currentTime < 12) {
                    return "Good Morning";
                } else if (currentTime >= 12 && currentTime < 17) {
                    return "Good Afternoon";
                } else {
                    return "Good Evening";
                }
            },
            navigateToLeaveRequests () {
                this.$router.push('/leaveRequest');
            },
            navigateToApplyLeave () {
                this.$router.push('/applyLeave');
            },
            navigateToLeaveEntitlement () {
                this.$router.push('/leaveEntitlement');
            },
            
        },
        async created() {
            const data = await this.fetchData();
            setTimeout(() => {
                this.showComponent = true;
            }, 1000);
            if (data && data.data.length > 0) {
                const leaveData = data.data[0];
                const timeOfDay = this.getTimeOfDay();
                console.log(`It's currently ${timeOfDay}.`);

                this.leavesLength = data.data.length;
                this.cardData.date = `${leaveData.dates.fromDate} - ${leaveData.dates.toDate}`;
                this.cardData.employeeName = `${leaveData.employee.firstName} ${leaveData.employee.middleName || ''} ${leaveData.employee.lastName}`;
                this.cardData.leaveType = leaveData.leaveType.name;
                this.cardData.leaveBalance = leaveData.leaveBalances[0].balance.balance.toString();
                this.cardData.numberOfDays = leaveData.noOfDays.toString();
                this.cardData.status = leaveData.leaveBreakdown[0].name;
                this.cardData.comment = leaveData.lastComment;
                this.cardData.timePeriod = timeOfDay;

                if(this.cardData.status === 'Pending'){
                    this.cardData.colorBadge = "warning";
                } else if (this.cardData.status === 'Reject') {
                    this.cardData.colorBadge = "danger";
                } else if (this.cardData.status === 'Taken') {
                    this.cardData.colorBadge = "primary";
                }

                console.log('Date:', this.cardData.date);
                console.log('Employee Name:', this.cardData.employeeName);
                console.log('Leave Type:', this.cardData.leaveType);
                console.log('Leave Balance:', this.cardData.leaveBalance);
                console.log('Number of Days:', this.cardData.numberOfDays);
                console.log('Status:', this.cardData.status);
                console.log('Comment:', this.cardData.comment)
                console.log('Badge:', this.cardData.colorBadge)
            }
        }
    });
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Inter');
    .margin-top {
        margin-top: 50px;
    }
    .flex-center {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .btn {
        border-radius: 15px;
        width: fit-content;
        height: 50px;
        overflow: hidden;
        font-family: Inter;
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        border: none;
        margin-bottom: 20px;
        --background: #12A3DA;
    }
    .card-title {
        color: #3B3C3E;
        font-family: 'Open Sans';
        font-size: 19px;
        font-style: normal;
        font-weight: bold;
        line-height: normal;
        margin-left: 10%;
  }
    .btn-bottom {
        position: fixed;
        bottom: 20px;
        width: 100%;
    }
    .leave-entitlement-btn {
        display: flex;
        align-items: center;
        width: fit-content;
        margin: 20px auto;
        justify-content: center;
        border: 3px solid #9b9b9b;
        border-radius: 10px;
    }
</style>
