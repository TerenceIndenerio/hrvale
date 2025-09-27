<template>
  <ion-modal :is-open="isOpen" @didDismiss="$emit('didDismiss')">
    <ion-header>
      <ion-toolbar>
        <ion-title>Enter Credentials</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$emit('didDismiss')">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-label position="stacked">Client ID</ion-label>
          <ion-input v-model="localClientId" placeholder="Enter Client ID" />
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Username</ion-label>
          <ion-input v-model="localUsername" placeholder="Enter Username" />
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Password</ion-label>
          <ion-input
            v-model="localPassword"
            type="password"
            placeholder="Enter Password"
          />
        </ion-item>
      </ion-list>

      <ion-button
        expand="block"
        color="primary"
        class="ion-margin-top"
        @click="submitCredentials"
      >
        Submit
      </ion-button>
    </ion-content>
  </ion-modal>
</template>

<script>
export default {
  name: "ClientCredentialsModal",
  props: {
    isOpen: Boolean,
    clientId: String,
    username: String,
    password: String,
  },
  data() {
    return {
      localClientId: this.clientId || "",
      localUsername: this.username || "",
      localPassword: this.password || "",
    };
  },
  watch: {
    localClientId(val) {
      this.$emit("update:clientId", val);
    },
    localUsername(val) {
      this.$emit("update:username", val);
    },
    localPassword(val) {
      this.$emit("update:password", val);
    },
  },
  methods: {
    submitCredentials() {
      this.$emit("submit", {
        clientId: this.localClientId,
        username: this.localUsername,
        password: this.localPassword,
      });
      this.$emit("didDismiss");
    },
  },
};
</script>
