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

              <ion-card-content class="face-scan-card-content">
                <div class="camera-container">
                  <div class="video-wrapper">
                    <video
                      ref="video"
                      autoplay
                      playsinline
                      muted
                      class="face-video"
                      :style="{ display: cameraOn ? 'block' : 'none' }"
                    ></video>
                    <canvas
                      ref="canvas"
                      class="face-canvas"
                      :style="{ display: cameraOn ? 'block' : 'none' }"
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
                  @click="cameraOn ? stopCamera() : startCamera()"
                  expand="block"
                  color="primary"
                  class="camera-button"
                  :disabled="loading"
                >
                  <ion-icon
                    :name="cameraOn ? 'videocam-off' : 'videocam'"
                    slot="start"
                  ></ion-icon>
                  {{ cameraOn ? "Stop Camera" : "Start Camera" }}
                </ion-button>

                <ion-button
                  @click="switchMode"
                  expand="block"
                  fill="outline"
                  color="primary"
                  class="mode-switch-button"
                >
                  <ion-icon name="swap-horizontal" slot="start"></ion-icon>
                  Switch to {{ mode === "auth" ? "Register" : "Auth" }}
                </ion-button>

                <ion-button
                  v-if="mode === 'register'"
                  @click="registerFace"
                  expand="block"
                  color="primary"
                  :disabled="processing || !cameraOn"
                  class="register-button"
                >
                  <ion-icon name="person-add" slot="start"></ion-icon>
                  Register Face
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-card v-if="mode === 'register'" class="registration-card">
        <ion-card-header class="registration-card-header">
          <ion-card-title class="registration-card-title">
            <ion-icon name="person-add-outline" class="card-icon"></ion-icon>
            Register New Face
          </ion-card-title>
        </ion-card-header>

        <ion-card-content class="registration-card-content">
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
              :key="employee.username"
              class="employee-item"
              :class="{ selected: selectedEmployee === employee }"
              @click="selectedEmployee = employee"
              :style="{ pointerEvents: processing ? 'none' : 'auto' }"
            >
              <div class="employee-name">{{ employee.name }}</div>
              <div class="employee-id">ID: {{ employee.username }}</div>
              <div v-if="employee.face" class="face-status">
                Has registered face
              </div>
            </div>
          </div>

          <ion-button
            @click="registerFace"
            expand="block"
            color="primary"
            :disabled="processing || !cameraOn || !selectedEmployee"
            class="register-submit-button"
          >
            <ion-icon name="checkmark-circle" slot="start"></ion-icon>
            Register Face
          </ion-button>

          <ion-button
            @click="goToRegisteredFaces"
            expand="block"
            color="primary"
            fill="outline"
            class="manage-faces-button"
          >
            <ion-icon name="list-outline" slot="start"></ion-icon>
            Manage All Registered Faces
          </ion-button>
        </ion-card-content>
      </ion-card>

      <ion-spinner v-if="loading" name="crescent"></ion-spinner>
    </ion-content>
    <ion-modal
      v-if="authenticated"
      :is-open="authenticated"
      @didDismiss="closeAuthenticated"
      class="clock-modal"
      :backdrop-dismiss="false"
    >
      <ion-header class="clock-modal-header">
        <ion-toolbar class="clock-toolbar">
          <ion-buttons slot="end">
            <ion-button @click="closeAuthenticated" color="primary">
              <ion-icon name="close"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-title class="clock-modal-title">
            <ion-icon name="time-outline" class="modal-title-icon"></ion-icon>
            Clock In / Out
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content class="clock-modal-content" v-if="!loading">
        <Refresher />
        <div>
          <div v-if="scannedUsername && scannedName" class="user-info-card">
            <p><strong>Username:</strong> {{ scannedUsername }}</p>
            <p><strong>Name:</strong> {{ scannedName }}</p>
          </div>
          <ClockinCard
            @clockInClicked="handleClockInData"
            :btnText="btnText"
            :btnColor="theme.primaryColor"
            :btnTextColor="theme.primaryFontColor"
            class="clock-card"
          />

          <ion-card class="reminder-card">
            <ion-card-content class="reminder-content">
              <ion-icon
                name="information-circle-outline"
                color="warning"
                slot="start"
              ></ion-icon>
              <p class="reminder-text">
                Reminder: Punch out will not show unless you completed break
                punch in and out
              </p>
            </ion-card-content>
          </ion-card>

          <!-- Button to open modal -->
          <ion-button
            class="break-details-btn"
            color="primary"
            expand="block"
            @click="openModal"
          >
            <ion-icon name="reader-outline" slot="start"></ion-icon>
            View Break Details
          </ion-button>
        </div>

        <!-- Modal -->
        <ion-modal :is-open="isModalOpen" @didDismiss="closeModal">
          <ion-header :style="{ backgroundColor: theme.primaryColor }">
            <ion-toolbar>
              <ion-title>
                Break Details
                <ion-icon name="reader-outline"></ion-icon>
              </ion-title>
              <ion-buttons slot="end">
                <ion-button @click="closeModal">Close</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>

          <ion-content>
            <ion-list v-if="breakDetails">
              <ion-item>
                <ion-icon
                  slot="start"
                  name="time-outline"
                  size="medium"
                  :style="{ color: theme.primaryColor }"
                ></ion-icon>
                <ion-label>
                  <strong :style="{ color: theme.primaryColor }"
                    >AM Break In:</strong
                  >
                  <p>
                    {{ breakDetails.punchInAmBreak.amTime || "" }}
                  </p>
                </ion-label>
              </ion-item>

              <ion-item>
                <ion-icon
                  slot="start"
                  name="time-outline"
                  size="medium"
                  :style="{ color: theme.primaryColor }"
                ></ion-icon>
                <ion-label>
                  <strong :style="{ color: theme.primaryColor }"
                    >AM Break Out:</strong
                  >
                  <p>
                    {{ breakDetails.punchOutAmBreak.amTime || "" }}
                  </p>
                </ion-label>
              </ion-item>

              <ion-item>
                <ion-icon
                  slot="start"
                  name="time-outline"
                  size="medium"
                  :style="{ color: theme.primaryColor }"
                ></ion-icon>
                <ion-label>
                  <strong :style="{ color: theme.primaryColor }"
                    >Lunch In:</strong
                  >
                  <p>
                    {{ breakDetails.punchInLunchBreak.lunchTime || "" }}
                  </p>
                </ion-label>
              </ion-item>

              <ion-item>
                <ion-icon
                  slot="start"
                  name="time-outline"
                  size="medium"
                  :style="{ color: theme.primaryColor }"
                ></ion-icon>
                <ion-label>
                  <strong :style="{ color: theme.primaryColor }"
                    >Lunch Out:</strong
                  >
                  <p>
                    {{ breakDetails.punchOutLunchBreak.lunchTime || "" }}
                  </p>
                </ion-label>
              </ion-item>

              <ion-item>
                <ion-icon
                  slot="start"
                  name="time-outline"
                  size="medium"
                  :style="{ color: theme.primaryColor }"
                ></ion-icon>
                <ion-label>
                  <strong :style="{ color: theme.primaryColor }"
                    >PM Break In:</strong
                  >
                  <p>
                    {{ breakDetails.punchInPmBreak.pmTime || "" }}
                  </p>
                </ion-label>
              </ion-item>

              <ion-item>
                <ion-icon
                  slot="start"
                  name="time-outline"
                  size="medium"
                  :style="{ color: theme.primaryColor }"
                ></ion-icon>
                <ion-label>
                  <strong :style="{ color: theme.primaryColor }"
                    >PM Break Out:</strong
                  >
                  <p>
                    {{ breakDetails.punchOutPmBreak.pmTime || "" }}
                  </p>
                </ion-label>
              </ion-item>
            </ion-list>

            <h4 v-else class="No-data-break-details">
              <strong>No Data</strong>
            </h4>
          </ion-content>
        </ion-modal>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonSpinner,
  IonGrid,
  IonCol,
  alertController,
  IonModal,
  IonList,
  IonItem,
  IonButtons,
  IonLabel,
  toastController,
} from "@ionic/vue";
import { camera } from "ionicons/icons";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import * as faceapi from "face-api.js";
import { useRouter } from "vue-router";
import { defineComponent } from "vue";
import Refresher from "@/components/refresher/Refresher.vue";
import ClockinCard from "@/views/services/clock_in/components/ClockinCard.vue";
import { useStore } from "vuex";
import axios from "axios";
import { Geolocation } from "@capacitor/geolocation";
import { runBackgroundScript } from "@/notification/Notification.ts";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonSpinner,
    IonGrid,
    IonCol,
    Refresher,
    ClockinCard,
    IonModal,
    IonList,
    IonItem,
    IonButtons,
    IonLabel,
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
      btnText: "",
      headerTitle: "Clock In/Out",
      clockin: "00:00",
      clockout: "00:00",
      date: "",
      time: "",
      timezoneName: "",
      timezoneOffset: "",
      employeeAlreadyPunchedIn: false,
      theme: {},
      coordinatesText: "",
      toastMessage: "",
      hasClockedIn: false,
      breakTime: false,
      breakDetails: null,
      isModalOpen: false,
      hasBreaktime: false,
      isPmBreakDone: false,
      searchQuery: "",
      scannedUsername: "",
      scannedName: "",
      employees: [],
      selectedEmployee: null,
    };
  },
  computed: {
    filteredEmployees() {
      const query = this.searchQuery.toLowerCase();
      return this.employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(query) ||
          employee.username.toLowerCase().includes(query)
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
            ctx.strokeStyle = "#008e9c";
            ctx.lineWidth = 2;
            ctx.strokeRect(
              scaledBox.x,
              scaledBox.y,
              scaledBox.width,
              scaledBox.height
            );
            ctx.fillStyle = "#008e9c";
            ctx.font = "16px Arial";
            const text = "processing";
            const textWidth = ctx.measureText(text).width;
            const textHeight = 16;
            const padding = 4;
            const bgX =
              scaledBox.x + scaledBox.width / 2 - textWidth / 2 - padding;
            const bgY = scaledBox.y - textHeight - padding * 2;
            const bgWidth = textWidth + padding * 2;
            const bgHeight = textHeight + padding * 2;
            ctx.fillStyle = "rgba(0,0,0,0.7)";
            ctx.fillRect(bgX, bgY, bgWidth, bgHeight);
            ctx.fillStyle = "#008e9c";
            ctx.fillText(
              text,
              scaledBox.x + scaledBox.width / 2 - textWidth / 2,
              scaledBox.y - 5
            );
            if (this.mode === "auth") {
              this.processing = true;
              await this.authenticateFace(detection.descriptor);
              return;
            }
          }
        } catch (error) {
          console.error("Error processing frame:", error);
        }
      }
      requestAnimationFrame(this.processFrames);
    },
    async authenticateFace(scannedDescriptor) {
      try {
        // 1. Get users from the API
        const usersResponse = await axios.get("https://hrvale.bapplware.com/users/data");
        const users = usersResponse.data.data;

        // 2. Find a match from localStorage to get the username
        const storedFaces = JSON.parse(localStorage.getItem("faceIds") || "[]");
        let matchedUsername = null;
        let minDistance = Infinity;

        for (const storedFace of storedFaces) {
          const distance = faceapi.euclideanDistance(
            scannedDescriptor,
            storedFace.descriptor
          );
          if (distance < minDistance) {
            minDistance = distance;
            matchedUsername = storedFace.username;
          }
        }

        if (minDistance < 0.6) { // threshold
          // 3. Find the user from the API response
          const matchedUser = users.find(user => user.username === matchedUsername);

          if (matchedUser && matchedUser.face_signature) {
            // 4. Compare the face signatures
            const storedDescriptor = new Float32Array(Object.values(JSON.parse(matchedUser.face_signature)));
            const distance = faceapi.euclideanDistance(
              scannedDescriptor,
              storedDescriptor
            );

            if (distance < 0.6) { // threshold
              this.showAlert("Face authenticated successfully!");
              this.store.dispatch("auth/login", matchedUser);
              this.authenticated = true;
              await this.initializeClock();
            } else {
              this.presentAlert("Authentication failed. Face does not match.");
            }
          } else {
            this.presentAlert("Authentication failed. User or face signature not found.");
          }
        } else {
          this.presentAlert("Authentication failed. Face not recognized.");
        }
      } catch (error) {
        console.error("Error during authentication:", error);
        this.presentAlert("An error occurred during authentication.");
      } finally {
        this.processing = false;
      }
    },
    async fetchEmployees() {
      try {
        const response = await axios.get(
          "https://hrvale.bapplware.com/users/data"
        );
        this.employees = response.data.data.map((emp) => ({
          id: emp.username,
          username: emp.username,
          name: emp.username,
          fingerprint:
            emp.finger_print === "undefined"
              ? undefined
              : emp.finger_print || undefined,
          face:
            emp.face_signature === "undefined"
              ? undefined
              : emp.face_signature || undefined,
        }));
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    },
    async registerFace() {
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
            this.selectedEmployee.username
          }_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const stored = JSON.parse(localStorage.getItem("faceIds") || "[]");
          stored.push({
            id: Date.now(),
            name: faceId,
            descriptor: Array.from(detection.descriptor),
            username: this.selectedEmployee.username,
            client: "default", // Default client
            employee: this.selectedEmployee,
          });
          localStorage.setItem("faceIds", JSON.stringify(stored));
          this.loadStoredFaces();
          this.presentAlert(
            `Face registered successfully for ${this.selectedEmployee.name}!`
          );
          try {
            const baseURL = localStorage.getItem("baseUrl");
            const token = localStorage.getItem("token");
            const headers = {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            };
            const url = `${baseURL}/users/${this.selectedEmployee.username}`;
            const payload = {
              face_signature: JSON.stringify(Array.from(detection.descriptor)),
            };
            await axios.put(url, payload, { headers });
            this.presentAlert(
              `Face signature updated successfully for ${this.selectedEmployee.name}!`
            );
          } catch (error) {
            console.error("Error updating face signature:", error);
            this.presentAlert("Error updating face signature. Please try again.");
          }
          // Clear selection
          this.selectedEmployee = null;
          this.searchQuery = "";
        } else {
          this.presentAlert("No face detected. Please try again.");
        }
      } catch (error) {
        console.error("Error registering face:", error);
        this.presentAlert("Error registering face. Please try again.");
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
    async initializeClock() {
      try {
        const coordinates = await Geolocation.getCurrentPosition();
        this.coordinatesText = `Latitude: ${coordinates.coords.latitude}, Longitude: ${coordinates.coords.longitude}`;
      } catch (error) {
        console.error("Error getting coordinates:", error.message);
        // GPS is off, do nothing and continue
      }

      this.getCurrentTime();
      setInterval(this.getCurrentTime, 1000);
      this.checkTokenExpiration();
      await this.breaktimeConfig();
      await this.checkState();

      this.fetchTheme();
      this.loading = false;
    },
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

    getCurrentTime() {
      try {
        const currentTime = new Date();
        const timezoneName = "Asia/Manila";
        const timezoneOffset = currentTime.getTimezoneOffset() / 60;

        const localDateString = `${currentTime.getFullYear()}-${String(
          currentTime.getMonth() + 1
        ).padStart(2, "0")}-${String(currentTime.getDate()).padStart(2, "0")}`;

        const localTimeString = `${String(currentTime.getHours()).padStart(
          2,
          "0"
        )}:${String(currentTime.getMinutes()).padStart(2, "0")}`;

        this.date = localDateString;
        this.time = localTimeString;
        this.timezoneName = timezoneName;
        this.timezoneOffset = timezoneOffset;
      } catch (error) {
        console.error("Error fetching current time:", error.message);
      }
    },

    async checkState() {
      try {
        this.store.commit("loader/updateLoader", true);
        const baseURL = localStorage.getItem("baseUrl");
        await this.checkTokenExpiration();
        const empNumber = localStorage.getItem("empNumber");
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not available.");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        const apiUrl =
          baseURL + `api/v2/attendance/records/latest?empNumber=${empNumber}`;

        const getStateResponse = await axios.get(apiUrl, { headers });

        this.clockin = getStateResponse.data?.data?.punchIn?.userTime;
        this.clockout = getStateResponse.data?.data?.punchOut?.userTime;

        const currentDate = new Date().toISOString().split("T")[0];

        if (getStateResponse.data?.data?.punchIn?.userDate !== currentDate) {
          this.clockin = "00:00";
        }

        if (getStateResponse.data?.data?.punchOut?.userDate !== currentDate) {
          this.clockout = "00:00";
        }

        if (this.clockin === null) {
          this.clockin = "00:00";
        }

        if (this.clockout === null) {
          this.clockout = "00:00";
        }

        if (!this.hasBreaktime) {
          console.log("this.isPmBreakDone: ", !this.isPmBreakDone);

          if (
            getStateResponse.data?.data?.state?.name === "Punched Out"
            // && getStateResponse.data?.data?.punchIn?.utcDate === currentDate
          ) {
            this.btnText = "Clock In";

            this.toastMessage = "Clocked Out";
          } else if (
            getStateResponse.data?.data?.state?.name === "Punched In"
            // && getStateResponse.data?.data?.punchIn?.utcDate === currentDate
          ) {
            this.btnText = "Clock Out";
            this.toastMessage = "Clocked In";
          }
        }
      } catch (error) {
        this.loading = false;
        if (error.response && error.response.status === 401) {
          console.error(
            "Session Expired. Token needs to be refreshed or user needs to re-authenticate."
          );
        } else {
          console.error("Error making the GET request:", error);
        }
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    async breaktimeConfig() {
      try {
        this.store.commit("loader/updateLoader", true);

        const empNumber = localStorage.getItem("empNumber");
        const baseURL = localStorage.getItem("baseUrl");
        await this.checkTokenExpiration();

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not available.");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        const apiUrl = `${baseURL}api/v1/attendance/break-time-config?empNumber=${empNumber}`;

        const getStateResponse = await axios.get(apiUrl, { headers });
        this.isPmBreakDone = getStateResponse.data?.data?.isPmBreakDone;
        this.hasBreaktime = getStateResponse.data?.data?.hasBreaktime;

        await this.checkStateBreaktime();
      } catch (error) {
        console.error("Error fetching break-time config:", error.message);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    async checkStateBreaktime() {
      try {
        this.store.commit("loader/updateLoader", true);
        const empNumber = localStorage.getItem("empNumber");
        const baseURL = localStorage.getItem("baseUrl");
        await this.checkTokenExpiration();
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not available.");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        const apiUrl =
          baseURL +
          `api/v1/attendance/break-time/latest?empNumber=${empNumber}`;
        const getStateResponse = await axios.get(apiUrl, { headers });

        const breakData = getStateResponse.data.data;

        const currentDate = new Date().toISOString().split("T")[0];

        if (
          breakData.punchInAmBreak.amDate === currentDate ||
          breakData.punchOutAmBreak.amDate === currentDate ||
          breakData.punchInLunchBreak.lunchDate === currentDate ||
          breakData.punchOutLunchBreak.lunchDate === currentDate ||
          breakData.punchInPmBreak.pmDate === currentDate ||
          breakData.punchOutPmBreak.pmDate === currentDate
        ) {
          this.breakDetails = breakData;
        } else {
          this.breakDetails = null;
        }

        if (this.hasBreaktime) {
          if (breakData.state.name === "Punched In") {
            this.btnText = "Punch Out Break";
            this.toastMessage = "Punch Out Break";
          } else {
            this.btnText = "Punch In Break";
            this.toastMessage = "Punch In Break";
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    async getState(dataData) {
      try {
        const token = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        if (!token) {
          console.error("Token not available.");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        const apiUrl = baseURL + `api/v3/attendance/employees/records`;
        const payload = {
          date: dataData,
        };

        const getStateResponse = await axios.get(apiUrl, { headers });

        if (getStateResponse.data?.data?.state?.name === "Punched Out") {
          this.employeeAlreadyPunchedIn = false;
        } else {
          this.employeeAlreadyPunchedIn = true;
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error(
            "Session Expired. Token needs to be refreshed or user needs to re-authenticate."
          );
        } else {
          console.error("Error making the GET request:", error);
        }
      }
    },

    async handleClockInData() {
      try {
        await this.checkTokenExpiration();
        const baseURL = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        let coordinates = null;
        try {
          coordinates = await Geolocation.getCurrentPosition();
        } catch (gpsError) {
          console.error("GPS not available:", gpsError.message);
          // Continue without GPS coordinates
        }

        if (this.hasBreaktime) {
          console.log("Using Break Time");
          const payload = {
            date: this.date,
            time: this.time,
            // timezoneName: this.timezoneName,
            // timezoneOffset: this.timezoneOffset,
            // note: null,
            // latitude: coordinates?.coords.latitude,
            // longitude: coordinates?.coords.longitude,
          };
          const breakTimeApiUrl = `${baseURL}api/v1/break-time`;

          await axios.post(breakTimeApiUrl, payload, { headers });
          await this.breaktimeConfig();
        } else {
          console.log("Using Attendance");
          const payload = {
            date: this.date,
            time: this.time,
            timezoneName: this.timezoneName,
            timezoneOffset: this.timezoneOffset,
          };
          const attendanceApiUrl = `${baseURL}api/v3/attendance/employees/records`;

          if (this.employeeAlreadyPunchedIn) {
            await axios.put(attendanceApiUrl, payload, { headers });
          } else {
            await axios.post(attendanceApiUrl, payload, { headers });
          }
          await this.checkState();
        }

        this.showAlert(this.toastMessage);
      } catch (error) {
        console.error(
          "Error making the API request: ",
          error.response?.data?.error?.message
        );

        this.showErrorMessage(error.response?.data?.error?.message);
      }
    },
    // /api/v1/break-time
    async showAlert(message) {
      try {
        const toast = await toastController.create({
          message: `${message}!`,
          duration: 3000,
          position: "top",
          icon: "alert-circle-outline",
          buttons: [
            {
              icon: "close-outline",
              role: "cancel",
            },
          ],
        });
        await toast.present();
      } catch (error) {
        console.log(error.message);
      }
    },

    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
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

    handleBack() {
      this.authenticated = false;
      console.log("Back button clicked");
    },
    closeAuthenticated() {
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
    goToRegisteredFaces() {
      const password = prompt(
        "Enter admin password to manage registered faces:"
      );
      if (password === "admin123") {
        this.router.push("/registeredfaces");
      } else {
        alert("Incorrect password");
      }
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
    async fetchToken() {
      try {
        const storedToken = localStorage.getItem("access_token");
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
    async hasPincode() {
      try {
        await this.fetchToken();

        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        const authToken = `Bearer ${storedToken}`;
        const apiUrl = baseURL + `api/ess/pincode`;
        const headers = { Authorization: authToken };
        const response = await axios.get(apiUrl, { headers });

        await this.fetchUserDetails();

        if (response.data.data.pincode) {
          try {
            await runBackgroundScript();

            localStorage.setItem("pincode", response.data.data.pincode);
            // this.router.push("/WelcomeTermsAndCondition");
          } catch (innerError) {
            console.log(innerError.message);
            location.reload();
          }
        } else {
          this.router.push("/setuppincodelogin");
        }
      } catch (error) {
        console.log(error.message);
        localStorage.setItem("hasSetup", false);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },
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
  position: relative;
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
  --border-radius: 12px;
  margin-bottom: 12px;
  font-weight: 600;
  height: 48px;
}

.register-button {
  --border-radius: 12px;
  font-weight: 600;
  height: 48px;
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
  position: relative;
  z-index: 1;
}

.registration-card-header {
  text-align: center;
  padding: 20px 20px 0 20px;
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
