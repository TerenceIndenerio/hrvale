<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/facescan"></ion-back-button>
        </ion-buttons>
        <ion-title>Registered Faces</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="addFace">
            <ion-icon name="add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
          <ion-col size="2">
            <ion-text><strong>Name</strong></ion-text>
          </ion-col>
          <ion-col size="2">
            <ion-text><strong>Username</strong></ion-text>
          </ion-col>
          <ion-col size="2">
            <ion-text><strong>Client</strong></ion-text>
          </ion-col>
          <ion-col size="3">
            <ion-text><strong>Registered Date</strong></ion-text>
          </ion-col>
          <ion-col size="3">
            <ion-text><strong>Actions</strong></ion-text>
          </ion-col>
        </ion-row>
        <ion-row v-for="face in storedFaces" :key="face.id">
          <ion-col size="2">
            <ion-input
              v-model="face.name"
              @ionBlur="updateFace(face)"
              placeholder="Enter name"
            ></ion-input>
          </ion-col>
          <ion-col size="2">
            <ion-text>{{ face.username }}</ion-text>
          </ion-col>
          <ion-col size="2">
            <ion-text>{{ face.client }}</ion-text>
          </ion-col>
          <ion-col size="3">
            <ion-text>{{ new Date(face.id).toLocaleDateString() }}</ion-text>
          </ion-col>
          <ion-col size="3">
            <ion-button
              color="danger"
              size="small"
              @click="deleteFace(face.id)"
            >
              <ion-icon name="trash"></ion-icon>
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonBackButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonInput,
  alertController,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonBackButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonInput,
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      storedFaces: [],
    };
  },
  mounted() {
    this.loadStoredFaces();
  },
  methods: {
    loadStoredFaces() {
      this.storedFaces = JSON.parse(localStorage.getItem("faceIds") || "[]");
    },
    addFace() {
      this.router.push("/facescan?mode=register");
    },
    updateFace(face) {
      const stored = JSON.parse(localStorage.getItem("faceIds") || "[]");
      const index = stored.findIndex((f) => f.id === face.id);
      if (index !== -1) {
        stored[index] = face;
        localStorage.setItem("faceIds", JSON.stringify(stored));
      }
    },
    async deleteFace(id) {
      const alert = await alertController.create({
        header: "Confirm Delete",
        message: "Are you sure you want to delete this face?",
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Delete",
            role: "destructive",
            handler: () => {
              this.storedFaces = this.storedFaces.filter((f) => f.id !== id);
              localStorage.setItem("faceIds", JSON.stringify(this.storedFaces));
            },
          },
        ],
      });
      await alert.present();
    },
  },
});
</script>

<style scoped>
ion-grid {
  padding: 16px;
}
</style>
