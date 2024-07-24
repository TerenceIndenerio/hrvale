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
              <rect width="50" height="46" rx="5" fill="url(#pattern0_5_662)" />
              <defs>
                <pattern
                  id="pattern0_5_662"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use
                    xlink:href="#image0_5_662"
                    transform="matrix(0.00519774 0 0 0.00564972 -0.240678 0)"
                  />
                </pattern>
                <image
                  id="image0_5_662"
                  width="285"
                  height="177"
                  xlink:href="data:image/png;base64,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"
                />
              </defs>
            </svg>
          </div>
          <p class="label">Sky Cable</p>
        </div>
        <!--  -->
        <div class="biller-container">
          <div class="img-container">
            <ion-icon name="tv" class="icon"></ion-icon>
          </div>
          <p class="label">Example</p>
        </div>
        <!--  -->
        <div class="biller-container">
          <div class="img-container">
            <ion-icon name="tv" class="icon"></ion-icon>
          </div>
          <p class="label">Example</p>
        </div>
        <!--  -->
        <div class="biller-container">
          <div class="img-container">
            <ion-icon name="tv" class="icon"></ion-icon>
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
      headerTitle: "Cable",
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
