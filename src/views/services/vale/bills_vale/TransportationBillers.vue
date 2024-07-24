<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <HeaderReturn
        :headerTitle="headerTitle"
        :headerColor="theme.primaryColor"
        :headerTextColor="theme.primaryFontColor"
      />
      <Refresher />

      <div class="search-container">
        <ion-input placeholder="Search Billers" class="search-bar">
          <ion-icon name="search-outline" class="search-icon"> </ion-icon>
        </ion-input>
      </div>

      <div class="bills-title">
        <h4 :style="{ color: theme.primaryColor }">Select your biller</h4>
      </div>
      <!--  -->
      <div class="biller-categories">
        <div class="biller-container" @click="navigatePayment()">
          <div class="img-container">
            <svg
              width="50"
              height="46"
              viewBox="0 0 50 46"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <rect width="50" height="46" rx="5" fill="url(#pattern0_5_742)" />
              <defs>
                <pattern
                  id="pattern0_5_742"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use
                    xlink:href="#image0_5_742"
                    transform="matrix(0.00444444 0 0 0.00483092 0 -0.0434783)"
                  />
                </pattern>
                <image
                  id="image0_5_742"
                  width="225"
                  height="225"
                  xlink:href="data:image/jpeg;base64,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kqetPysn2jvvFXKfDDqMMaxx+jCpMogICAgICAgICAgICAgICAgtLon/ADWX7f8AoaqXJ+KHK9b/AL8fo2qPKuGzPc5lpiHkvAlLgCTvcX7VGcmSI8seTnczHWIt4hwekbMQd+RsY5ga4ay4ab6fNDR2c7rLgx+e6V/pPD8+3tO5+SQ5BDThbdfm/Kar8NOo39ixZ/j8Nf1Tccv3fXw55o8Dt58XDlI6/vUonKz1y9R3Hif4RTJOn41i0bt6yTTfjp0v039Vlmy79n5bTqO/wc93r4dLpa/OY/sf6io4PhlX6L+Xt+qRdIPzW39qL+SxYv7ij0z85P7q+yiT8Pp7fpgrWX4Zb/nRE8e2/olXS8Brpu3RJ4XYsHG35aroMzq37f7q9srbf6h9R6ICAgICAgICAgICAgICAgICC0uif81l+3/oaqXI+OHLdaj+vVCMHxc0lcZQfJ65wkHawuN/Dj6lYtSLU03Ofjxn48V+ek16TMLbLTtqmbllrkfSjdw8CR4rBx7zFu2Wo6RnnHlnDZsZP+Zj9nN/UvMn9yEOd+ej9lTN4K78nUx6JDkH5yg/ad/23rFm+CVDqvnjW/8Avm63S1+cx/Yf1FY8HwSp9F/L2/VMsyYQ+roGxRFocerddxIFm78gVgrfsvtqeLya8fkza33cXKORn004nnewlgOhrLkXItqJIHAKeTP3RqFvndUjPj9njifKNdImLtqKuzDqZE3QCOBcTdxHsHqWbBTtq2XSeNOLDu3rKLLO2ogICAgICAgICAgICAgICAgICDp4Rj09K17YX6A/zhYHfhcX4FQtjrb1Vs3ExZrRa8ejmKaxEa8OpJmCodTCmMl4hYabC9huG6uNu5Q9nXu7tK0cPFGT2uvL5SY9URU76dklo33uLC/lcbHldJx1m2y/DxXyRktHmHMU1pnoqt8MjZIzpew3ae9eTET4lDJjrkrNbeks2LYpLVSdZM7U6wHCwAHAABRrSKxqEMGCmGvbSPDfpc3VkbAxs50tFgC1psOy5F1GcNJ8q2TpvHyW7pq8VuaqyZpa+d2k8QLNv+6Lr2MVY9EsfT+PjndauMsi6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg//Z"
                />
              </defs>
            </svg>
          </div>
          <p class="label">Autosweep RFID</p>
        </div>
        <!--  -->
        <div class="biller-container">
          <div class="img-container">
            <ion-icon name="bus" class="icon"></ion-icon>
          </div>
          <p class="label">Example</p>
        </div>
        <!--  -->
        <div class="biller-container">
          <div class="img-container">
            <ion-icon name="bus" class="icon"></ion-icon>
          </div>
          <p class="label">Example</p>
        </div>
        <!--  -->
        <div class="biller-container">
          <div class="img-container">
            <ion-icon name="bus" class="icon"></ion-icon>
          </div>
          <p class="label">Example</p>
        </div>
      </div>
      <!--  -->
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonButton,
  IonCol,
  IonGrid,
  IonRow,
  IonIcon,
  IonInput,
  IonCheckbox,
  IonCard,
  IonContent,
  IonPage,
} from "@ionic/vue";
import { defineComponent } from "vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import Refresher from "@/components/refresher/Refresher.vue";

export default defineComponent({
  components: {
    IonButton,
    IonCol,
    IonGrid,
    IonRow,
    IonIcon,
    IonInput,
    IonCheckbox,
    IonCard,
    IonContent,
    IonPage,
    HeaderReturn,
    Refresher,
  },

  data() {
    return {
      headerTitle: "Transportation",
      loading: true,
      theme: {},
    };
  },

  created() {
    this.fetchTheme();
    this.loading = false;
  },

  methods: {
    navigateToValeMain() {
      this.$router.go(-1);
    },
    navigateRequestForm() {},
    addFavorites() {},
    async navigatePayment() {
      this.$router.push("/paybill");
    },
    fetchTheme() {
      const themeData = JSON.parse(localStorage.getItem("themeData")) || {};
      this.theme = themeData;
    },
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
.bills-page {
  margin: 0;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  border-radius: 0;
  overflow-y: scroll;
}
.return-container {
  margin: 0;
}

.bills-title h4 {
  font-family: Poppins;
  font-size: 20px;
  font-weight: 700;
  margin: 20px 0 10px 10px;
}
.bill-contents {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  margin: 10px 10px 5px 0;
  overflow: scroll;
}
.bill-contents h5 {
  font-family: Poppins;
  font-size: 25px;
  color: white;
  font-weight: 700;
}
.bill-categories {
  /* flex-wrap: wrap; */
  background-color: white;
  border-radius: 10px;
  margin: 50px auto 0 auto;
  display: flex;
  width: 90%;
  max-width: 500px;
  padding: 10px 10px 30px 10px;
  height: fit-content;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.bill-categories h1 {
  font-family: Poppins;
  font-size: 12px;
  font-weight: 700;
  color: #018593;
}
.fave-billers {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  background-color: #62a0ae;
  border: 1px solid white;
  border-radius: 10px;
  margin: 10px 0 10px 20px;
  min-width: 320px;
  max-width: 500px;
  height: 10%;
  padding: 15px;
}
.fave-billers h1 {
  font-family: Poppins;
  font-size: 12px;
  font-weight: 500;
  color: white;
  margin: 0 10px 1px 0;
}
.return-btn {
  border-radius: 100px;
  overflow: hidden;
  position: absolute;
  top: 10px;
  left: 10px;
  right: 0;
  margin: 20px 0 0 5px;
  width: 70%;
  height: 30px;
  max-width: 48px;
}
.back-icon {
  font-size: 20px;
  color: #018593;
}
.add-btn {
  margin: 5px 0 5px 10px;
  position: relative;
  border-radius: 10px;
}
.add-icon {
  font-size: 20px;
  color: #018593;
}
.search-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  /* height: 30px; */
  min-width: 320px;
  max-width: 500px;
  padding: 15px;
}
.search-bar {
  font-family: Poppins;
  font-size: 12px;
  padding: 10px;
  border-radius: 10px;
  color: #9e9e9e;
  font-weight: 600;
  border: none;
  --border-width: 0;
  --padding-start: 10px;
  --padding-end: 10px;
  background-color: #f3f3f3;
  box-shadow: inset 0 -4px 8px rgba(0, 0, 0, 0.1);
}
.search-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 90%;
  color: #9e9e9e;
  font-size: 15px;
}
.suggest-btn {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 350px;
  margin: 50px 0 0 0;
  text-transform: none;
  font-family: Poppins;
  color: white;
  font-weight: 600;
  font-size: 13px;
  background-color: #018593;
  transform: translateX(-50%);
}
.category-buttons {
  margin: 0 5px 0 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.btn-text h4 {
  padding: 0;
  margin: 0;
  font-family: Poppins;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  color: white;
}
.btn-container {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 10px;
}
.categories-btn {
  font-size: 25px;
  color: var(--ion-color-blue-theme);
}
.card {
  padding: 0;
  height: 70px;
  width: fit-content;
  min-width: 90px;
  border-radius: 10px;
  margin: 10px 5px 0 5px;
  /* box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8); */
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.create-vale-btn {
  border-radius: 10px;
  overflow: hidden;
  position: fixed;
  bottom: 5%;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 80%;
  height: 30px;
  max-width: 350px;
}
.biller-categories {
  display: flex;
  flex-direction: column;
  padding: 10px 20px 0 20px;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.biller-container {
  display: flex;
  align-items: center;
  flex-direction: row;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  width: 100%;
  max-width: 320px;
  border-radius: 10px;
  padding: 10px;
}
.img-container {
  height: 50px;
  width: 50px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.img-container .icon {
  font-size: 24px;
}
.label {
  font-size: 16px;
  font-weight: bold;
  margin-left: 10px;
}

@media screen and (max-height: 600px) {
  .suggest-btn {
    bottom: 0;
  }
}
</style>
