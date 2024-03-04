<template>
  <ion-header class="header" :style="{ backgroundColor: headerColor }">
    <ion-icon
      name="arrow-back-outline"
      class="icon1"
      @click="navigateBack"
    ></ion-icon>
    <h2 class="title" :style="{ color: headerTextColor }">{{ headerTitle }}</h2>

    <ion-icon
      name="notifications"
      class="icon2"
      color="light"
      @click="rotateIcon"
      :class="{ rotateIcon: rotationState === 'rotateIcon' }"
      :key="rotationState"
    ></ion-icon>
    <ion-card class="card-top">
      <div class="flex-inline">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="17"
          viewBox="0 0 20 17"
          fill="none"
        >
          <path
            d="M10 0C4.47581 0 0 3.80444 0 8.5C0 13.1956 4.47581 17 10 17C15.5242 17 20 13.1956 20 8.5C20 3.80444 15.5242 0 10 0ZM12.3024 11.9994L8.74597 9.80242C8.62097 9.72359 8.54839 9.6002 8.54839 9.46996V3.70161C8.54839 3.4754 8.76613 3.29032 9.03226 3.29032H10.9677C11.2339 3.29032 11.4516 3.4754 11.4516 3.70161V8.42117L14.0121 10.0046C14.2298 10.1383 14.2742 10.3954 14.1169 10.5804L12.9798 11.9103C12.8226 12.0919 12.5202 12.1331 12.3024 11.9994Z"
            fill="#F2994A"
          />
        </svg>
        <p class="text-bold">HOURS</p>
      </div>
      <div class="flex-inline">
        <p class="text-orange">Clock In :</p>
        <p class="text-bold">{{ clockin }}</p>
      </div>
      <div class="flex-inline">
        <p class="text-orange">Clock Out :</p>
        <p class="text-bold">{{ clockout }}</p>
      </div>
    </ion-card>
  </ion-header>
  <ion-popover
    :is-open="popoverOpen"
    :event="event"
    @didDismiss="popoverOpen = false"
    class="ion-popover-container"
  >
    <div class="popup-container">
      <ion-button class="btn" fill="clear" expand="full"
        ><ion-icon name="person-circle-outline"></ion-icon> Profile</ion-button
      >
      <ion-button
        class="btn logout-btn"
        expand="full"
        color="none"
        @click="logout"
        :style="{ backgroundColor: headerColor }"
        ><ion-icon name="exit-outline"></ion-icon> Log Out</ion-button
      >
    </div>
  </ion-popover>
</template>

<script>
import { IonHeader, IonIcon, IonCard, IonPopover, IonButton } from "@ionic/vue";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import { defineProps, defineComponent } from "vue";

export default defineComponent({
  components: {
    IonHeader,
    IonIcon,
    IonCard,
    IonPopover,
    IonButton,
  },
  props: {
    headerTitle: String,
    clockin: String,
    clockout: String,
    headerColor: String,
    headerTextColor: String,
  },
  setup() {
    const router = useRouter();
    const popoverOpen = ref(false);
    const event = ref(null);

    const openPopover = (e) => {
      event.value = e;
      popoverOpen.value = true;
    };

    const logout = () => {
      localStorage.removeItem("token");
      router.push("/login");
      popoverOpen.value = false;
    };

    return {
      popoverOpen,
      openPopover,
      logout,
      event,
    };
  },
  data() {
    return {
      rotationState: "initial",
    };
  },
  methods: {
    navigateBack() {
      this.$router.go(-1);
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
/* specifics */
.header {
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
  left: 0;
  right: 0;
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

.card {
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80vw;
  margin: 0 auto;
  padding-left: 10px;
  position: absolute;
  left: 0;
  right: 0;
  top: 90px;
}
.container-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
}
.card-text-container h3,
h4 {
  padding: 0;
  margin: 0;
}
.card-text-container h3 {
  color: #5a5656;
  text-align: center;
  font-family: "Open Sans";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.card-text-container h4 {
  color: #000;
  text-align: center;
  font-family: "Open Sans";
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.container-right {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 20px;
  background-color: #eed709;
  padding: 0px 10px;
}
.container-right h1 {
  color: #fff;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
  font-size: 32px;
  font-weight: 800;
  margin: 0;
}
.container-right p {
  color: #797979;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0);
  font-family: Open Sans;
  font-size: 12px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
}
.settings-icon {
  font-size: 25px;
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
