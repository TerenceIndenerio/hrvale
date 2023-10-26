<template>
    <ion-page>
      <HeaderReturn :headerTitle="headerTitle" router-direction="none"></HeaderReturn>
      <ion-content :fullscreen="true">

        <div class="calendar-container">
            <ion-datetime 
            class="date border-style"
            presentation="date"
            display-timezone="false"
            v-model="selectedDate"
            :highlighted-dates="highlightedDates"
            readonly
            ></ion-datetime>
        </div>

        <div class="calendar-container">
            <ion-datetime
                class="calendar-select"
                presentation="date"
                display-timezone="false"
                display-day="false"
                v-model="selectedMonth"
                @ionChange="handleMonthChange"
                :prefer-wheel="true"
            ></ion-datetime>
        </div>

        <div class="sched-container">
            <div class="box-container">
                <ion-card class="box">
                    <h3>
                        In
                    </h3>
                    <h2>
                        {{ regularWorkHourStart }}
                    </h2>
                </ion-card>
                <ion-card class="box">
                    <h3>
                        Out
                    </h3>
                    <h2>
                        {{ regularWorkHourEnd }}
                    </h2>
                </ion-card>
            </div>
        </div>

      </ion-content>
    </ion-page>
</template>
  
<script>
    import { IonPage, IonContent, IonButton, IonCard } from '@ionic/vue';
    import HeaderReturn from '@/components/header/HeaderReturn.vue';
    import HomeDashboardCard from '@/views/services/schedule/components/HomeDashboardCard.vue';
    import ScheduleOverviewCard from '@/views/services/schedule/components/ScheduleOverviewCard.vue';
    import { IonDatetime } from '@ionic/vue';
    import { defineComponent } from 'vue';
    import axios from 'axios';
    import { GlobalConstants } from '@/config/constants';
  
    const baseURL = GlobalConstants.HOST_URL;
  
    export default defineComponent({
        components: {
        IonPage,
        IonContent,
        IonDatetime,
        HeaderReturn,
        HomeDashboardCard,
        ScheduleOverviewCard,
        IonButton,
        IonCard,
        },
        data() {
        return {
            selectedMonth: new Date().toISOString(),
            selectedDate: new Date().toISOString(),
            headerTitle: 'Schedule',
            buttonText: 'Request Schedule',
            empNumber: 1,
            month: 0,
            scheduleData: [],
            regularWorkHourStart: '00:00',
            regularWorkHourEnd: '00:00',
            }
        },
        computed: {
            highlightedDates() {
                return this.scheduleData.map(entry => ({
                    date: entry.scheduleDate.date.split(' ')[0],
                    backgroundColor: entry.workShift.scheduleColor,
                }));
            },
        },
        methods: {
            async requestData() {
                try {
                    const authPayload = {
                        clientId: 'test_id',
                        clientSecret: 'test_secret',
                        userId: 1,
                    };
                    const authResponse = await axios.post(baseURL + 'auth/token', authPayload);
                    const authToken = `Bearer ${authResponse.data.token}`;
                    const currentMonth = new Date().getMonth() + 1;
                    const apiUrl = baseURL + `api/v2/ess/employee-schedule?empNumber=${this.empNumber}&month=${this.month}`;
                    const headers = {
                        Authorization: authToken,
                    };
                    
                    const response = await axios.get(apiUrl, { headers });

                    this.scheduleData = response.data.data;

                    const extractedData = this.scheduleData.map(entry => ({
                        regularWorkHourStart: entry.regularWorkHourStart,
                        regularWorkHourEnd: entry.regularWorkHourEnd,
                        scheduleColor: entry.workShift.scheduleColor,
                        date: entry.scheduleDate.date.split(' ')[0],
                    }));

                    console.log('Fetched data:', extractedData);
                } catch (error) {
                    console.error('Error:', error);
                }
            },
            handleMonthChange(event) {
                const selectedDate = event.detail.value;
                const datePart = new Date(selectedDate).toISOString().split('T')[0];
                const month = new Date(selectedDate).getMonth() + 1;
                const selectedMonth = event.detail.value;

                this.selectedDate = datePart;
                this.month = month;
                this.selectedMonth = selectedMonth;
                console.log(datePart);

                const selectedData = this.scheduleData.find(entry => entry.scheduleDate.date.split(' ')[0] === datePart);
                if (selectedData) {
                    this.regularWorkHourStart = selectedData.regularWorkHourStart;
                    this.regularWorkHourEnd = selectedData.regularWorkHourEnd;
                } else {
                    this.regularWorkHourStart = '00:00';
                    this.regularWorkHourEnd = '00:00';
                }
                this.requestData();
            },
        },
        async created() {
            const data = await this.requestData()
        }
    });
</script>
  
<style scoped>

    .calendar-container {
        margin: 10px auto;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .calendar-select {
        border-radius: 20px;
        height: 100px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 7px solid rgba(220, 220, 220, 0.581);
        box-shadow: inset -10px -10px 15px #FFFFFF,
        9.91px 9.91px 15px #D9DADE, -9.91px -9.91px 15px #FFFFFF;
    }
    .date {
        margin: auto;
        border-radius: 20px;
    }
    .border-style {
        border: 5px solid rgba(220, 220, 220, 0.581);
        box-shadow: inset 10px 10px 15px #D9DADE, inset -10px -10px 15px #FFFFFF,
        9.91px 9.91px 15px #D9DADE, -9.91px -9.91px 15px #FFFFFF;
    }
    .sched-container {
        text-align: center;
        border-radius: 30px;
        padding: 20px 0;
    }
    .sched-container h2 {
        margin: 10px 0 0 0;
        font-weight: bold;
    }
    .sched-container h3 {
        margin: 0;
    }
    .box-container {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        flex-direction: row;
        height: fit-content;
    }
    .box {
        width: fit-content;
        min-width: 40%;
        height: fit-content;
        padding: 10px 20px;
        margin: 20px 0;
        border-radius: 10px;
    }
</style>