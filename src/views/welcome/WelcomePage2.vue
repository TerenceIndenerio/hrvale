<template>
    <ion-page >
      <ion-content :scrollEvents="false" class="content-no-scroll">

        <div class="container">
          <svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" height="65%">
              <defs>
                <linearGradient id="Gradient" x1="329.566" y1="260.141" x2="220.468" y2="-119.498" gradientUnits="userSpaceOnUse">
                  <stop offset="-0.2421" stop-color="rgb(88, 189, 199)"/>
                  <stop offset="0.28127" stop-color="rgb(67, 184, 195)"/>
                  <stop offset="0.54295" stop-color="rgb(1, 141, 156)"/>
                  <stop offset="0.84626" stop-color="rgb(31, 80, 126)"/>
                </linearGradient>
              </defs>
              <path fill="url(#Gradient)" fill-opacity="1" d="M0,288L17.1,282.7C34.3,277,69,267,103,266.7C137.1,267,171,277,206,256C240,235,274,181,309,170.7C342.9,160,377,192,411,181.3C445.7,171,480,117,514,112C548.6,107,583,149,617,186.7C651.4,224,686,256,720,224C754.3,192,789,96,823,53.3C857.1,11,891,21,926,21.3C960,21,994,11,1029,10.7C1062.9,11,1097,21,1131,32C1165.7,43,1200,53,1234,53.3C1268.6,53,1303,43,1337,42.7C1371.4,43,1406,53,1423,58.7L1440,64L1440,0L1422.9,0C1405.7,0,1371,0,1337,0C1302.9,0,1269,0,1234,0C1200,0,1166,0,1131,0C1097.1,0,1063,0,1029,0C994.3,0,960,0,926,0C891.4,0,857,0,823,0C788.6,0,754,0,720,0C685.7,0,651,0,617,0C582.9,0,549,0,514,0C480,0,446,0,411,0C377.1,0,343,0,309,0C274.3,0,240,0,206,0C171.4,0,137,0,103,0C68.6,0,34,0,17,0L0,0Z"></path>
            </svg>
            <img class="welcomeIMG2" src="https://res.cloudinary.com/dlbtxizrp/image/upload/v1709030876/Bappleware/Bot_helping_solve_problems_in_the_chat_x0bbzn.png" alt="">
        </div>
        <div class="lower-section">
           <ion-text class="text-container">
                <h1 class="title">Revolutionize HR with our HR VALE Software:</h1>
                <p class="description">Streamline processes on-the-go with our cutting-edge, user-friendly solutions for modern businesses.</p>
           </ion-text> 
        <ion-button class="next-button" fill="clear" @click="nextClicked">Next</ion-button>
      </div>
      </ion-content>
    </ion-page>
</template>

<script>
  import { IonContent, IonHeader, IonTitle, IonToolbar, IonPage, IonButton } from '@ionic/vue';
  import { defineComponent } from 'vue';
  import { useRouter } from 'vue-router';

  
export default defineComponent({
components: { IonContent, IonPage, IonButton },
setup() {
const router = useRouter();

const nextClicked = () => {
  router.push('/welcome3');
};

return {
  nextClicked,
};
},
});

</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");



.svg{
  position: absolute;
  top: 0%;
}
.container{
  height: 55vh;
  
}
.welcomeIMG2{
  position: absolute;
}

.lower-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding: 2% 2% 0 2%;
}
.text-container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5% 5% 0% 5%;
}
.title{
 /* Revolutionize HR with our HR VALE Software: */
  width: 100%;
  height: 100%;
  margin-bottom: 2vh;
  /* font layout */
  color: rgb(2, 94, 144);
  font-family: Poppins;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0%;
  text-align: left;
}
.description{
  /* Streamline processes on-the-go with our cutting-edge, user-friendly solutions for modern businesses. */
  margin: 0%;
  /* font layout */
  color: rgb(87, 95, 107);
  font-family: Poppins;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0%;
  text-align: left;
}
.next-button{
  margin: 15% 5vw;
  width: 120px;
  height: 28px; /* Adjust the height as needed */
  border-radius: 26px;
  background: rgb(0, 142, 156);
  /* font-layout */
  color: rgb(255, 255, 255);
  font-family: Poppins;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0%;
  text-align: center;
}
</style>
