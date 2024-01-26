<template>
  <ion-page>
    <HeaderUser
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :imgLogo="theme.clientLogo"
    ></HeaderUser>
    <ion-content :fullscreen="true" v-if="!loading">
      <Refresher />
      <CardWImg :cardHeader="cardHeader" :cardText="cardText" />

      <div class="flex-center">
        <div class="services-card">
          <ion-text>
            <h2 class="title">Services</h2>
          </ion-text>
          <ServicesGroupButton
            :btnColor="theme.primaryColor"
            :btnTextColor="theme.primaryColor"
          />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonText,
  IonContent,
  IonIcon,
  IonCard,
} from "@ionic/vue";
import CardWImg from "@/components/cards/CardWImg.vue";
import ServicesGroupButton from "@/components/buttons/ServicesGroupButton.vue";
import HeaderUser from "@/components/header/HeaderUser.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import { defineComponent } from "vue";
import { getThemeData } from "@/theme/theme";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { GlobalConstants } from "@/config/constants";
import axios from "axios";
const baseURL = GlobalConstants.HOST_URL;
// const empNumber = GlobalConstants.EMPLOYEE_ID;

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonText,
    IonContent,
    IonIcon,
    CardWImg,
    ServicesGroupButton,
    HeaderUser,
    Refresher,
    IonCard,
  },
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    return {
      loading: true,
      headerTitle: "Services",
      cardHeader: "",
      cardText: "",
      img_src: "assets/images/card_img2.png",
      theme: {},
      firstName: "User",
      empNumber: ""
    };
  },
  methods: {
    // Exppiration of token
    async checkTokenExpiration() {
      const storedToken = localStorage.getItem("_token");

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
    async userDetails() {
      try {
        this.store.commit("loader/updateLoader", true);
        await this.checkTokenExpiration();

        this.storedToken = localStorage.getItem("_token");
        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };

        const api =
          baseURL + `api/v2/pim/employees/${this.empNumber}/personal-details`;
        const dataResponse = await axios.get(api, { headers });

        if (
          dataResponse.data &&
          dataResponse.data.data &&
          dataResponse.data.data.firstName
        ) {
          this.firstName = dataResponse.data.data.firstName;
        } else {
          console.error(
            "Error: Unable to retrieve first name from the response."
          );
        }
      } catch (error) {
        console.error("Error fetching user details: ", error);
      } finally {
        this.cardHeader = "Hello, " + this.firstName + "!";
        // incase there is another lines for this text here.
        this.cardText =
          "Welcome to ESS (Employee Self-Service). Feel free to explore or ask any questions. Wishing you a wonderful day!";
        this.store.commit("loader/updateLoader", false);
        this.loading = false;
      }
    },
  },
  created() {
    this.empNumber = localStorage.getItem('empNumber');
    this.checkTokenExpiration();
    const storedThemeData = getThemeData();

    this.theme = storedThemeData;

    this.userDetails(this.firstName);
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Inter");
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
@import url("https://fonts.googleapis.com/css?family=Roboto");

.flex-center {
  display: flex;
  justify-content: center;
  width: 100%;
}

ion-text .title {
  width: 120px;
  margin: 0;
  color: var(--ion-text-color);
  font-family: Open Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
}
.card {
  height: 55px;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  gap: 7px;
  border-radius: 10px;
}

.card h3 {
  padding: 0;
  margin: 0;
  color: var(--oil-11, #0d0d0d);
  font-family: Open Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.img-container {
  width: fit-content;
  height: 139px;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0px 4px 3px 0px rgb(175, 175, 175);
  margin: 10px auto;
}

.header {
  background-color: var(--ion-color-blue-theme);
  height: 120px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 0 40px 40px;
  padding: 0 29px;
  box-shadow: none;
  text-align: center;
}
.icon1 {
  font-size: 30px;
  color: var(--ion-color-primary-contrast);
}
.icon2 {
  font-size: 30px;
  color: var(--ion-color-primary-contrast);
}

.space {
  margin: 7px;
}

.flex-inline {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 0;
  padding: 0;
  height: 20px;
}
.text-bold {
  color: #000;
  font-family: Open Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}

.text-orange {
  color: #f2994a;
  font-family: Open Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.card-top {
  padding: 0 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  box-shadow: 0px 4px 3px 0px rgb(175, 175, 175);
  width: fit-content;
  margin-right: auto;
  margin-left: auto;

  position: absolute;
  top: 80px;
}
.card-bottom {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0px 4px 3px 0px rgb(175, 175, 175);
  width: fit-content;
  margin-right: auto;
  margin-left: auto;
  margin-top: 50px;
  gap: 10px;
}
.img {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.time {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
.box {
  background-color: #feeded;
  height: 50px;
  width: 50px;
  border-radius: 5px;
}
.box h2 {
  display: flex;
  justify-content: right;
  align-items: center;
  height: 100%;
  padding: 5px;
  color: #00003d;
  margin: 0;
}
.time-text {
  color: #000;
}
.text-clock {
  color: #000;
  text-align: center;
  font-family: Open Sans;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.btn-clock {
  border-radius: 15px;
  background-color: #12a3da;
  color: #fff;
  width: 232px;
  height: 50px;
  overflow: hidden;
  font-family: Open Sans;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.btn-center {
  text-align: center;
  margin-top: 30px;
}
.services-card {
  border-radius: 20px;
  padding: 10px;
  width: fit-content;
  min-width: 350px;
  margin-top: 10px;
}
</style>
