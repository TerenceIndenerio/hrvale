<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <HeaderReturn
        :headerTitle="headerTitle"
        :headerColor="theme.primaryColor"
        :headerTextColor="theme.primaryFontColor"
      />
      <Refresher />
      <!--  -->
      <h4 class="category-title">TOP DEALS</h4>
      <div class="gadgets-container">
        <ion-card
          v-for="(phone, index) in phones"
          :key="index"
          class="card card-container"
          color="none"
        >
          <ion-icon name="phone-portrait" class="card-icon" />
          <h4>{{ phone.name }}</h4>
          <p>{{ phone.details }}</p>
        </ion-card>
      </div>
      <!--  -->
      <h4 class="category-title">DISCOVER</h4>
      <div class="discover-container">
        <ion-card
          v-for="(disc, index) in discover"
          :key="index"
          class="card card-discover card-container"
          color="none"
        >
          <ion-icon name="image" class="card-discover-icon" />
          <h4>{{ disc.name }}</h4>
          <p>{{ disc.details }}</p>
        </ion-card>
      </div>
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
import { useStore } from "vuex";
import { useRouter } from "vue-router";

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
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    return {
      headerTitle: "Gadgets Vale",
      loading: true,
      theme: {},
      phones: [
        { name: "Phone 1", details: "Specs & Details" },
        { name: "Phone 2", details: "Specs & Details" },
        { name: "Phone 3", details: "Specs & Details" },
        { name: "Phone 4", details: "Specs & Details" },
        { name: "Phone 5", details: "Specs & Details" },
      ],
      discover: [
        { name: "Discover 1", details: "Details" },
        { name: "Discover 2", details: "Details" },
        { name: "Discover 3", details: "Details" },
      ],
    };
  },

  async created() {
    this.fetchTheme();
    await this.checkTokenExpiration();
    this.loading = false;
  },

  methods: {
    async checkTokenExpiration() {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        console.error("Token not available.");
        console.log("Token is missing. Redirecting to login...");
        this.router.push("/login");
        return;
      }

      const tokenData = JSON.parse(atob(storedToken.split(".")[1]));
      const expirationTime = tokenData.exp * 1000;

      if (Date.now() > expirationTime) {
        console.log("Token expired. Redirecting to login...");
        this.router.push("/login");
      }
    },
    fetchTheme() {
      const themeData = JSON.parse(localStorage.getItem("themeData")) || {};
      this.theme = themeData;
    },
  },
});
</script>

<style scoped>
.category-title {
  font-weight: bold;
  font-size: 18px;
  margin: 30px 0 0 10px;
}
.gadgets-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow-x: scroll;
  width: 100%;
  height: 170px;
}
.discover-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow-x: scroll;
  width: 100%;
  height: 170px;
}
.card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.card {
  padding: 0;
  height: 150px;
  width: 150px;
  min-width: 150px;
  border-radius: 10px;
  margin: 5px;
  overflow: hidden;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.card-discover {
  padding: 0;
  height: 150px;
  min-width: 250px;
  border-radius: 10px;
  margin: 5px;
  overflow: hidden;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.card-icon {
  font-size: 60px;
}
.card-discover-icon {
  font-size: 80px;
}
.card h4 {
  padding: 0;
  margin: 0;
  font-family: Poppins;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
}
</style>
