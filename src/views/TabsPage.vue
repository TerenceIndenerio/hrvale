<template>
  <ion-page color="none" style="background-color: #fff">
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar class="tab-bar" color="none">
        <ion-tab-button
          tab="services"
          href="/tabs/services"
          @click="handleTabButtonClick('services')"
        >
          <div class="services" :class="{ clicked: clickedTab === 'services' }">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              name="grid"
              class="icon-color"
              :style="{ fill: theme.primaryColor, width: '35px' }"
            >
              <path
                d="M204 240H68a36 36 0 01-36-36V68a36 36 0 0136-36h136a36 36 0 0136 36v136a36 36 0 01-36 36zM444 240H308a36 36 0 01-36-36V68a36 36 0 0136-36h136a36 36 0 0136 36v136a36 36 0 01-36 36zM204 480H68a36 36 0 01-36-36V308a36 36 0 0136-36h136a36 36 0 0136 36v136a36 36 0 01-36 36zM444 480H308a36 36 0 01-36-36V308a36 36 0 0136-36h136a36 36 0 0136 36v136a36 36 0 01-36 36z"
              />
            </svg>
            <!-- <ion-icon
              name="grid"
              class="icon-color"
              :style="{ color: theme.primaryColor }"
            ></ion-icon> -->
          </div>
          <ion-label :style="{ color: theme.primaryColor }">SERVICES</ion-label>
        </ion-tab-button>

        <ion-tab-button
          tab="home"
          href="/tabs/home"
          @click="handleTabButtonClick('home')"
        >
          <div class="home" :class="{ clicked: clickedTab === 'home' }">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              name="home"
              class="icon-color"
              :style="{ fill: theme.primaryColor, width: '35px' }"
            >
              <path
                d="M261.56 101.28a8 8 0 00-11.06 0L66.4 277.15a8 8 0 00-2.47 5.79L63.9 448a32 32 0 0032 32H192a16 16 0 0016-16V328a8 8 0 018-8h80a8 8 0 018 8v136a16 16 0 0016 16h96.06a32 32 0 0032-32V282.94a8 8 0 00-2.47-5.79z"
              />
              <path
                d="M490.91 244.15l-74.8-71.56V64a16 16 0 00-16-16h-48a16 16 0 00-16 16v32l-57.92-55.38C272.77 35.14 264.71 32 256 32c-8.68 0-16.72 3.14-22.14 8.63l-212.7 203.5c-6.22 6-7 15.87-1.34 22.37A16 16 0 0043 267.56L250.5 69.28a8 8 0 0111.06 0l207.52 198.28a16 16 0 0022.59-.44c6.14-6.36 5.63-16.86-.76-22.97z"
              />
            </svg>
            <!-- <ion-icon
              name="home"
              class="icon-color"
              :style="{ color: theme.primaryColor }"
            ></ion-icon> -->
          </div>

          <ion-label :style="{ color: theme.primaryColor }">HOME</ion-label>
        </ion-tab-button>

        <ion-tab-button
          tab="tab3"
          href="/tabs/tab3"
          @click="handleTabButtonClick('tab3')"
        >
          <div class="approval" :class="{ clicked: clickedTab === 'tab3' }">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              name="checkmark-circle"
              class="icon-color"
              :style="{ fill: theme.primaryColor, width: '35px' }"
            >
              <path
                d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm108.25 138.29l-134.4 160a16 16 0 01-12 5.71h-.27a16 16 0 01-11.89-5.3l-57.6-64a16 16 0 1123.78-21.4l45.29 50.32 122.59-145.91a16 16 0 0124.5 20.58z"
              />
            </svg>
            <!-- <ion-icon
              name="checkmark-circle"
              class="icon-color"
              :style="{ color: theme.primaryColor }"
            ></ion-icon> -->
          </div>
          <ion-label :style="{ color: theme.primaryColor }">APPROVAL</ion-label>
        </ion-tab-button>

        <!-- <ion-tab-button tab="tab4" href="/tabs/tab4">
          <div class="more">
            <ion-icon
              name="cog"
              class="icon-color"
              :style="{ color: theme.primaryColor }"
            ></ion-icon>
          </div>
          <ion-label :style="{ color: theme.primaryColor }">MORE</ion-label>
        </ion-tab-button> -->
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
} from "@ionic/vue";
import { getThemeData } from "@/theme/theme";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonLabel,
    IonIcon,
    IonPage,
    IonRouterOutlet,
  },
  data() {
    return {
      theme: {},
      clickedTab: null,
    };
  },
  methods: {
    handleTabButtonClick(tabName) {
      this.clickedTab = tabName;
      setTimeout(() => {
        this.clickedTab = null;
      }, 200);
    },
  },
  created() {
    const storedThemeData = getThemeData();

    if (storedThemeData) {
      this.theme = storedThemeData;
    }
  },
});
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
ion-tab-button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
ion-tab-bar {
  height: 60px;
  background-color: #fff;
}
ion-label {
  color: var(--ion-color-primary);
  font-family: Roboto;
  font-size: 8px;
  font-style: normal;
  font-weight: bold;
  line-height: normal;
}
ion-tab-bar {
  border-radius: 30px 30px 0 0;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.05),
    0 -2px 4px -1px rgba(0, 0, 0, 0.07);
}
.icon-color {
  font-size: 35px;
  color: var(--ion-color-primary);
}
.clicked {
  transform: scale(0.7);
  transition: transform 0.2s ease;
}
</style>
