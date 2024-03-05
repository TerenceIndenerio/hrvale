<template>
  <div class="clock-card">
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
        <h4>
          {{ hours }}
        </h4>
      </div>
      <div class="box">
        <h4>
          {{ minutes }}
        </h4>
      </div>
      <div class="box">
        <h4>
          {{ seconds }}
        </h4>
      </div>
      <div class="time-text">
        <p>PM</p>
      </div>
    </div>
  </div>
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
import { useRouter } from "vue-router";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonButton,
  },
  setup() {
    return {
      router: useRouter(),
    };
  },
  props: {
    btnColor: String,
    btnTextColor: String,
  },
  data() {
    return {
      hours: "",
      seconds: "",
      minutes: "",
      cinHrs: "",
      cinMin: "",
      cinSec: "",
    };
  },
  mounted() {
    this.updateClock();
    setInterval(this.updateClock, 1);
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
    navigateToClockIn() {
      this.$router.push("/clockin");
    },
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans");

.card {
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8), 0px -4px 8px rgba(0, 0, 0, 0.05);
}
.space {
  margin: 7px;
}

.clock-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  text-align: center;
  width: 80%;
  margin: 0 auto;
  /* flex-wrap: wrap; */
  height: fit-content;
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
  height: fit-content;
  width: fit-content;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.box h4 {
  color: #00003d;
  padding: 5px;
  margin: 0;
}
.time-text {
  color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}
.time-text p {
  margin: 0;
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
  background-color: #12a3da;

  width: 232px;
  height: 50px;
  overflow: hidden;
  font-family: Open Sans;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
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
