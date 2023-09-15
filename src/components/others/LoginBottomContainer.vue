<template>
    <!-- <br> -->
    <ion-page>
        <div class="bottom container">
            
            <div class="inline-v text-container">
                <h1>
                    Welcome!
                </h1>
                <h3>
                    It is a long established fact that a reader will
                    be distracted by the readable content of a 
                    page when looking at its layout.
                </h3>
            </div>

            <Button class="btn" @click="$emit('login', $event)" ></Button>

            <br>
            <br>
        </div>
    </ion-page>
</template>

<script>
    import { IonPage, IonHeader, IonText, IonContent, IonIcon, IonFooter, IonToolbar, IonTitle, IonList, IonItem, IonSelect, IonTextarea, IonSelectOption } from '@ionic/vue';
    import Button from '@/components/buttons/Button.vue'
    
    //Button
    var buttonText= 'Login'
    //link Button
    const SignIn = "/home"

    export default {
        components: {
            IonPage,
            IonHeader, 
            IonToolbar, 
            IonTitle, 
            IonContent,
            IonText,
            Button
        },
        emits: ['login'],
    };
    
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Lato');
@import url('https://fonts.googleapis.com/css?family=Open+Sans');
    a {
        text-decoration: none;
        color: #000;
    }
    .inline-v {
        display: flex;
        flex-direction: column;
    }
    .float-r {
        width: 100%;
        text-align: right;
    }
    
    /* specifics */
    
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
        height: fit-content;
        width: 100%;
        border-radius: 50px 50px 0 0;
    }
    .text-container {
        padding: 10px 20px;
    }
    .text-container h1 {
        color: #000;
        text-align: center;
        font-family: Open Sans;
        font-size: 30px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        width: fit-content;
    }
    .text-container h3 {
        color: #000;
        font-family: Open Sans;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        padding: 10px;
        margin: 0;
    }
</style>