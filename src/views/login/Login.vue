<template>
<ion-page>
    <ion-content :fullscreen="true">
        <div class="container">
            <ion-text class="logo-name">
                <h1>Suy Sing</h1>
            </ion-text>
            <div class="bg-container">
                <Svg></Svg>
            </div>
        </div>
        <LoginForm @login="OnLogin" />
    </ion-content>
</ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonAlert, IonSpinner, alertController } from '@ionic/vue';
import LoginForm from '@/views/login/components/LoginForm.vue';
import Svg from '@/views/login/components/Svg.vue';
import { ApiService } from '@/services/api';
import Alert2 from '@/components/alert/Alert2.vue';
import { useRouter } from 'vue-router';

export default {
  components: {
    IonPage,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonText,
    LoginForm,
    Svg,
    Alert2,
    IonAlert,
    IonSpinner,
    alertController
  },
  setup() {
    return {
      http: new ApiService(),
      isLoading: false,
      router: useRouter(),
    }
  },
  data() {
    return {
      data: "",
      alertText: "test text Lorem ipsum.",
    }
  },
  async mounted() {
    console.log("mounted login");
    if(localStorage.getItem('_token')) {
      this.router.push('/tabs/home');
    }
  },
  methods: {
    async OnLogin(value) {
      if(!localStorage.getItem('_token')) {
        this.$store.commit('isLoading', true);
        this.http.request('auth/token', {
          clientId: value.username,
          clientSecret: value.password,
          userId: 1
        }, 'POST').then(res => {
          if(res.data.token != undefined) {
            localStorage.setItem('_token', res.data.token);
            this.$store.commit('isLoading', false);
            return this.router.push('/tabs/home');
          }
          this.alertError();
          this.$store.commit('isLoading', false);
        }).catch(error => {
          this.$store.commit('isLoading', false);
        });
      }
    },
    async alertError() {
      const showAlert = async () => {
        const alert = await alertController.create({
          header: 'Invalid Credentials',
          message: 'The username or password you entered is incorrect. Please try again.',
          buttons: [
            {
              text: 'Close',
              htmlAttributes: {
                'aria-label': 'close',
              },
            },
          ],
        });
        await alert.present();
      };
      return showAlert();
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Alata');
* {
    margin: 0;
    padding: 0;
}
.container {
    background-color: #12A3DA;
    height: 100%;
}
.logo-name h1 {
    text-align: right;
    color: #FFF;
    font-family: Alata;
    font-size: 31.567px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-right: 20px;
}
.bg-container {
    display: flex;
    justify-content: center;
}
</style>