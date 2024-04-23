<template>
  <ion-page>
    <HeaderReturnNotification
      v-if="!loading"
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
      :headerTextColor="theme.primaryFontColor"
    />
    <ion-content :fullscreen="true" v-if="!loading">
      <Refresher />

      <div class="result-container">
        <div
          v-for="(result, index) in results"
          :key="index"
          class="neomorphic-card-1 result-item"
          :class="{ expanded: result.expanded }"
          @click="toggleExpand(result)"
        >
          <div class="notif-inner-item">
            <h5 class="notif-title">{{ result.title }}</h5>

            <p
              class="message"
              :class="{ collapse: !result.expanded }"
              :style="{ maxHeight: result.expanded ? 'none' : '35px' }"
            >
              {{ result.message }}
            </p>

            <button class="expand-button">
              <ion-icon
                :name="
                  result.expanded ? 'caret-up-outline' : 'caret-down-outline'
                "
              ></ion-icon>
            </button>
          </div>
          <p class="date">{{ result.dateCreated }}</p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonCard,
  IonButton,
  IonButtons,
  IonModal,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonCol,
  IonRow,
  IonGrid,
  IonIcon,
  IonCardHeader,
  IonCardContent,
} from "@ionic/vue";
import HeaderReturnNotification from "@/components/header/HeaderReturnNotification.vue";
import { defineComponent } from "vue";
import Refresher from "@/components/refresher/Refresher.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import { GlobalConstants } from "@/config/constants";
import { toastController } from "@ionic/vue";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonInput,
    IonItem,
    HeaderReturnNotification,
    IonLabel,
    Refresher,
    IonCard,
    IonButton,
    IonButtons,
    IonModal,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonCol,
    IonRow,
    IonGrid,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardContent,
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
      headerTitle: "Notification",
      selectedDateFrom: formattedDate,
      selectedDateTo: formattedDate,
      isModalVisible: false,
      selectedResult: null,
      isOpen: false,
      theme: {},
      loading: true,
      totalRec: 0,
      paygradeId: 0,
      empNumber: "",
      result: [],
    };
  },

  mutations: {
    updateResults(state, results) {
      state.results = results;
    },
  },

  methods: {
    // Expiration of token
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

    async fetchNotif() {
      try {
        this.store.commit("loader/updateLoader", true);
        const baseURL = localStorage.getItem("baseUrl");
        await this.checkTokenExpiration();

        const storedToken = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const api = baseURL + `api/push-notification/messages`;
        const response = await axios.get(api, { headers });

        this.results = response.data.data;

        this.store.commit("loader/updateLoader", false);
      } catch (error) {
        this.store.commit("loader/updateLoader", false);
        console.error("Error fetching messages: ", error);
        this.showErrorMessage(error.response?.data?.error?.message);
      }
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

    toggleExpand(result) {
      result.expanded = !result.expanded;
    },

    handleView(result) {
      this.selectedResult = result;
      this.isOpen = true;
    },

    setOpen(val) {
      this.isOpen = val;
    },
    fetchTheme() {
      const storedThemeData = localStorage.getItem("themeData");
      const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};

      this.theme = themeData;
    },
  },
  created() {
    this.empNumber = localStorage.getItem("empNumber");
    this.checkTokenExpiration();
    this.fetchTheme();
    this.fetchNotif();
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
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 5px;
  margin: 10px;
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
  width: 60%;
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

.notif-title {
  font-weight: 600;
  padding: 0 10px;
  margin: 5px 0;
}
.date {
  font-size: 10px;
  margin: 0;
  padding: 0 10px;
}
.message {
  padding: 0px 10px;
  margin: 0;
}
.result-item {
  width: 100%;
  border-radius: 10px;
  max-width: 500px;
  transition: max-height 0.3s ease;
  overflow: hidden;
}

.expand-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 5px;
  float: right;
  color: rgb(159, 159, 159);
}
.collapse {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ellipsis {
  display: inline-block;
  width: 1em;
  overflow: hidden;
  white-space: nowrap;
}
</style>
