<template>
  <ion-page>
    <HeaderReturn
      v-if="!loading"
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    />
    <ion-content :fullscreen="true" v-if="!loading">
      <Refresher />

      <div class="result-container neomorphic-card-1">
        <h4 class="text-center neomorphic-input-2 record-label">
          {{ totalRec }} Record(s) Found
        </h4>

        <div
          v-for="(result, index) in results"
          :key="index"
          class="result-card"
        >
          <IonCard class="ion-padding neomorphic-card-1 card-content">
            <h5>{{ result.topic }}</h5>
            <p>Published Date: {{ formatDate(result.publishedDate.date) }}</p>
            <p>Category: {{ result.category }}</p>
            <div>
              <a
                :href="`data:${result.attachments.type};base64,${result.attachments.base64}`"
                :download="result.attachments.name"
                @click="onDownload(result.attachments.name)"
              >
                <IonIcon name="download-outline" />
                {{ result.attachments.name }}
              </a>
            </div>
          </IonCard>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonContent, IonIcon, IonCard } from "@ionic/vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import { defineComponent } from "vue";
import Refresher from "@/components/refresher/Refresher.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import { toastController } from "@ionic/vue";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    HeaderReturn,
    Refresher,
    IonCard,
    IonIcon,
  },
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    return {
      results: [],
      headerTitle: "Document",
      selectedDateFrom: formattedDate,
      selectedDateTo: formattedDate,
      isModalVisible: false,
      selectedResult: null,
      isOpen: false,
      theme: {},
      loading: true,
      totalRec: 0,
    };
  },

  methods: {
    async checkTokenExpiration() {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        console.error("Token not available.");
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

    async fetchRequest() {
      try {
        this.store.commit("loader/updateLoader", true);
        const baseURL = localStorage.getItem("baseUrl");
        await this.checkTokenExpiration();

        const storedToken = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const api = baseURL + `api/v2/admin/document-config`;
        const dataResponse = await axios.get(api, { headers });

        this.results = dataResponse.data.data;
        this.totalRec = this.results.length;
        this.store.commit("loader/updateLoader", false);
      } catch (error) {
        this.store.commit("loader/updateLoader", false);
        console.error("Error fetching benefit package: ", error);

        this.showErrorMessage(error.response?.data?.error?.message);
      }
    },

    formatDate(dateStr) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    },

    async showErrorMessage(message) {
      try {
        const toast = await toastController.create({
          message: message,
          duration: 3000,
          position: "top",
          color: "light",
          buttons: [
            {
              icon: "close-outline",
              role: "cancel",
            },
          ],
        });
        await toast.present();
      } catch (error) {
        console.error("Error displaying toast:", error);
      }
    },

    fetchTheme() {
      const storedThemeData = localStorage.getItem("themeData");
      const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};
      this.theme = themeData;
    },

    onDownload(filename) {
      console.log(`Downloading file: ${filename}`);
      // Add any additional logic if needed
    },
  },

  created() {
    this.checkTokenExpiration();
    this.fetchTheme();
    this.fetchRequest();

    this.loading = false;
  },
});
</script>

<style scoped>
.text-center {
  text-align: center;
  margin: auto;
}
.card {
  border-radius: 20px;
  width: fit-content;
}

.card-modal {
  border-radius: 20px;
  max-width: 400px;
  margin-top: 0;
}
.result-container {
  padding: 10px 0;
  width: fit-content;
  min-width: 300px;
  margin: 0 auto;
}
.flex-right {
  float: right;
  margin: 10px 5%;
  width: 120px;
}
.btn-container {
  margin: 0 10px 10px 10px;
  border-radius: 10px;
  overflow: hidden;
}
.record-label {
  color: #828282;
  border-radius: 20px;
  padding: 5px 10px;
  width: fit-content;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 0 5px 0 20px;
}

.container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.date-container {
  width: 300px;
  margin: 10px auto;
}
.search-container {
  min-width: 330px;
}
ion-modal#example-modal {
  --width: 350px;
  --min-width: 250px;
  --height: fit-content;
  --border-radius: 20px;
}
.no-data-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.card-content {
  margin: 15px;
  padding: 10px;
}
.card-content h5 {
  margin: 0;
}
</style>
