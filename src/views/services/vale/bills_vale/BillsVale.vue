<template>
    <ion-page>
        <ion-content :fullscreen="true">
            <div 
                class="bills-page"
                :style="{
                'background-image': 
                    'linear-gradient(to right bottom, #92d8e2, #7ecad5, #69bcc7, #54aeba, #3ba0ad, #2c929f, #1b8491, #007783, #006670, #00555e, #00454d, #00363c)',
                }"
            >
                    <div class="return-container">
                        <ion-button
                            color="none"
                            class="return-btn"
                            :style="{ 'background-color': 'white' }"
                            @click="navigateToValeMain"
                        >
                            <ion-icon 
                                name="arrow-back"
                                class="back-icon"
                            >
                            </ion-icon>
                        </ion-button>
                    </div>
                    <div class="bills-title">
                        <h4>
                            Bills Vale
                        </h4>
                    </div>
                    <div class="search-container">
                        <ion-input 
                            placeholder="Search Billers"
                            class="search-bar"
                        >
                            <ion-icon 
                                name="search-outline"
                                class="search-icon"
                            >
                            </ion-icon>
                        </ion-input> 
                    </div>
                        <ion-card class="fave-billers">
                            <ion-button
                                color="none"
                                class="add-btn"
                                :style="{ 'background-color': 'white' }"
                                @click="addFavorites"
                            >
                                <ion-icon 
                                        name="add"
                                        class="add-icon"
                                >
                                </ion-icon>
                            </ion-button>
                            <h1>
                                Add your favorite billers here.
                            </h1>
                        </ion-card>
                        <ion-card class="bill-categories">
                            <ion-row class="category-buttons">
                                <ion-col class="card btn-text" expand="full">
                                    <a
                                    @click="navigateElectricity"
                                    class="categories btn-container"
                                    :style="{
                                        'background-image': 
                                            'linear-gradient(to right bottom, #39aab9, #2fa0af, #2397a5, #168d9b, #018491)',
                                    }"
                                    >
                                        <ion-icon
                                            name="flash"
                                            class="categories-btn"
                                            :style="{ 'color': 'white' }"
                                        />
                                        <h4>Electricity</h4>
                                    </a>
                                </ion-col>
                                <ion-col class="card btn-text" expand="full">
                                    <a
                                    @click="navigateWater"
                                    class="categories btn-container"
                                    :style="{
                                        'background-image': 
                                            'linear-gradient(to right bottom, #39aab9, #2fa0af, #2397a5, #168d9b, #018491)',
                                    }"
                                    >
                                        <ion-icon
                                            name="water"
                                            class="categories-btn"
                                            :style="{ 'color': 'white' }"
                                        >
                                        </ion-icon>
                                        <h4>Water</h4>
                                    </a>
                                </ion-col>
                                <ion-col class="card btn-text" expand="full">
                                    <a
                                    @click="navigateCable"
                                    class="categories btn-container"
                                    :style="{
                                        'background-image': 
                                            'linear-gradient(to right bottom, #39aab9, #2fa0af, #2397a5, #168d9b, #018491)',
                                    }"
                                    >
                                        <ion-icon
                                            name="wifi"
                                            class="categories-btn"
                                            :style="{ 'color': 'white' }"
                                        >
                                        </ion-icon>
                                        <h4>Cable</h4>
                                    </a>
                                </ion-col>
                                <ion-col class="card btn-text" expand="full">
                                    <a
                                    @click="navigateTranspo"
                                    class="categories btn-container"
                                    :style="{
                                        'background-image': 
                                            'linear-gradient(to right bottom, #39aab9, #2fa0af, #2397a5, #168d9b, #018491)',
                                    }"
                                    >
                                        <ion-icon
                                            name="bus"
                                            class="categories-btn"
                                            :style="{ 'color': 'white' }"
                                        >
                                        </ion-icon>
                                        <h4>Transport</h4>
                                    </a>
                                </ion-col>
                            </ion-row>
                            <ion-row>
                                <ion-button
                                    color="none"
                                    class="suggest-btn"
                                    @click="navigateRequestForm"
                                >
                                    Suggest More Billers
                                </ion-button>
                            </ion-row>
                        </ion-card>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { IonButton, IonCol, IonGrid, IonRow, IonIcon, IonInput, IonCheckbox, IonCard } from "@ionic/vue";
import { defineComponent } from "vue";
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
  },

  data () {
    return {
        loading: true,
    };
  },

  created() {
    this.loading = false;
  },

  methods: {
    navigateToValeMain() {
      this.$router.push("/valemain");
    },
  },
})
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
.bills-title {
    margin: 120px 0 0 20px;
}
.bills-title h4 {
    font-family: Poppins;
    font-size: 25px;
    color: white;
    font-weight: 700;
}
.bill-contents {
    display: flex;
    flex-wrap: wrap;
    padding: 20px;
    margin: 10px 10px 5px 0;
    overflow: scroll;
}
.bill-contents h4 {
    font-family: Poppins;
    font-size: 25px;
    color: white;
    font-weight: 700;
}
.bill-categories {
  flex-wrap: wrap;
  background-color: white;
  border-radius: 10px;
  margin: 10px 0 10px 20px;
  min-width: 320px;
  max-width: 500px; 
  padding: 10px;
  height: 25%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
  background-color: #62A0AE;
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
    height: 30px;
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
.ion-row .category-buttons {
    margin: 0 5px 0 5px;
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
  border-radius: 10px;
  margin: 10px 5px 0 5px;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
}
@media screen and (max-height: 600px) {
    .suggest-btn {
        bottom: 0; 
    }
}
</style>
