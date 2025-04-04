<template>
  <IonContent>
    <div class="signature-container">
      <IonButton
        expand="full"
        @click="clearSignature"
        class="neomorphic-btn-2 clear-btn"
        color="none"
      >
        <ion-icon name="trash-outline"></ion-icon> Clear
      </IonButton>
      <canvas ref="signatureCanvas" class="signature-canvas"></canvas>
      <div class="btn-action-container">
        <IonButton
          expand="full"
          @click="saveSignature"
          class="neomorphic-btn-2"
        >
          <strong>Accept All & Continue</strong>
        </IonButton>
      </div>
    </div>
  </IonContent>
</template>

<script lang="ts">
import { IonContent, IonButton, IonIcon } from "@ionic/vue";
import SignaturePad from "signature_pad";

export default {
  components: { IonContent, IonButton, IonIcon },
  data() {
    return {
      signaturePad: null as SignaturePad | null,
    };
  },
  mounted() {
    this.initSignaturePad();
  },
  methods: {
    initSignaturePad() {
      const canvas = this.$refs.signatureCanvas as HTMLCanvasElement;
      this.setFixedCanvasSize(canvas); // Set fixed dimensions
      this.signaturePad = new SignaturePad(canvas, {
        backgroundColor: "rgb(255, 255, 255)",
        penColor: "rgb(0, 0, 0)",
      });
    },
    setFixedCanvasSize(canvas: HTMLCanvasElement) {
      const fixedWidth = 300; // Fixed width in pixels
      const fixedHeight = 200; // Fixed height in pixels

      // Set canvas dimensions
      canvas.width = fixedWidth;
      canvas.height = fixedHeight;

      const context = canvas.getContext("2d")!;
      context.scale(1, 1); // No scaling for fixed size
    },
    clearSignature() {
      this.signaturePad?.clear();
    },
    saveSignature() {
      if (this.signaturePad && !this.signaturePad.isEmpty()) {
        const dataUrl = this.signaturePad.toDataURL("image/png");
        const base64Signature = dataUrl.split(",")[1]; // Extract Base64 part
        this.$emit("signatureSaved", base64Signature); // Emit event with Base64 data
      } else {
        console.log("Signature pad is empty.");
      }
    },
  },
  beforeUnmount() {
    if (this.signaturePad) {
      this.signaturePad.off();
    }
  },
};
</script>

<style>
.signature-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.signature-canvas {
  border: 1px solid #000;
  width: 300px; /* Fixed width */
}
.btn-action-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
}
.clear-btn {
  margin-left: auto;
  background-color: red;
}
</style>
