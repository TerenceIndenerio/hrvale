<template>
  <ion-page>
    <ion-content :scrollEvents="false" class="content-no-scroll">
      <div class="container">
        <svg
          class="svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          height="120%"
        >
          <defs>
            <linearGradient
              id="GradientColor"
              x1="319.566"
              y1="160.141"
              x2="220.468"
              y2="-119.498"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="-0.2421" stop-color="rgb(88, 189, 199)" />
              <stop offset="0.28127" stop-color="rgb(67, 184, 195)" />
              <stop offset="0.54295" stop-color="rgb(1, 141, 156)" />
              <stop offset="0.84626" stop-color="rgb(31, 80, 126)" />
            </linearGradient>
          </defs>
          <path
            fill="url(#GradientColor)"
            fill-opacity="1"
            d="M0,160L20,154.7C40,149,80,139,120,149.3C160,160,200,192,240,197.3C280,203,320,181,360,192C400,203,440,245,480,245.3C520,245,560,203,600,202.7C640,203,680,245,720,272C760,299,800,309,840,261.3C880,213,920,107,960,101.3C1000,96,1040,192,1080,224C1120,256,1160,224,1200,208C1240,192,1280,192,1320,197.3C1360,203,1400,213,1420,218.7L1440,224L1440,0L1420,0C1400,0,1360,0,1320,0C1280,0,1240,0,1200,0C1160,0,1120,0,1080,0C1040,0,1000,0,960,0C920,0,880,0,840,0C800,0,760,0,720,0C680,0,640,0,600,0C560,0,520,0,480,0C440,0,400,0,360,0C320,0,280,0,240,0C200,0,160,0,120,0C80,0,40,0,20,0L0,0Z"
          ></path>
        </svg>
        <img
          class="welcomeIMG3"
          src="https://res.cloudinary.com/dlbtxizrp/image/upload/v1709030876/Bappleware/Business_men_shaking_hands_after_a_successful_deal_wv9prz.png"
          alt="WelcomePage3IMG"
        />
      </div>
      <div class="lower-section">
        <ion-text class="text-container">
          <img
            class="logo"
            src="https://res.cloudinary.com/dlbtxizrp/image/upload/v1709031119/Bappleware/hr-vale-w-text-no-bg_1_scdug8.png"
            alt="HR Vale Logo"
          />
          <p class="description2">
            Automate tasks, boost engagement, and optimize HR operations for
            efficiency. With seamless mobile access, empower your workforce with
            easy VALE and cash advance applications.
          </p>
        </ion-text>
        <ion-button
          class="continue-button"
          fill="clear"
          @click="continueClicked"
          >Continue</ion-button
        >
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonPage,
  IonButton,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  components: { IonContent, IonPage, IonButton },
  setup() {
    const router = useRouter();

    const continueClicked = () => {
      // router.push('/login');
      router.push("/setuplogin");
    };

    return {
      continueClicked,
    };
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

.svg {
  position: fixed;
  top: 0%;
}
.container {
  height: 55vh;
}
.welcomeIMG3 {
  position: absolute;
}

.lower-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding: 2%;
}
.text-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5%;
}
.logo {
  margin: 0% 0 2vh 0;
}
.description2 {
  margin: 0%;
  color: rgb(87, 95, 107);
  font-family: Poppins;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0%;
  text-align: left;
}
.continue-button {
  margin: 0 5vw;
  width: 120px;
  height: 28px; /* Adjust the height as needed */
  border-radius: 26px;
  background: rgb(0, 142, 156);
  /* font-layout */
  color: rgb(255, 255, 255);
  font-family: Poppins;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
}
.content-no-scroll {
  overflow: hidden;
}
</style>
