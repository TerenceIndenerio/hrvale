<template>
  <ion-page>
    <HeaderReturn
      :headerTitle="'Payw1zard session'"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    />
    <ion-content :fullscreen="true">
      <div class="session-form-container neomorphic-input-2">
        <p class="description-text">
          Please thoroughly review the attachment before proceeding to take the
          exam.
        </p>

        <ion-item>
          <ion-label position="stacked"><strong>Course</strong></ion-label>
          <ion-text class="input-box">{{ session.name }}</ion-text>
        </ion-item>

        <ion-item>
          <ion-label position="stacked"><strong>Start Date</strong></ion-label>
          <ion-text class="input-box">{{
            formatDate(session.startDate.date)
          }}</ion-text>
        </ion-item>

        <ion-item>
          <ion-label position="stacked"><strong>End Date</strong></ion-label>
          <ion-text class="input-box">{{
            formatDate(session.endDate.date)
          }}</ion-text>
        </ion-item>

        <ion-item>
          <ion-label position="stacked"
            ><strong>Delivery Location</strong></ion-label
          >
          <ion-text class="input-box">{{ session.deliveryLocation }}</ion-text>
        </ion-item>

        <ion-item>
          <ion-label position="stacked"
            ><strong>Delivery Method</strong></ion-label
          >
          <ion-text class="input-box">{{ session.deliveryMethod }}</ion-text>
        </ion-item>

        <ion-item>
          <ion-label position="stacked"><strong>Status</strong></ion-label>
          <ion-text class="input-box">{{ session.status }}</ion-text>
        </ion-item>

        <ion-item>
          <ion-label position="stacked"
            ><strong>Training Materials</strong></ion-label
          >
          <ion-button
            expand="block"
            fill="solid"
            color="primary"
            :href="session.trainingMaterials"
            target="_blank"
          >
            Open
          </ion-button>
          <br />
        </ion-item>

        <!-- Updated ion-textarea -->
        <ion-item>
          <ion-label position="stacked"><strong>Description</strong></ion-label>
          <ion-textarea
            readonly
            class="input-box"
            :value="session.description"
          ></ion-textarea>
        </ion-item>

        <div class="button-group">
          <ion-button expand="block" fill="outline" color="medium"
            >Cancel</ion-button
          >
          <ion-button expand="block" fill="solid" color="primary"
            >Take Assessment</ion-button
          >
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonButton,
  IonTextarea,
  IonText,
} from "@ionic/vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import { defineComponent, onMounted, ref } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonItem,
    IonLabel,
    IonButton,
    IonTextarea,
    IonText,
    HeaderReturn,
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const sessionId = route.query.id;

    const session = ref({
      name: "",
      startDate: { date: "" },
      endDate: { date: "" },
      deliveryLocation: "",
      deliveryMethod: "",
      status: "",
      trainingMaterials: "",
      description: "",
    });
    const theme = ref({});

    // Function to format date
    function formatDate(dateString) {
      if (!dateString) return "";
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Function to fetch theme
    function fetchTheme() {
      const storedThemeData = localStorage.getItem("themeData");
      const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};
      theme.value = themeData;
    }

    // Function to fetch session data
    async function fetchSession() {
      try {
        store.commit("loader/updateLoader", true); // Show loader

        const baseURL = localStorage.getItem("baseUrl");
        const storedToken = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const response = await axios.get(
          `${baseURL}api/v2/training/session/${sessionId}`,
          { headers }
        );
        session.value = response.data.data;
      } catch (error) {
        console.error("Error fetching session data:", error);
      } finally {
        store.commit("loader/updateLoader", false); // Hide loader
      }
    }

    // Fetch data on component mount
    onMounted(() => {
      fetchTheme();
      fetchSession();
    });

    return {
      session,
      theme,
      formatDate,
    };
  },
});
</script>

<style scoped>
.session-form-container {
  padding: 16px;
  border-radius: 12px;
  background-color: #f9f9f9;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: auto;
}

.description-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 16px;
}

.input-box {
  display: block;
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
  border-radius: 6px;
  background-color: #eef1f7;
  color: #444;
  z-index: -1;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}
</style>
