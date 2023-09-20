<template>
    <ion-page>
        <HeaderReturnWCard 
            :headerTitle="header.headerTitle"
            :timePeriod="header.timePeriod" 
            :userName="header.userName"
            :leavesNum="header.leavesNum"
        />
        <ion-content :fullscreen="true">
            <br>
            <br>

            <LeaveDashboardCard 
                :cardTitle = "leaveDashboardCard.pending.cardTitle"
                :appliedDuration="leaveDashboardCard.pending.appliedDuration"
                :reason="leaveDashboardCard.pending.reason"
                :typeOfLeave="leaveDashboardCard.pending.typeOfLeave"
                :status = "leaveDashboardCard.pending.status"
                :colorBadge="leaveDashboardCard.pending.colorBadge"
            />


            <LeaveDashboardCard
                :cardTitle = "leaveDashboardCard.reject.cardTitle2"
                :appliedDuration="leaveDashboardCard.reject.appliedDuration"
                :reason="leaveDashboardCard.reject.reason"
                :typeOfLeave="leaveDashboardCard.reject.typeOfLeave"
                :status = "leaveDashboardCard.reject.status"
                :colorBadge="leaveDashboardCard.reject.colorBadge"
            />
            <LeaveDashboardCard
                :cardTitle = "leaveDashboardCard.reject.cardTitle2"
                :appliedDuration="leaveDashboardCard.reject.appliedDuration"
                :reason="leaveDashboardCard.reject.reason"
                :typeOfLeave="leaveDashboardCard.reject.typeOfLeave"
                :status = "leaveDashboardCard.reject.status"
                :colorBadge="leaveDashboardCard.reject.colorBadge"
            />
            <LeaveDashboardCard
                :cardTitle = "leaveDashboardCard.reject.cardTitle2"
                :appliedDuration="leaveDashboardCard.reject.appliedDuration"
                :reason="leaveDashboardCard.reject.reason"
                :typeOfLeave="leaveDashboardCard.reject.typeOfLeave"
                :status = "leaveDashboardCard.reject.status"
                :colorBadge="leaveDashboardCard.reject.colorBadge"
            />

            <Button :buttonText="buttonText" :url="ApplyLeave"></Button>
            <div class="flex-center">
                <ion-button class="btn">{{ buttonText }}</ion-button>
            </div>
        
        </ion-content>
    </ion-page>
</template>

<script>
    import { IonPage, IonHeader, IonText, IonContent, IonTitle, IonAlert } from '@ionic/vue'
    import HeaderReturnWCard from '@/components/header/HeaderReturnWCard.vue'
    import LeaveDashboardCard from '@/components/cards/LeaveDashboardCard.vue'
    import Button from '@/components/buttons/Button.vue';
    import { useRouter } from 'vue-router';

    export default {
        components: {
            IonPage,
            IonHeader, 
            IonTitle, 
            IonContent,
            IonText,
            IonAlert,
            LeaveDashboardCard,
            HeaderReturnWCard,
        },
        setup() {
            return {
                http: new ApiService(),
                isLoading: false,
                router: useRouter()
            }
        },
        data() {
            return {
            data: "",
            buttonText: 'Apply Leave',
            ApplyLeave: "/ApplyLeave",
            header: {
                headerTitle : "Leave Dashboard",
                timePeriod : "Good Morning,",
                userName : "Al Guzman",
                leavesNum : "6",
            },
            leaveDashboardCard: {
                "pending" : {
                    cardTitle : "YESTERDAY",
                    appliedDuration : "12 Oct, 2019 to 15 Oct, 2019",
                    reason : "Having fever from last night",
                    typeOfLeave : "Sick Leave",
                    status : "Pending",
                    colorBadge : "warning",
                },
                "reject" : {
                    cardTitle2 : "22 Aug, 2022",
                    appliedDuration : "12 Oct, 2019 to 15 Oct, 2019",
                    reason : "Having fever from last night",
                    typeOfLeave : "Sick Leave",
                    status : "Reject",
                    colorBadge : "danger",
                }
            },
            alertButtons: [
                {
                text: 'OK',
                handler: () => {
                    console.log("test");
                },
                },
            ],
            }
        },
        async mounted() {
            console.log("mounted leave dashboard");
            const response = await this.http.request('api/v2/admin/user-roles', {}).then(res => {
                console.log(res);
            });
        },
        methods: {
            async OnLogin(value) {
            if(!localStorage.getItem('_token')) {
                this.$store.commit('isLoading', true);
                this.http.request('auth/token', {
                    clientId: value.username,
                    clientSecret: value.password,
                    userId: 1
                }, 'POST')
                .then(res => {
                    if(res.data.token != undefined) {
                        localStorage.setItem('_token', res.data.token);
                    }
                    this.$store.commit('isLoading', false);
                    this.router.push('/tabs/home');
                }).catch(error => {
                    this.$store.commit('isLoading', false);
                });
            }
            },
        }
    }
</script>

<style scoped>
    .flex-center {
        display: flex;
        justify-content: center;
        align-items: center;
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
        margin-bottom: 20px;
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
</style>
