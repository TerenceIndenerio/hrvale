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
      <div class="container">
        <ion-card class="card result-container">
          <h4 class="text-center outlineColor">{{ totalRec }} Record Found</h4>
          <div v-for="(result, index) in results" :key="index">
            <BenefitCard
              :benefitCode="result.benefitCode"
              :benefitName="result.benefitName"
              :benefitType="result.benefitType"
            />
          </div>
        </ion-card>
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
} from "@ionic/vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import { defineComponent } from "vue";
import Refresher from "@/components/refresher/Refresher.vue";
import BenefitCard from "@/views/services/benefits/components/BenefitCard.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import { GlobalConstants } from "@/config/constants";
import { toastController } from "@ionic/vue";
import { getThemeData } from "@/theme/theme";

const baseURL = GlobalConstants.HOST_URL;

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonInput,
    IonItem,
    HeaderReturn,
    IonLabel,
    Refresher,
    IonCard,
    BenefitCard,
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
      headerTitle: "Approval",
      results: [],
      headerTitle: "Benefits",
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
    // Exppiration of token
    async checkTokenExpiration() {
      const storedToken = localStorage.getItem("_token");

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

    async fetchRequest() {
      try {
        this.store.commit("loader/updateLoader", true);

        await this.checkTokenExpiration();

        const storedToken = localStorage.getItem("_token");

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const api = baseURL + `api/v2/benefit-packages/5?limit=50&offset=0`;
        const dataResponse = await axios.get(api, { headers });

        const { id, payGradeName, jobCategoryName, name, packageItems } =
          dataResponse.data.data;

        const mappedPackageItems = packageItems.map((item) => ({
          benefitType: item.benefitType,
          benefitName: item.benefitName,
          benefitCode: item.benefitCode,
        }));

        const dataMap = {
          id,
          payGradeName,
          jobCategoryName,
          name,
          packageItems: mappedPackageItems,
        };
        this.results = dataMap.packageItems;
        this.totalRec = this.results.length;

        this.store.commit("loader/updateLoader", false);
      } catch (error) {
        this.store.commit("loader/updateLoader", false);
        console.error("Error fetching benefit package: ", error);

        this.showErrorMessage("An error occurred: " + error.message);
      }
    },

    async showErrorMessage(message) {
      try {
        const toast = await toastController.create({
          message: message,
          duration: 3000,
          position: "top",
          color: "danger",
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

    handleView(result) {
      this.selectedResult = result;
      console.log("Selected", this.selectedResult);
      console.log("Selected", result);
      this.isOpen = true;
    },

    setOpen(val) {
      this.isOpen = val;
    },
    getTheme() {
      const storedThemeData = getThemeData();

      if (storedThemeData) {
        this.theme = storedThemeData;
      }
      this.theme = storedThemeData;
    },
  },
  created() {
    this.checkTokenExpiration();
    this.getTheme();
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
.outlineColor {
  border: 1px solid #828282;
  color: #828282;
  border-radius: 20px;
  width: 90%;
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
</style>
