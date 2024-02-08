<template>
  <!-- Card Container -->
  <ion-card class="neomorphic-card-1 card-box">
    <!-- Card Header -->
    <div
      class="badge-container"
      :style="{ backgroundColor: theme.primaryColor }"
    >
      <p :style="{ color: theme.primaryFontColor }">Badge</p>
    </div>
    <!-- Card Content -->
    <div class="card-content">
      <!-- Content Row -->
      <ion-row class="pad-w">
        <!-- Label -->
        <ion-col class="col-label">
          <p>Label:</p>
        </ion-col>
        <!-- Data -->
        <ion-col class="col-data">
          <p>{{ dataExample }}</p>
        </ion-col>
      </ion-row>

      <!-- Content Row -->
      <ion-row class="pad-w">
        <!-- Label -->
        <ion-col class="col-label">
          <p>Label:</p>
        </ion-col>
        <!-- Data -->
        <ion-col class="col-data">
          <p>Data here</p>
        </ion-col>
      </ion-row>

      <!-- Content Row -->
      <ion-row class="pad-w">
        <!-- Label -->
        <ion-col class="col-label">
          <p>Label:</p>
        </ion-col>
        <!-- Data -->
        <ion-col class="col-data">
          <p>Data here</p>
        </ion-col>
      </ion-row>

      <!-- Content Row -->
      <ion-row class="pad-w">
        <!-- Label -->
        <ion-col class="col-label">
          <p>Label:</p>
        </ion-col>
        <!-- Data -->
        <ion-col class="col-data">
          <p>Data here</p>
        </ion-col>
      </ion-row>
    </div>

    <!-- Card Action Button -->
    <div class="action-container">
      <ion-button expand="full" color="medium" class="action-btn">
        Button 1
      </ion-button>
      <ion-button expand="full" color="medium" class="action-btn">
        Button 2
      </ion-button>
    </div>
  </ion-card>
</template>

<script>
import {
  IonCard,
  IonCol,
  IonGrid,
  IonRow,
  IonIcon,
  IonButton,
} from "@ionic/vue";
import { getThemeData } from "@/theme/theme";

export default {
  components: {
    IonCard,
    IonCol,
    IonGrid,
    IonRow,
    IonIcon,
    IonButton,
  },
  props: {
    dataExample: String,
  },
  data() {
    return {
      theme: {},
    };
  },
  created() {
    const storedThemeData = getThemeData();

    if (storedThemeData) {
      this.theme = storedThemeData;
    }
    this.theme = storedThemeData;
  },
};
</script>

<style scoped>
p {
  padding: 0;
  margin: 0;
}
.badge-container {
  padding: 0;
  margin: 0;
  border-radius: 20px 0 0 20px;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
}
.badge-container p {
  padding: 5px 10px;
  margin: 0;
}

.col-label {
  color: #585b5f;
  font-family: Open Sans;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 107.682%;
}
.col-data {
  color: #0d0d0d;
  font-family: Open Sans;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 107.682%;
}
.card-content {
  margin: 30px 10px 10px 10px;
}
.card-box {
  width: 300px;
  margin: 20px auto;
  padding: 0;
}
.action-container {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.action-btn {
  margin: 10px 0 0 0;
  width: 100%;
}
</style>
