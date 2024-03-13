<template>
  <ion-page>
    <div class="bottom">
      <div class="inline-v">
        <h1 class="text-center shout-text">Log In</h1>
      </div>
      <div class="inline-v">
        <div class="box-container text-pad">
          <ion-input
            label="Tenant"
            labelPlacement="floating"
            class="input-text"
            required
          ></ion-input>
        </div>
        <br />
        <div class="box-container text-pad">
          <ion-input
            label="Username"
            v-model="form.username"
            labelPlacement="floating"
            placeholder="user@example.com"
            class="input-text"
            required
          ></ion-input>
        </div>
        <br />
        <div class="box-container text-pad">
          <ion-input
            label="Password"
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
          >{{ buttonText }}
        </ion-button>
      </div>

      <div class="bottom-text">
        <p>© 2024 BAPPLWARE Technologies, <br />Inc. All rights reserved.</p>
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
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

a {
  text-decoration: none;
  color: #034ea2;
}
.center {
  margin: auto;
  width: fit-content;
}
.margin-top {
  margin: 5% 0;
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
  color: #008e9c;
  text-align: center;
  font-family: Poppins;
  font-size: 30px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 5px;
}
.bottom {
  overflow-y: scroll;
  position: fixed;
  bottom: 0px;
  width: 100%;
  padding: 20px;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  /* flex-wrap: wrap; */
  gap: 5px;

  border-top: 1px solid rgb(157, 157, 157);
  height: 65%;
  width: 100%;
  border-radius: 130px 130px 0 0;
}
.box-container {
  border-radius: 20px;
  background-color: #baedf3;
  overflow: hidden;
  width: 100%;
  max-width: 300px;
  display: flex;
  margin: 0 auto;
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
  color: #257178;
  margin-left: 10px;
  font-family: Poppins;
  font-size: 14px;
  font-weight: 700;
  opacity: 60%;
}
.btn {
  border-radius: 60px;
  width: 250px;
  height: 50px;
  overflow: hidden;
  font-family: Poppins;
  font-size: 22px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
  border: none;
  background-image: linear-gradient(
    to right,
    #007682,
    #007a87,
    #007f8b,
    #008390,
    #008895,
    #038e9c,
    #0694a2,
    #099aa9,
    #10a3b2,
    #16acbc,
    #1cb6c5,
    #21bfcf
  );
}
.bottom-text {
  width: 100%;
  /* margin: 10% 0; */
  padding: 0;
}
.bottom-text p {
  padding: 0;
  margin: 0;
  text-align: center;
  color: #008e9c;
  font-weight: 600;
  font-family: Poppins;
  font-size: 12px;
}
.margin-top-less {
  margin-top: 0px;
  color: #062f5f;
  font-weight: 900;
  font-family: Poppins;
  font-size: 16px;
  text-decoration: none;
}
</style>
