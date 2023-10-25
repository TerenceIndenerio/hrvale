<template>
    <ion-page>
      <HeaderReturn :headerTitle="headerTitle" router-direction="none"></HeaderReturn>
      <ion-content :fullscreen="true">
        <Refresher />
        <div v-if="showComponent">

          <ion-card class="select-date-container card-round">
            <ion-select v-model="selectedApi">
              <div slot="label">Select Date:</div>
                <ion-select-option
                  v-for="(option, index) in leavePeriodOptions"
                  :key="index"
                  :value="option.value"
                >
                  {{ option.text }}
                </ion-select-option>
              </ion-select>
          </ion-card>
          
          <div v-for="(entitlement, index) in entitlements" :key="index">
            <LeaveEntitlementCard
              :leaveType="entitlement.leaveType.name"
              :entitlement="entitlement.entitlement"
              :daysUsed="entitlement.daysUsed"
              :creditedDate="entitlement.creditedDate"
            />
          </div>
          
        </div>
      </ion-content>
    </ion-page>
</template>
  
<script>
import { IonPage, IonCard, IonSelect, IonSelectOption, IonContent } from '@ionic/vue';
import HeaderReturn from '@/components/header/HeaderReturn.vue';
import LeaveEntitlementCard from '@/views/services/leave/components/LeaveEntitlementCard.vue';
import Refresher from '@/components/refresher/Refresher.vue';
import { defineComponent, ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

export default defineComponent({
  name: 'LeaveEntitlements',
  components: {
    IonPage,
    IonCard,
    HeaderReturn,
    LeaveEntitlementCard,
    Refresher,
    IonSelect,
    IonSelectOption,
    IonContent
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
      selectedApi: null,
      leavePeriodOptions: [],
    };
  },
  methods: {
    async fetchLeavePeriods() {
      try {
        const tokenResponse = await axios.post(
          'https://hrp-staging-delta.bapplware.com/web/index.php/auth/token',
          {
            clientId: 'test_id',
            clientSecret: 'test_secret',
            userId: 1
          }
        );
        const token = tokenResponse.data.token;

        const currentLeavePeriodResponse = await axios.get(
          'https://hrp-staging-delta.bapplware.com/web/index.php/api/v2/leave/leave-periods',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        

        const { startDate, endDate } = currentLeavePeriodResponse.data.meta.currentLeavePeriod;
        this.selectedApi = `${startDate} - ${endDate}`;
        this.makeGetRequest(startDate, endDate);

        const response = await axios.get(
          'https://hrp-staging-delta.bapplware.com/web/index.php/api/v2/leave/leave-periods',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

        const leavePeriods = response.data.data;
        this.leavePeriodOptions = leavePeriods.map((period, index) => ({
          value: `${period.startDate} - ${period.endDate}`,
          text: `${period.startDate} - ${period.endDate}`,
        }));
        this.showComponent = true;

      } catch (error) {
        console.error(error);
      }
    },
    async makeGetRequest(fromDate, toDate) {
      try {
        this.store.commit('loader/updateLoader', true);
        const apiUrl = `https://hrp-staging-delta.bapplware.com/web/index.php/api/v2/leave/leave-entitlements?limit=50&offset=0&fromDate=${fromDate}&toDate=${toDate}`;
        const tokenResponse = await axios.post(
          'https://hrp-staging-delta.bapplware.com/web/index.php/auth/token',
          {
            clientId: 'test_id',
            clientSecret: 'test_secret',
            userId: 1
          }
        );
        const token = tokenResponse.data.token;

        const headers = {
          Authorization: `Bearer ${token}`
        };
        const dataResponse = await axios.get(apiUrl, { headers });

        this.entitlements = dataResponse.data.data.map((entitlement) => {
          return {
            leaveType: entitlement.leaveType,
            entitlement: entitlement.entitlement,
            daysUsed: entitlement.daysUsed,
            creditedDate: entitlement.creditedDate,
          };
        });
        this.store.commit('loader/updateLoader', false);
      } catch (error) {
        this.store.commit('loader/updateLoader', false);
        console.error(error);
      }
    },
  },
  watch: {
  selectedApi(newVal) {
    const selectedOption = this.leavePeriodOptions.find((option) => option.value === newVal);
    if (selectedOption) {
      const fromDate = selectedOption.text.split(' - ')[0];
      const toDate = selectedOption.text.split(' - ')[1];
      this.makeGetRequest(fromDate, toDate);
    }
  },
},
  async mounted() {
    await this.fetchLeavePeriods();
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
  .card-round {
    border-radius: 20px;
    width: 90%;
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