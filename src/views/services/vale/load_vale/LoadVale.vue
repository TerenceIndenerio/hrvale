<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <HeaderReturn
        :headerTitle="headerTitle"
        :headerColor="theme.primaryColor"
        :headerTextColor="theme.primaryFontColor"
      />
      <Refresher />

      <div class="load-contents">
        <div class="load-credentials">
          <h1>Select Telco</h1>
          <div v-if="!selectedTelco" class="telco">
            <div
              v-for="(telco, key) in telcos"
              :key="key"
              @click="selectTelco(key)"
              class="telco-container"
            >
              <img
                :src="telco.img"
                :alt="telco.name"
                class="icon-btn"
                style="width: 40px; height: 30px"
              />
              <p>{{ telco.name }}</p>
            </div>
          </div>
          <div v-else>
            <div class="telco">
              <img
                :src="telcos[selectedTelco].img"
                :alt="telcos[selectedTelco].name"
                class="icon-btn"
                style="width: 40px; height: 30px"
              />
              <p>{{ telcos[selectedTelco].name }}</p>
            </div>
          </div>

          <div v-if="selectedTelco">
            <h1>Enter mobile number</h1>
            <ion-input
              placeholder="(+63)"
              class="number-amount-text"
              type="tel"
              pattern="[0-9]+"
            >
              <ion-icon name="journal" class="contacts-icon"> </ion-icon>
            </ion-input>
          </div>
          <div
            v-if="
              selectedTelco && !showPromoSelection && selectedPromo === null
            "
          >
            <h1>Enter desired amount</h1>
            <ion-input
              placeholder="Enter value from 5-1000"
              class="number-amount-text"
            ></ion-input>
          </div>

          <div v-if="selectedTelco">
            <ion-button
              color="none"
              class="select-promo-btn"
              @click="togglePromoSelection"
              :style="{ backgroundColor: theme.primaryColor }"
            >
              {{
                showPromoSelection && selectedPromo === null
                  ? "Regular Load"
                  : selectedPromo === null
                  ? "Select Promo"
                  : "Change Promo"
              }}
            </ion-button>
          </div>

          <div v-if="selectedTelco && showPromoSelection">
            <h1>Unli Promo:</h1>
            <div class="promo-examples">
              <div
                v-for="(promo, index) in promoExamples"
                :key="index"
                class="promo-container"
                @click="selectPromo(index)"
              >
                <div class="promo-item-container">
                  <p>
                    <strong>{{ promo.price }}</strong> - {{ promo.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedPromo !== null">
            <h1>Selected Promo</h1>
            <div class="promo-container">
              <div class="promo-item-container">
                <p>
                  <strong>{{ promoExamples[selectedPromo].price }}</strong> -
                  {{ promoExamples[selectedPromo].description }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="selectedTelco" class="checkbox-row">
            <ion-col class="checkbox-col">
              <ion-checkbox v-model="isChecked" class="checkbox-confirmation" />
              <ion-label class="checkbox-text">
                I confirm that the above details are correct.
              </ion-label>
            </ion-col>
          </div>
        </div>
      </div>

      <ion-button
        v-if="selectedTelco"
        color="none"
        class="create-vale-btn neomorphic-btn-1"
        :style="{ backgroundColor: theme.secondaryColor }"
      >
        Buy Load
      </ion-button>
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
  IonLabel,
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
    IonLabel,
  },

  data() {
    return {
      headerTitle: "Load Vale",
      loading: true,
      theme: {},
      isChecked: false,
      selectedTelco: null,
      selectedPromo: null,
      showPromoSelection: false,
      telcos: {
        smart: {
          name: "Smart",
          img: "/assets/images/smart.png",
        },
        tnt: {
          name: "TNT",
          img: "/assets/images/tnt.png",
        },
        globe: {
          name: "Globe",
          img: "/assets/images/globe.png",
        },
        tm: {
          name: "TM",
          img: "/assets/images/tm.png",
        },
        gomo: {
          name: "Gomo",
          img: "/assets/images/gomo.png",
        },
        dito: {
          name: "Dito",
          img: "/assets/images/dito.png",
        },
      },
      promoExamples: [
        { description: "Unli Texts to all networks for 3 days", price: "₱20" },
        { description: "Unli Texts to all networks for 7 days", price: "₱50" },
        {
          description: "Unli Calls and Texts to same network for 30 days",
          price: "₱100",
        },
        { description: "Unli Data for 1 day", price: "₱50" },
        { description: "Unli Data for 3 days", price: "₱70" },
        { description: "Unli Data for 7 days", price: "₱99" },
      ],
    };
  },

  created() {
    this.fetchTheme();
    this.loading = false;
  },

  methods: {
    selectTelco(key) {
      this.selectedTelco = key;
      this.selectedPromo = null; // Reset selected promo when changing telco
      this.showPromoSelection = false; // Hide promo selection when changing telco
    },
    fetchTheme() {
      const themeData = JSON.parse(localStorage.getItem("themeData")) || {};
      this.theme = themeData;
    },
    togglePromoSelection() {
      this.showPromoSelection = !this.showPromoSelection;
    },
    selectPromo(index) {
      this.selectedPromo = index;
      this.showPromoSelection = false;
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
  height: 50px;
  max-width: 350px;
  z-index: 1000;
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

/*  */
.load-page {
  margin: 0;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  border-radius: 0;
  overflow-y: scroll;
}
.load-contents {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  margin: 10px auto 100px auto;
  width: fit-content;
  max-width: 320px;
  border-radius: 10px;
}

.load-contents h4 {
  font-family: Poppins;
  font-size: 25px;
  color: white;
  font-weight: 700;
}
.load-credentials {
  flex-wrap: wrap;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  margin: auto;
  width: 100%;
  height: 85%;
  min-width: 320px;
  max-width: 500px;
  padding: 15px;
}
.load-credentials h1 {
  font-family: Poppins;
  font-size: 12px;
  font-weight: 700;
  color: #018593;
  margin: 10px 0;
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
.telco {
  padding: 0;
  margin: 5px auto;
  gap: 5px;
  justify-content: space-evenly;
}
.number-amount-text {
  font-family: Poppins;
  font-size: 12px;
  padding: 10px;
  border-radius: 10px;
  color: #018593;
  font-weight: 600;
  border: none;
  --border-width: 0;
  --padding-start: 10px;
  --padding-end: 10px;
  background-color: #f3f3f3;
  box-shadow: inset 0 -4px 8px rgba(0, 0, 0, 0.1);
  z-index: 0;
}
.contacts-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 90%;
  color: #018593;
  font-size: 15px;
}
.load-button {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 350px;
  margin: 150px 0 0 0;
  text-transform: none;
  font-family: Poppins;
  color: white;
  font-weight: 600;
  font-size: 13px;
  background-color: #018593;
  transform: translateX(-50%);
}
.checkbox-row {
  align-items: center;
  justify-content: center;
}
.checkbox-col {
  display: flex;
  align-items: center;
}
.checkbox-confirmation {
  margin: 15px 0 0 0;
}
.checkbox-text {
  padding: 10px;
  margin-top: 15px;
  font-family: Poppins;
  font-size: 10px;
  color: rgb(155, 155, 155);
}
.invalid-input {
  --ion-color-base: red;
}
.telco {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.telco-container {
  text-align: center;
}
.promo-item-container {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 10px;
  margin: 10px;
  padding: 5px 10px;
}
@media screen and (max-height: 600px) {
  .load-button {
    bottom: 0;
  }
}
</style>
