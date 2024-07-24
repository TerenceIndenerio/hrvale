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
              <rect width="50" height="46" rx="5" fill="url(#pattern0_5_582)" />
              <defs>
                <pattern
                  id="pattern0_5_582"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use
                    xlink:href="#image0_5_582"
                    transform="matrix(0.00464646 0 0 0.00505051 -0.090101 0)"
                  />
                </pattern>
                <image
                  id="image0_5_582"
                  width="254"
                  height="198"
                  xlink:href="data:image/png;base64,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"
                />
              </defs>
            </svg>
          </div>
          <p class="label">MAYNILAD (Maynilad Water Services, Inc.)</p>
        </div>
        <!--  -->
        <div class="biller-container">
          <div class="img-container">
            <ion-icon name="water" class="icon"></ion-icon>
          </div>
          <p class="label">Example</p>
        </div>
        <!--  -->
        <div class="biller-container">
          <div class="img-container">
            <ion-icon name="water" class="icon"></ion-icon>
          </div>
          <p class="label">Example</p>
        </div>
        <!--  -->
        <div class="biller-container">
          <div class="img-container">
            <ion-icon name="water" class="icon"></ion-icon>
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
      headerTitle: "Water",
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
