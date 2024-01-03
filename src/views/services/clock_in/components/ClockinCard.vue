<template>
  <ion-card class="card">
    <div class="clock-container">
      <Clock />
    </div>

    <div class="time space">
      <div class="box">
        <h2>
          {{ hours }}
        </h2>
      </div>
      <div class="box">
        <h2>
          {{ minutes }}
        </h2>
      </div>
      <div class="box">
        <h2>
          {{ seconds }}
        </h2>
      </div>
      <div class="time-text">
        <p>{{ period }}</p>
      </div>
    </div>

    <svg
      class="space"
      xmlns="http://www.w3.org/2000/svg"
      width="290"
      height="6"
      viewBox="0 0 290 6"
      fill="none"
    >
      <path
        d="M3.01831 2.69977H286.526"
        stroke="#E9E3E3"
        stroke-width="5"
        stroke-linecap="round"
      />
    </svg>

    <ion-button
      color="none"
      class="btn-clock space"
      @click="setClockInTime"
      :style="{ backgroundColor: btnColor, color: btnTextColor }"
    >
      {{ btnText }}
    </ion-button>
  </ion-card>
</template>

<script>
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonButton,
} from "@ionic/vue";
import { defineComponent } from "vue";
import Clock from "@/views/services/clock_in/components/Clock.vue";

export default defineComponent({
  components: {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonButton,
    Clock,
  },
  props: {
    btnText: String,
    btnColor: String,
    btnTextColor: String,
  },
  data() {
    return {
      hours: "",
      minutes: "",
      seconds: "",
      period: "", // Added variable to store AM or PM
    };
  },
  created() {
    this.updateClock();
    this.clockInterval = setInterval(this.updateClock, 1000);
  },
  beforeUnmount() {
    clearInterval(this.clockInterval);
  },
  methods: {
    updateClock() {
      const now = new Date();
      this.hours = this.padNumber(now.getHours() % 12 || 12, 2);
      this.minutes = this.padNumber(now.getMinutes(), 2);
      this.seconds = this.padNumber(now.getSeconds(), 2);
      this.period = now.getHours() < 12 ? "AM" : "PM";
    },
    padNumber(number, length) {
      return String(number).padStart(length, "0");
    },
    setClockInTime() {
      this.$emit("clockInClicked");
    },
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans");

.space {
  margin: 7px;
}
.card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  text-align: center;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8), 0px -4px 8px rgba(0, 0, 0, 0.05);
}
.img {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 15px;
  padding: 0 10px;
  align-items: center;
  position: absolute;
  top: 96px;
  left: 0;
  right: 0;
}
.time {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
.box {
  background-color: #feeded;
  height: 50px;
  width: 50px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box h2 {
  padding: 5px;
}
.box h2 {
  color: #00003d;
}
.time-text {
  color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
}
.text-clock {
  color: #000;
  text-align: center;
  font-family: Open Sans;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.btn-clock {
  border-radius: 15px;
  width: 232px;
  height: 50px;
  overflow: hidden;
  font-family: Open Sans;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  color: #fff;
}

.clock-container {
  background-color: rgb(241, 241, 241);
  padding: 20px;

  border-radius: 50%;
  border: 10px solid whitesmoke;
  box-shadow: inset 8px 8px 16px rgba(0, 0, 0, 0.1),
    inset -8px -8px 16px rgba(255, 255, 255, 0.8),
    inset 0px -4px 8px rgba(0, 0, 0, 0.05);
}

.sun {
  animation: floatSun 10s ease 0s infinite normal forwards;
}
.clouds {
  animation: clouds 3s ease 0s infinite alternate-reverse forwards;
}
.clouds2 {
  animation: clouds 3.5s ease 0s infinite alternate-reverse forwards;
}

/* animation */
@keyframes floatSun {
  0%,
  /* 100% {
    transform: translateX(0%);
    transform-origin: 50% 50%;
  } */

  100% {
    transform: translateX(-6px) rotate(0deg);
  }

  /* 30% {
    transform: translateX(5px) rotate(6deg);
  }

  45% {
    transform: translateX(-5px) rotate(-3.6deg);
  }

  60% {
    transform: translateX(9px) rotate(2.4deg);
  }

  75% {
    transform: translateX(-6px) rotate(-1.2deg);
  } */
}

@keyframes clouds {
  0% {
    transform: translate(0);
  }

  20% {
    transform: translate(-2px, 2px);
  }

  40% {
    transform: translate(-2px, -2px);
  }

  60% {
    transform: translate(2px, 2px);
  }

  80% {
    transform: translate(2px, -2px);
  }

  100% {
    transform: translate(0);
  }
}
@keyframes clouds2 {
  0% {
    transform: translate(0);
  }

  20% {
    transform: translate(-2px, 2px);
  }

  40% {
    transform: translate(-2px, -2px);
  }

  60% {
    transform: translate(2px, 2px);
  }

  80% {
    transform: translate(2px, -2px);
  }

  100% {
    transform: translate(0);
  }
}
</style>
