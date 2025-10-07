<template>
  <ion-page>
    <ion-content
      :fullscreen="true"
      class="face-scan-content"
      :style="{
        '--background':
          'linear-gradient(to right top, #008e9c, #00828f, #007782, #006b75, #006069)',
      }"
    >
      <Refresher />
      <ion-header class="face-scan-header">
        <div class="face-scan-title">
          <img
            src="/assets/images/hrvaleofficiallogofinal.png"
            alt="HRVale Logo"
            class="header-logo"
          />
          <h4>Face Scan</h4>
        </div>
      </ion-header>

      <div v-if="loading" class="loading-overlay">
        <div class="loading-content">
          <ion-spinner name="crescent" color="primary"></ion-spinner>
          <h3>Loading Face Recognition...</h3>
          <p>Please wait while we initialize the camera and models</p>
        </div>
      </div>

      <ion-grid v-else class="face-scan-grid">
        <ion-row>
          <ion-col size="12" class="face-scan-col">
            <ion-card class="face-scan-card">
              <ion-card-header class="face-scan-card-header">
                <ion-card-title class="face-scan-card-title">
                  {{ mode === "auth" ? "Authentication" : "Registration" }}
                </ion-card-title>
                <ion-card-subtitle class="face-scan-card-subtitle">
                  Position your face in the camera for
                  {{ mode === "auth" ? "authentication" : "registration" }}.
                </ion-card-subtitle>
              </ion-card-header>
              <br />

              <ion-card v-if="mode === 'register'" class="registration-card">
                <ion-card-header class="registration-card-header">
                  <ion-card-title class="registration-card-title">
                    <ion-icon
                      name="person-add-outline"
                      class="card-icon"
                    ></ion-icon>
                    Register New Face
                  </ion-card-title>
                </ion-card-header>
              </ion-card>

              <ion-card-content class="face-scan-card-content">
                <FaceScannerCamera
                  :cameraOn="cameraOn"
                  :processing="processing"
                  @update:cameraOn="cameraOn = $event"
                  ref="faceScannerCamera"
                />

                <ion-button
                  @click="switchMode"
                  fill="outline"
                  color="primary"
                  class="mode-switch-button"
                >
                  <ion-icon
                    :name="mode === 'auth' ? 'cog' : 'scan'"
                    slot="start"
                  ></ion-icon>
                </ion-button>

                <ion-button
                  @click="refreshPage"
                  fill="outline"
                  color="primary"
                  class="refresh-button"
                >
                  <ion-icon name="reload"></ion-icon>
                </ion-button>

                <ion-button
                  v-if="mode === 'register'"
                  @click="registerFace"
                  color="primary"
                  :disabled="processing || !cameraOn"
                  class="register-button"
                >
                  <ion-icon name="person-add" slot="start"></ion-icon>
                  Register Face
                </ion-button>

                <ion-button
                  v-if="mode === 'register'"
                  @click="goToRegisteredFacesTemp"
                  expand="block"
                  color="secondary"
                  fill="outline"
                  class="manage-faces-button ion-margin-top"
                >
                  <ion-icon name="list-outline" slot="start"></ion-icon>
                  Manage Registered Faces
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-spinner v-if="loading" name="crescent"></ion-spinner>
      <ClockInModal
        :is-open="authenticated"
        :scanned-username="scannedUsername"
        :scanned-first-name="scannedFirstName"
        :scanned-last-name="scannedLastName"
        @didDismiss="closeAuthenticated"
      />

      <RegistrationModal
        :isOpen="isRegisterModalOpen"
        @didDismiss="isRegisterModalOpen = false"
        @submit="submitRegistration"
      />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonContent,
  IonHeader,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonSpinner,
  IonGrid,
  IonCol,
  alertController,
  IonCardTitle,
  IonCardSubtitle,
  IonCardHeader,
  IonRow,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { defineComponent, ref, onMounted, nextTick, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import Refresher from "@/components/refresher/Refresher.vue";
import ClockInModal from "@/features/FaceScanner/components/ClockInModal.vue";
import FaceScannerCamera from "@/features/FaceScanner/components/FaceScannerCamera.vue";
import RegistrationModal from "@/features/FaceScanner/components/RegistrationModal.vue";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import {
  loadModels as loadFaceApiModels,
  detectSingleFace,
  findBestMatch,
  drawLandmarks,
  drawAuthenticatedBox,
} from "@/features/FaceScanner/services/faceapi.service";
import { performFaceLogin } from "@/features/FaceScanner/services/auth.face.service";

export default defineComponent({
  name: "FaceScannerPage",
  components: {
    IonPage,
    IonContent,
    IonHeader,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonSpinner,
    IonGrid,
    IonCol,
    Refresher,
    ClockInModal,
    FaceScannerCamera,
    RegistrationModal,
    IonCardTitle,
    IonCardSubtitle,
    IonCardHeader,
    IonRow,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const loading = ref(false);
    const modelsLoaded = ref(false);
    const processing = ref(false);
    const mode = ref<"auth" | "register">("auth");
    const storedFaces = ref<any[]>([]);
    const authenticated = ref(false);
    const cameraOn = ref(false);
    const scannedUsername = ref("");
    const scannedFirstName = ref("");
    const scannedLastName = ref("");
    const isRegisterModalOpen = ref(false);
    const faceScannerCamera = ref<any>(null);
    let frameRequest: number;

    onMounted(async () => {
      loading.value = true;
      fetchTheme();
      try {
        await loadFaceApiModels();
        modelsLoaded.value = true;
        loadStoredFaces();
        await nextTick();
        if (faceScannerCamera.value) {
          await faceScannerCamera.value.startCamera();
          processFrames();
        }
      } catch (error) {
        console.error(error);
        presentAlert("Initialization failed. Please refresh the page.");
      } finally {
        loading.value = false;
      }
    });

    onBeforeUnmount(() => {
        cancelAnimationFrame(frameRequest);
    });

    const processFrames = async () => {
      if (!processing.value && modelsLoaded.value && cameraOn.value) {
        const video = faceScannerCamera.value?.video;
        if (video && video.readyState === 4) {
          const detection = await detectSingleFace(video);
          const canvas = faceScannerCamera.value?.canvas;

          if (canvas && detection) {
            drawLandmarks(video, canvas, detection);

            if (mode.value === "auth") {
              const matchedFace = findBestMatch(
                detection.descriptor,
                storedFaces.value
              );
              if (matchedFace) {
                processing.value = true;
                drawAuthenticatedBox(canvas, detection, "Authenticated!");

                const loginResult = await performFaceLogin(matchedFace, store);

                if (loginResult.success) {
                  scannedUsername.value = loginResult.username;
                  scannedFirstName.value = loginResult.firstName;
                  scannedLastName.value = loginResult.lastName;
                  authenticated.value = true;

                  await TextToSpeech.speak({
                    text: `${getGreeting()} ${loginResult.firstName} ${
                      loginResult.lastName
                    }`,
                    lang: "en-US",
                    rate: 1.0,
                  });

                  cancelAnimationFrame(frameRequest); // Stop processing
                  return;
                } else {
                  processing.value = false; // Reset on failure
                }
              }
            }
          }
        }
      }
      frameRequest = requestAnimationFrame(processFrames);
    };

    const switchMode = () => {
      if (mode.value === "auth") {
        const password = prompt(
          "Enter admin password to access registration:"
        );
        if (password === "admin123") {
          mode.value = "register";
        } else {
          alert("Incorrect password");
        }
      } else {
        mode.value = "auth";
      }
    };

    const refreshPage = async () => {
      processing.value = false;
      authenticated.value = false;
      scannedUsername.value = "";
      scannedFirstName.value = "";
      scannedLastName.value = "";
      isRegisterModalOpen.value = false;

      if (faceScannerCamera.value) {
        await faceScannerCamera.value.startCamera();
        processFrames();
      }
    };

    const registerFace = () => {
      isRegisterModalOpen.value = true;
    };

    const submitRegistration = async (registrationData: any) => {
      processing.value = true;
      isRegisterModalOpen.value = false;

      const video = faceScannerCamera.value?.video;
      if (!video) {
        processing.value = false;
        return;
      }

      const detection = await detectSingleFace(video);

      if (detection) {
        const { username, password, clientID } = registrationData;
        const faceId = `${username}_${Date.now()}`;

        const stored = JSON.parse(localStorage.getItem("faceIds") || "[]");
        stored.push({
          id: Date.now(),
          name: faceId,
          descriptor: Array.from(detection.descriptor),
          username,
          password,
          clientID,
        });

        localStorage.setItem("faceIds", JSON.stringify(stored));
        loadStoredFaces();
        presentAlert(`Face registered successfully for ${username}!`);
      } else {
        presentAlert("No face detected. Please try again.");
      }
      processing.value = false;
    };

    const loadStoredFaces = () => {
      const faces = JSON.parse(localStorage.getItem("faceIds") || "[]");
      storedFaces.value = faces.map((face: any) => {
        if (
          face.descriptor &&
          typeof face.descriptor === "object" &&
          !Array.isArray(face.descriptor)
        ) {
          face.descriptor = Object.values(face.descriptor);
        }
        return face;
      });
    };

    const closeAuthenticated = async () => {
      authenticated.value = false;
      await refreshPage();
    };

    const fetchTheme = () => {
      const storedThemeData = localStorage.getItem("themeData");
      if (storedThemeData) {
        const themeData = JSON.parse(storedThemeData);
        document.documentElement.style.setProperty("--ion-color-primary", themeData.primary || "#008e9c");
        document.documentElement.style.setProperty("--ion-color-primary-contrast", themeData.contrast || "#ffffff");
      }
    };

    const goToRegisteredFacesTemp = () => {
      router.push("/registeredfacestemp");
    };

    const presentAlert = async (message: string) => {
      const alert = await alertController.create({
        header: "Face Scan",
        message,
        buttons: ["OK"],
      });
      await alert.present();
    };

    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) return "Good Morning";
      if (hour >= 12 && hour < 18) return "Good Afternoon";
      return "Good Evening";
    };

    return {
        loading,
        modelsLoaded,
        processing,
        mode,
        authenticated,
        cameraOn,
        scannedUsername,
        scannedFirstName,
        scannedLastName,
        isRegisterModalOpen,
        faceScannerCamera,
        switchMode,
        refreshPage,
        registerFace,
        submitRegistration,
        closeAuthenticated,
        goToRegisteredFacesTemp,
    };
  }
});
</script>

<style scoped>
.face-scan-content {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 16px;
  --padding-bottom: 16px;
}

.face-scan-header {
  --background: linear-gradient(
    to right top,
    #008e9c,
    #00828f,
    #007782,
    #006b75,
    #006069
  );
  border-radius: 10px;
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto 16px auto;
}
.face-scan-title {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  gap: 12px;
}
.face-scan-title h4 {
  color: white;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.title-icon {
  font-size: 24px;
}

.header-logo {
  height: 40px;
  width: auto;
  margin-left: auto;
}

.header-logo {
  height: 40px;
  margin-left: 8px;
}

.face-scan-grid {
  height: fit-content;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.face-scan-col {
  display: flex;
  justify-content: center;
}

.face-scan-card {
  width: 100%;
  /* max-width: 700px; */
  --background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.face-scan-card-header {
  text-align: center;
  padding: 20px 20px 0 20px;
}

.face-scan-card-title {
  --color: #2c3e50;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.face-scan-card-subtitle {
  --color: #7f8c8d;
  font-size: 14px;
  line-height: 1.4;
}

.face-scan-card-content {
  padding: 20px;
}

.camera-container {
  margin-bottom: 20px;
}

.video-wrapper {
  position: relative;
  width: 80vw;
  height: auto;
  min-height: 430px;
  margin: auto;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: #000;
}

.face-video {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 16px;
}

.face-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.scan-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.scan-text {
  margin-top: 12px;
  font-size: 16px;
  font-weight: 500;
}

.camera-placeholder {
  height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  border: 2px dashed #bdc3c7;
  margin-bottom: 20px;
  color: #7f8c8d;
}

.camera-placeholder p {
  margin-top: 8px;
  font-size: 14px;
}

.camera-button {
  --border-radius: 12px;
  margin-bottom: 12px;
  font-weight: 600;
  height: 48px;
}

.mode-switch-button {
  --border-radius: 50%;
  margin-bottom: 12px;
  font-weight: 600;
  width: 70px;
  height: 70px;
  position: absolute;
  top: 50%;
  right: 25px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-50%);
}

.mode-switch-button ion-icon {
  font-size: 50px;
  margin: 0;
  padding: 0;
}

.refresh-button {
  --border-radius: 50%;
  margin-bottom: 12px;
  font-weight: 600;
  width: 70px;
  height: 70px;
  position: absolute;
  top: 35%;
  right: 25px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-50%);
}

.refresh-button ion-icon {
  font-size: 80px;
  margin: 0;
  padding: 0;
}

.register-button {
  --border-radius: 12px;
  font-weight: 600;
  height: 50px;
  margin: 0 auto;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}

.registration-card {
  width: 100%;
  max-width: 400px;
  --background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin: 0 auto;

  /* position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);y */
  z-index: 1;
}

.registration-card-header {
  text-align: center;
}

.registration-card-title {
  --color: #2c3e50;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.card-icon {
  font-size: 20px;
}

.registration-card-content {
  padding: 20px;
}

.registration-item {
  --border-radius: 12px;
  --padding-start: 16px;
  --inner-padding-end: 16px;
  margin-bottom: 16px;
  --background: rgba(255, 255, 255, 0.8);
}

.register-submit-button {
  --border-radius: 12px;
  font-weight: 600;
  height: 48px;
  margin-top: 20px;
}

.faces-list-card {
  width: 100%;
  max-width: 400px;
  --background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: 20px;
}

.faces-list-card-header {
  text-align: center;
  padding: 20px 20px 0 20px;
}

.faces-list-card-title {
  --color: #2c3e50;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.faces-list-card-content {
  padding: 20px;
}

.faces-list {
  background: transparent;
  border-radius: 12px;
  overflow: hidden;
}

.face-item {
  --border-radius: 12px;
  --padding-start: 16px;
  --inner-padding-end: 16px;
  margin-bottom: 8px;
  --background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.manage-faces-button {
  --border-radius: 12px;
  font-weight: 600;
  height: 48px;
  width: fit-content;
  margin: 16px auto 0 auto;
}

.clock-modal {
  --background: transparent; /* Make modal background transparent */
  --border-radius: 20px;
  --height: 700px;
  --width: 650px;

  /* Glassmorphism effect */
  background: rgba(255, 255, 255, 0.1); /* transparent white overlay */
  backdrop-filter: blur(15px); /* actual blur effect */
  -webkit-backdrop-filter: blur(15px); /* for Safari */
  border: 1px solid rgba(255, 255, 255, 0.2); /* subtle border */
}

.clock-modal-header {
  --background: transparent;
}

.clock-toolbar {
  --background: transparent;
}

.clock-modal-title {
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 8px;
  background-color: white;
  border-radius: 10px;
}

.modal-title-icon {
  font-size: 20px;
  color: #2c3e50;
}

.clock-modal-content {
  --background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;

  --background: transparent;
  /* Glassmorphism effect */
  background: rgba(255, 255, 255, 0.1); /* transparent white overlay */
  backdrop-filter: blur(15px); /* actual blur effect */
  -webkit-backdrop-filter: blur(15px); /* for Safari */
  border: 1px solid rgba(255, 255, 255, 0.2); /* subtle border */
}

.clock-card {
  --background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 20px;
}

.user-info-card {
  --background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin: 10px auto 20px auto;
  padding: 16px;
  text-align: center;
}

.user-info-card p {
  margin: 8px 0;
  font-size: 16px;
  color: #ffffff;
}

.reminder-card {
  --background: rgba(255, 248, 200, 0.9);
  border-radius: 12px;
  border: 1px solid rgba(255, 193, 7, 0.3);
  max-width: 700px;
  margin: 0 auto 20px auto;
}

.reminder-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
}

.reminder-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  color: #856404;
}

.break-details-btn {
  --border-radius: 12px;
  font-weight: 700;
  height: 48px;
  max-width: 200px;
  margin: 0 auto;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to right top,
    #008e9c,
    #00828f,
    #007782,
    #006b75,
    #006069
  );
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
  color: white;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.loading-content h3 {
  margin: 20px 0 10px 0;
  font-size: 20px;
  font-weight: 600;
}

.loading-content p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
  color: #e3f2fd;
}

ion-spinner {
  margin: 20px auto;
  display: block;
}

.No-data-break-details {
  text-align: center;
  padding: 20px;
  color: #6c757d;
}

ion-button {
  --background: linear-gradient(
    to right,
    #008e9c,
    #00828f,
    #007782,
    #006b75,
    #006069
  );
  --color: white;
}

.face-scan-card-title,
.face-scan-card-subtitle,
.registration-card-title,
.user-info-card p,
.clock-modal-title {
  background: linear-gradient(
    to right,
    #008e9c,
    #00828f,
    #007782,
    #006b75,
    #006069
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.selected-emp {
  background-color: #e3f2fd;
  border-color: #008e9c;
  text-align: center;
  font-weight: 600;
  font-size: 18px;
}
</style>
