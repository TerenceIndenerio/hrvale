<template>
    <ion-page>
      <HeaderReturn :headerTitle="headerTitle" router-direction="none"></HeaderReturn>
      <ion-content :fullscreen="true">
        <Refresher />
        <div v-if="showComponent">
  
            <ion-card class="card-round">
                <div class="flex-c">
                <p class="username-text"><strong>{{ employeeName }}</strong></p>
                </div>
                <div class="flex-h flex-c">
                <p class="leave-text">Leave Period: </p>
                <p class="leave-text-val"><strong>{{ leaveEntitlementFor }}</strong></p>
                </div>
            </ion-card>

            <ion-card class="select-date-container card-round">
                <ion-select v-model="selectedApi">
                    <div slot="label" class="">Select Date:</div>
                    <ion-select-option value="api1">2023-01-01 - 2023-08-31</ion-select-option>
                    <ion-select-option value="api2">2023-09-01 - 2024-08-31</ion-select-option>
                    <!-- <ion-select-option value="api3">2024-09-01 - 2025-08-31</ion-select-option> This is still empty --> 
                </ion-select>
            </ion-card>
          
          <ion-card class="result-container">
            <div v-for="(entitlement, index) in entitlements" :key="index">
              <LeaveEntitlementCard
                :leaveType="entitlement.leaveType.name"
                :entitlement="entitlement.entitlement"
                :daysUsed="entitlement.daysUsed"
                :creditedDate="entitlement.creditedDate"
              />
            </div>
          </ion-card>
        </div>
      </ion-content>
    </ion-page>
</template>
  
<script>
import { IonPage, IonHeader, IonContent, IonCard, IonIcon, IonSelect, IonSelectOption } from '@ionic/vue'
import HeaderReturn from '@/components/header/HeaderReturn.vue'
import LeaveEntitlementCard from '@/views/services/leave/components/LeaveEntitlementCard.vue'
import Refresher from '@/components/refresher/Refresher.vue'
import { defineComponent } from 'vue'
import { useStore } from 'vuex';
import axios from 'axios'

export default defineComponent({
  name: 'LeaveEntitlements',
  components: {
    IonPage,
    IonHeader,
    IonContent,
    IonCard,
    IonIcon,
    HeaderReturn,
    LeaveEntitlementCard,
    Refresher,
    IonSelect,
    IonSelectOption
  },
  setup() {
    return {
        store: useStore(),
    }
  },
  data() {
    return {
      showComponent: false,
      entitlements: [],
      headerTitle: 'Leave Entitlements',
      employeeName: '',
      leaveEntitlementFor: '',
      selectedApi: 'api1',
    }
  },
  watch: {
    selectedApi: 'fetchData',
  },
  methods: {
    async fetchData() {
      try {
        this.store.commit('loader/updateLoader', true);
        const apiUrls = {
          api1: 'https://hrp-staging-delta.bapplware.com/web/index.php/api/v2/leave/leave-entitlements?limit=50&offset=0&fromDate=2023-09-01&toDate=2024-08-31',
          api2: 'https://hrp-staging-delta.bapplware.com/web/index.php/api/v2/leave/leave-entitlements?limit=50&offset=0&fromDate=2023-01-01&toDate=2023-08-31',
        //   api3: 'https://hrp-staging-delta.bapplware.com/web/index.php/api/v2/leave/leave-entitlements?limit=50&offset=0&fromDate=2024-09-01&toDate=2025-08-31', This is still Empty
        };

        const apiUrl = apiUrls[this.selectedApi];
        
        const response = await axios.post(
          'https://hrp-staging-delta.bapplware.com/web/index.php/auth/token',
          {
            clientId: 'test_id',
            clientSecret: 'test_secret',
            userId: 1
          }
        );
        const token = response.data.token;

        const headers = {
          Authorization: `Bearer ${token}`
        };
        const dataResponse = await axios.get(apiUrl, { headers });

        this.employeeName = `${dataResponse.data.data[0].employee.firstName} ${dataResponse.data.data[0].employee.middleName || ''} ${dataResponse.data.data[0].employee.lastName}`;
        this.leaveEntitlementFor = `${dataResponse.data.meta.fromDate} - ${dataResponse.data.meta.toDate}`;

        this.entitlements = dataResponse.data.data.map((entitlement) => {
          const leaveData = {
            leaveType: entitlement.leaveType,
            entitlement: entitlement.entitlement,
            daysUsed: entitlement.daysUsed,
            creditedDate: entitlement.creditedDate,
          };
          return leaveData;
        });
      } catch (error) {
        console.error(error);
      }
      this.store.commit('loader/updateLoader', false);
    },
  },
  async created() {
    const data = await this.fetchData();
    setTimeout(() => {
      this.showComponent = true;
    }, 1000);
    this.store.commit('loader/updateLoader', false);
  },
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
  .result-container {
    margin-top: 20px;
    border-radius: 20px;
  }
  .card-round {
    border-radius: 20px;
    width: fit-content;
    margin: 10px auto;
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
  .select-date-container {
    height: fit-content;
    padding: 0 20px;
  }
</style>