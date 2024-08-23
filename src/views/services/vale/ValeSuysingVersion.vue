<template>
  <ion-page>
    <HeaderReturn
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    />
    <ion-content :fullscreen="true">
      <Refresher />

      <ion-card
        class="card loan-budget-container"
        v-if="!loading"
        :style="{
          background: `linear-gradient(to right, ${theme.primaryGradientStartColor}, ${theme.primaryGradientEndColor})`,
        }"
      >
        <div class="loanbalance-container">
          <div class="loan-budget-text">
            <p :style="{ color: theme.primaryFontColor }">
              <strong>Loanable Amount</strong>
            </p>
          </div>
          <div class="loan-budget-val">
            <p :style="{ color: theme.primaryFontColor }">PHP</p>
            <h4 :style="{ color: theme.primaryFontColor }">
              <strong>{{ loanDataResult.balance }}</strong>
            </h4>
          </div>
        </div>
        <div class="card-bottom">
          <p :style="{ color: theme.primaryFontColor }">
            <strong>Cash Vale</strong>
          </p>
          <img
            src="@/assets/images/hrvalewhiteicon.png"
            alt="Vale Icon"
            class="icon-btn"
            style="width: 30px; height: 30px"
            id="vale-mask"
          />
        </div>
      </ion-card>

      <div class="bottom">
        <div class="vale-history-container">
          <h5 class="recent-transation-label">
            <strong>Recent Transactions:</strong>
          </h5>
          <ion-button
            class="vale-history-btn"
            @click="navigateToValeHistory"
            color="none"
            fill="outline"
            :style="{
              color: theme.primaryColor,
            }"
          >
            <strong>View All</strong>
          </ion-button>
        </div>

        <ion-button
          class="applyvale-btn neomorphic-btn-1"
          :style="{
            backgroundColor: theme.secondaryColor,
            color: theme.primaryFontColor,
          }"
          color="none"
          @click="navigateToApplyVale"
        >
          Apply Vale
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonInput,
  IonIcon,
  toastController,
} from "@ionic/vue";
import Refresher from "@/components/refresher/Refresher.vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import { defineComponent } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonCard,
    HeaderReturn,
    Refresher,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonInput,
    IonIcon,
  },
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    return {
      headerTitle: "Vale",
      results: [],
      theme: {},
      loading: true,
      startDate: "",
      endDate: "",
      empNumber: "",
      loanDataResult: {
        budget: 0,
        balance: 0,
      },
      showAllResults: false,
    };
  },
  computed: {
    displayedResults() {
      return this.showAllResults ? this.results : this.results.slice(0, 5);
    },
  },
  watch: {
    startDate() {
      this.showAllResults = true;
      this.fetchData();
    },
    endDate() {
      this.showAllResults = true;
      this.fetchData();
    },
  },
  async created() {
    await this.checkTokenExpiration();
    this.empNumber = localStorage.getItem("empNumber");
    this.fetchTheme();
    this.fetchData();
    this.fetchLoanBudget();
    this.loading = false;
  },
  methods: {
    async checkTokenExpiration() {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        console.error("Token not available.");
        console.log("Token is missing. Redirecting to login...");
        this.router.push("/login");
        return;
      }

      const tokenData = JSON.parse(atob(storedToken.split(".")[1]));
      const expirationTime = tokenData.exp * 1000;

      if (Date.now() > expirationTime) {
        console.log("Token expired. Redirecting to login...");
        this.router.push("/login");
      }
    },
    fetchTheme() {
      const themeData = JSON.parse(localStorage.getItem("themeData")) || {};
      this.theme = themeData;
    },
    async navigateToViewPage(result) {
      this.$router.push({ path: "/viewvale", query: { id: result.id } });
    },
    async navigateToValeHistory() {
      this.$router.push("/valehistory");
    },
    async fetchData() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();

        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        let api = `${baseURL}api/v2/vale?limit=50&offset=0&sortField=v.id&sortOrder=DESC`;

        if (this.startDate && this.endDate) {
          const startTimestamp = new Date(this.startDate).getTime();
          const endTimestamp = new Date(this.endDate).getTime();

          const dataResponse = await axios.get(api, { headers });

          if (dataResponse.data && Array.isArray(dataResponse.data.data)) {
            this.results = dataResponse.data.data
              .filter((data) => {
                const loanDateTimestamp = new Date(data.loanDate).getTime();
                return (
                  loanDateTimestamp >= startTimestamp &&
                  loanDateTimestamp <= endTimestamp
                );
              })
              .map((data) => ({
                id: data.id,
                loanAmount: data.loanAmount,
                loanDate: data.loanDate,
                status: data.status,
              }));
          }
        } else {
          const dataResponse = await axios.get(api, { headers });

          if (dataResponse.data && Array.isArray(dataResponse.data.data)) {
            this.results = dataResponse.data.data.map((data) => ({
              id: data.id,
              loanAmount: data.loanAmount,
              loanDate: data.loanDate,
              status: data.status,
            }));
          }
        }
      } catch (error) {
        this.showErrorMessage(error.response.data.error.message);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },
    async fetchLoanBudget() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();

        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };
        const api = `${baseURL}api/v2/apply-vale?limit=50&offset=0`;

        const dataResponse = await axios.get(api, { headers });

        this.loanDataResult = {
          budget: dataResponse.data.data.budget,
          balance: dataResponse.data.data.loanableAmount,
        };
      } catch (error) {
        this.showErrorMessage(error.response.data.error.message);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },
    navigateToApplyVale() {
      this.$router.push("/applyvale");
    },
    async showErrorMessage(message) {
      try {
        const toast = await toastController.create({
          message: message,
          duration: 3000,
          position: "top",
          color: "light",
          buttons: [
            {
              icon: "close-outline",
              role: "cancel",
            },
          ],
        });
        await toast.present();
      } catch (error) {
        console.error("Error displaying toast:", error);
      }
    },
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
p {
  margin: 0;
}

.flex-h {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.text-center {
  text-align: center;
}
.card {
  padding: 0 10px 0 10px;
  border-radius: 20px;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8), 0px -4px 8px rgba(0, 0, 0, 0.05),
    -8px -8px 16px rgba(0, 0, 0, 0.1);
}

.card ion-card-header {
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.card ion-card-header ion-card-subtitle {
  border: 1px solid gray;
  padding: 10px 20px;
  border-radius: 20px;
  margin: 10px 0 0 0;
}
.card ion-card-content {
  padding: 10px;
}
.card h5 {
  margin: 0;
}
.filter-container {
  display: flex;
  justify-content: center;
  padding: 10px 5px;
}

.loan-budget-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 5px;
  text-align: center;
  min-width: 270px;
  width: 95%;
  padding: 20px;
  margin: 5px auto;
  border-radius: 10px;
  height: 200px;
  position: absolute;
  top: 25%;
  left: 0;
  right: 0;
  box-shadow: 6px 6px 12px #000000, -6px -6px 12px #b1b1b1;
  max-width: 500px;
}
.loan-budget-val {
  display: flex;
  justify-content: center;
  align-items: center;
}
.loan-budget-val p {
  font-size: 12px;
  margin: 0 5px 0 0;
}
.loan-budget-text p {
  font-size: 16px;
}

.loan-budget-container h4 {
  margin: 0;
  font-size: 35px;
}

.line_bottom {
  border: 1px solid rgb(139, 139, 139);
  width: 80%;
}

.result-container {
  width: fit-content;
  min-width: 300px;
  margin: 20px auto 50px auto;
}
.payroll-container {
  width: fit-content;
  min-width: 305px;
  height: fit-content;
  flex-shrink: 0;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.5);
  margin: 0 auto;
  padding: 10px;
}
.wdays-text {
  color: #000;
  text-align: center;
  font-family: Open Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.box {
  width: 45px;
  height: 45px;
  border-radius: 10px;
  background: #6d2b84;
}
.wdays-num {
  color: #fff;
  text-align: center;
  font-family: Open Sans;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.select-option {
  width: fit-content;
  min-width: 300px;
  background-color: rgba(128, 128, 128, 0.184);
  border-radius: 10px;
  padding: 0 10px;
  margin: 10px auto;
}
.header-row {
  border-bottom: 1px solid #000;
  margin-bottom: 20px;
}
.outlineColor {
  border: 1px solid #828282;
  color: #828282;
  border-radius: 20px;
  width: fit-content;
  padding: 0 30px;
  margin: 10px auto;
}
.pos-right {
  float: right;
  right: 10px;
}
.search-btn-container {
  overflow: hidden;
  border-radius: 10px;
}
.edit-btn {
  padding: 0;
  overflow: hidden;
  margin: 10px auto;
  width: 100%;
}
.create-vale-btn {
  border-radius: 10px;
  overflow: hidden;
  position: fixed;
  bottom: 10px;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 80%;
  height: 30px;
  max-width: 350px;
}
.loanbalance-container {
  padding: 5px 10px;
  border-radius: 10px;
  overflow: hidden;
}
.no-data-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 20px 0;
}
.search-container {
  margin: 10px auto 20px auto;
  padding: 10px;
}
.search-title {
  font-family: "Inter";
  font-weight: bold;
  text-align: center;
  margin: 0 0 10px 0;
}
.label {
  font-family: "Inter";
  font-weight: bold;
}
.input-container {
  display: flex;
  flex-direction: row;
  width: fit-content;
  gap: 5px;
}
.date-input {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 120px;
}
.container-inner p {
  padding-left: 20px;
}
.btn-container {
  bottom: 50px;
  margin: 0px auto 20px auto;
  left: 0;
  right: 0;
  position: absolute;
  display: flex;
  justify-content: center;
}
.applyvale-btn {
  width: 230px;
  border-radius: 10px;
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
  margin: 0 auto;
}

.vale-history-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.bottom {
  overflow-y: auto;
  position: fixed;
  bottom: 0px;
  left: 0;
  right: 0;
  width: 85%;
  max-width: 500px;
  padding: 10px 20px;
  background-color: white;
  border-radius: 50px 50px 50% 50%;
  height: 23vh;
  box-shadow: 0px -5px 7px #dbdbdb;
  border: none;
  outline: none;
  margin: 0 auto;
}
.container {
  border-top: 1px solid rgb(157, 157, 157);
  width: 100%;
}
.recent-transation-label {
  color: gray;
  margin: 0;
}
.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  position: absolute;
  bottom: 10px;
}
.vale-history-btn {
  /* color: rgb(5, 113, 255); */
  /* outline: 1px solid rgb(5, 113, 255); */
  /* padding: 3px 10px;   */
  border-radius: 30px;
}
</style>
