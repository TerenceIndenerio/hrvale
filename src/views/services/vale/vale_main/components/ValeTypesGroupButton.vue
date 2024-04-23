<template>
  <ion-grid class="button-container">
    <ion-row class="vale-buttons">
      <ion-col class="card btn-text" expand="full">
        <a
          @click="navigateVale"
          class="vale btn-container"
          :style="{
            'background-image': 
                'linear-gradient(to right bottom, #39aab9, #2fa0af, #2397a5, #168d9b, #018491)',
          }"
        >
            <ion-icon
                name="wallet"
                class="vale-btn"
                :style="{ 'color': 'white' }"
            />
            <h4>Cash Vale</h4>
        </a>
      </ion-col>
      <ion-col class="card btn-text" expand="full">
        <a
          @click="navigateBills"
          class="vale btn-container"
          :style="{
            'background-image': 
                'linear-gradient(to right bottom, #39aab9, #2fa0af, #2397a5, #168d9b, #018491)',
          }"
        >
          <ion-icon
                name="card"
                class="vale-btn"
                :style="{ 'color': 'white' }"
            ></ion-icon>
          <h4>Bills Vale</h4>
        </a>
      </ion-col>
      <ion-col class="card btn-text" expand="full">
        <a
          @click="navigateLoad"
          class="vale btn-container"
          :style="{
            'background-image': 
                'linear-gradient(to right bottom, #39aab9, #2fa0af, #2397a5, #168d9b, #018491)',
          }"
        >
          <ion-icon
                name="phone-portrait"
                class="vale-btn"
                :style="{ 'color': 'white' }"
            ></ion-icon>
          <h4>Load Vale</h4>
        </a>
      </ion-col>
      <ion-col class="card btn-text" expand="full">
        <a
          @click="navigateclockin"
          class="vale btn-container"
          :style="{
            'background-image': 
                'linear-gradient(to right bottom, #39aab9, #2fa0af, #2397a5, #168d9b, #018491)',
          }"
        >
          <ion-icon
                name="cart"
                class="vale-btn"
                :style="{ 'color': 'white' }"
            ></ion-icon>
          <h5>Grocery Vale</h5>
        </a>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script>
import { IonButton, IonCol, IonGrid, IonRow, IonIcon } from "@ionic/vue";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  components: { IonButton, IonCol, IonGrid, IonRow, IonIcon },
  props: {
    btnColor: String,
    btnTextColor: String,
    btnSecondaryColor: String,
    theme: Object,
  },

  methods: {
    navigateVale() {
      this.$router.push("/vale");
    },
    navigateBills() {
      this.$router.push("/billsvale");
    },
    navigateLoad() {
      this.$router.push("/loadvale");
    },
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

a {
  text-decoration: none;
  width: 100%;
  height: 100%;
}
.ion-row .vale-buttons {
    margin: 0 10px 0 10px;
    padding: 10px;
}
.button-container {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
}
.title {
  margin-left: 10px;
  width: 120px;
  height: 30px;
  flex-shrink: 0;
  color: var(--oil-11, #0d0d0d);
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-family: Open Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.ion-text-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-right: auto;
  mix-blend-mode: multiply;
  margin-left: 12px;
  gap: 10px;
}
.card {
  padding: 0;
  height: 100px;
  border-radius: 10px;
  margin: 10px 5px 0 5px;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
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
.btn-text h5 {
  padding: 0;
  margin: 0;
  font-family: Poppins;
  font-size: 11px;
  font-style: normal;
  font-weight: 500;
  color: white;
}
.icon-circle {
  border-radius: 100%;
}
.vale {
  display: flex;
  align-items: center;
}
.icon-btn {
  height: 50px;
  color: var(--ion-color-blue-theme);
}
.vale-btn {
  font-size: 25px;
  color: var(--ion-color-blue-theme);
}
.btn-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
}
</style>
