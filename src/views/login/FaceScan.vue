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
          <h3>Loading Face Recognition</h3>
          <br />
          <p>Please wait while we initialize the camera and models</p>
          <ion-progress-bar
            :buffer="buffer"
            :value="progress"
            class
          ></ion-progress-bar>
          <div class="loader-2"></div>
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
                  Face the frame directly to ensure accurate facial scanning.
                </ion-card-subtitle>
              </ion-card-header>
              <br />

              <!-- Registration Modal -->
              <ion-card
                :is-open="isRegisterModalOpen"
                v-if="isRegisterModalOpen"
              >
                <div class="ion-padding">
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
                  <div class="registration-buttons">
                    <ion-button
                      @click="submitRegistration"
                      class="register-button"
                      :disabled="!selectedEmployee"
                    >
                      <ion-icon name="checkmark" slot="start"></ion-icon>
                      Save
                    </ion-button>

                    <ion-button
                      @click="isRegisterModalOpen = false"
                      color="danger"
                      class="close-register-button"
                    >
                      <ion-icon name="close"></ion-icon>
                      Cancel
                    </ion-button>

                    <ion-button
                      v-if="selectedEmployee && selectedEmployee.face_signature"
                      @click="resetFaceSignature"
                      class="reset-button"
                      color="danger"
                    >
                      <ion-icon name="trash-outline" slot="start"></ion-icon>
                      Reset Face Signature
                    </ion-button>
                  </div>
                </div>
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
                      <div class="loader"></div>
                    </div>
                  </div>
                </div>

                <div class="button-tools-container">
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
                </div>

                <!-- Scanning and Detecting Text -->
                <div
                  v-if="processing && cameraOn"
                  class="loader-3"
                  :style="{ color: '#064ea0' }"
                ></div>

                <h3 v-else class="scanning-text detecting">Detecting Face</h3>

                <ion-button
                  v-if="mode === 'register' && !isRegisterModalOpen"
                  @click="registerFace"
                  :disabled="processing || !cameraOn"
                  class="register-face-button"
                >
                  <ion-icon name="person-add" slot="start"></ion-icon>
                  Register Face
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ClockInModal
        :is-open="authenticated"
        @didDismiss="closeAuthenticated"
        :scannedEmployeeDetails="scannedEmployeeDetails"
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
  IonProgressBar,
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
import ClockInCardDigital from "../services/clock_in/components/ClockInCardDigital.vue";

export default defineComponent({
  name: "FaceScanComponent",

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
    IonProgressBar,
    ClockInCardDigital,
  },

  setup() {
    const router = useRouter();
    const store = useStore();
    return { router, store };
  },

  data() {
    return {
      // Icons
      camera,

      // Loading & Status
      loading: false,
      modelsLoaded: false,
      processing: false,
      authenticated: false,
      cameraOn: false,

      // Camera & Video
      stream: null,

      // Mode Management
      mode: "auth", // 'auth' or 'register'

      // Employee Data
      employees: [],
      storedFaces: [],
      selectedEmployee: null,
      searchQuery: "",

      // Modal States
      isRegisterModalOpen: false,

      // Registration Data
      registrationData: {
        username: "",
        password: "",
        clientID: "",
      },

      // Theme
      theme: {},

      // User Data
      scannedEmployeeDetails: null,
      scannedUsername: "",
      scannedFirstName: "",
      scannedLastName: "",
      empNumber: null,

      // Optimization Properties
      frameSkipCounter: 0,
      frameSkipRate: 2,
      lastProcessTime: 0,
      minProcessInterval: 100,
      isProcessingFrame: false,
      cachedLabeledDescriptors: null,
      lastCacheUpdate: 0,
      cacheTimeout: 10000,
      isAuthenticating: false, // Prevent multiple simultaneous login attempts

      // Misc
      version: "1.0.0",
      updateInterval: null,

      // Display Times
      displayTimes: {
        clockIn: "00:00",
        clockOut: "00:00",
      },

      // progress bar
      buffer: 1,
      progress: 0,
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
    await this.initialize();
  },

  beforeUnmount() {
    this.cleanup();
  },

  beforeDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  },

  created() {
    this.fetchTheme();
  },

  methods: {
    // ============================================
    // INITIALIZATION METHODS (OPTIMIZED)
    // ============================================

    async initialize() {
      this.loading = true;
      this.progress = 0;
      this.fetchTheme();

      try {
        // Load models and fetch employees in PARALLEL for faster initialization
        await Promise.all([this.loadFaceModels(), this.fetchEmployees()]);

        this.loadStoredFaces();
        this.progress = 0.75;
      } catch (error) {
        console.error("Error during initialization:", error);
        await this.presentAlert(
          "Initialization failed. Please refresh the page."
        );
      }

      // Turn off loading screen first so video element becomes available
      this.loading = false;

      // Wait for DOM to update and video element to be available
      await this.$nextTick();

      // Now initialize camera
      try {
        if (this.$refs.video) {
          await this.initializeCamera();
        }
      } catch (error) {
        console.error("Error initializing camera:", error);
        await this.presentAlert(
          "Error accessing camera. Please check permissions."
        );
      }
    },

    async loadFaceModels() {
      const modelUrl =
        "https://justadudewhohacks.github.io/face-api.js/models/";

      // Load ALL models in PARALLEL instead of sequentially
      const models = [
        faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
        faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl),
        faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl),
      ];

      try {
        // Use Promise.all to load all models simultaneously (3x faster!)
        await Promise.all(models);
        this.progress = 0.75;
        console.log("All models loaded in parallel");
        this.modelsLoaded = true;
      } catch (error) {
        console.error("Failed to load models:", error);
        throw error;
      }
    },

    async initializeCamera() {
      try {
        // Update progress to show camera initialization starting (75%)
        this.progress = 0.75;
        console.log("Initializing camera...");

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 },
            frameRate: { ideal: 30, max: 30 },
          },
        });

        this.$refs.video.srcObject = stream;
        this.stream = stream;

        // Update progress to 90% while waiting for video to be ready
        this.progress = 0.9;

        // Wait for video to be actually ready
        await this.waitForVideoReady(this.$refs.video);

        this.cameraOn = true;

        // Camera is fully on, complete progress
        this.progress = 1.0;
        console.log("Camera fully initialized and ready");

        // Start processing frames immediately (no delay needed)
        requestAnimationFrame(() => this.processFrames());
      } catch (error) {
        console.error("Error initializing camera:", error);
        this.cameraOn = false;
        throw error;
      }
    },

    waitForVideoReady(video) {
      return new Promise((resolve) => {
        if (video.readyState >= 2) {
          resolve();
        } else {
          video.addEventListener("loadeddata", () => resolve(), { once: true });
        }
      });
    },

    cleanup() {
      this.stopCamera();
      this.resetState();
    },

    resetState() {
      this.processing = false;
      this.authenticated = false;
      this.isAuthenticating = false;
      this.frameSkipCounter = 0;
      this.lastProcessTime = 0;
      this.isProcessingFrame = false;
      this.cachedLabeledDescriptors = null;
      this.lastCacheUpdate = 0;
    },

    // ============================================
    // CAMERA MANAGEMENT
    // ============================================

    async startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 },
            frameRate: { ideal: 30, max: 30 },
          },
        });

        this.$refs.video.srcObject = stream;
        this.stream = stream;
        this.cameraOn = true;

        // Start processing frames
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

    async refreshPage() {
      window.location.reload();
    },

    // ============================================
    // FACE DETECTION & PROCESSING (OPTIMIZED)
    // ============================================

    async processFrames() {
      const video = this.$refs.video;

      // Ensure video and models are ready
      if (
        !video ||
        video.videoWidth === 0 ||
        !this.modelsLoaded ||
        !this.cameraOn
      ) {
        requestAnimationFrame(() => this.processFrames());
        return;
      }

      // Adaptive frame skipping - process more frames when idle
      this.frameSkipCounter++;
      const skipRate = this.processing ? 3 : 1; // Skip more frames when processing
      if (this.frameSkipCounter % skipRate !== 0) {
        requestAnimationFrame(() => this.processFrames());
        return;
      }

      // Throttle processing based on time
      const now = Date.now();
      const minInterval = this.processing ? 300 : 100; // Slower when processing
      if (now - this.lastProcessTime < minInterval) {
        requestAnimationFrame(() => this.processFrames());
        return;
      }

      // Prevent concurrent processing
      if (this.isProcessingFrame) {
        requestAnimationFrame(() => this.processFrames());
        return;
      }

      this.isProcessingFrame = true;
      this.lastProcessTime = now;

      try {
        // Use smaller input size for faster detection
        const detectionOptions = new faceapi.TinyFaceDetectorOptions({
          inputSize: 320, // Reduced from 160 for faster detection
          scoreThreshold: 0.4,
        });

        const detection = await faceapi
          .detectSingleFace(video, detectionOptions)
          .withFaceLandmarks()
          .withFaceDescriptor();

        const canvas = this.$refs.canvas;
        const ctx = canvas.getContext("2d");

        canvas.width = video.clientWidth;
        canvas.height = video.clientHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (detection) {
          // Use simpler mesh when not processing for better performance
          const meshMode = this.processing ? "simple" : "detailed";
          this.drawFaceLandmarks(ctx, detection, video, meshMode);

          // Only match faces in auth mode when not already processing
          if (this.mode === "auth" && !this.processing) {
            await this.matchFace(detection);
          }
        }
      } catch (err) {
        console.error("processFrames error:", err);
      } finally {
        this.isProcessingFrame = false;
      }

      requestAnimationFrame(() => this.processFrames());
    },

    async matchFace(detection) {
      // Prevent multiple simultaneous authentication attempts
      if (this.isAuthenticating) {
        return;
      }

      const now = Date.now();

      // Build/refresh cached face matcher
      if (
        !this.cachedLabeledDescriptors ||
        now - this.lastCacheUpdate > this.cacheTimeout
      ) {
        this.cachedLabeledDescriptors = this.buildFaceMatcher();
        this.lastCacheUpdate = now;
      }

      // ✅ CHANGED: Show alert when no registered faces exist
      if (
        !this.cachedLabeledDescriptors ||
        this.cachedLabeledDescriptors.length === 0
      ) {
        if (!this.processing && !this.isAuthenticating) {
          this.processing = true;
          await this.speakMessage(
            "Face not recognized. Please register your face first."
          );

          this.processing = false;
        }
        return; // ✅ ADDED: Stop processing
      }

      // Lower threshold for stricter matching (0.6 is standard, lower = stricter)
      const matcher = new faceapi.FaceMatcher(
        this.cachedLabeledDescriptors,
        0.55
      );
      const bestMatch = matcher.findBestMatch(detection.descriptor);

      console.log(
        `Match result: ${bestMatch.label} (score: ${bestMatch.distance.toFixed(
          3
        )})`
      );

      // Only accept matches with good confidence (distance < 0.55)
      if (bestMatch.label !== "unknown" && bestMatch.distance < 0.55) {
        const matchedEmployee = this.employees.find(
          (emp) => emp.id === bestMatch.label
        );

        if (matchedEmployee) {
          console.log(`✓ Authenticated: ${matchedEmployee.name}`);
          this.isAuthenticating = true;
          this.processing = true;
          await this.performLogin(matchedEmployee);
        } else {
          console.warn(
            "Matched face ID but employee not found in current list"
          );
        }
      } else if (bestMatch.label === "unknown" || bestMatch.distance >= 0.55) {
        // Face detected but not registered
        if (!this.processing && !this.isAuthenticating) {
          this.processing = true;
          await this.speakMessage(
            "Face not recognized. Please register your face first."
          );

          this.processing = false;
        }
      }
    },

    buildFaceMatcher() {
      const employeesWithFaces = this.employees.filter(
        (emp) => emp.face_signature && typeof emp.face_signature === "string"
      );

      if (employeesWithFaces.length === 0) {
        console.warn("No employees with valid face signatures found");
        return null;
      }

      const labeledDescriptors = employeesWithFaces
        .map((emp) => {
          try {
            // Parse face signature
            const descriptorArray = emp.face_signature.split(",").map(Number);

            // Validate descriptor length and values
            if (descriptorArray.length !== 128) {
              console.error(
                `Invalid descriptor length for ${emp.name}: ${descriptorArray.length}`
              );
              return null;
            }

            if (descriptorArray.some(isNaN)) {
              console.error(`Invalid descriptor values for ${emp.name}`);
              return null;
            }

            const descriptor = new Float32Array(descriptorArray);
            console.log(
              `✓ Loaded face signature for: ${emp.name} (ID: ${emp.id})`
            );

            return new faceapi.LabeledFaceDescriptors(emp.id, [descriptor]);
          } catch (e) {
            console.error(`Failed to parse face_signature for ${emp.name}:`, e);
            return null;
          }
        })
        .filter(Boolean);

      console.log(
        `Built face matcher with ${labeledDescriptors.length} valid face signatures`
      );

      return labeledDescriptors;
    },

    drawFaceLandmarks(ctx, detection, video, mode = "detailed") {
      const scaleX = video.clientWidth / video.videoWidth;
      const scaleY = video.clientHeight / video.videoHeight;
      const points = detection.landmarks.positions.map((p) => ({
        x: p.x * scaleX,
        y: p.y * scaleY,
      }));

      // Mesh presets
      const meshes = {
        simple: {
          VERTICES: [0, 8, 16, 27, 30, 36, 45, 48, 54],
          TRIANGLES: [
            [0, 8, 16],
            [0, 27, 30],
            [16, 27, 30],
            [36, 30, 45],
            [48, 30, 54],
          ],
        },
        detailed: {
          VERTICES: [0, 3, 8, 13, 16, 19, 24, 27, 30, 36, 39, 42, 45, 48, 54],
          TRIANGLES: [
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
          ],
        },
      };

      // Pick mesh depending on mode
      const { VERTICES, TRIANGLES } = meshes[mode] || meshes.simple;

      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 0.3;
      ctx.fillStyle = "#fff";
      ctx.shadowBlur = 10;

      // Draw triangles
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

      // Draw vertices
      VERTICES.forEach((i) => {
        const p = points[i];
        if (!p) return;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    },

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

    // ============================================
    // MODE MANAGEMENT
    // ============================================

    async switchMode() {
      if (this.mode === "auth") {
        const password = prompt("Enter admin password to access registration:");
        if (password === "admin123") {
          this.mode = "register";
          this.clearCache();
        } else {
          alert("Incorrect password");
        }
      } else {
        this.mode = "auth";
        this.clearCache();
      }
    },

    clearCache() {
      this.cachedLabeledDescriptors = null;
      this.lastCacheUpdate = 0;
      console.log("Face matcher cache cleared");
    },

    // ============================================
    // EMPLOYEE DATA MANAGEMENT (OPTIMIZED)
    // ============================================

    async fetchEmployees() {
      try {
        // Always fetch fresh data for authentication accuracy
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
            emp.face_signature === "undefined" || !emp.face_signature
              ? undefined
              : emp.face_signature,
        }));

        // Clear face matcher cache after updating employees
        this.clearCache();

        console.log(
          `Loaded ${
            this.employees.filter((e) => e.face_signature).length
          } employees with face signatures`
        );
      } catch (error) {
        console.error("Failed to fetch employees:", error);
        throw error;
      }
    },

    loadStoredFaces() {
      this.storedFaces = JSON.parse(localStorage.getItem("faceIds") || "[]");
      this.storedFaces.forEach((face) => {
        if (!face.name) {
          face.name = "Face " + face.id;
        }
      });
      localStorage.setItem("faceIds", JSON.stringify(this.storedFaces));
    },

    // ============================================
    // FACE REGISTRATION
    // ============================================

    async registerFace() {
      this.isRegisterModalOpen = true;
    },

    async submitRegistration() {
      this.processing = true;
      this.isRegisterModalOpen = false;

      try {
        if (!this.selectedEmployee) {
          this.presentAlert(
            "No employee selected. Please select an employee first."
          );
          this.processing = false;
          return;
        }

        const video = this.$refs.video;
        const detection = await this.detectFace(video);
        if (!detection) {
          this.processing = false;
          return;
        }

        // Convert descriptor to comma-separated string
        const descriptorString = Array.from(detection.descriptor).join(",");

        // ✅ NEW: Check if face is already registered to another employee
        const duplicateCheck = await this.checkForDuplicateFace(
          detection.descriptor
        );
        if (duplicateCheck.isDuplicate) {
          this.presentAlert(
            `This face is already registered to ${duplicateCheck.employeeName}. Each face can only be registered once.`
          );
          this.processing = false;
          return;
        }

        // Send to server first
        const enrollSuccess = await this.enrollFaceToServer(
          this.selectedEmployee.id,
          descriptorString
        );

        if (!enrollSuccess) {
          this.presentAlert("Failed to register face on server.");
          this.processing = false;
          return;
        }

        // Update local employee data
        const employeeIndex = this.employees.findIndex(
          (e) => e.id === this.selectedEmployee.id
        );
        if (employeeIndex !== -1) {
          this.employees[employeeIndex].face_signature = descriptorString;
        }

        // Clear cache to force rebuild with new data
        this.clearCache();

        await this.speakMessage(
          `Successfully registered ${this.selectedEmployee.name}!`
        );

        this.presentAlert(
          `Face registered successfully for ${this.selectedEmployee.name}!`
        );

        this.selectedEmployee = null;
        this.searchQuery = "";
      } catch (error) {
        console.error("Error registering face:", error);
        this.presentAlert("Error registering face. Please try again.");
      } finally {
        this.processing = false;
      }
    },

    async checkForDuplicateFace(newDescriptor) {
      // Get all employees with face signatures except the currently selected one
      const employeesWithFaces = this.employees.filter(
        (emp) =>
          emp.face_signature &&
          typeof emp.face_signature === "string" &&
          emp.id !== this.selectedEmployee?.id // Exclude current employee (for re-registration)
      );

      if (employeesWithFaces.length === 0) {
        return { isDuplicate: false };
      }

      // Check against each registered face
      for (const emp of employeesWithFaces) {
        try {
          const descriptorArray = emp.face_signature.split(",").map(Number);

          if (descriptorArray.length !== 128 || descriptorArray.some(isNaN)) {
            continue;
          }

          const existingDescriptor = new Float32Array(descriptorArray);
          const distance = faceapi.euclideanDistance(
            newDescriptor,
            existingDescriptor
          );

          console.log(
            `Face comparison with ${emp.name}: score = ${distance.toFixed(3)}`
          );

          // If distance is less than 0.6, faces are considered the same
          // (lower distance = more similar)
          if (distance < 0.6) {
            return {
              isDuplicate: true,
              employeeName: emp.name,
              employeeId: emp.id,
              distance: distance,
            };
          }
        } catch (e) {
          console.error(`Error comparing face with ${emp.name}:`, e);
          continue;
        }
      }

      return { isDuplicate: false };
    },

    generateFaceId(employeeId) {
      return `${employeeId}_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
    },

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
        } else {
          localStorage.setItem("employeesData", JSON.stringify(employeesData));
          console.log("Employee not found in local storage!");
        }
      } catch (error) {
        console.error("Error updating face signature:", error);
        this.presentAlert(
          "Error updating face signature in local storage. Please try again."
        );
      }
    },

    async enrollFaceToServer(username, faceSignature) {
      try {
        const fingerprint = "";
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

        console.log(`✓ Face signature enrolled for ${username}`);
        return true;
      } catch (apiErr) {
        console.error("Error calling enrollment API:", apiErr);
        return false;
      }
    },

    async resetFaceSignature() {
      if (!this.selectedEmployee) return;

      const alert = await alertController.create({
        header: "Confirm Reset",
        message: `Are you sure you want to reset the face signature for ${this.selectedEmployee.name}? This action cannot be undone.`,
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Reset",
            handler: async () => {
              this.processing = true;
              try {
                const success = await this.enrollFaceToServer(
                  this.selectedEmployee.id,
                  ""
                );

                if (success) {
                  const employee = this.employees.find(
                    (e) => e.id === this.selectedEmployee.id
                  );
                  if (employee) {
                    employee.face_signature = undefined;
                  }

                  let storedFaces = JSON.parse(
                    localStorage.getItem("faceIds") || "[]"
                  );
                  storedFaces = storedFaces.filter(
                    (f) => f.username !== this.selectedEmployee.id
                  );
                  localStorage.setItem("faceIds", JSON.stringify(storedFaces));

                  this.clearCache();
                  this.presentAlert("Face signature reset successfully.");
                  this.selectedEmployee.face_signature = undefined;
                } else {
                  this.presentAlert("Failed to reset face signature.");
                }
              } catch (error) {
                console.error("Error resetting face signature:", error);
                this.presentAlert("An error occurred. Please try again.");
              } finally {
                this.processing = false;
              }
            },
          },
        ],
      });
      await alert.present();
    },

    // ============================================
    // AUTHENTICATION & LOGIN
    // ============================================

    async performLogin(face) {
      try {
        const authResult = await this.store.dispatch(
          "auth/biometricLogin",
          face
        );

        if (authResult.success) {
          localStorage.setItem("access_token", authResult.data.access_token);
          localStorage.setItem("refresh_token", authResult.data.refresh_token);

          const storedThemeData = localStorage.getItem("bio");
          if (storedThemeData) {
            await this.fetchStoredTheme();
          } else {
            console.warn("No theme data found in localStorage.");
          }

          // ✅ NEW: Fetch token with error handling
          try {
            await this.fetchToken();
          } catch (tokenError) {
            console.error("Failed to fetch token:", tokenError.message);

            this.processing = false;
            this.isAuthenticating = false;
            return; // Stop the login process
          }

          // ✅ NEW: Fetch user details with error handling
          try {
            await this.fetchUserDetails();
          } catch (userDetailsError) {
            console.error(
              "Failed to fetch user details:",
              userDetailsError.message
            );

            this.processing = false;
            this.isAuthenticating = false;
            return; // Stop the login process
          }

          localStorage.setItem("hasSetup", true);
          this.authenticated = true;
        }
      } catch (error) {
        console.error("Login error:", error.message);
        localStorage.setItem("hasSetup", false);
        await this.alertError("Authentication failed. Try again later!");
        this.processing = false;
        this.isAuthenticating = false;
      }
    },

    async closeAuthenticated() {
      this.authenticated = false;
      this.processing = false;
      this.isAuthenticating = false; // Reset authentication flag

      // Resume camera and scanning if camera was stopped
      if (!this.cameraOn) {
        await this.startCamera();
      }
    },

    // ============================================
    // API CALLS
    // ============================================

    async fetchToken() {
      try {
        const storedToken = localStorage.getItem("access_token");
        const baseURL = "https://hrp-uat-app.bapplware.com/web/index.php";

        if (!storedToken || !baseURL) {
          throw new Error("Missing storedToken or baseURL");
        }

        const response = await axios.post(baseURL + `/auth/token`, {
          secret: storedToken,
        });

        localStorage.setItem("token", response.data.token);
      } catch (error) {
        console.error("Error fetching token:", error);
        throw error; // ✅ Re-throw to stop the login process
      }
    },

    async fetchUserDetails() {
      try {
        const storedToken = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${storedToken}` };
        const api = `https://hrp-uat-app.bapplware.com/web/index.php/api/v2/user/me`;
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

        this.scannedEmployeeDetails = dataResponse.data.data;

        this.scannedFirstName = dataResponse.data.data.employee.firstName;
        this.scannedLastName = dataResponse.data.data.employee.lastName;

        console.log(this.scannedEmployeeDetails);
      } catch (error) {
        console.log(error.message);
        if (error.message === "Request failed with status code 401") {
          // ✅ Handle 401 with specific error message
          throw new Error("Unauthorized - Invalid token");
        } else {
          console.error("Error fetching user details:", error);
          throw error; // ✅ Re-throw to stop the login process
        }
      }
    },

    // ============================================
    // THEME MANAGEMENT
    // ============================================

    fetchTheme() {
      const storedThemeData = localStorage.getItem("themeData");
      const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};
      this.theme = themeData;

      document.documentElement.style.setProperty(
        "--ion-color-primary",
        "#008e9c"
      );
      document.documentElement.style.setProperty(
        "--ion-color-primary-contrast",
        "#ffffff"
      );
    },

    async fetchStoredTheme() {
      try {
        const storedThemeData = localStorage.getItem("bio");
        const parsedData = storedThemeData ? JSON.parse(storedThemeData) : null;

        if (!parsedData || !parsedData.configs) {
          console.error("No valid configs found in stored data.");
          return;
        }

        const configs = parsedData.configs;
        const brandingConfig = configs.find((item) => item.name === "branding");
        const authConfig = configs.find(
          (item) => item.name === "authentication"
        );

        if (brandingConfig && brandingConfig.configuration.apiHost) {
          const baseUrl = brandingConfig.configuration.apiHost;
          localStorage.setItem("baseUrl", baseUrl);
        } else if (authConfig && authConfig.configuration.apiHost) {
          const baseUrl = authConfig.configuration.apiHost;
          localStorage.setItem("baseUrl", baseUrl);
          console.log("Base URL set (from auth):", baseUrl);
        } else {
          console.error("No baseUrl found in configs");
        }

        if (brandingConfig) {
          const { theme, services, client } = brandingConfig.configuration;
          if (theme) {
            localStorage.setItem("themeData", JSON.stringify(theme));
            this.theme = theme;
          }
          if (services) {
            localStorage.setItem("servicesConfig", JSON.stringify(services));
          }
          if (client) {
            localStorage.setItem("client", JSON.stringify(client));
          }
        }

        if (parsedData.access_token) {
          localStorage.setItem("accessToken", parsedData.access_token);
        }
        if (parsedData.refresh_token) {
          localStorage.setItem("refreshToken", parsedData.refresh_token);
        }
      } catch (error) {
        console.error("Error fetching or parsing theme data:", error);
        localStorage.setItem("hasSetup", false);
      }
    },

    // ============================================
    // UI HELPERS
    // ============================================

    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    async speakMessage(text) {
      try {
        await TextToSpeech.speak({
          text: text,
          lang: "en-US",
          rate: 1.0,
        });
      } catch (error) {
        console.error("Text-to-speech error:", error);
      }
    },

    getGreeting() {
      const now = new Date();
      const hour = now.getHours();

      if (hour >= 5 && hour < 12) {
        return "Good Morning";
      } else if (hour >= 12 && hour < 18) {
        return "Good Afternoon";
      } else {
        return "Good Evening";
      }
    },

    async alertError(message) {
      const alert = await alertController.create({
        header: "Invalid",
        message: message,
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

    goToRegisteredFacesTemp() {
      this.router.push("/registeredfacestemp");
    },
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
}

.face-scan-card-subtitle {
  --color: #7f8c8d;
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
}

.face-scan-card-content {
  padding: 0 20px 20px 20px;
}

.video-wrapper {
  position: relative;
  width: 90vw;
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
  font-weight: 600;
  width: 70px;
  height: 70px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}

.mode-switch-button ion-icon {
  font-size: 50px;
  margin: 0;
  padding: 0;
}

.refresh-button {
  --border-radius: 50%;
  font-weight: 600;
  width: 70px;
  height: 70px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: linear-gradient(to right, #064ea0, #002e62);
  margin: 0;
}

.refresh-button ion-icon {
  font-size: 80px;
  margin: 0;
  padding: 0;
}

.register-face-button {
  --border-radius: 12px;
  font-weight: 600;
  height: 50px;
  margin: 15px auto 5px auto;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  --background: linear-gradient(to right, #064ea0, #002e62);
}

.register-button {
  --border-radius: 12px;
  font-weight: 600;
  height: 50px;
  width: 100px;

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
  --background: transparent;
  --border-radius: 20px;
  --height: 800px;
  --width: 650px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
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

.face-status {
  font-size: 0.85rem;
  color: #28a745;
  margin-top: 0.25rem;
}

.version {
  margin: 0;
  padding: 0;
}
.registration-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 1rem;
}

.reset-button {
  --background: #eb445a;
  /* position: absolute;
  left: 10px;
  bottom: 15px; */
  height: 50px;
  border-radius: 10px;
  overflow: hidden;
}

.scanning-text {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
}

.detecting {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
}

.scanning::after {
  content: "";
  display: inline-block;
  animation: dots 1.5s steps(3, end) infinite;
}

@keyframes dots {
  0% {
    content: "";
  }
  33% {
    content: ".";
  }
  66% {
    content: "..";
  }
  100% {
    content: "...";
  }
}

.register-close-button-container {
  width: 100%;
  display: flex;
  justify-content: right;
  align-items: center;
}
.close-register-button {
  --border-radius: 12px;
  font-weight: 600;
  height: 50px;

  --background: linear-gradient(to right, #064ea0, #002e62);
}

.button-tools-container {
  position: absolute;
  right: 20px;
  top: 50%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  height: fit-content;
  transform: translateY(-50%);
}

.loading-content {
  animation: fadeIn 0.3s ease-in-out;
}

ion-progress-bar {
  --progress-background: #4cafef;
  --buffer-background: #cce7f9;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.loader {
  width: fit-content;
  font-weight: bold;
  font-family: monospace;
  font-size: 30px;
  background: radial-gradient(circle closest-side, #064ea0 94%, #0000) right /
    calc(200% - 1em) 100%;
  animation: l24 1s infinite alternate linear;
}

.loader::before {
  content: "Scanning...";
  line-height: 1em;
  color: #0000;
  background: inherit;
  background-image: radial-gradient(
    circle closest-side,
    #ffffff 94%,
    #064ea0d7
  );
  -webkit-background-clip: text;
  background-clip: text;
}
@keyframes l24 {
  100% {
    background-position: left;
  }
}

.loader-2 {
  --d: 22px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  color: #fff;
  box-shadow: calc(1 * var(--d)) calc(0 * var(--d)) 0 0,
    calc(0.707 * var(--d)) calc(0.707 * var(--d)) 0 1px,
    calc(0 * var(--d)) calc(1 * var(--d)) 0 2px,
    calc(-0.707 * var(--d)) calc(0.707 * var(--d)) 0 3px,
    calc(-1 * var(--d)) calc(0 * var(--d)) 0 4px,
    calc(-0.707 * var(--d)) calc(-0.707 * var(--d)) 0 5px,
    calc(0 * var(--d)) calc(-1 * var(--d)) 0 6px;
  animation: l27 1s infinite steps(8);
  margin: 50px auto 10px auto;
}
@keyframes l27 {
  100% {
    transform: rotate(1turn);
  }
}

.loader-3 {
  width: 85px;
  height: 25px;
  --g1: conic-gradient(from 90deg at left 3px top 3px, #0000 90deg, #4c8def 0);
  --g2: conic-gradient(
    from -90deg at bottom 3px right 3px,
    #0000 90deg,
    #4cafef 0
  );
  background: var(--g1), var(--g1), var(--g1), var(--g2), var(--g2), var(--g2);
  background-position: left, center, right;
  background-repeat: no-repeat;
  animation: l8 1s infinite;
  margin: 10px auto 0 auto;
}
@keyframes l8 {
  0% {
    background-size: 25px 100%, 25px 100%, 25px 100%;
  }
  20% {
    background-size: 25px 50%, 25px 100%, 25px 100%;
  }
  40% {
    background-size: 25px 50%, 25px 50%, 25px 100%;
  }
  60% {
    background-size: 25px 100%, 25px 50%, 25px 50%;
  }
  80% {
    background-size: 25px 100%, 25px 100%, 25px 50%;
  }
  100% {
    background-size: 25px 100%, 25px 100%, 25px 100%;
  }
}
</style>
