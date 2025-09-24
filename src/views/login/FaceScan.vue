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
      <div v-if="loading" class="loading-overlay">
        <div class="loading-content">
          <ion-spinner name="crescent" color="primary"></ion-spinner>
          <h3>Loading Face Recognition...</h3>
          <p>Please wait while we initialize the camera and models</p>
        </div>
      </div>
      <div class="camera-container" v-else>
        <div class="video-wrapper">
          <video
            ref="video"
            autoplay
            playsinline
            muted
            class="face-video"
            :style="{
              display: cameraOn ? 'block' : 'none',
            }"
          ></video>
          <canvas
            ref="canvas"
            class="face-canvas"
            :style="{
              display: cameraOn ? 'block' : 'none',
            }"
          ></canvas>
          <div class="camera-placeholder" v-if="!cameraOn">
            <ion-icon
              name="camera-outline"
              size="large"
              color="medium"
            ></ion-icon>
            <p>Camera is off</p>
          </div>
          <div class="scan-overlay" v-if="processing && cameraOn">
            <ion-spinner name="crescent" color="primary"></ion-spinner>
            <p class="scan-text">{{ authStatus || "Scanning..." }}</p>
          </div>
        </div>
      </div>

      <ion-button @click="switchMode" class="mode-switch-button">
        <ion-icon name="swap-horizontal" slot="icon-only"></ion-icon>
      </ion-button>

      <ion-button
        v-if="mode === 'enroll'"
        @click="enrollFace"
        :disabled="processing || !cameraOn"
        class="enroll-button"
      >
        <ion-icon name="person-add" slot="icon-only"></ion-icon>
      </ion-button>
      <ion-modal :is-open="mode === 'enroll'" @didDismiss="mode = 'auth'">
        <ion-card class="enrollment-card">
          <ion-card-header class="enrollment-card-header">
            <ion-card-title class="enrollment-card-title">
              <ion-icon name="person-add-outline" class="card-icon"></ion-icon>
              Enroll New Face
            </ion-card-title>
          </ion-card-header>

          <ion-card-content class="enrollment-card-content">
            <!-- Search Box -->
            <div class="search-container">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search employees..."
                class="search-input"
                :disabled="processing"
              />
              <span class="search-icon">🔍</span>
            </div>

            <!-- Employee List -->
            <div class="employee-list">
              <div
                v-for="employee in filteredEmployees"
                :key="employee.id"
                class="employee-item"
                :class="{ selected: selectedEmployee === employee }"
                @click="selectedEmployee = employee"
                :style="{ pointerEvents: processing ? 'none' : 'auto' }"
              >
                <div class="employee-name">{{ employee.name }}</div>
                <div class="employee-id">ID: {{ employee.id }}</div>
                <div v-if="employee.face_signature" class="face-status">
                  Has enrolled face
                </div>
              </div>
            </div>

            <ion-button
              @click="enrollFace"
              expand="block"
              color="primary"
              :disabled="processing || !cameraOn || !selectedEmployee"
              class="enroll-submit-button"
            >
              <ion-icon name="checkmark-circle" slot="start"></ion-icon>
              Enroll Face
            </ion-button>

            <ion-button
              @click="goToEnrolledFaces"
              expand="block"
              color="primary"
              fill="outline"
              class="manage-faces-button"
            >
              <ion-icon name="list-outline" slot="start"></ion-icon>
              Manage All Enrolled Faces
            </ion-button>
          </ion-card-content>
        </ion-card>
      </ion-modal>

      <ion-spinner v-if="loading" name="crescent"></ion-spinner>
      <ClockInModal
        :is-open="authenticated"
        :scanned-username="scannedUsername"
        :scanned-name="scannedName"
        @didDismiss="closeAuthenticated"
      />
    </ion-content>
  </ion-page>
</template>

<script>
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
  IonModal,
} from "@ionic/vue";
import { camera } from "ionicons/icons";
import * as faceapi from "face-api.js";
import { useRouter } from "vue-router";
import { defineComponent } from "vue";
import Refresher from "@/components/refresher/Refresher.vue";
import { useStore } from "vuex";
import axios from "axios";
import { runBackgroundScript } from "@/notification/Notification.ts";
import ClockInModal from "./components/ClockInModal.vue";

export default defineComponent({
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
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    return { router, store };
  },
  data() {
    return {
      camera,
      loading: true,
      modelsLoaded: false,
      stream: null,
      processing: false,
      mode: "auth",
      storedFaces: [],
      authenticated: false,
      cameraOn: false,
      theme: {},
      searchQuery: "",
      scannedUsername: "",
      scannedName: "",
      employees: [],
      selectedEmployee: null,
      authStatus: "",
    };
  },
  computed: {
    filteredEmployees() {
      const query = this.searchQuery.toLowerCase();
      return this.employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(query) ||
          employee.id.toLowerCase().includes(query)
      );
    },
  },
  async mounted() {
    this.fetchTheme();
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri(
        "https://justadudewhohacks.github.io/face-api.js/models/"
      );
      await faceapi.nets.faceLandmark68Net.loadFromUri(
        "https://justadudewhohacks.github.io/face-api.js/models/"
      );
      await faceapi.nets.faceRecognitionNet.loadFromUri(
        "https://justadudewhohacks.github.io/face-api.js/models/"
      );
      this.modelsLoaded = true;
      this.loadStoredFaces();
      // Fetch employees for registration
      await this.fetchEmployees();
    } catch (error) {
      console.error("Error loading face detection models:", error);
      await this.presentAlert(
        "Failed to load face detection models. Please try again later."
      );
    } finally {
      this.loading = false;
      this.$nextTick(() => {
        this.startCamera();
      });
    }
  },
  methods: {
    async startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        this.$refs.video.srcObject = stream;
        this.stream = stream;
        this.cameraOn = true;
        this.processFrames();
      } catch (error) {
        console.error("Error accessing camera:", error);
        await this.presentAlert(
          "Error accessing camera. Please check permissions."
        );
      }
    },
    stopCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop());
        this.stream = null;
        this.cameraOn = false;
      }
    },
    async switchMode() {
      if (this.mode === "auth") {
        // Switching to enroll mode - require password
        const password = prompt("Enter admin password to access enrollment:");
        if (password === "admin123") {
          this.mode = "enroll";
        } else {
          alert("Incorrect password");
        }
      } else {
        // Switching back to auth mode - no password required
        this.mode = "auth";
      }
    },
    async processFrames() {
      if (!this.processing && this.modelsLoaded) {
        const video = this.$refs.video;
        if (video.videoWidth === 0) {
          requestAnimationFrame(this.processFrames);
          return;
        }
        try {
          const detection = await faceapi
            .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();
          // Draw detection box
          const canvas = this.$refs.canvas;
          const ctx = canvas.getContext("2d");
          canvas.width = video.clientWidth;
          canvas.height = video.clientHeight;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (detection) {
            const scaleX = video.clientWidth / video.videoWidth;
            const scaleY = video.clientHeight / video.videoHeight;
            const box = detection.detection.box;
            const scaledBox = {
              x: box.x * scaleX,
              y: box.y * scaleY,
              width: box.width * scaleX,
              height: box.height * scaleY,
            };

            const centerX = scaledBox.x + scaledBox.width / 2;
            const centerY = scaledBox.y + scaledBox.height / 2;
            const radius = Math.max(scaledBox.width, scaledBox.height) / 2;

            // Clear previous frame
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 🔵 Main circular scan overlay
            ctx.strokeStyle = "#00f9ff"; // neon blue
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();

            // 🔵 Animated radar arcs
            const now = Date.now() / 500;
            ctx.strokeStyle = "rgba(0,249,255,0.5)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(
              centerX,
              centerY,
              radius * 0.9,
              now % (Math.PI * 2),
              (now % (Math.PI * 2)) + Math.PI / 4
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(
              centerX,
              centerY,
              radius * 0.7,
              (now % (Math.PI * 2)) + Math.PI / 2,
              (now % (Math.PI * 2)) + Math.PI / 2 + Math.PI / 4
            );
            ctx.stroke();

            // 🔵 Crosshair lines
            ctx.strokeStyle = "#00f9ff";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(centerX - radius, centerY);
            ctx.lineTo(centerX + radius, centerY);
            ctx.moveTo(centerX, centerY - radius);
            ctx.lineTo(centerX, centerY + radius);
            ctx.stroke();

            // Text
            ctx.font = "14px Arial";
            ctx.fillStyle = "#00f9ff";
            const text = "Scanning...";
            const textWidth = ctx.measureText(text).width;
            ctx.fillText(text, centerX - textWidth / 2, centerY + radius + 20);

            // ✅ Authentication logic stays here
            if (this.mode === "auth") {
              const stored = JSON.parse(
                localStorage.getItem("faceIds") || "[]"
              );
              let minDistance = Infinity;
              let matchedId = null;

              for (const face of stored) {
                const distance = faceapi.euclideanDistance(
                  detection.descriptor,
                  face.descriptor
                );
                if (distance < minDistance) {
                  minDistance = distance;
                  matchedId = face.id;
                }
              }

              if (minDistance < 0.6) {
                // threshold
                const matchedFace = stored.find((f) => f.id === matchedId);
                this.scannedUsername = matchedFace.username;

                // Optionally draw a green circle to indicate success:
                ctx.strokeStyle = "#00ff80";
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.stroke();

                ctx.font = "16px Arial";
                ctx.fillStyle = "#00ff80";
                ctx.fillText(
                  "Authenticated!",
                  centerX - ctx.measureText("Authenticated!").width / 2,
                  centerY + radius + 20
                );

                this.processing = true;
                this.authStatus = "Authenticating...";
                await this.performLogin(matchedFace);
                return; // stop scanning after login
              } else {
                this.authStatus = "Invalid User or Not Registered";
              }
            }
          }
        } catch (error) {
          console.error("Error processing frame:", error);
        }
      }
      requestAnimationFrame(this.processFrames);
    },
    async fetchEmployees() {
      try {
        const response = await axios.get(
          "https://hrvale.bapplware.com/users/data"
        );
        this.employees = response.data.data.map((emp) => ({
          id: emp.username,
          name: emp.username,
          fingerprint:
            emp.finger_print === "undefined"
              ? undefined
              : emp.finger_print || undefined,
          face_signature:
            emp.face_signature === "undefined"
              ? undefined
              : emp.face_signature || undefined,
        }));
        localStorage.setItem("employeesData", JSON.stringify(this.employees));
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    },
    async enrollFace() {
      this.processing = true;
      try {
        if (!this.selectedEmployee) {
          this.presentAlert("Please select an employee.");
          this.processing = false;
          return;
        }

        const video = this.$refs.video;
        const detection = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();
        if (detection) {
          // Generate unique face ID
          const faceId = `${
            this.selectedEmployee.id
          }_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const stored = JSON.parse(localStorage.getItem("faceIds") || "[]");
          stored.push({
            id: Date.now(),
            name: faceId,
            descriptor: Array.from(detection.descriptor),
            username: this.selectedEmployee.id,
            client: "default", // Default client
            employee: this.selectedEmployee,
          });
          localStorage.setItem("faceIds", JSON.stringify(stored));
          this.loadStoredFaces();
          this.presentAlert(
            `Face enrolled successfully for ${this.selectedEmployee.name}!`
          );
          try {
            let employeesData = JSON.parse(
              localStorage.getItem("employeesData") || "[]"
            );
            const employeeIndex = employeesData.findIndex(
              (emp) => emp.id === this.selectedEmployee.id
            );

            if (employeeIndex !== -1) {
              employeesData[employeeIndex].face_signature = JSON.stringify(
                Array.from(detection.descriptor)
              );
              localStorage.setItem(
                "employeesData",
                JSON.stringify(employeesData)
              );
              this.presentAlert(
                `Face signature updated locally for ${this.selectedEmployee.name}!`
              );
            } else {
              this.presentAlert(`Employee not found in local storage!`);
            }
          } catch (error) {
            console.error(
              "Error updating face signature in local storage:",
              error
            );
            this.presentAlert(
              "Error updating face signature in local storage. Please try again."
            );
          }
          // Clear selection
          this.selectedEmployee = null;
          this.searchQuery = "";
        } else {
          this.presentAlert("No face detected. Please try again.");
        }
      } catch (error) {
        console.error("Error enrolling face:", error);
        this.presentAlert("Error enrolling face. Please try again.");
      }
      this.processing = false;
    },
    loadStoredFaces() {
      this.storedFaces = JSON.parse(localStorage.getItem("faceIds") || "[]");
      // Ensure all faces have a name
      this.storedFaces.forEach((face) => {
        if (!face.name) {
          face.name = "Face " + face.id;
        }
      });
      localStorage.setItem("faceIds", JSON.stringify(this.storedFaces));
    },
    deleteFace(id) {
      this.storedFaces = this.storedFaces.filter((f) => f.id !== id);
      localStorage.setItem("faceIds", JSON.stringify(this.storedFaces));
    },
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
    closeAuthenticated() {
      this.stopCamera();
      this.authenticated = false;
      this.processing = false;
      this.processFrames();
      this.router.push("/facescan");
      console.log("Close authenticated, restart scanning");
    },

    fetchTheme() {
      const storedThemeData = localStorage.getItem("themeData");

      const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};

      this.theme = themeData;

      // Set CSS variables to use theme colors
      document.documentElement.style.setProperty(
        "--ion-color-primary",
        "#008e9c"
      );
      document.documentElement.style.setProperty(
        "--ion-color-primary-contrast",
        "#ffffff"
      );
    },
    goToEnrolledFaces() {
      const password = prompt(
        "Enter admin password to manage enrolled faces:"
      );
      if (password === "admin123") {
        this.router.push("/enrolledfaces");
      } else {
        alert("Incorrect password");
      }
    },
    async presentAlert(message, handler = null) {
      // const alert = await alertController.create({
      //   header: "Face Scan",
      //   message,
      //   buttons: [
      //     {
      //       text: "OK",
      //       handler,
      //     },
      //   ],
      // });
      // await alert.present();
    },
    async performLogin(face) {
      // This method handles the login process after a face is successfully authenticated.
      // It dispatches a Vuex action to get a token, and then stores it in localStorage.
      try {
        const employee = face.employee;
        if (!employee) {
          this.authStatus = "Employee data not found";
          return;
        }

        this.store.commit("loader/updateLoader", true);

        const authResult = await this.store.dispatch(
          "auth/biometricLogin",
          employee
        );

        if (authResult.success) {
          this.authStatus = "Authenticated";
          console.log(
            "Authentication successful:",
            authResult.data.access_token
          );
          localStorage.setItem("token", authResult.data.access_token);
          localStorage.setItem("access_token", authResult.data.access_token);
          localStorage.setItem("refresh_token", authResult.data.refresh_token);

          await this.fetchStoredTheme();
          // await this.hasPincode();
          localStorage.setItem("hasSetup", true);

          const userCredentials = {
            username: employee.username || employee.id,
            client: "suysing",
          };
          localStorage.setItem(
            "userCredentials",
            JSON.stringify(userCredentials)
          );

          this.authenticated = true;
        } else {
          this.authStatus = "Invalid User or Not Registered";
        }
      } catch (error) {
        console.error(error.message);
        localStorage.setItem("hasSetup", false);
        this.authStatus = "An error occurred during login.";
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },
    // async fetchToken() {
    //   try {
    //     const accessToken = localStorage.getItem("access_token");
    //     const refreshToken = localStorage.getItem("refresh_token");
    //     const baseURL = localStorage.getItem("baseUrl");

    //     if (!accessToken || !refreshToken || !baseURL) {
    //       throw new Error("Missing access_token, refresh_token, or baseURL");
    //     }

    //     const url = new URL(baseURL);
    //     const tokenUrl = `${url.origin}/web/index.php/auth/token`;

    //     const response = await axios.post(tokenUrl, {
    //       token: accessToken,
    //       // refresh_token: refreshToken,
    //     });
    //     console.log("token response ", response);

    //     localStorage.setItem("token", response.data.token);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
    // async hasPincode() {
    //   try {
    //     await this.fetchToken();

    //     const storedToken = localStorage.getItem("token");
    //     const baseURL = localStorage.getItem("baseUrl");
    //     const authToken = `Bearer ${storedToken}`;
    //     const apiUrl = baseURL + `api/ess/pincode`;
    //     const headers = { Authorization: authToken };
    //     const response = await axios.get(apiUrl, { headers });

    //     await this.fetchUserDetails();

    //     if (response.data.data.pincode) {
    //       try {
    //         await runBackgroundScript();

    //         localStorage.setItem("pincode", response.data.data.pincode);
    //         // this.router.push("/WelcomeTermsAndCondition");
    //       } catch (innerError) {
    //         console.log(innerError.message);
    //         location.reload();
    //       }
    //     } else {
    //       this.router.push("/setuppincodelogin");
    //     }
    //   } catch (error) {
    //     console.log(error.message);
    //     localStorage.setItem("hasSetup", false);
    //   } finally {
    //     this.store.commit("loader/updateLoader", false);
    //   }
    // },
    async fetchUserDetails() {
      try {
        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const headers = { Authorization: `Bearer ${storedToken}` };
        const api = baseURL + `api/v2/user/me`;
        const dataResponse = await axios.get(api, { headers });

        this.empNumber = dataResponse.data.data.employee.empNumber;
        localStorage.setItem(
          "empNumber",
          dataResponse.data.data.employee.empNumber
        );

        localStorage.setItem(
          "myDetails",
          JSON.stringify(dataResponse.data.data)
        );

        const employee = dataResponse.data.data.employee;
        this.scannedName = `${employee.firstName} ${employee.lastName}`;
      } catch (error) {
        console.log(error.message);
        if (error.message === "Request failed with status code 401") {
          this.checkToken();
        } else {
          this.router.replace("/setuplogin");
        }
      }
    },
    checkToken() {
      // Simple checkToken method
      this.router.replace("/setuplogin");
    },
    async fetchStoredTheme() {
      try {
        const storedThemeData = localStorage.getItem("configs");
        const configs = storedThemeData ? JSON.parse(storedThemeData) : [];

        const brandingConfig = configs.find((item) => item.name === "branding");
        const authConfigs = configs.find(
          (item) => item.name === "authentication"
        );

        // Branding Theme
        if (brandingConfig) {
          const theme = brandingConfig.configuration.theme;
          const services = brandingConfig.configuration.services;
          const client = brandingConfig.configuration.client;

          if (theme) {
            localStorage.setItem("themeData", JSON.stringify(theme));
            this.theme = theme;
            localStorage.setItem("servicesConfig", JSON.stringify(services));
            localStorage.setItem("client", JSON.stringify(client));
          } else {
            console.error("Theme not found in the branding configuration.");
          }
        } else {
          console.error("Configuration for branding not found.");
        }

        // Authentication
        if (authConfigs) {
          const apiHost = authConfigs.configuration.apiHost;
          localStorage.setItem("baseUrl", apiHost);
        } else {
          console.error("Configuration for Auth not found.");
        }
      } catch (error) {
        console.error("Error fetching or parsing theme data:", error);
        localStorage.setItem("hasSetup", false);
      }
    },
  },
  created() {
    this.fetchTheme();
  },
  beforeUnmount() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
  },
  beforeDestroy() {
    clearInterval(this.updateInterval);
  },
});
</script>

<style scoped>
.face-scan-content {
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
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
  max-width: 700px;
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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.face-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  height: 200px;
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
  position: absolute;
  top: 16px;
  right: 16px;
  --border-radius: 50%;
  width: 60px;
  height: 60px;
}

.enroll-button {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  --border-radius: 50%;
  width: 60px;
  height: 60px;
}

.enrollment-card {
  width: 100%;
  max-width: 400px;
  --background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.enrollment-card-header {
  text-align: center;
  padding: 20px 20px 0 20px;
}

.enrollment-card-title {
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

.enrollment-card-content {
  padding: 20px;
}

.search-container {
  position: relative;
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.employee-list {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 2rem;
}

.employee-item {
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.employee-item:hover {
  background-color: #f5f5f5;
}

.employee-item.selected {
  background-color: #e3f2fd;
  border-color: #008e9c;
}

.employee-name {
  font-weight: 500;
  color: #333;
}

.employee-id {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.25rem;
}

.face-status {
  font-size: 0.8rem;
  color: #ffc107;
  margin-top: 0.25rem;
  font-style: italic;
}

.enrollment-item {
  --border-radius: 12px;
  --padding-start: 16px;
  --inner-padding-end: 16px;
  margin-bottom: 16px;
  --background: rgba(255, 255, 255, 0.8);
}

.enroll-submit-button {
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
  margin-top: 16px;
}

.clock-modal {
  --background: transparent;
  --border-radius: 20px;
  --height: 90%;
  --width: 95%;
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
</style>
