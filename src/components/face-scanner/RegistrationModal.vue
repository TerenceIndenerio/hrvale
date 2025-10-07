<template>
  <ion-modal
    :is-open="isOpen"
    @didDismiss="$emit('didDismiss')"
  >
    <ion-header>
      <ion-toolbar>
        <ion-title>Register Credentials</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$emit('didDismiss')">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="floating">Username</ion-label>
        <ion-input v-model="registrationData.username"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Password</ion-label>
        <ion-input
          type="password"
          v-model="registrationData.password"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Client ID</ion-label>
        <ion-input v-model="registrationData.clientID"></ion-input>
      </ion-item>
      <ion-button
        expand="block"
        @click="submitRegistration"
        class="ion-margin-top"
      >
        Submit
      </ion-button>
    </ion-content>
  </ion-modal>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
} from '@ionic/vue';

export default defineComponent({
  name: 'RegistrationModal',
  components: {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
  },
  props: {
    isOpen: Boolean,
  },
  emits: ['didDismiss', 'submit'],
  setup(props, { emit }) {
    const registrationData = reactive({
      username: '',
      password: '',
      clientID: '',
    });

    const submitRegistration = () => {
      emit('submit', { ...registrationData });
      registrationData.username = '';
      registrationData.password = '';
      registrationData.clientID = '';
    };

    return {
      registrationData,
      submitRegistration,
    };
  },
});
</script>