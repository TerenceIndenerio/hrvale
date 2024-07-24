<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <HeaderReturn
        :headerTitle="headerTitle"
        :headerColor="theme.primaryColor"
        :headerTextColor="theme.primaryFontColor"
      />
      <Refresher />

      <ion-card>
        <ion-card-header>
          <ion-card-title>Pay Bills</ion-card-title>
          <ion-card-subtitle>Fill out all necessary fields.</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <form @submit.prevent="onSubmit">
            <ion-item>
              <ion-input
                type="number"
                label="Enter amount to pay"
                labelPlacement="floating"
                fill="outline"
                required
              ></ion-input>
            </ion-item>

            <ion-item>
              <ion-input
                type="text"
                label="Customer Account Number (CAN)"
                labelPlacement="floating"
                fill="outline"
                required
                maxlength="10"
              ></ion-input>
            </ion-item>

            <ion-item>
              <ion-input
                type="email"
                label="Email Address (optional)"
                labelPlacement="floating"
                fill="outline"
              ></ion-input>
            </ion-item>

            <ion-item lines="none">
              <ion-checkbox
                slot="start"
                aria-label="I agree to proceed payment and I am sure that the credentials I entered are correct."
              ></ion-checkbox>
              <span
                >I agree to proceed payment and I am sure that the credentials I
                entered are correct.</span
              >
            </ion-item>

            <ion-button
              expand="block"
              type="submit"
              color="none"
              :style="{ backgroundColor: theme.primaryColor }"
              class="pay-btn"
              >Pay Now</ion-button
            >
          </form>
        </ion-card-content>
      </ion-card>
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
  IonCardTitle,
  IonCardSubtitle,
  IonCardHeader,
  IonLabel,
  IonItem,
  IonCardContent,
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
    IonCardTitle,
    IonCardSubtitle,
    IonCardHeader,
    IonLabel,
    IonItem,
    IonCardContent,
  },

  data() {
    return {
      headerTitle: "Payment",
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
    async navigateElectricity() {
      this.$router.push("/electricitybillers");
    },
    async navigateWater() {
      this.$router.push("/electricitybillers");
    },
    async navigateCable() {
      this.$router.push("/electricitybillers");
    },
    async navigateTransport() {
      this.$router.push("/electricitybillers  ");
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
.pay-btn {
  border-radius: 10px;
}
ion-card {
  margin: 16px;
}

ion-card-header {
  text-align: center;
}

ion-item {
  margin-bottom: 16px;
}

.checkbox-label {
  margin-left: 8px;
}

ion-button {
  margin-top: 16px;
}

@media screen and (max-height: 600px) {
  .suggest-btn {
    bottom: 0;
  }
}
</style>
