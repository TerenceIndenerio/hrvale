<template>
  <ion-header class="header-container" color="none">
    <img
      :src="'https://www.jdldavao.com/wp-content/uploads/2019/09/jobscloud.jpg'"
      alt="Logo"
      class="logo"
    />

    <div class="notif-bell-container">
      <div class="redDot" v-if="newNotif"></div>
      <ion-icon
        name="notifications"
        class="icon1"
        @click="rotateIcon"
        :class="{ rotateIcon: rotationState === 'rotateIcon' }"
        :key="rotationState"
        :style="{
          color: headerColor,
        }"
      >
      </ion-icon>
    </div>

    <div
      class="profile-img-container"
      :style="{
        outline: `3px solid ${headerColor}`,
      }"
      @click="openProfileModal"
    >
      <img :src="profileImageUrl" alt="" />
    </div>
    <ion-modal :is-open="isOpen" id="modal">
      <ion-card class="card-modal">
        <ion-icon
          @click="isOpen = false"
          name="close"
          color="danger"
          class="close-btn"
        >
        </ion-icon>

        <div class="modal-content">
          <div>
            <img :src="profileImageUrl" alt="" class="profile-img" />
          </div>

          <h3>
            {{ this.profileDetails.firstName }}
            {{ this.profileDetails.middleName }}
            {{ this.profileDetails.lastName }}
          </h3>
          <h3>{{ this.myProfileDetails.userRole.displayName }}</h3>

          <div class="location-container">
            <p>
              Name: {{ this.myProfileDetails.employee.firstName }}
              {{ this.myProfileDetails.employee.middleName }}
              {{ this.myProfileDetails.employee.lastName }}
            </p>
            <p>
              Employee Number: {{ this.myProfileDetails.employee.empNumber }}
            </p>
            <p>Employee ID: {{ this.myProfileDetails.employee.employeeId }}</p>
            <p>Username: {{ this.myProfileDetails.userName }}</p>
          </div>
        </div>
      </ion-card>
    </ion-modal>
  </ion-header>
</template>

<script>
import {
  IonHeader,
  IonIcon,
  IonPopover,
  IonContent,
  IonButton,
  IonCard,
  IonModal,
} from "@ionic/vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { defineProps, defineComponent } from "vue";
import { GlobalConstants } from "@/config/constants";
import axios from "axios";

export default defineComponent({
  components: {
    IonHeader,
    IonIcon,
    IonPopover,
    IonContent,
    IonButton,
    IonCard,
    IonModal,
  },
  props: {
    headerTitle: String,
    headerColor: String,
  },
  data() {
    return {
      popoverOpen: false,
      event: null,
      profile: "",
      defaultProfile: `https://ionicframework.com/docs/img/demos/avatar.svg`,
      profileImageUrl: "",
      empNumber: "",
      rotationState: "initial",
      isOpen: false,
      firstName: "",
      middleName: "",
      lastName: "",
      jobTitle: "",
      subunit: "",
      location: "",
      profileDetails: "",
      logo: "",
      myProfileDetails: "",
      newNotif: "",
    };
  },
  created() {
    const empNumber = localStorage.getItem("empNumber");
    this.fetchProfilePhoto(empNumber);
    this.fetchProfileDirectory();
    this.fetchLogo();
    this.fetchNotification();
  },
  methods: {
    openProfileModal() {
      this.isOpen = true;
    },
    openPopover(e) {
      this.event = e;
      this.popoverOpen = true;
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("pincodeId");
      this.$router.push("/login");
      this.popoverOpen = false;
    },
    fetchLogo() {
      const baseURL = localStorage.getItem("baseUrl");

      this.logo = baseURL + "admin/theme/image/clientBanner";
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
        this.profileImageUrl = URL.createObjectURL(blob);

        localStorage.setItem("profileImageUrl", this.profileImageUrl);
      } catch (error) {
        console.error("Error:", error);
        return null;
      }
    },

    async fetchNotification() {
      try {
        const baseURL = localStorage.getItem("baseUrl");
        const storedToken = localStorage.getItem("token");
        const apiUrl = `${baseURL}api/push-notification/messages`;
        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const response = await axios.get(apiUrl, { headers });
        const notifications = response.data.data;

        if (notifications) {
          const currentTime = new Date();
          const currentFormattedTime = currentTime.toLocaleTimeString("en-US", {
            hour12: false,
          });

          notifications.forEach((notification) => {
            if (notification.dateCreated) {
              const dateCreated = new Date(notification.dateCreated.date);
              const formattedDateCreatedTime = dateCreated.toLocaleTimeString(
                "en-US",
                { hour12: false }
              );

              const timeDifference = (currentTime - dateCreated) / (1000 * 60);

              if (timeDifference <= 30) {
                this.newNotif = true;
              }
            }
          });
        }
      } catch (error) {
        console.error("Error:", error);
        return null;
      }
    },

    navigateAcctSettings() {
      this.$router.push("/tabs/accsettings");
      this.popoverOpen = false;
    },
    navigateNotification() {
      this.$router.push("/suysing_notification");
    },
    async fetchProfileDirectory() {
      try {
        const myDetails = localStorage.getItem("myDetails");

        this.myProfileDetails = JSON.parse(myDetails);
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async rotateIcon() {
      this.rotationState = "rotateIcon";
      await new Promise((resolve) => setTimeout(resolve, 300));
      this.navigateNotification();
      this.rotationState = "initial";
    },
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Inter");
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
@import url("https://fonts.googleapis.com/css?family=Roboto");

.header-container {
  background-color: #ffffff;
  height: 100px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-shadow: none;
  -webkit-box-shadow: none;
  text-align: center;
  border-radius: 0 0 50px 50px;
  -webkit-border-radius: 0 0 50px 50px;
}

.profile-img-container {
  width: 30px;
  height: 30px;
  overflow: hidden;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  position: absolute;
  top: 35px;
  right: 70px;
  font-size: 25px;
  background-color: white;
  box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.8),
    0px 2px 4px -1px rgba(0, 0, 0, 0.6);
  -webkit-box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.8),
    0px 2px 4px -1px rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.profile-img-container img {
  width: 30px;
  height: 30px;
}
.icon1 {
  font-size: 30px;
  border: 3px solid white;
  border-radius: 100%;
  color: var(--ion-color-primary-contrast);
  transition: transform 0.3s ease-out;
}

.icon2 {
  font-size: 30px;
  color: var(--ion-color-primary-contrast);
}
.title {
  color: var(--ion-color-primary-contrast);
  text-align: center;
  font-family: var(--ion-font-font2);
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
ion-popover {
  --width: fit-content;
}

.btn {
  margin: 0;
  height: 50px;
  width: 150px;
}
.pop-container {
  width: fit-content;
}
.logout-btn {
  background-color: #12a3da;
}
.logo {
  width: 200px;
  position: absolute;
  top: 20px;
  left: 5px;
  padding: 0 5px;
}

.rotateIcon {
  animation: rotateKeyframes 0.3s ease-in-out;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 10px;
  width: 30px;
  height: 30px;
  padding: 0;
  margin: 0;
  box-shadow: var(--neomorphism-convex-4);
  border-radius: 50%;
  background-color: rgb(246, 246, 246);
  overflow: hidden;
}

#modal {
  --background: rgba(255, 0, 0, 0);
  --width: 100vw;
  --height: 100vh;
}

.card-modal {
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  margin: auto auto;
  padding: 20px 30px;
}

.modal-content {
  margin-top: 20px;
  text-align: center;
}

.profile-img {
  border-radius: 50%;
}

.location-icon {
  font-size: 40px;
}
.location-container {
  display: flex;
  flex-direction: column;
  text-align: left;
  background-color: rgb(239, 239, 239);
  border-radius: 10px;
  padding: 10px;
}
.location-container p {
  margin: 0;
  padding: 0;
}
.redDot {
  background-color: red;
  width: 15px;
  height: 15px;
  border-radius: 100%;
  position: absolute;
  right: 0px;
  top: 0;
  z-index: 1;
}
.notif-bell-container {
  position: absolute;
  top: 30px;
  right: 20px;
  padding: 3px;
}

@keyframes rotateKeyframes {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-20deg);
  }
  100% {
    transform: rotate(20deg);
  }
}
</style>
