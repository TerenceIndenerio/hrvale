<template>
  <div class="header" :style="{ backgroundColor: headerColor }">
    <ion-icon
      name="arrow-back-outline"
      class="icon1"
      @click="navigateBack"
      router-direction="forward"
    ></ion-icon>

    <h2 class="title">{{ headerTitle }}</h2>

    <ion-icon
      name="notifications"
      class="icon2"
      color="light"
      @click="rotateIcon"
      :class="{ rotateIcon: rotationState === 'rotateIcon' }"
      :key="rotationState"
    ></ion-icon>
  </div>
  <ion-popover
    :is-open="popoverOpen"
    :event="event"
    @didDismiss="popoverOpen = false"
    class="ion-popover-container"
  >
    <div class="popup-container">
      <ion-button
        class="btn"
        fill="clear"
        expand="full"
        @click="navigateAcctSettings()"
        ><ion-icon name="settings-outline"></ion-icon> Settings</ion-button
      >
      <ion-button
        class="btn logout-btn"
        expand="full"
        color="none"
        @click="logout()"
        :style="{ backgroundColor: headerColor }"
        ><ion-icon name="exit-outline"></ion-icon> Log Out</ion-button
      >
    </div>
  </ion-popover>
</template>

<script>
import { IonHeader, IonIcon, IonPopover, IonButton } from "@ionic/vue";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import { defineProps, defineComponent } from "vue";

export default defineComponent({
  components: {
    IonHeader,
    IonIcon,
    IonPopover,
    IonButton,
  },
  props: {
    headerTitle: String,
    headerColor: String,
    headerTextColor: String,
  },
  data() {
    return {
      popoverOpen: false,
      event: null,
      rotationState: "initial",
    };
  },
  methods: {
    navigateBack() {
      this.$router.go(-1);
    },
    openPopover(e) {
      this.event = e;
      this.popoverOpen = true;
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
      this.popoverOpen = false;
    },
    navigateAcctSettings() {
      console.log("changed");
      this.$router.push("/tabs/accsettings");
      this.popoverOpen = false;
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
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 2;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.2),
    -8px -8px 16px rgba(255, 255, 255, 0.8), 0px -4px 8px rgba(0, 0, 0, 0.1);
}
.icon1 {
  font-size: 30px;
  color: var(--ion-color-primary-contrast);
  transition: transform 0.2s ease;
}
.icon1:hover {
  transform: scale(0.5);
}
.icon2 {
  right: 20px;
  font-size: 25px;
  border-radius: 100%;
  padding: 3px;
  color: var(--ion-color-primary-contrast);

  transition: transform 0.7s ease;
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
.settings-icon {
  font-size: 25px;
  transition: transform 0.7s ease;
}

.settings-icon:hover {
  transform: rotate(360deg);
}

ion-popover {
  --width: fit-content;
}
.btn {
  margin: 0;
  height: 50px;
  width: 150px;
}
.logout-btn {
  background-color: #12a3da;
}

.rotateIcon {
  animation: rotateKeyframes 0.3s ease-in-out;
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
