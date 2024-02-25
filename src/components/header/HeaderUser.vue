<template>
  <ion-header
    class="header"
    color="none"
    :style="{ backgroundColor: headerColor }"
  >
    <img :src="this.logo" alt="Logo" class="logo" />

    <ion-icon
      name="notifications"
      class="icon1"
      @click="rotateIcon"
      :class="{ rotateIcon: rotationState === 'rotateIcon' }"
      :key="rotationState"
    ></ion-icon>

    <div class="profile-img-container" @click="openProfileModal">
      <img :src="profileImageUrl" alt="" />
    </div>
  </ion-header>

  <ion-modal :is-open="isOpen" id="modal">
    <ion-card class="card-modal">
      <ion-icon
        @click="isOpen = false"
        name="close"
        color="danger"
        class="close-btn"
      ></ion-icon>

      <div class="modal-content">
        <h3>{{ this.profileDetails.userName }}</h3>
        <div>
          <img :src="profileImageUrl" alt="" class="profile-img" />
        </div>

        <h3>
          {{ this.profileDetails.employee.firstName }}
          {{ this.profileDetails.employee.middleName }}
          {{ this.profileDetails.employee.lastName }}
        </h3>
        <div class="location-container">
          <div>
            <ion-icon name="location" class="location-icon"></ion-icon>
          </div>
          <div>
            <p>
              {{ this.profileDetails.subunit }}
            </p>
            <p>
              {{ this.profileDetails.location }}
            </p>
          </div>
        </div>
      </div>
    </ion-card>
  </ion-modal>
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
    // logo: String,
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
    };
  },
  created() {
    const empNumber = localStorage.getItem("empNumber");
    this.fetchProfilePhoto(empNumber);
    this.fetchProfileDirectory();
    this.fetchLogo();
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
      localStorage.removeItem("_token");
      localStorage.removeItem("pincodeId");
      this.$router.push("/login");
      this.popoverOpen = false;
    },
    fetchLogo() {
      const baseURL = "https://hrp-uat-app.bapplware.com/web/index.php/";
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

    navigateAcctSettings() {
      this.$router.push("/tabs/accsettings");
      this.popoverOpen = false;
    },
    async fetchProfileDirectory() {
      try {
        const adminUserDetails = localStorage.getItem("adminUserDetails");
        this.profileDetails = JSON.parse(adminUserDetails);
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async rotateIcon() {
      this.rotationState = "rotateIcon";
      await new Promise((resolve) => setTimeout(resolve, 300));
      this.rotationState = "initial";
    },
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Inter");
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
@import url("https://fonts.googleapis.com/css?family=Roboto");

.header {
  background-color: #12a3da;
  height: 100px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 0 0 40px 40px;
  box-shadow: none;
  text-align: center;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.2),
    -8px -8px 16px rgba(255, 255, 255, 0.8), 0px -4px 8px rgba(0, 0, 0, 0.1);
}
.profile-img-container {
  width: 30px;
  height: 30px;
  overflow: hidden;
  border-radius: 50%;
  outline: 3px solid white;
  position: absolute;
  left: 20px;
  font-size: 25px;
  background-color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.8),
    0 2px 4px -1px rgba(0, 0, 0, 0.6);
}
.profile-img-container img {
  width: 30px;
  height: 30px;
}
.icon1 {
  position: absolute;
  right: 20px;
  font-size: 20px;
  outline: 3px solid white;
  border-radius: 100%;
  padding: 3px;
  color: var(--ion-color-primary-contrast);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.8),
    0 2px 4px -1px rgba(0, 0, 0, 0.6);
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
  width: 250px;
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  margin: auto;
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
}

.card-modal {
  border-radius: 20px;
  max-width: 400px;
  margin-top: 50%;
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
  align-items: center;
  text-align: left;
  background-color: rgb(239, 239, 239);
  border-radius: 10px;
  padding: 10px;
}
.location-container p {
  margin: 0;
  padding: 0;
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
