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
        <ion-card class="neomorphic-card-1 card-box">
          <div class="card-header">
            <div class="author">
              <div class="profile-img-card">
                <img :src="cardData.profileImg" alt="" />
              </div>
              <div>
                <div>
                  <p class="author-name">{{ cardData.employee }}</p>
                </div>
                <div>
                  <p class="date-time">
                    {{ cardData.date }} {{ cardData.time }}
                  </p>
                </div>
              </div>
            </div>
            <div class="caption">
              <p>{{ cardData.text }}</p>
            </div>
          </div>

          <div class="card-content">
            <div
              :class="{
                'img-content': true,
                'fit-content': cardData.photoLink,
              }"
            >
              <ion-spinner
                name="dots"
                v-if="!cardData.photoLink"
                class="spinner"
              ></ion-spinner>

              <img :src="cardData.photoLink" alt="" />
            </div>
          </div>

          <div class="action-btn-container">
            <div class="action-btn">
              <ion-icon name="heart" class="action-icon"></ion-icon>
              {{ cardData.numOfLikes }}
            </div>
          </div>
        </ion-card>
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
  IonSpinner,
  IonCard,
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
    IonSpinner,
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
            const profileImg = await this.fetchProfilePhoto(
              data.employee.empNumber
            );
            return {
              id: data.id,
              employee: `${data.employee.firstName} ${data.employee.middleName} ${data.employee.lastName}`,
              text: data.text,
              numOfLikes: data.stats.numOfLikes,
              numOfShares: data.stats.numOfShares,
              photoIds: data.photoIds,
              date: data.createdDate,
              time: data.createdTime,
              postId: data.post.id,
              empNumber: data.employee.empNumber,
              profileImg: profileImg,
            };
          });

          this.newsFeed = await Promise.all(promises);
          this.hasNews = this.newsFeed.length > 0;

          this.fetchImagesForNewsFeed();
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        this.hasNews = true;
      }
    },

    async fetchImagesForNewsFeed() {
      try {
        const imagePromises = this.newsFeed.map(async (cardData, index) => {
          try {
            const photoLink = await this.fetchPhotoLink(cardData.photoIds);
            const img = new Image();
            img.src = photoLink;
            img.onload = () => {
              this.newsFeed[index] = { ...cardData, photoLink };
            };
            img.onerror = (error) => {
              console.error("Error loading image:", error);
            };
          } catch (error) {
            console.error("Error fetching photo link:", error);
          }
        });

        await Promise.all(imagePromises);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    },

    fetchPhotoLink(photoIds) {
      return new Promise((resolve, reject) => {
        try {
          this.photoLinkLoading = true;

          const storedToken = localStorage.getItem("token");
          console.log(storedToken);
          const baseURL = localStorage.getItem("baseUrl");
          const apiUrl = baseURL + `buzz/photo/${photoIds}`;

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
        const baseURL = localStorage.getItem("baseUrl");
        const storedToken = localStorage.getItem("token");

        const apiUrl = baseURL + `pim/viewPhoto/empNumber/${empNumber}`;

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
        console.log("Stored theme data:", storedThemeData);

        const themeData = storedThemeData ? JSON.parse(storedThemeData) : [];
        console.log("Parsed theme data:", themeData);

        let themeConfiguration = null;

        for (const data of themeData) {
          if (data.configuration && data.configuration.theme) {
            themeConfiguration = data.configuration.theme;
            break;
          }
        }

        if (themeConfiguration) {
          console.log("Theme configuration:", themeConfiguration);

          this.theme = themeConfiguration;
          console.log("Theme:", this.theme);
        } else {
          console.error(
            "No theme data found in local storage or theme configuration not available."
          );
        }
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

/*  */
.card-box p {
  padding: 0;
  margin: 0;
}
.badge-container {
  padding: 0;
  margin: 0;
  border-radius: 20px 0 0 20px;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
}
.badge-container p {
  padding: 5px 10px;
  margin: 0;
}

.col-label {
  color: #585b5f;
  font-family: Open Sans;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 107.682%;
}
.col-data {
  color: #0d0d0d;
  font-family: Open Sans;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 107.682%;
}
.card-content {
  margin: 0 10px 10px 10px;
}
.card-box {
  width: 90%;
  max-width: 500px;
  margin: 10px auto 20px auto;
  padding: 0;
}
.action-container {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.action-btn-container {
  margin: 10px 0;
  width: 100%;
  display: flex;
  justify-content: center;
}
.action-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 2px;
}
.author-name {
  font-size: 14px;
  font-weight: 700;
}
.date-time {
  font-size: 12px;
}
.card-header {
  padding: 10px;
}
.author {
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 10px;
}
.profile-img-card {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  border: 2px solid rgb(207, 207, 207);
  overflow: hidden;
  display: flex;
  justify-content: center;
}
.img-content {
  height: fit-content;

  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--neomorphism-concave-2);
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fit-content {
  width: fit-content;
  margin: 0 auto;
}

.action-icon {
  font-size: 25px;
}
.spinner {
  width: 50px;
  height: 50px;
}
</style>
