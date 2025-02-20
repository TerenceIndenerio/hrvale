<template>
  <ion-page :fullscreen="true">
    <ion-content>
      <div class="content-container">
        <div class="tabs">
          <input id="slide1" type="radio" name="slider" checked disabled />
          <input id="slide2" type="radio" name="slider" disabled />
          <input id="slide3" type="radio" name="slider" disabled />
          <div class="buttons">
            <label for="slide1"></label>
            <label for="slide2"></label>
            <label for="slide3"></label>
          </div>
          <div class="content">
            <div class="box slide1">
              <div class="text-section">
                <h1 class="header1">Welcome!</h1>
                <h2 class="header2">
                  We are glad that <br />
                  you are here
                </h2>
              </div>
              <div class="Img-section">
                <img
                  class="welcomeIMG"
                  src="@/assets/images/1.png"
                  alt="People working together"
                />
                <ion-button
                  class="start-button"
                  fill="clear"
                  @click="startClicked"
                  >Let's Get Started!</ion-button
                >
              </div>
              <div class="wave-container"></div>
            </div>
            <div class="box slide2">
              <div class="wave-container2">
                <svg
                  class="svg2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1440 320"
                  height="65%"
                >
                  <defs>
                    <linearGradient
                      id="Gradient"
                      x1="329.566"
                      y1="260.141"
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
                    fill="url(#Gradient)"
                    fill-opacity="1"
                    d="M0,288L17.1,282.7C34.3,277,69,267,103,266.7C137.1,267,171,277,206,256C240,235,274,181,309,170.7C342.9,160,377,192,411,181.3C445.7,171,480,117,514,112C548.6,107,583,149,617,186.7C651.4,224,686,256,720,224C754.3,192,789,96,823,53.3C857.1,11,891,21,926,21.3C960,21,994,11,1029,10.7C1062.9,11,1097,21,1131,32C1165.7,43,1200,53,1234,53.3C1268.6,53,1303,43,1337,42.7C1371.4,43,1406,53,1423,58.7L1440,64L1440,0L1422.9,0C1405.7,0,1371,0,1337,0C1302.9,0,1269,0,1234,0C1200,0,1166,0,1131,0C1097.1,0,1063,0,1029,0C994.3,0,960,0,926,0C891.4,0,857,0,823,0C788.6,0,754,0,720,0C685.7,0,651,0,617,0C582.9,0,549,0,514,0C480,0,446,0,411,0C377.1,0,343,0,309,0C274.3,0,240,0,206,0C171.4,0,137,0,103,0C68.6,0,34,0,17,0L0,0Z"
                  ></path>
                </svg>
                <img class="welcomeIMG2" src="@/assets/images/2.png" alt="" />
                <ion-button class="back" @click="backClicked" fill="clear">
                  <ion-icon :icon="chevronBackOutline"></ion-icon> Back
                </ion-button>
              </div>
              <div class="lower-section">
                <ion-text class="text-container">
                  <h1 class="title">
                    Revolutionize HR with our HR VALE Software:
                  </h1>
                  <p class="description">
                    Streamline processes on-the-go with our cutting-edge,
                    user-friendly solutions for modern businesses.
                  </p>
                </ion-text>
                <ion-button
                  class="next-button"
                  fill="clear"
                  @click="nextClicked"
                  >Next</ion-button
                >
              </div>
            </div>
            <div class="box slide3">
              <div class="wave-container3">
                <svg
                  class="svg2"
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
                  class="welcomeIMG2"
                  src="@/assets/images/3.png"
                  alt="WelcomePage3IMG"
                />
                <ion-button class="back" @click="backClicked2" fill="clear">
                  <ion-icon :icon="chevronBackOutline"></ion-icon> Back
                </ion-button>
              </div>
              <div class="lower-section2">
                <ion-text class="text-container2">
                  <img
                    class="logo"
                    src="@/assets/images/icon_logo.png"
                    alt="HR Vale Logo"
                  />
                  <p class="description">
                    Automate tasks, boost engagement, and optimize HR operations
                    for efficiency. With seamless mobile access, empower your
                    workforce with easy VALE and cash advance applications.
                  </p>
                  <ion-button
                    class="continue-button"
                    fill="clear"
                    @click="continueClicked"
                    >Continue</ion-button
                  >
                </ion-text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
<script>
import { IonContent, IonPage, IonButton, IonIcon, IonText } from "@ionic/vue";
import { chevronBackOutline } from "ionicons/icons";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  components: { IonContent, IonPage, IonButton, IonIcon, IonText },
  setup() {
    const router = useRouter();
    const continueClicked = () => {
      router.push("/setuplogin");
    };

    return {
      chevronBackOutline,
      continueClicked,
    };
  },

  methods: {
    startClicked() {
      document.getElementById("slide2").checked = true;
    },
    nextClicked() {
      document.getElementById("slide3").checked = true;
    },
    continueClicked() {},
    backClicked() {
      document.getElementById("slide1").checked = true;
    },
    backClicked2() {
      document.getElementById("slide2").checked = true;
    },
  },
});
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Poppins;
}
.back {
  color: white;
  padding: 10px;
  font-size: 16px;
}
.content-container {
  width: 100%;
  height: 100vh;
  background: transparent;
  overflow: hidden;
}
.tabs input {
  visibility: hidden;
  display: none;
}
.buttons {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%);
  display: flex;
  gap: 10px;
  margin-bottom: 5%;
  z-index: 100;
}
.buttons label {
  width: 20px;
  height: 20px;
  background: #008e9c;
  opacity: 0.5;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.5s;
}
.tabs input:nth-child(1):checked ~ .buttons label:nth-child(1),
.tabs input:nth-child(2):checked ~ .buttons label:nth-child(2),
.tabs input:nth-child(3):checked ~ .buttons label:nth-child(3) {
  opacity: 1;
  width: 50px;
}
.content {
  position: relative;
  width: 300vw;
  display: flex;
  transition: o.5s;
}
.content .box {
  position: relative;
  width: 100vw;
  height: 100vh;
  user-select: none;
  padding: 0px;
}
.tabs input:nth-child(1):checked ~ .content {
  left: 0;
}
.tabs input:nth-child(2):checked ~ .content {
  left: -100vw;
}
.tabs input:nth-child(3):checked ~ .content {
  left: -200vw;
}
/* Slide 1 Style */
.svg1 {
  position: absolute;
  bottom: 0%;
}
@media (min-width: 1101px) {
  .svg1 {
    width: 100%;
  }
}
.text-section {
  margin: 10% 5% 0% 5%;
}
.header1 {
  /* Welcome! */
  margin: 0%;
  /* Font-layout */
  color: rgb(3, 78, 162);
  font-family: Poppins;
  font-size: 55px;
  font-weight: 700;
  line-height: 83px;
  letter-spacing: 0%;
  text-align: left;
}
.header2 {
  /* We are glad that you are here */
  margin: 0%;
  /* Font Layout */
  color: rgb(45, 98, 138);
  font-family: Poppins;
  font-size: 24px;
  font-weight: 500;
  line-height: 27px;
  letter-spacing: 0%;
  text-align: left;
}
.start-button {
  height: 52px;
  left: 50%;
  bottom: 0;
  border-radius: 55px;
  background: linear-gradient(
    -49.98deg,
    rgb(31, 80, 126) -23.737%,
    rgb(1, 141, 156) 32.115%,
    rgb(67, 184, 195) 60.041%,
    rgb(88, 189, 199) 92.409%
  );
  color: white;
  font-family: Poppins;
  font-size: 20px;
  font-weight: 700;
  line-height: 29px;
  letter-spacing: 0%;
  text-align: center;
  text-transform: none;
  margin-bottom: 20px; /* Adjust as needed */
  z-index: 100;
}
/* Slide 2 Style */
.text-section,
.header1 {
  display: flex;
  flex-direction: column;
  width: fit-content;
  margin: 0 auto;
}
.Img-section {
  display: flex;
  justify-content: center;
  background-color: rgb(233, 233, 233);
  width: fit-content;
  padding: 20px;
  margin: 10px auto;
  border-radius: 30px;
  flex-direction: column;
  box-shadow: var(--neomorphism-concave-1);
}
.svg2 {
  position: absolute;
  top: 0%;
}
.wave-container2 {
  height: 55vh;
}
.welcomeIMG2 {
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
}
.lower-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding: 2% 2% 0 2%;
  background-color: rgb(240, 240, 240);
  width: fit-content;
  margin: 0 auto;
  padding: 0 10px 20px 10px;
  border-radius: 20px;
  box-shadow: var(--neomorphism-concave-1);
}
.text-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5% 5% 0% 5%;
}
.title {
  /* Revolutionize HR with our HR VALE Software: */
  width: 100%;
  height: 100%;
  margin-bottom: 2vh;
  color: rgb(2, 94, 144);
  font-family: Poppins;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0%;
  text-align: left;
}
.description {
  margin: 0%;
  color: rgb(87, 95, 107);
  font-family: Poppins;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0%;
  text-align: left;
}
.next-button {
  width: 150px;
  height: 50px;
  border-radius: 26px;
  background: rgb(0, 142, 156);
  color: rgb(255, 255, 255);
  font-family: Poppins;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0%;
  text-align: center;
  margin: 10px auto;
}
/*Slide 3 Style */
.wave-container3 {
  height: 55vh;
}
.lower-section2 {
  display: flex;
  flex-direction: column;
  padding: 2%;
  max-width: 1000px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 10%;
  margin: 0 auto;
}
.text-container2 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5%;
  background-color: rgb(247, 247, 247);
  border-radius: 10px;
  gap: 10px;
  z-index: 1000;
  box-shadow: var(--neomorphism-concave-1);
}
.logo {
  z-index: 1000;
  margin: 0 auto;
}
.continue-button {
  width: 150px;
  height: 50px;
  border-radius: 26px;
  background: rgb(0, 142, 156);
  color: rgb(255, 255, 255);
  font-family: Poppins;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  z-index: 1001;
}
</style>
