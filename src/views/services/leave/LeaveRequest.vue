<template>
    <ion-page>
        <ion-content :fullscreen="true">
          <HeaderReturn :headerTitle="headerTitle" router-direction="none"></HeaderReturn>
            <div v-if="showComponent">

              <ion-card>
                <div class="flex-c">
                  <p class="username-text"><strong>{{ employeeName }}</strong></p>
                </div>
                <div class="flex-h">
                  <p class="leave-text">Leave Request for: </p>
                  <p class="leave-text-val"><strong>{{ leaveReqFor }}</strong></p>
                </div>
              </ion-card>

              <div v-for="(cardData, index) in requests" :key="index">
                <LeaveRequestCard
                  :dateText="cardData.date"
                  :leaveType="cardData.leaveType"
                  :leaveBalance="cardData.leaveBalance"
                  :duration="cardData.duration"
                  :status="cardData.status"
                  :comment="cardData.comment"
                  :outlineColor="cardData.outlineColor"
                />
              </div>
            </div>
            
        </ion-content>
    </ion-page>
</template>

<script>
    import { IonPage, IonHeader, IonText, IonContent, IonCard, IonIcon } from '@ionic/vue' 
    import HeaderReturn from '@/components/header/HeaderReturn.vue'
    import LeaveRequestCard from '@/views/services/leave/components/LeaveRequestCard.vue';
    import { defineComponent } from 'vue';
    import axios from 'axios';

export default defineComponent({
  name: 'Leave Requests',
  components: {
    IonPage,
    IonHeader,
    IonContent,
    IonText,
    IonCard,
    IonIcon,
    HeaderReturn,
    LeaveRequestCard,
  },
  data() {
    return {
      showComponent: false,
      requests: [],
      headerTitle: 'Leave Requests',
      data: [],
      employeeName: '',
      leaveReqFor: '',
      cardData: {
        date: '',
        employeeName: '',
        leaveType: '',
        dateText: '',
        leaveBalance: '',
        duration: '',
        status: '',
        comment: '',
        outlineColor: '',
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
        const api = 'https://hrp-staging-delta.bapplware.com/web/index.php/api/v2/leave/leave-requests/1/leaves?limit=50&offset=0';
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
  },
  async created() {
    const data = await this.fetchData();
    setTimeout(() => {
      this.showComponent = true;
    }, 1000);

    for (const leaveData of data.data) {
        const cardData = {
          date: `${leaveData.dates.fromDate}`,
          employeeName: `${data.meta.employee.firstName} ${
            data.meta.employee.middleName || ''
          } ${data.meta.employee.lastName}`,
          leaveType: leaveData.leaveType.name,
          leaveBalance: leaveData.leaveBalance.balance.balance.toString(),
          duration: (leaveData.lengthHours).toString(),
          status: leaveData.leaveStatus.name,
          Comment: leaveData.lastComment,
          outlineColor:
            leaveData.leaveType.name === 'Vacation Leave'
              ? 'border: 1px solid #27AE60; color: #27AE60;'
              : 'border: 1px solid #2F80ED; color: #2F80ED;',
        }
        this.requests.push(cardData)
        this.employeeName = `${data.meta.employee.firstName} ${
            data.meta.employee.middleName || ''
          } ${data.meta.employee.lastName}`;
          this.leaveReqFor = `${data.data[0].dates.fromDate} - ${leaveData.dates.fromDate} `
      }
      console.log('Requests:', this.requests)
  }
});

</script>

<style scoped>
  p {
    padding: 0;
    margin: 0;  
  }
  ion-card {
    padding: 10px 20px;
  }
  .flex-h {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 10px 0;
    padding: 0;
  }
  .flex-c {
    display: flex;
    justify-content: center;
  }
  .employee-icon {
    font-size: 30px;
    color: black;
  }
  .username-text, .leave-text {
    color: #000;
    font-family: Open Sans;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .leave-text-val {
    margin-left: 0px;
  }
</style>