  <template>
      <ion-page :fullscreen="true" v-if="!loading" :scrollEvents="false"> 
        <ion-content>
          <div class="text-section">
            <h1 class="header1">Welcome!</h1>
            <h2 class="header2">We are glad that <br> you are here </h2>
          </div>
          <div class="Img-section">
            <img class="welcomeIMG" src="https://res.cloudinary.com/dlbtxizrp/image/upload/v1709030877/Bappleware/People_working_in_a_team_izkqtq.png" alt="People working together">
          </div>  
          <div class="wave-container">
            <svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" height="250">
          <defs>
            <linearGradient id="customGradient" x1="529.566" y1="260.141" x2="220.468" y2="-119.498" gradientUnits="userSpaceOnUse">
              <stop offset="-0.237" stop-color="rgb(31, 80, 126)"/>
              <stop offset="0.321" stop-color="rgb(1, 141, 156)"/>
              <stop offset="0.600" stop-color="rgb(67, 184, 195)"/>
              <stop offset="0.924" stop-color="rgb(88, 189, 199)"/>
            </linearGradient>
          </defs>
          <path fill="url(#customGradient)" fill-opacity="1" d="M0,64L14.1,74.7C28.2,85,56,107,85,112C112.9,117,141,107,169,106.7C197.6,107,226,117,254,112C282.4,107,311,85,339,69.3C367.1,53,395,43,424,42.7C451.8,43,480,53,508,74.7C536.5,96,565,128,593,165.3C621.2,203,649,245,678,240C705.9,235,734,181,762,149.3C790.6,117,819,107,847,96C875.3,85,904,75,932,69.3C960,64,988,64,1016,64C1044.7,64,1073,64,1101,90.7C1129.4,117,1158,171,1186,197.3C1214.1,224,1242,224,1271,192C1298.8,160,1327,96,1355,69.3C1383.5,43,1412,53,1426,58.7L1440,64L1440,320L1425.9,320C1411.8,320,1384,320,1355,320C1327.1,320,1299,320,1271,320C1242.4,320,1214,320,1186,320C1157.6,320,1129,320,1101,320C1072.9,320,1045,320,1016,320C988.2,320,960,320,932,320C903.5,320,875,320,847,320C818.8,320,791,320,762,320C734.1,320,706,320,678,320C649.4,320,621,320,593,320C564.7,320,536,320,508,320C480,320,452,320,424,320C395.3,320,367,320,339,320C310.6,320,282,320,254,320C225.9,320,198,320,169,320C141.2,320,113,320,85,320C56.5,320,28,320,14,320L0,320Z"></path>
        </svg>
           <ion-button class="start-button" fill="clear" @click="startClicked">Let's Get Started!</ion-button>
          </div>

        </ion-content>
      </ion-page>
  </template>
  
  <script>
    import { IonContent, IonPage, IonButton } from '@ionic/vue';
    import { defineComponent } from 'vue';
    import { useRouter } from 'vue-router';
 

  
    export default defineComponent({
  components: { IonContent, IonPage, IonButton },

  setup() {
    const router = useRouter();

    const startClicked = () => {
      // Redirect to /welcome2
      router.push('/welcome2');
    };

    return {
      startClicked,
    };
  },
});

  </script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");


.svg{
  position: absolute;
  bottom: 0%;
}
@media (min-width: 1101px) {
    .svg {
      width: 100%; /* or any other width value you desire */
    }
  }
.text-section{
  margin: 10% 5% 0% 5%;
}
.header1{
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
.Img-section{
    width: 100%;
    text-align: center;
}

.start-button {
  /* Rectangle 114 */
  position: absolute;
  width: 299px;
  height: 52px;
  left: 50%;
  transform: translate(-50%, -50%);
  bottom: 5%;
  border-radius: 55px;
  background: rgb(255, 255, 255);
  color: rgb(45, 98, 138);
  font-family: Poppins;
  font-size: 20px;
  font-weight: 700;
  line-height: 29px;
  letter-spacing: 0%;
  text-align: center;
  text-transform: none;
  margin-bottom: 20px; /* Adjust as needed */
}





</style>