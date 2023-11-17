<template>
  <div v-if="isLoading" class="container">
    <div class="flex-center">
      <div class="box">
        <h1 class="custom-loading" :style="{ color: theme.primaryColor }">Suy Sing</h1>
        <ion-spinner name="circular" :style="{ color: theme.primaryColor }"></ion-spinner>
      </div>
    </div>
  </div>
</template>

<script>
import { IonSpinner } from "@ionic/vue";
import { getThemeData } from "@/theme/theme";

export default {
  template: `
      <div class="container">
        <div class="flex-center">
          <h1 class="custom-loading">Suy Sing</h1>
          <ion-spinner name="circular"></ion-spinner>
        </div>
      </div>
    `,
  components: {
    IonSpinner,
  },
  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      theme: {},
    };
  },
  created() {
    const storedThemeData = getThemeData();

    if (storedThemeData) {
      this.theme = storedThemeData;
    }
    this.theme = storedThemeData;
  },
};
</script>

<style scoped>
.flex-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  height: 150px;
  width: 200px;
  background-color: rgb(255, 255, 255);
  box-shadow: 3px 8px 25px 0px rgba(0, 0, 0, 0.5);
  -webkit-box-shadow: 3px 8px 25px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 3px 8px 25px 0px rgba(0, 0, 0, 0.5);
}
.custom-loading {
  font-weight: bold;
  color: var(--ion-color-blue-theme);
  padding: 0;
  margin: 0;
}
ion-spinner {
  width: 100px;
  height: 60px;
}
.container {
  position: fixed;
  top: 45%;
  width: 100%;
}
</style>
