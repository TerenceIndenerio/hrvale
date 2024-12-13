<template>
  <ion-card class="card-top neomorphic-card-1 leave-card">
    <ion-badge class="status" v-bind:color="{ primaryColor }">{{
      typeOfLeave
    }}</ion-badge>

    <ion-grid class="card-content-container">
      <ion-row>
        <ion-col size="6" class="col-name">
          <p>Date Applied</p>
        </ion-col>

        <ion-col size="6" class="col-name">
          <p :style="{ color: primaryColor }"></p>
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col size="6" class="col-name">
          <p>Status</p>
        </ion-col>
        <ion-col size="6" class="col-data">
          <p :style="{ color: primaryColor }">{{ status }}</p>
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col size="6" class="col-name">
          <p>Leave Type</p>
        </ion-col>
        <ion-col size="6" class="col-data">
          <p :style="{ color: primaryColor }">{{ typeOfLeave }}</p>
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col size="6" class="col-name">
          <p>Leave Start</p>
        </ion-col>
        <ion-col size="6" class="col-data">
          <p :style="{ color: primaryColor }">{{ endDate }}</p>
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col size="6" class="col-name">
          <p>Leave End</p>
        </ion-col>
        <ion-col size="6" class="col-data">
          <p :style="{ color: primaryColor }">{{ startDate }}</p>
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col size="6" class="col-name">
          <p>Reason</p>
        </ion-col>
        <ion-col size="6" class="col-data">
          <p :style="{ color: primaryColor }">{{ reason }}</p>
        </ion-col>
      </ion-row>
    </ion-grid>

    <div class="action-btns">
      <ion-button
        expand="full"
        color="danger"
        @click="redirectToRetractLeave"
        :disabled="status === 'Rejected'"
        class="neomorphic-card-1 leave-action-btn retract-btn"
      >
        Retract
      </ion-button>
    </div>
  </ion-card>
</template>

<script>
import {
  IonCard,
  IonText,
  IonBadge,
  IonItem,
  IonList,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/vue";

export default {
  components: {
    IonCard,
    IonText,
    IonBadge,
    IonItem,
    IonList,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
  },
  props: {
    cardTitle: String,
    appliedDuration: String,
    reason: String,
    typeOfLeave: String,
    status: String,
    colorBadge: String,
    endDate: String,
    startDate: String,
    primaryColor: String,
  },
  emits: ["view-details-clicked"],
  methods: {
    redirectToApplyLeave() {
      this.$emit("view-details-clicked");
    },
    redirectToRetractLeave() {
      this.$emit("retract-clicked");
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
@import url("https://fonts.googleapis.com/css?family=Roboto");

* {
  padding: 0;
  margin: 0;
}

ion-card {
  border-radius: 50%;
  overflow: hidden;
}
.card {
  padding-top: 10px;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8), 0px -4px 8px rgba(0, 0, 0, 0.05);
}
.card-top {
  border-radius: 5px;
  margin: 0 10% 20px 10%;
}
.status {
  position: absolute;
  top: 5;
  right: 0;
  border-radius: 20px 0px 0px 20px;
  padding: 5px 10px;
  margin: 10pz;
  color: white;
  z-index: 10;
}
.card-title {
  color: #3b3c3e;
  font-family: "Open Sans";
  font-size: 19px;
  font-style: normal;
  font-weight: bold;
  line-height: normal;
  margin-left: 10%;
}
.icon-item-container {
  margin-right: 10px;
}
.text-item-container p {
  margin: 0;
  color: #7b808b;
  font-family: var(--ion-font-font1);
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.text-item-container h4 {
  color: #3b3c3e;
  font-family: var(--ion-font-font1);
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.action-btns {
  display: flex;
  justify-content: center;
  flex-direction: row;
  margin: 0;
  padding: 0;
  gap: 0;
}
.action-btns {
  width: 100%;
  margin-top: 10px;
}
.leave-card {
  width: 300px;
  border-radius: 20px;
  padding: 10px;
}
.leave-action-btn {
  padding: 0;
  margin: 10px 5px;
  overflow: hidden;
  width: 80%;
}
.view-btn {
  border-radius: 20px 0 0 20px;
}

.retract-btn {
  border-radius: 10px;
}
.col-name {
  font-family: Poppins;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
}
.col-data {
  font-family: Poppins;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
}
.card-content-container {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>
