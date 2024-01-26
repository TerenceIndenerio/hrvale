<template>
  <ion-header
    class="header"
    color="none"
    :style="{ backgroundColor: headerColor }"
  >
    <img :src="imgLogo" alt="Logo" class="logo" />

    <ion-icon
    name="notifications"
    class="icon1"
    @click="rotateIcon"
    :class="{ 'rotateIcon': rotationState === 'rotateIcon' }"
    :key="rotationState"
  ></ion-icon>

    <div class="profile-img-container">
      <img :src="profileImg" alt="" />
    </div>
  </ion-header>
  
  <ion-popover
    :is-open="popoverOpen"
    :event="event"
    @didDismiss="popoverOpen = false"
    class="ion-popover-container"
  >
    <div class="popup-container">
      <ion-button
        class="btn"
        color="none"
        expand="full"
        :style="{ backgroundColor: headerColor }"
        @click="navigateAcctSettings"
      >
      <ion-icon name="key-outline"></ion-icon> Token</ion-button>
    </div>
  </ion-popover>
</template>

<script>
import {
  IonHeader,
  IonIcon,
  IonPopover,
  IonContent,
  IonButton,
} from "@ionic/vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { defineProps, defineComponent } from "vue";
import { GlobalConstants } from "@/config/constants";

export default defineComponent({
  components: {
    IonHeader,
    IonIcon,
    IonPopover,
    IonContent,
    IonButton,
  },
  props: {
    headerTitle: String,
    headerColor: String,
    imgLogo: String,
  },
  data() {
    return {
      popoverOpen: false,
      event: null,
      profile: "",
      defaultProfile: `https://ionicframework.com/docs/img/demos/avatar.svg`,
      profileImg: "",
      empNumber: "",
      rotationState: 'initial'
    };
  },
  methods: {
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
    hasProfile() {
      this.profile = `https://hrp-staging-delta.bapplware.com/web/index.php/employee/photo/${this.empNumber}`
      this.profileImg = this.profile ? this.defaultProfile : this.profile;
    },
    navigateAcctSettings() {
      this.$router.push("/tabs/accsettings");
      this.popoverOpen = false;
    },
    async rotateIcon() {
      this.rotationState = 'rotateIcon';
      await new Promise(resolve => setTimeout(resolve, 300));
      this.rotationState = 'initial';
    },
  },
  created() {
    this.empNumber = localStorage.getItem('empNumber');
    this.hasProfile();
    
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Inter");
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
@import url("https://fonts.googleapis.com/css?family=Roboto");

.header {
  background-color: #12a3da;
  height: 120px;
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
  top: 40px;
  left: 0;
  right: 0;
  margin: auto;
}

.rotateIcon {
  animation: rotateKeyframes .3s ease-in-out;
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
