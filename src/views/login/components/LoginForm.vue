<template>
  <ion-page>
    <div class="bottom container">
      <div class="inline-v">
        <h1 class="text-center shout-text">Let’s work!</h1>
      </div>
      <div class="inline-v center">
        <h4 class="input-title">Username</h4>
        <div class="box-container text-pad">
          <ion-input
            label="Enter Username"
            v-model="form.username"
            labelPlacement="floating"
            placeholder="user@example.com"
            class="input-text"
            required
          ></ion-input>
        </div>
        <h4 class="input-title">Password</h4>
        <div class="box-container text-pad">
          <ion-input
            label="Enter password"
            v-model="form.password"
            labelPlacement="floating"
            type="password"
            class="input-text"
            :required="true"
          ></ion-input>
        </div>
      </div>
      <div class="flex-center margin-top">
        <ion-button
          class="btn"
          @click="submitForm"
          color="none"
          v-bind:style="{
            backgroundColor: btnBackgroundColor,
            color: btnColor,
          }"
          >{{ buttonText }}</ion-button
        >
      </div>
      <div class="bottom-text">
        <p>© 2023 BAPPLWARE Technologies, <br />Inc. All rights reserved.</p>
      </div>
    </div>
  </ion-page>
</template>

<script>
import { IonInput, IonPage, IonButton } from "@ionic/vue";
import Button from "@/components/buttons/Button.vue";

export default {
  components: {
    Button,
    IonInput,
    IonPage,
    IonButton,
  },
  props: {
    btnBackgroundColor: String,
    btnColor: String,
  },
  data() {
    return {
      buttonText: "Login",
      form: {},
    };
  },
  emits: ["login"],
  methods: {
    submitForm() {
      this.$emit("login", this.form);
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Lato");
a {
  text-decoration: none;
  color: #000;
}
.center {
  margin: auto;
  width: fit-content;
}
.margin-top {
  margin: 10% 0;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.inline-v {
  display: flex;
  flex-direction: column;
}
.text-center {
  text-align: center;
}
.float-r {
  width: 100%;
  text-align: right;
}
.text-pad {
  padding: 0 10px;
}
/* specifics */
.shout-text {
  color: #313536;
  text-align: center;
  font-family: Lato;
  font-size: 35px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin: 0;
}
.bottom {
  overflow-y: auto;
  position: fixed;
  bottom: 0px;
  width: 100%;
  padding: 20px;
  background-color: white;
}
.container {
  border-top: 1px solid rgb(157, 157, 157);
  height: 65%;
  width: 100%;
  border-radius: 50px 50px 0 0;
}
.box-container {
  border-radius: 50px;
  background-color: #e8e8e8;
  overflow: hidden;
  width: 300px;
}
.input-title {
  color: #3b3c3e;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: bold;
  line-height: normal;
}
.input-text {
  color: gray;
  margin-left: 10px;
}
.btn {
  border-radius: 15px;
  width: 500px;
  height: 50px;
  overflow: hidden;
  font-family: Open Sans;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  border: none;
}
.bottom-text {
  width: 100%;
  margin: 10% 0;
  padding: 0;
}
.bottom-text p {
  padding: 0;
  margin: 0;
  text-align: center;
  color: rgba(128, 128, 128, 0.7);
}
</style>
