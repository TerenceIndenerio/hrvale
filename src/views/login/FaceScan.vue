<template>
  <ion-page>
    <ion-content
      :fullscreen="true"
      class="face-scan-content"
      :style="{
        '--background': '#064ea0',
      }"
    >
      <Refresher />
      <ion-header class="face-scan-header">
        <div class="face-scan-title">
          <img
            src="https://hrp-uat-app.bapplware.com/web/index.php/admin/theme/image/loginBanner?1759126595199"
            alt="Logo"
            class="header-logo"
          />
        </div>
      </ion-header>

      <div v-if="loading" class="loading-overlay">
        <div class="loading-content">
          <h3>Loading Face Recognition...</h3>
          <p>Please wait while we initialize the camera and models</p>
          <ion-spinner name="crescent" color="primary"></ion-spinner>
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
                <div class="camera-container">
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
                      <ion-spinner
                        name="crescent"
                        color="primary"
                      ></ion-spinner>
                      <p class="scan-text">Scanning...</p>
                    </div>
                  </div>
                </div>

                <ion-button
                  @click="switchMode"
                  class="mode-switch-button"
                  color="None"
                >
                  <ion-icon
                    :name="mode === 'auth' ? 'cog' : 'scan'"
                    :style="{ color: '#064ea0' }"
                    slot="start"
                  ></ion-icon>
                </ion-button>

                <!-- Refresh Button -->
                <ion-button
                  @click="refreshPage"
                  class="refresh-button"
                  color="None"
                >
                  <ion-icon
                    name="reload"
                    :style="{ color: '#064ea0' }"
                  ></ion-icon>
                </ion-button>

                <ion-button
                  v-if="mode === 'register'"
                  @click="registerFace"
                  :disabled="processing || !cameraOn"
                  class="register-button"
                >
                  <ion-icon name="person-add" slot="start"></ion-icon>
                  Register Face
                </ion-button>

                <!-- <ion-button
                  v-if="mode === 'register'"
                  @click="goToRegisteredFacesTemp"
                  expand="block"
                  class="manage-faces-button ion-margin-top"
                >
                  <ion-icon name="list-outline" slot="start"></ion-icon>
                  Manage Registered Faces
                </ion-button> -->
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

      <!-- Registration Modal -->
      <ion-modal
        :is-open="isRegisterModalOpen"
        @didDismiss="isRegisterModalOpen = false"
      >
        <ion-header>
          <ion-toolbar>
            <ion-title>Register Credentials</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="isRegisterModalOpen = false"
                >Close</ion-button
              >
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
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
                Has registered face
              </div>
            </div>
          </div>
          <ion-button
            @click="submitRegistration"
            class="register-button ion-margin-top"
          >
            <ion-icon name="person-add" slot="start"></ion-icon>
            Register
          </ion-button>
        </ion-content>
      </ion-modal>
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
  IonCardTitle,
  IonCardSubtitle,
  IonCardHeader,
  IonRow,
  IonModal,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonItem,
  IonLabel,
  IonInput,
} from "@ionic/vue";
import { camera, scan } from "ionicons/icons";
import * as faceapi from "face-api.js";
import { useRouter } from "vue-router";
import { defineComponent } from "vue";
import Refresher from "@/components/refresher/Refresher.vue";
import { useStore } from "vuex";
import ClockInModal from "./components/ClockInModal.vue";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import generateToken from "@/store/token/accessToken.ts";
import axios from "axios";

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
    IonCardTitle,
    IonCardSubtitle,
    IonCardHeader,
    IonRow,
    TextToSpeech,
    IonModal,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonItem,
    IonLabel,
    IonInput,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    return { router, store };
  },
  data() {
    return {
      camera,
      loading: false,
      modelsLoaded: false,
      stream: null,
      processing: false,
      mode: "auth",
      storedFaces: [],
      authenticated: false,
      cameraOn: false,
      theme: {},
      scannedUsername: "",
      scannedFirstName: "",
      scannedLastName: "",
      isRegisterModalOpen: false,
      registrationData: {
        username: "",
        password: "",
        clientID: "",
      },
      searchQuery: "",
      employees: [],
      selectedEmployee: null,
      version: "1.0.0",
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
  watch: {
    async loading(newValue) {
      if (newValue === false) {
        this.$nextTick(async () => {
          if (this.modelsLoaded) {
            await this.startCamera();
          }
        });
      }
    },
  },
  async mounted() {
    this.loading = true;
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
    } catch (error) {
      console.error("Error during component mount:", error);
      await this.presentAlert(
        "Initialization failed. Please refresh the page."
      );
    }
    await this.fetchEmployees();
    this.loading = false;
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
        // Switching to register mode - require password
        const password = prompt("Enter admin password to access registration:");
        if (password === "admin123") {
          this.mode = "register";
        } else {
          alert("Incorrect password");
        }
      } else {
        // Switching back to auth mode - no password required
        this.mode = "auth";
      }
    },
    async refreshPage() {
      this.processing = false;
      this.authenticated = false;
      this.scannedUsername = "";
      this.scannedFirstName = "";
      this.scannedLastName = "";
      this.isRegisterModalOpen = false;
      this.registrationData = {
        username: "",
        clientID: "",
      };

      // Stop and restart the camera to ensure a clean state
      this.stopCamera();
      await this.$nextTick(); // Allow the DOM to update
      await this.startCamera();
    },
    async fetchEmployees() {
      console.log("Fetching employees...");
      try {
        const response = await axios.get(
          "https://hrvale.bapplware.com/users/data"
        );
        const serverEmployees = response.data.data;
        this.employees = serverEmployees.map((emp) => ({
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
        let storedFaces = JSON.parse(localStorage.getItem("faceIds") || "[]");
        this.employees.forEach((employee) => {
          if (
            employee.face_signature &&
            typeof employee.face_signature === "string" &&
            employee.face_signature.startsWith("[")
          ) {
            try {
              const descriptor = JSON.parse(employee.face_signature);
              const existingFaceIndex = storedFaces.findIndex(
                (f) => f.username === employee.id
              );
              if (existingFaceIndex > -1) {
                storedFaces[existingFaceIndex].descriptor = descriptor;
                storedFaces[existingFaceIndex].employee = employee;
                console.log(`Updated face signature for ${employee.name}`);
              } else {
                storedFaces.push({
                  id: Date.now() + Math.random(),
                  name: `${employee.name}_${Date.now()}`,
                  descriptor: descriptor,
                  username: employee.id,
                  client: "suysing",
                  employee: employee,
                });
                console.log(`Added new face signature for ${employee.name}`);
              }
            } catch (e) {
              console.error(
                `Failed to parse face_signature for ${employee.name}:`,
                e
              );
            }
          }
        });
        localStorage.setItem("faceIds", JSON.stringify(storedFaces));
        this.loadStoredFaces();
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    },
    async processFrames() {
      const video = this.$refs.video;

      // Ensure video and models are ready
      if (!video || video.videoWidth === 0 || !this.modelsLoaded) {
        requestAnimationFrame(() => this.processFrames());
        return;
      }

      try {
        // Detect face with landmarks + descriptor
        const detection = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        const canvas = this.$refs.canvas;
        const ctx = canvas.getContext("2d");

        // Keep canvas in sync with video display size
        canvas.width = video.clientWidth;
        canvas.height = video.clientHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (detection) {
          // scale landmarks
          const scaleX = video.clientWidth / video.videoWidth;
          const scaleY = video.clientHeight / video.videoHeight;
          const points = detection.landmarks.positions.map((p) => ({
            x: p.x * scaleX,
            y: p.y * scaleY,
          }));

          // --- draw filter mesh ---
          const VERTICES = [
            0, 3, 8, 13, 16, 19, 24, 27, 30, 36, 39, 42, 45, 48, 54,
          ];
          const TRIANGLES = [
            [0, 3, 8],
            [3, 8, 13],
            [8, 13, 16],
            [0, 19, 27],
            [19, 24, 27],
            [24, 16, 27],
            [19, 36, 30],
            [24, 45, 30],
            [36, 39, 30],
            [42, 45, 30],
            [48, 54, 30],
            [39, 48, 30],
            [42, 54, 30],
          ];

          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 0.2;
          ctx.fillStyle = "#fff";
          ctx.shadowBlur = 10;

          TRIANGLES.forEach(([a, b, c]) => {
            const p1 = points[a],
              p2 = points[b],
              p3 = points[c];
            if (!p1 || !p2 || !p3) return;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.closePath();
            ctx.stroke();
          });

          VERTICES.forEach((i) => {
            const p = points[i];
            if (!p) return;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
            ctx.fill();
          });

          // --- FACE MATCHING ---
          const storedFaces = JSON.parse(
            localStorage.getItem("faceIds") || "[]"
          );

          // Build matcher
          const labeledDescriptors = storedFaces.map(
            (f) =>
              new faceapi.LabeledFaceDescriptors(f.username, [
                new Float32Array(f.descriptor),
              ])
          );

          if (labeledDescriptors.length > 0) {
            const matcher = new faceapi.FaceMatcher(labeledDescriptors, 0.5);
            const bestMatch = matcher.findBestMatch(detection.descriptor);

            if (bestMatch.label !== "unknown" && !this.processing) {
              // find the employee object corresponding to the matched username
              const matchedFace = storedFaces.find(
                (f) => f.username === bestMatch.label
              );

              if (matchedFace && matchedFace.employee) {
                this.processing = true; // block repeated calls
                await this.performLogin(matchedFace.employee); // pass employee object
                console.log(
                  "Face recognized, performing login...",
                  matchedFace.employee
                );
              } else {
                console.warn(
                  "Matched face found but no employee object attached"
                );
              }
            }
          }
        }
      } catch (err) {
        console.error("processFrames error:", err);
      }

      requestAnimationFrame(() => this.processFrames());
    },
    getGreeting() {
      const now = new Date();
      const hour = now.getHours(); // 0–23

      if (hour >= 5 && hour < 12) {
        return "Good Morning";
      } else if (hour >= 12 && hour < 18) {
        return "Good Afternoon";
      } else {
        return "Good Evening";
      }
    },

    // start of register face
    async registerFace() {
      this.isRegisterModalOpen = true;
    },

    async submitRegistration() {
      this.processing = true;
      this.isRegisterModalOpen = false;

      try {
        // Validate
        if (!this.selectedEmployee) {
          this.presentAlert(
            "No employee selected. Please select an employee first."
          );
          return;
        }

        const video = this.$refs.video;
        const detection = await this.detectFace(video);
        if (!detection) return;

        console.log("Registering face for employee:", this.selectedEmployee);

        const enrollSuccess = await this.enrollFaceToServer(
          this.selectedEmployee.name,
          detection.descriptor
        );

        if (!enrollSuccess) {
          this.presentAlert("Enrollment failed. Face not saved locally.");
          return;
        }

        const faceId = this.generateFaceId(this.selectedEmployee.id);
        // this.saveFaceLocally(faceId, detection, this.selectedEmployee);

        this.updateEmployeeFaceSignature(
          this.selectedEmployee.id,
          detection.descriptor
        );

        this.loadStoredFaces();
        this.presentAlert(
          `Face registered successfully for ${this.selectedEmployee.name}!`
        );
      } catch (error) {
        console.error("Error registering face:", error);
        this.presentAlert("Error registering face. Please try again.");
      } finally {
        this.processing = false;
      }
    },
    /** Detect single face and return detection */
    async detectFace(video) {
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        this.presentAlert("No face detected. Please try again.");
        return null;
      }
      return detection;
    },

    /** Generate unique face ID */
    generateFaceId(employeeId) {
      return `${employeeId}_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
    },

    /** Save face info locally */
    saveFaceLocally(faceId, detection, employee) {
      const stored = JSON.parse(localStorage.getItem("faceIds") || "[]");
      stored.push({
        id: Date.now(),
        name: faceId,
        descriptor: Array.from(detection.descriptor),
        username: employee.id,
        client: "suysing",
        employee: employee,
      });
      localStorage.setItem("faceIds", JSON.stringify(stored));
    },

    /** Update employee’s face signature in employeesData */
    updateEmployeeFaceSignature(employeeId, descriptor) {
      try {
        let employeesData = JSON.parse(
          localStorage.getItem("employeesData") || "[]"
        );
        const idx = employeesData.findIndex((emp) => emp.id === employeeId);

        if (idx !== -1) {
          employeesData[idx].face_signature = JSON.stringify(
            Array.from(descriptor)
          );
          localStorage.setItem("employeesData", JSON.stringify(employeesData));
          this.presentAlert(
            `Face signature updated locally for ${employeesData[idx].name}!`
          );
        } else {
          this.presentAlert("Employee not found in local storage!");
        }
      } catch (error) {
        console.error("Error updating face signature:", error);
        this.presentAlert(
          "Error updating face signature in local storage. Please try again."
        );
      }
    },

    /** Send enrollment to server */
    async enrollFaceToServer(username, descriptor) {
      try {
        const fingerprint = "";
        const faceSignature = JSON.stringify(Array.from(descriptor));
        // const encodedFaceSignature = btoa(faceSignature);
        console.log(
          "username, fingerprint, faceSignature",
          username,
          fingerprint,
          faceSignature
        );
        const tokenString = `${username}|${fingerprint}|${faceSignature}`;
        const encodedPayload = btoa(tokenString);

        const response = await fetch(
          "https://hrvale.bapplware.com/api/bio/enrollment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: encodedPayload }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.message || response.status);
        }

        this.presentAlert("Enrollment sent to server successfully!");
        return true;
      } catch (apiErr) {
        console.error("Error calling enrollment API:", apiErr);
        this.presentAlert("Error sending enrollment to server.");
        return false;
      }
    },
    // end submitRegistration

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
    async closeAuthenticated() {
      this.startCamera();
      this.authenticated = false;
      this.processing = false;
      this.processFrames();
      this.router.push("/facescan");
      console.log("Close authenticated, restart scanning");
    },

    goToRegisteredFacesTemp() {
      this.router.push("/registeredfacestemp");
    },

    async fetchToken() {
      try {
        const storedToken = localStorage.getItem("access_token");
        console.log("storedToken ", storedToken);
        const baseURL = localStorage.getItem("baseUrl");

        if (!storedToken || !baseURL) {
          throw new Error("Missing storedToken or baseURL");
        }

        const response = await axios.post(`${baseURL}auth/token`, {
          secret: storedToken,
        });
        console.log("token response ", response);

        localStorage.setItem("token", response.data.token);
      } catch (error) {
        console.log(error);
      }
    },

    // async fetchUserDetails() {
    //   try {
    //     const storedToken = localStorage.getItem("token");
    //     const baseURL = localStorage.getItem("baseUrl");
    //     const headers = { Authorization: `Bearer ${storedToken}` };
    //     const api = baseURL + `api/v2/user/me`;
    //     const dataResponse = await axios.get(api, { headers });

    //     this.empNumber = dataResponse.data.data.employee.empNumber;
    //     localStorage.setItem(
    //       "empNumber",
    //       dataResponse.data.data.employee.empNumber
    //     );

    //     localStorage.setItem(
    //       "myDetails",
    //       JSON.stringify(dataResponse.data.data)
    //     );

    //     this.scannedFirstName = dataResponse.data.data.employee.firstName;
    //     this.scannedLastName = dataResponse.data.data.employee.lastName;
    //     console.log(
    //       "scannedLastName",
    //       this.scannedFirstName,
    //       this.scannedLastName
    //     );
    //   } catch (error) {
    //     console.log(error.message);
    //     if (error.message === "Request failed with status code 401") {
    //       // this.checkToken();
    //     } else {
    //       console.error("Error fetching user details:", error);
    //     }
    //   }
    // },
    async performLogin(face) {
      try {
        console.log("Performing login for face:", face);
        const employee = face.employee;
        this.store.commit("loader/updateLoader", true);
        const authResult = await this.store.dispatch(
          "auth/biometricLogin",
          face
        );

        console.log("Employee data:", face);

        console.log("Auth result:", authResult);

        if (authResult.success) {
          console.log(
            "Authentication successful:",
            authResult.data.access_token
          );
          localStorage.setItem("access_token", authResult.data.access_token);
          console.log("access_token :", authResult.data.access_token);
          localStorage.setItem("refresh_token", authResult.data.refresh_token);
          await this.fetchToken();
          await this.fetchStoredTheme();
          // await this.hasPincode();
          localStorage.setItem("hasSetup", true);

          this.authenticated = true;
        }

        // await this.fetchUserDetails();

        // this.scannedUsername = username;
      } catch (error) {
        console.error("Login error:", error.message);
        localStorage.setItem("hasSetup", false);
        await this.alertError(
          "Authentication failed. Please check credentials or network."
        );
        this.processing = false;
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
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
    async alertError() {
      const showAlert = async () => {
        const alert = await alertController.create({
          header: "Invalid Credentials",
          message:
            "Invalid credentials. Please check your username and password and try again. If you're having trouble, refer to the email containing your login details.",
          buttons: [
            {
              text: "Close",
              htmlAttributes: {
                "aria-label": "close",
              },
            },
          ],
        });
        await alert.present();
      };
      return showAlert();
    },

    async presentAlert(message, handler = null) {
      const alert = await alertController.create({
        header: "Face Scan",
        message,
        buttons: [
          {
            text: "OK",
            handler,
          },
        ],
      });
      await alert.present();
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
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 16px;
  --padding-bottom: 16px;
}

.face-scan-header {
  --background: linear-gradient(to right, #064ea0, #002e62);
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
  color: linear-gradient(to right, #064ea0, #002e62);
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
  --background: linear-gradient(to right, #064ea0, #002e62);
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
  --background: linear-gradient(to right, #064ea0, #002e62);
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
  --background: linear-gradient(to right, #064ea0, #002e62);
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
  --background: linear-gradient(to right, #064ea0, #002e62);
  --color: white;
}

.face-scan-card-title,
.face-scan-card-subtitle,
.registration-card-title,
.user-info-card p,
.clock-modal-title {
  background: linear-gradient(to right, #064ea0, #002e62);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.selected-emp {
  background-color: #e3f2fd;
  border-color: #064ea0;
  text-align: center;
  font-weight: 600;
  font-size: 18px;
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
  border-color: #064ea0;
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
.version {
  margin: 0;
  padding: 0;
}
</style>
