<template>
    <!-- <br> -->
    <ion-page>
        <div class="bottom container">
            <div class="inline-v">
                <h1 class="text-center shout-text">
                    Let’s work!
                </h1>       
            </div>
            <div class="inline-v">
                <h4 class="input-title">
                    Username
                </h4>
                <div class="box-container text-pad">
                    <ion-input 
                        label="Enter Username" 
                        v-model="form.username" 
                        labelPlacement="floating" 
                        placeholder="user@example.com"
                    ></ion-input>
                </div>
                <h4 class="input-title">
                    Password
                </h4>
                <div class="box-container text-pad">
                    <ion-input label="Enter password" v-model="form.password" labelPlacement="floating" placeholder="********" type="password"></ion-input>
                </div>
                <p class="float-r">
                    <a href="/">
                        Forgot Password
                    </a>
                </p>
            </div>
            <Button class="btn" :buttonText="buttonText" @click="submitForm" ></Button>
        </div>
    </ion-page>
</template>

<script>
    import { IonInput, IonPage } from '@ionic/vue';
    import Button from '@/components/buttons/Button.vue';
    
    export default {
        components: {
            Button,
            IonInput,
            IonPage
        },
        data() {
            return {
                buttonText: "Login",
                form: {}
            }
        },
        emits: ['login'],
        methods: {
            submitForm() {
                this.$emit('login', this.form);
            }
        }
    };
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Lato');
a {
        text-decoration: none;
        color: #000;
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
        font-size: 39px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
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
        border-radius: 9px;
        background-color: #E8E8E8;
    }
    .input-title {
        color: #3B3C3E;
        font-family: Inter;
        font-size: 19px;
        font-style: normal;
        font-weight: bold;
        line-height: normal;
    }
</style>