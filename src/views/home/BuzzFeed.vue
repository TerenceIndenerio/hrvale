<template>
  <ion-page>
    <HeaderUser
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
    ></HeaderUser>
    <ion-content :fullscreen="true">
      <Refresher />

      <div class="buzz-action-btn-container">
        <ion-button
          color="none"
          :style="{ color: isActive('recent') ? theme.secondaryColor : 'gray' }"
          class="neomorphic-btn-3 buzz-action-btn"
          :class="
            isActive('recent')
              ? 'neomorphic-btn-3-inactive'
              : 'neomorphic-btn-3'
          "
          @click="setActive('recent')"
        >
          <ion-icon
            name="time"
            class="buzz-action-btn-icon"
            :style="{
              color: isActive('recent') ? theme.secondaryColor : 'gray',
            }"
          ></ion-icon>
          <span v-if="isActive('recent')">Recent Post</span>
        </ion-button>

        <ion-button
          color="none"
          :style="{ color: isActive('react') ? theme.secondaryColor : 'gray' }"
          class="neomorphic-btn-3 buzz-action-btn"
          :class="
            isActive('react') ? 'neomorphic-btn-3-inactive' : 'neomorphic-btn-3'
          "
          @click="setActive('react')"
        >
          <ion-icon
            name="heart"
            class="buzz-action-btn-icon"
            :style="{
              color: isActive('react') ? theme.secondaryColor : 'gray',
            }"
          ></ion-icon>
          <span
            v-if="isActive('react')"
            :style="{
              color: isActive('react') ? theme.secondaryColor : 'gray',
            }"
            >Most React</span
          >
        </ion-button>
      </div>

      <div class="no-news-container" v-if="!hasNews">
        <BuzzFeedCardEmpty />
      </div>

      <div v-for="(cardData, index) in newsFeed" :key="index">
        <BuzzFeedCard
          :caption="cardData.text"
          :name="cardData.employee"
          :numOfLikes="cardData.numOfLikes"
          :numOfShares="cardData.numOfShares"
          :photoIds="cardData.photoIds"
          :photoLink="cardData.photoLink"
          :date="cardData.date"
          :time="cardData.time"
          :postId="cardData.postId"
          :empNumber="cardData.empNumber"
          :profileImg="cardData.profileImg"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  toastController,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import GreetingsCard from "@/views/home/components/GreetingsCard.vue";
import HeaderUser from "@/components/header/HeaderUser.vue";
import CardWImgHome from "@/components/cards/CardWImgHome.vue";
import ClockinCard from "@/components/cards/HomeClockInCard.vue";
import HomeRandomCard from "@/components/cards/HomeRandomCard.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import axios from "axios";
import { defineComponent } from "vue";
import { mapMutations } from "vuex";
import { getThemeData } from "@/theme/theme";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { GlobalConstants } from "@/config/constants";
import { PushNotifications } from "@capacitor/push-notifications";
import BuzzFeedCard from "@/views/home/components/BuzzFeedCard.vue";
import BuzzFeedCardEmpty from "@/views/home/components/BuzzFeedCardEmpty.vue";
import { IonImg } from "@ionic/vue";
import { newToken } from "@/store/token/newToken.ts";

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    HeaderUser,
    CardWImgHome,
    ClockinCard,
    HomeRandomCard,
    Refresher,
    toastController,
    BuzzFeedCard,
    IonImg,
    GreetingsCard,
    IonButton,
    IonIcon,
    BuzzFeedCardEmpty,
  },
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    return {
      headerTitle: "Home",
      cardHeader: "Buzz NewsFeed",
      cardText: "",
      img_src: "assets/images/card_img1.png",
      theme: {},
      btnText: "Clock In",
      orgData: [],
      extractedData: [],
      loading: true,
      imgLogo: "",
      newsFeed: [],
      caption: "",
      imageSrc: "",
      imgId: "",
      imageUrl: "",
      firstName: "",
      empNumber: null,
      activeButton: "recent",
      baseUrl: "",
      profileDetails: "",
      hasNews: false,
      isReloaded: false,
    };
  },
  methods: {
    ...mapMutations("loader", ["updateLoader"]),

    async fetchNewsFeed(filterVal) {
      try {
        this.hasNews = false;

        const storedToken = localStorage.getItem("token");
        const apiUrl = this.baseURL + filterVal;
        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const dataResponse = await axios.get(apiUrl, { headers });

        if (dataResponse.data && Array.isArray(dataResponse.data.data)) {
          const promises = dataResponse.data.data.map(async (data) => {
            const photoLinkPromise = this.fetchPhotoLink(data.photoIds);
            const profileImg = await this.fetchProfilePhoto(
              data.employee.empNumber
            );

            const photoLink = await photoLinkPromise;
            return {
              id: data.id,
              employee:
                data.employee.firstName +
                " " +
                data.employee.middleName +
                " " +
                data.employee.lastName,
              text: data.text,
              numOfLikes: data.stats.numOfLikes,
              numOfShares: data.stats.numOfShares,
              photoIds: data.photoIds,
              photoLink: photoLink,
              date: data.createdDate,
              time: data.createdTime,
              postId: data.post.id,
              empNumber: data.employee.empNumber,
              profileImg: profileImg,
            };
          });

          this.newsFeed = await Promise.all(promises);

          this.hasNews = this.newsFeed.length > 0;
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        this.hasNews = true;
      }
    },

    fetchPhotoLink(photoIds) {
      return new Promise((resolve, reject) => {
        try {
          this.photoLinkLoading = true;

          const storedToken = localStorage.getItem("token");
          const apiUrl = `https://hrp-uat-app.bapplware.com/web/index.php/buzz/photo/${photoIds}`;

          const headers = {
            Authorization: `Bearer ${storedToken}`,
          };

          axios
            .get(apiUrl, {
              headers,
              responseType: "blob",
            })
            .then((response) => {
              const blob = response.data;
              const imageUrl = URL.createObjectURL(blob);
              resolve(imageUrl);
            })
            .catch((error) => {
              console.error("Error fetching photo link:", error);
              reject(null);
            })
            .finally(() => {
              this.photoLinkLoading = false;
            });
        } catch (error) {
          console.error("Error fetching photo link:", error);
          reject(null);
          this.photoLinkLoading = false;
        }
      });
    },

    async fetchProfilePhoto(empNumber) {
      try {
        const storedToken = localStorage.getItem("token");

        const apiUrl = `https://hrp-uat-app.bapplware.com/web/index.php/pim/viewPhoto/empNumber/${empNumber}`;

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const response = await axios.get(apiUrl, {
          headers,
          responseType: "blob",
        });
        const blob = response.data;

        const profileImageUrl = URL.createObjectURL(blob);

        return profileImageUrl;
      } catch (error) {
        console.error("Error:", error);
        return null;
      }
    },

    async getSharedData(postId) {
      try {
        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
          console.log("Token is missing. Redirecting to login...");
          this.router.push("/login");
          return;
        }

        const apiUrl = this.baseURL + `api/v2/buzz/shares/${postId}/likes`;

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };
        const dataResponse = await axios.get(apiUrl, { headers });
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async fetchData() {
      try {
        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
          console.log("Token is missing. Redirecting to login...");
          this.router.push("/login");
          return;
        }

        const apiUrl = this.baseURL + `api/v2/admin/organization`;

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const response = await axios.get(apiUrl, { headers });

        const extractedData = response.data.data;

        this.extractedData = extractedData;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async userDetails() {
      try {
        this.empNumber = localStorage.getItem("empNumber");
        this.store.commit("loader/updateLoader", true);

        this.storedToken = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${this.storedToken}`,
        };

        const api =
          this.baseURL +
          `api/v2/pim/employees/${this.empNumber}/personal-details`;
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
        this.cardText = "Hello, " + this.firstName + "!";
        this.loading = false;
      }
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

    isActive(buttonName) {
      return this.activeButton === buttonName;
    },
    setActive(buttonName) {
      this.activeButton = buttonName;

      if (buttonName === "react") {
        this.fetchNewsFeed(
          "api/v2/buzz/feed?limit=10&offset=0&sortOrder=DESC&sortField=share.numOfLikes"
        );
      } else if (buttonName === "react") {
        this.fetchNewsFeed(
          "api/v2/buzz/feed?limit=10&offset=0&sortOrder=DESC&sortField=share.createdAtUtc"
        );
      } else {
        this.fetchNewsFeed(
          "api/v2/buzz/feed?limit=10&offset=0&sortOrder=DESC&sortField=share.numOfComments"
        );
      }
    },
    fetchTheme() {
      try {
        const storedThemeData = localStorage.getItem("configs");
        const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};
        const theme = themeData[1]?.configuration?.theme;
        this.theme = theme;
      } catch (error) {
        console.error("Error fetching or parsing theme data:", error);
      }
    },

    checkToken() {
      const storedToken = localStorage.getItem("token");
      const storedRefereshToken = localStorage.getItem("refreshtoken");

      if (storedToken) {
        try {
          const decodedToken = JSON.parse(atob(storedToken.split(".")[1]));
          const currentTimestamp = Math.floor(Date.now() / 1000);

          if (decodedToken.exp && decodedToken.exp < currentTimestamp) {
            console.log("Token has expired");
            this.router.push("/login");
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      } else {
        console.log("No token found");
      }
    },
  },

  async mounted() {
    this.baseURL = localStorage.getItem("baseUrl");
    const adminUserDetails = localStorage.getItem("adminUserDetails");
    this.profileDetails = JSON.parse(adminUserDetails);
    this.checkToken();
    this.updateLoader(false);
    this.fetchData();
    this.fetchNewsFeed(
      "api/v2/buzz/feed?limit=10&offset=0&sortOrder=DESC&sortField=share.numOfComments"
    );
    this.fetchTheme();
    const token = localStorage.getItem("access_token");

    this.loading = false;

    console.log(localStorage.getItem("myDetails"));
  },
});
</script>

<style>
.buzz-action-btn-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  overflow: scroll;
  width: 100vw;
}
.buzz-action-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: gray;
}
.buzz-action-btn-icon {
  font-size: 20px;
  color: gray;
}

.no-news-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  /* margin: 50px 0; */
}

.greetings-container {
  margin: 10px 20px 30px 20px;
}
.greetings-inner-container {
  display: flex;
  flex-direction: column;
}

.greetings-inner-container p {
  padding: 0;
  margin: 0;
  font-family: Poppins;
  font-size: 16px;
  font-style: normal;
  font-weight: bold;
}

.greetings-inner-container h4 {
  padding: 0;
  margin: 0 0 0 10px;
  font-family: Poppins;
  font-size: 20px;
  font-style: normal;
  font-weight: 800;
}
</style>
