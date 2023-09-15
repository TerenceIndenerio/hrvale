<template>
    <ion-button id="present-alert">{{ alertText }}</ion-button>
    <ion-alert
        trigger="present-alert"
        :header="header"
        :sub-header="subheader"
        :message="message"
        :buttons="alertButtons"
    ></ion-alert> 
</template>

<script lang="ts" setup>
    import { IonAlert, IonButton } from '@ionic/vue';

    const alertButtons = ['OK'];
    
    // Delete this code below this example only on other view
    const alertText = "Click this button";
    const message = "This is an alert!";
    const subheader = "Important message";
    const header = "Alert";
    
    // use this instead
    defineProps({
        message: String,
        subheader: String,
        header: String,
    });
</script>