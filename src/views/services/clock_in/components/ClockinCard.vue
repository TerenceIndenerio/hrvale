<template>
  <ion-card>
    <div class="img space">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="47"
        height="14"
        viewBox="0 0 47 14"
        fill="none"
        style="margin-top: 20px"
        class="clouds"
      >
        <path
          d="M0.520874 12.2566H3.84017C3.53842 8.88631 5.56468 1.2926 14.9794 1.2926C24.3941 1.2926 24.4269 9.57967 24.4269 13.595C24.162 11.4033 26.1443 6.62881 32.1794 6.62881C38.2145 6.62881 38.9186 11.1225 38.5162 13.3693H42.7408M44.1584 13.3693H46.1624"
          stroke="black"
          stroke-linecap="round"
        />
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="45"
        viewBox="0 0 48 45"
        fill="none"
        class="sun"
      >
        <path
          d="M36.5298 21.975C36.5298 28.4906 30.8436 33.8326 23.7526 33.8326C16.6615 33.8326 10.9754 28.4906 10.9754 21.975C10.9754 15.4595 16.6615 10.1175 23.7526 10.1175C30.8436 10.1175 36.5298 15.4595 36.5298 21.975Z"
          fill="#F2994A"
          stroke="#3C3636"
        />
        <path
          d="M23.7526 7.49194V0.899628"
          stroke="#3B3636"
          stroke-linecap="round"
        />
        <path
          d="M23.7526 43.7822V37.1899"
          stroke="#3B3636"
          stroke-linecap="round"
        />
        <path
          d="M39.7066 22.3409L46.7896 22.3409"
          stroke="#3B3636"
          stroke-linecap="round"
        />
        <path
          d="M0.715678 22.3409L7.79858 22.3409"
          stroke="#3B3636"
          stroke-linecap="round"
        />
        <path
          d="M34.6983 11.5288L39.7067 6.86731"
          stroke="#3B3636"
          stroke-linecap="round"
        />
        <path
          d="M7.12749 37.1899L12.1359 32.5284"
          stroke="#3B3636"
          stroke-linecap="round"
        />
        <path
          d="M34.6983 31.5507L39.7067 36.2122"
          stroke="#3B3636"
          stroke-linecap="round"
        />
        <path
          d="M7.12749 5.88962L12.1359 10.5511"
          stroke="#3B3636"
          stroke-linecap="round"
        />
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="47"
        height="14"
        viewBox="0 0 47 14"
        fill="none"
        style="margin-top: -20px"
        class="clouds2"
      >
        <path
          d="M0.520874 12.2566H3.84017C3.53842 8.88631 5.56468 1.2926 14.9794 1.2926C24.3941 1.2926 24.4269 9.57967 24.4269 13.595C24.162 11.4033 26.1443 6.62881 32.1794 6.62881C38.2145 6.62881 38.9186 11.1225 38.5162 13.3693H42.7408M44.1584 13.3693H46.1624"
          stroke="black"
          stroke-linecap="round"
        />
      </svg>
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
        <p>HRS</p>
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

    <p class="text-clock">GENERAL 09:00 AM TO 06:00 PM</p>

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

<script lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonButton,
} from "@ionic/vue";
import { defineComponent, defineEmits } from "vue";

export default defineComponent({
  components: {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonButton,
  },
  props: {
    btnText: String,
    btnColor: String,
    btnTextColor: String,
  },
  data() {
    return {
      hours: "",
      seconds: "",
      minutes: "",
      clockinNum: "",
      cinHrs: "",
      cinMin: "",
      cinSec: "",
    };
  },
  mounted() {
    this.updateClock();
    setInterval(this.updateClock, 1000);
  },
  methods: {
    updateClock() {
      const now = new Date();
      this.hours = this.padNumber(now.getHours() % 12 || 12, 2);
      this.minutes = this.padNumber(now.getMinutes(), 2);
      this.seconds = this.padNumber(now.getSeconds(), 2);
    },
    padNumber(number: number, length: number): string {
      return String(number).padStart(length, "0");
    },
    setClockInTime() {
      const now = new Date();
      const timeZoneOffsetMinutes = now.getTimezoneOffset();
      const offsetSign = timeZoneOffsetMinutes < 0 ? "-" : "+";
      const formattedDate = now.toISOString().slice(0, 10);
      const formattedTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const timeZone = new Intl.DateTimeFormat("en-US", {
        timeZoneName: "short",
      }).resolvedOptions().timeZone;

      this.$emit("clockInData", {
        date: formattedDate,
        time: formattedTime,
        timezoneName: timeZone,
        timezoneOffset: offsetSign + Math.abs(timeZoneOffsetMinutes) / 60,
      });
    },
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans");

.space {
  margin: 7px;
}
ion-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  text-align: center;
}
.img {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
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
  100% {
    transform: translateX(0%);
    transform-origin: 50% 50%;
  }

  15% {
    transform: translateX(-6px) rotate(-10deg);
  }

  30% {
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
  }
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
