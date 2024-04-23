<template>
    <ion-page>
        <ion-content :fullscreen="true">
            <div 
                class="load-page"
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
                    <ion-row class="load-contents">
                        <div class="load-title">
                            <h4>
                                Load Vale
                            </h4>
                        </div>
                        <div class="load-credentials">
                            <h1>
                                Select Telco
                            </h1>
                            <ion-row>
                                <ion-col class="telco">
                                    <a @click="smartLoad">
                                        <img
                                            src="/assets/images/smart.png"
                                            alt="Telco Network"
                                            class="icon-btn"
                                            style="width: 40px; height: 30px"
                                        />
                                    </a>
                                </ion-col>
                                <ion-col class="telco">
                                    <a @click="tntLoad">
                                        <img
                                            src="/assets/images/tnt.png"
                                            alt="Telco Network"
                                            class="icon-btn"
                                            style="width: 40px; height: 30px"
                                        />
                                    </a>
                                </ion-col>
                                <ion-col class="telco">
                                    <a @click="globeLoad">
                                        <img
                                            src="/assets/images/globe.png"
                                            alt="Telco Network"
                                            class="icon-btn"
                                            style="width: 40px; height: 30px"
                                        />
                                    </a>
                                </ion-col>
                                <ion-col class="telco">
                                    <a @click="tmLoad">
                                        <img
                                            src="/assets/images/tm.png"
                                            alt="Telco Network"
                                            class="icon-btn"
                                            style="width: 40px; height: 30px"
                                        />
                                    </a>
                                </ion-col>
                                <ion-col class="telco">
                                    <a @click="gomoLoad">
                                        <img
                                            src="/assets/images/gomo.png"
                                            alt="Telco Network"
                                            class="icon-btn"
                                            style="width: 40px; height: 30px"
                                        />
                                    </a>
                                </ion-col>
                                <ion-col class="telco">
                                    <a @click="ditoLoad">
                                        <img
                                            src="/assets/images/dito.png"
                                            alt="Telco Network"
                                            class="icon-btn"
                                            style="width: 40px; height: 30px"
                                        />
                                    </a>
                                </ion-col>
                            </ion-row>
                            <ion-row>
                                <h1>
                                    Enter mobile number
                                </h1>
                                <ion-input 
                                    placeholder="(+63)"
                                    class="number-amount-text"
                                    type="tel"
                                    pattern="[0-9]+"
                                    :class="{ 'invalid-input': containsNonNumeric }"
                                    v-model="phoneNumber"
                                    @input="checkForNonNumeric"
                                >
                                    <ion-icon 
                                        name="journal"
                                        class="contacts-icon"
                                        @click="openContacts"
                                    >
                                    </ion-icon>
                                </ion-input>
                            </ion-row>
                            <ion-row>
                                <h1>
                                    Enter desired amount
                                </h1>
                                <ion-input 
                                    placeholder="Enter value from 5-1000"
                                    class="number-amount-text"
                                ></ion-input> 
                            </ion-row>
                            <ion-row class="checkbox-row">
                                <ion-col class="checkbox-col">
                                    <ion-checkbox 
                                        v-model="isChecked"
                                        class="checkbox-confirmation" 
                                    />
                                    <ion-label class="checkbox-text">
                                        I confirm that the above details are correct.
                                    </ion-label>
                                </ion-col>
                            </ion-row>
                            <ion-row>
                                <ion-button
                                    color="none"
                                    class="load-button"
                                    @click="buyLoad"
                                >
                                    Buy Load
                                </ion-button>
                            </ion-row>
                        </div>
                    </ion-row>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { IonButton, IonCol, IonGrid, IonRow, IonIcon, IonInput, IonCheckbox } from "@ionic/vue";
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
  },

  data () {
    return {
        loading: true,
        phoneNumber: "",
        containsNonNumeric: false, 
    };
  },

  created() {
    this.loading = false;
  },

  methods: {
    navigateToValeMain() {
      this.$router.push("/valemain");
    },
    checkForNonNumeric() {
      const nonNumericRegex = /[^0-9]/;
      this.containsNonNumeric = nonNumericRegex.test(this.phoneNumber);
    },
    // pang-open po ng contacts
    // npm install @capacitor/contacts, di ko pa po na-check
    async openContacts() {
      try {
        await Contacts.openContacts();
      } catch (error) {
        console.error('Error opening contacts', error);
      }
    }
  },
})
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
.load-page {
    margin: 0;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    border-radius: 0;
    overflow-y: scroll;
}
.load-contents {
    display: flex;
    flex-wrap: wrap;
    padding: 20px;
    margin: 80px 10px 10px 0;
    overflow: scroll;
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
  margin: 20px auto;
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
@media screen and (max-height: 600px) {
    .load-button {
        bottom: 0; 
    }
}
</style>
