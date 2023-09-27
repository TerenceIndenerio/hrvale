<template>
    <ion-page>
        <ion-content :fullscreen="true">
          <HeaderReturn :headerTitle="headerTitle" router-direction="none"></HeaderReturn>
            <div v-if="showComponent">
                <LeaveRequestCard
                    :employeeName="cardData.EmployeeName"
                    :dateText="cardData.Date"
                    :leaveType="cardData.LeaveType"
                    :LeaveBalance="cardData.LeaveBalance"
                    :NumberOfDays="cardData.NumberOfDays"
                    :Status="cardData.Status"
                    :Comment="cardData.Comment"
                    :outlineColor="cardData.outlineColor"
                />
            </div>
            
        </ion-content>
    </ion-page>
</template>

<script >
    import { IonPage, IonHeader, IonText, IonContent } from '@ionic/vue' 
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
    HeaderReturn,
    LeaveRequestCard,
  },
  data() {
    return {
      showComponent: false,
      requests: [],
      headerTitle: 'Leave Requests',
      cardData: {
        Date: '',
        EmployeeName: '',
        LeaveType: '',
        dateText: '',
        LeaveBalance: '',
        NumberOfDays: '',
        Status: '',
        Comment: '',
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
  },
  async created() {
    const data = await this.fetchData();
    setTimeout(() => {
      this.showComponent = true;
    }, 1000);
    if (data && data.data.length > 0) {
      const leaveData = data.data[0];

      this.cardData.Date = `${leaveData.dates.fromDate} - ${leaveData.dates.toDate}`;
      this.cardData.EmployeeName = `${leaveData.employee.firstName} ${leaveData.employee.middleName || ''} ${leaveData.employee.lastName}`;
      this.cardData.LeaveType = leaveData.leaveType.name;
      this.cardData.LeaveBalance = leaveData.leaveBalances[0].balance.balance.toString();
      this.cardData.NumberOfDays = leaveData.noOfDays.toString();
      this.cardData.Status = 'Pending';
      this.cardData.Comment = leaveData.lastComment;

      if(this.cardData.LeaveType === 'Vacation Leave') {
        this.cardData.outlineColor = "border: 1px solid #27AE60; color: #27AE60;"
      } else {
        this.cardData.outlineColor = "border: 1px solid #2F80ED; color: #2F80ED;"
      }

      console.log('Date:', this.cardData.Date);
      console.log('Employee Name:', this.cardData.EmployeeName);
      console.log('Leave Type:', this.cardData.LeaveType);
      console.log('Leave Balance:', this.cardData.LeaveBalance);
      console.log('Number of Days:', this.cardData.NumberOfDays);
      console.log('Status:', this.cardData.Status);
      console.log('Comment:', this.cardData.Comment)
    }
  }
});

    
</script>
