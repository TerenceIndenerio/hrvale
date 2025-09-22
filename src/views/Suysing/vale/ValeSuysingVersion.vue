<template>
  <ion-page>
    <HeaderReturn
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    />
    <ion-content :fullscreen="true">
      <Refresher />

      <div class="content-container">
        <!-- Swiper Carousel -->

        <div class="carousel">
          <div class="carousel-inner">
            <input
              class="carousel-open"
              type="radio"
              id="carousel-1"
              name="carousel"
              aria-hidden="true"
              hidden=""
              v-model="currentSlide"
              value="1"
            />
            <div class="carousel-item">
              <img :src="image1" />
            </div>
            <input
              class="carousel-open"
              type="radio"
              id="carousel-2"
              name="carousel"
              aria-hidden="true"
              hidden=""
              v-model="currentSlide"
              value="2"
            />
            <div class="carousel-item">
              <img :src="image2" />
            </div>
            <input
              class="carousel-open"
              type="radio"
              id="carousel-3"
              name="carousel"
              aria-hidden="true"
              hidden=""
              v-model="currentSlide"
              value="3"
            />
            <div class="carousel-item">
              <img :src="image3" />
            </div>
            <input
              class="carousel-open"
              type="radio"
              id="carousel-4"
              name="carousel"
              aria-hidden="true"
              hidden=""
              v-model="currentSlide"
              value="4"
            />
            <div class="carousel-item">
              <img :src="image4" />
            </div>
            <input
              class="carousel-open"
              type="radio"
              id="carousel-5"
              name="carousel"
              aria-hidden="true"
              hidden=""
              v-model="currentSlide"
              value="5"
            />
            <div class="carousel-item">
              <img :src="image5" />
            </div>
            <input
              class="carousel-open"
              type="radio"
              id="carousel-6"
              name="carousel"
              aria-hidden="true"
              hidden=""
              v-model="currentSlide"
              value="6"
            />
            <div class="carousel-item">
              <img :src="image6" />
            </div>
            <label for="carousel-3" class="carousel-control prev control-1"
              >‹</label
            >
            <label for="carousel-2" class="carousel-control next control-1"
              >›</label
            >
            <label for="carousel-1" class="carousel-control prev control-2"
              >‹</label
            >
            <label for="carousel-3" class="carousel-control next control-2"
              >›</label
            >
            <label for="carousel-2" class="carousel-control prev control-3"
              >‹</label
            >
            <label for="carousel-1" class="carousel-control next control-3"
              >›</label
            >
            <label for="carousel-3" class="carousel-control prev control-4"
              >‹</label
            >
            <label for="carousel-5" class="carousel-control next control-4"
              >›</label
            >
            <label for="carousel-4" class="carousel-control prev control-5"
              >‹</label
            >
            <label for="carousel-6" class="carousel-control next control-5"
              >›</label
            >
            <label for="carousel-5" class="carousel-control prev control-6"
              >‹</label
            >
            <label for="carousel-1" class="carousel-control next control-6"
              >›</label
            >
            <ol class="carousel-indicators">
              <li>
                <label for="carousel-1" class="carousel-bullet">•</label>
              </li>
              <li>
                <label for="carousel-2" class="carousel-bullet">•</label>
              </li>
              <li>
                <label for="carousel-3" class="carousel-bullet">•</label>
              </li>
              <li>
                <label for="carousel-4" class="carousel-bullet">•</label>
              </li>
              <li>
                <label for="carousel-5" class="carousel-bullet">•</label>
              </li>
              <li>
                <label for="carousel-6" class="carousel-bullet">•</label>
              </li>
            </ol>
          </div>
        </div>

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

        <div class="action-btn-container">
          <ion-card
            class="card action-btn"
            :style="{
              background: `linear-gradient(to right, ${theme.primaryGradientStartColor}, ${theme.primaryGradientEndColor})`,
            }"
            @click="navigateToApplyVale"
          >
            <div
              class="vale-history-btn"
              color="none"
              :style="{
                color: theme.primaryFontColor,
              }"
            >
              <h4><strong>Apply Vale</strong></h4>
            </div>
            <div
              color="none"
              :style="{
                color: theme.primaryFontColor,
              }"
              class="icon-container"
            >
              <svg
                width="33"
                height="40"
                viewBox="0 0 33 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="icon-btn"
              >
                <g filter="url(#filter0_d_3_2171)">
                  <path
                    d="M12.813 9.11111C12.813 8.63962 13.0024 8.18743 13.3397 7.85403C13.677 7.52063 14.1345 7.33333 14.6115 7.33333C15.0885 7.33333 15.546 7.52063 15.8833 7.85403C16.2206 8.18743 16.4101 8.63962 16.4101 9.11111V17.0578L18.5863 17.2889L27.4712 21.1822C28.4245 21.6089 29 22.5511 29 23.5822V31.3333C28.946 32.7911 27.777 33.9467 26.3022 34H14.6115C13.9281 34 13.2806 33.7333 12.813 33.2356L4 25.7689L5.33094 24.4C5.67266 24.0267 6.15827 23.8311 6.66187 23.8311H7.05755L12.813 26.8889V9.11111ZM14.6115 2C16.5195 2 18.3494 2.7492 19.6986 4.0828C21.0478 5.41639 21.8058 7.22513 21.8058 9.11111C21.8058 11.7778 20.3669 14.0356 18.2086 15.2622V13.0933C19.3058 12.1156 20.0072 10.6933 20.0072 9.11111C20.0072 7.69662 19.4387 6.34007 18.4268 5.33988C17.4149 4.33968 16.0425 3.77778 14.6115 3.77778C13.1805 3.77778 11.8081 4.33968 10.7962 5.33988C9.7843 6.34007 9.21583 7.69662 9.21583 9.11111C9.21583 10.6933 9.91727 12.1156 11.0144 13.0933V15.2622C8.85612 14.0356 7.41727 11.7778 7.41727 9.11111C7.41727 7.22513 8.17523 5.41639 9.52441 4.0828C10.8736 2.7492 12.7035 2 14.6115 2Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_d_3_2171"
                    x="0"
                    y="0"
                    width="33"
                    height="40"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="2" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_3_2171"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_3_2171"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
          </ion-card>

          <ion-card
            class="card action-btn"
            :style="{
              background: `linear-gradient(to right, ${theme.primaryGradientStartColor}, ${theme.primaryGradientEndColor})`,
            }"
            @click="navigateToValeHistory"
          >
            <div
              class="vale-history-btn"
              color="none"
              :style="{
                color: theme.primaryFontColor,
              }"
            >
              <h4><strong>Recent Transactions</strong></h4>
            </div>
            <div
              color="none"
              :style="{
                color: theme.primaryFontColor,
              }"
              class="icon-container"
            >
              <svg
                width="33"
                height="40"
                viewBox="0 0 33 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="icon-btn"
              >
                <g filter="url(#filter0_d_3_2171)">
                  <path
                    d="M12.813 9.11111C12.813 8.63962 13.0024 8.18743 13.3397 7.85403C13.677 7.52063 14.1345 7.33333 14.6115 7.33333C15.0885 7.33333 15.546 7.52063 15.8833 7.85403C16.2206 8.18743 16.4101 8.63962 16.4101 9.11111V17.0578L18.5863 17.2889L27.4712 21.1822C28.4245 21.6089 29 22.5511 29 23.5822V31.3333C28.946 32.7911 27.777 33.9467 26.3022 34H14.6115C13.9281 34 13.2806 33.7333 12.813 33.2356L4 25.7689L5.33094 24.4C5.67266 24.0267 6.15827 23.8311 6.66187 23.8311H7.05755L12.813 26.8889V9.11111ZM14.6115 2C16.5195 2 18.3494 2.7492 19.6986 4.0828C21.0478 5.41639 21.8058 7.22513 21.8058 9.11111C21.8058 11.7778 20.3669 14.0356 18.2086 15.2622V13.0933C19.3058 12.1156 20.0072 10.6933 20.0072 9.11111C20.0072 7.69662 19.4387 6.34007 18.4268 5.33988C17.4149 4.33968 16.0425 3.77778 14.6115 3.77778C13.1805 3.77778 11.8081 4.33968 10.7962 5.33988C9.7843 6.34007 9.21583 7.69662 9.21583 9.11111C9.21583 10.6933 9.91727 12.1156 11.0144 13.0933V15.2622C8.85612 14.0356 7.41727 11.7778 7.41727 9.11111C7.41727 7.22513 8.17523 5.41639 9.52441 4.0828C10.8736 2.7492 12.7035 2 14.6115 2Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_d_3_2171"
                    x="0"
                    y="0"
                    width="33"
                    height="40"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="2" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_3_2171"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_3_2171"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
          </ion-card>
        </div>
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
import image1 from "@/assets/images/benefits-poster-1.png";
import image2 from "@/assets/images/benefits-poster-2.png";
import image3 from "@/assets/images/benefits-poster-3.png";
import image4 from "@/assets/images/vale-poster-1.png";
import image5 from "@/assets/images/vale-poster-2.png";
import image6 from "@/assets/images/vale-poster-3.png";

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
      currentSlide: 1,
      image1,
      image2,
      image3,
      image4,
      image5,
      image6,
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
  mounted() {
    setInterval(() => {
      this.currentSlide = this.currentSlide % 6 + 1;
    }, 2000);
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
      this.$router.push("/suysing_applyvale");
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
  margin: 30px auto 0 auto;
  border-radius: 10px;
  height: 170px;
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
  margin-right: auto;
}
.vale-history-btn h4 {
  margin: 0;
  padding: 0;
}
.action-btn-container {
  display: flex;
  justify-content: center;
  gap: 5px;
  flex-direction: row;
}
.content-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.action-btn {
  width: 100%;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
}
.icon-container {
  margin-left: auto;
}
.icon-container .icon-btn {
  font-size: 30px;
}
/* carousel */
.carousel {
  position: relative;
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.64);
  margin-top: 26px;
}

.carousel-inner {
  position: relative;
  overflow: hidden;
  width: 100%;
}

.carousel-open:checked + .carousel-item {
  position: static;
  opacity: 100;
}

.carousel-item {
  position: absolute;
  opacity: 0;
  -webkit-transition: opacity 0.6s ease-out;
  transition: opacity 0.6s ease-out;
}

.carousel-item img {
  display: block;
  height: auto;
  max-width: 100%;
}

.carousel-control {
  background: rgba(0, 0, 0, 0.28);
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  display: none;
  font-size: 40px;
  height: 40px;
  line-height: 35px;
  position: absolute;
  top: 50%;
  -webkit-transform: translate(0, -50%);
  cursor: pointer;
  -ms-transform: translate(0, -50%);
  transform: translate(0, -50%);
  text-align: center;
  width: 40px;
  z-index: 10;
}

.carousel-control.prev {
  left: 2%;
}

.carousel-control.next {
  right: 2%;
}

.carousel-control:hover {
  background: rgba(0, 0, 0, 0.8);
  color: #aaaaaa;
}

#carousel-1:checked ~ .control-1,
#carousel-2:checked ~ .control-2,
#carousel-3:checked ~ .control-3,
#carousel-4:checked ~ .control-4,
#carousel-5:checked ~ .control-5,
#carousel-6:checked ~ .control-6 {
  display: block;
}

.carousel-indicators {
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  bottom: 2%;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 10;
}

.carousel-indicators li {
  display: inline-block;
  margin: 0 5px;
}

.carousel-bullet {
  color: #fff;
  cursor: pointer;
  display: block;
  font-size: 35px;
}

.carousel-bullet:hover {
  color: #aaaaaa;
}

#carousel-1:checked
  ~ .control-1
  ~ .carousel-indicators
  li:nth-child(1)
  .carousel-bullet,
#carousel-2:checked
  ~ .control-2
  ~ .carousel-indicators
  li:nth-child(2)
  .carousel-bullet,
#carousel-3:checked
  ~ .control-3
  ~ .carousel-indicators
  li:nth-child(3)
  .carousel-bullet,
#carousel-4:checked
  ~ .control-4
  ~ .carousel-indicators
  li:nth-child(4)
  .carousel-bullet,
#carousel-5:checked
  ~ .control-5
  ~ .carousel-indicators
  li:nth-child(5)
  .carousel-bullet,
#carousel-6:checked
  ~ .control-6
  ~ .carousel-indicators
  li:nth-child(6)
  .carousel-bullet {
  color: #428bca;
}

#title {
  width: 100%;
  position: absolute;
  padding: 0px;
  margin: 0px auto;
  text-align: center;
  font-size: 27px;
  color: rgba(255, 255, 255, 1);
  font-family: "Open Sans", sans-serif;
  z-index: 9999;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.33),
    -1px 0px 2px rgba(255, 255, 255, 0);
}
</style>
