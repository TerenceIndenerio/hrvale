<template>
  <div class="clock-card">
    <div>
      <div class="time">{{ time }}</div>
      <div class="day">{{ day }}</div>
      <div class="controls">
        <IonButton
          color="none"
          class="btn-clock space"
          @click="$emit('clockInClicked')"
          :style="{ backgroundColor: btnColor, color: btnTextColor }"
        >
          {{ btnText }}
        </IonButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { IonButton } from "@ionic/vue"; // 👈 import Ionic button

const props = defineProps({
  btnText: { type: String, default: "Clock In" },
  btnColor: { type: String, default: "#3880ff" },
  btnTextColor: { type: String, default: "#fff" },
});

const time = ref("");
const day = ref("");
let timer = null;

function update() {
  const now = new Date();
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  time.value = new Intl.DateTimeFormat(undefined, options).format(now);
  day.value = new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(
    now
  );
}

onMounted(() => {
  update();
  timer = setInterval(update, 1000);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.clock-card {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 12px;
  padding: 16px;
}
.time {
  font-size: 2.6rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #fff;
}
.day {
  font-size: 1.5rem;
  color: var(--ion-color-medium, #666);
}
.controls {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}
.btn-clock.space {
  border-radius: 15px;
  width: 232px;
  height: 70px;
  overflow: hidden;
  font-family: Open Sans, sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  /* 🔹 Animate the glow */
  animation: glowPulse 2s infinite alternate;
}
@keyframes glowPulse {
  0% {
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.4),
      0 0 15px rgba(255, 255, 255, 0.2);
  }
  100% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.8),
      0 0 30px rgba(255, 255, 255, 0.5);
  }
}
@media (min-width: 768px) {
  .time {
    font-size: 3.6rem;
  }
}
</style>
