<template>
    <ion-page>
        <div class="bottom container">
            <div class="inline-v">
                <h1 class="text-center shout-text">
                    Change Password
                </h1>       
            </div>
            <div class="inline-v">
                <h4 class="input-title">
                    Create Password
                </h4>
                <div class="box-container text-pad">
                    <ion-input label="Enter password" labelPlacement="floating" placeholder="********" type="password"></ion-input>
                </div>
                <h4 class="input-title">
                    Re-enter Password
                </h4>
                <div class="box-container text-pad">
                    <ion-input label="Enter password" labelPlacement="floating" placeholder="********" type="password"></ion-input>
                </div>
                
            </div>
            <Button class="btn" :buttonText="buttonText" :url="Save" ></Button>
        </div>
    </ion-page>
</template>

<script setup lang="ts">
    import { IonPage, IonInput, IonHeader, IonText, IonContent, IonIcon, IonFooter, IonToolbar, IonTitle, IonList, IonItem, IonSelect, IonTextarea, IonSelectOption } from '@ionic/vue';
    import Button from '@/components/buttons/Button.vue'
    
     //Button
     var buttonText= 'Save'
    //link Button
    const Save = "/"

    
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