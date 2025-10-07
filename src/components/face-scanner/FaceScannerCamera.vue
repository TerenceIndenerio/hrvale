<template>
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
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeUnmount, PropType, expose } from 'vue';
import { IonIcon, IonSpinner } from '@ionic/vue';

export default defineComponent({
  name: 'FaceScannerCamera',
  components: {
    IonIcon,
    IonSpinner,
  },
  props: {
    cameraOn: Boolean,
    processing: Boolean,
  },
  emits: ['update:cameraOn'],
  setup(props, { emit, expose }) {
    const video = ref<HTMLVideoElement | null>(null);
    const canvas = ref<HTMLCanvasElement | null>(null);
    const stream = ref<MediaStream | null>(null);

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        });
        if (video.value) {
          video.value.srcObject = mediaStream;
        }
        stream.value = mediaStream;
        emit('update:cameraOn', true);
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    const stopCamera = () => {
      if (stream.value) {
        stream.value.getTracks().forEach((track) => track.stop());
        stream.value = null;
        emit('update:cameraOn', false);
      }
    };

    onBeforeUnmount(() => {
      stopCamera();
    });

    expose({
      video,
      canvas,
      startCamera,
      stopCamera,
    });

    return {
      video,
      canvas,
    };
  },
});
</script>

<style scoped>
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
</style>