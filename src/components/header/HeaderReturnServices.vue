<template>
  <div class="header">
    <ion-icon
      name="arrow-back-outline"
      class="icon1"
      :style="{ color: headerColor }"
      @click="navigateBack"
      router-direction="forward"
    ></ion-icon>

    <img
      :src="this.logo"
      alt="Logo"
      class="logo"
      :style="{ backgroundColor: headerColor }"
    />
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
  created() {
    this.fetchLogo();
  },
  methods: {
    async navigateBack() {
      await this.$router.push("/tabs/suysing_services");
      window.location.reload();
    },

    fetchLogo() {
      const baseURL = localStorage.getItem("baseUrl");

      this.logo = baseURL + "admin/theme/image/clientBanner";
    },
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Inter");
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
@import url("https://fonts.googleapis.com/css?family=Roboto");

.header {
  height: 100px;
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
}

.btn {
  margin: 0;
  height: 50px;
  width: 150px;
}

.logo {
  width: 230px;
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  margin: auto;
  padding: 0 5px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.8),
    0px 2px 4px -1px rgba(0, 0, 0, 0.6);
  -webkit-box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.8);
}
</style>
