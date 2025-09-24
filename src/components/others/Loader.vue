<template>
  <div v-if="isLoading" class="container">
    <div class="flex-center">
      <div class="box">
        <h1 class="custom-loading" :style="{ color: theme.primaryColor }">
          Loading
        </h1>
        <ion-spinner
          name="circular"
          :style="{ color: theme.primaryColor }"
        ></ion-spinner>
      </div>
    </div>
  </div>
</template>

<script>
import { IonSpinner } from "@ionic/vue";

export default {
  template: `
      <div class="container">
        <div class="flex-center">
          <h1 class="custom-loading">Loading</h1>
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
    this.fetchTheme();
  },
  methods: {
    fetchTheme() {
      try {
        const storedThemeData = localStorage.getItem("themeData");

        const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};

        this.theme = themeData;
      } catch (error) {
        console.log(error.message);
      }
    },
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
  padding: 20px;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.1);
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
  z-index: 2000;
}
</style>
