<template>
  <div class="header" :style="{ backgroundColor: headerColor }">
    <ion-icon
      name="arrow-back-outline"
      class="icon1"
      @click="navigateBack"
      router-direction="forward"
    ></ion-icon>
    <h2 class="title">{{ headerTitle }}</h2>
  </div>
</template>

<script>
import { IonHeader, IonIcon, IonPopover, IonButton } from "@ionic/vue";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import { defineProps, defineComponent } from "vue";

export default defineComponent({
  components: {
    IonHeader,
    IonIcon,
    IonPopover,
    IonButton,
  },
  props: {
    headerTitle: String,
    headerColor: String,
    headerTextColor: String,
  },
  data() {
    return {
      popoverOpen: false,
      event: null,
      rotationState: "initial",
    };
  },
  methods: {
    navigateBack() {
      this.$router.go(-1);
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
      this.popoverOpen = false;
    },
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Inter");
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
@import url("https://fonts.googleapis.com/css?family=Roboto");

.header {
  background-color: var(--ion-color-blue-theme);
  height: 70px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 0 40px 40px;
  padding: 0 29px;
  box-shadow: none;
  text-align: center;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 2;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.2),
    -8px -8px 16px rgba(255, 255, 255, 0.8), 0px -4px 8px rgba(0, 0, 0, 0.1);
}
.icon1 {
  font-size: 30px;
  color: var(--ion-color-primary-contrast);
  transition: transform 0.2s ease;
}
.icon1:hover {
  transform: scale(0.5);
}
.icon2 {
  right: 20px;
  font-size: 25px;
  border-radius: 100%;
  padding: 3px;
  color: var(--ion-color-primary-contrast);

  transition: transform 0.7s ease;
}

.title {
  color: var(--ion-color-primary-contrast);
  text-align: center;
  font-family: var(--ion-font-font2);
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: fit-content;
}
.settings-icon {
  font-size: 25px;
  transition: transform 0.7s ease;
}

.settings-icon:hover {
  transform: rotate(360deg);
}
.btn {
  margin: 0;
  height: 50px;
  width: 150px;
}

</style>
