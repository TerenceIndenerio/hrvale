<template>
    <div class="float-center">
        <div class="container-inner">
            <div class="alert-text inline-h">
                <ion-icon class="alert-icon" name="alert-circle-outline" ></ion-icon>
                <p>
                    {{ alertText }}
                    <!-- delete the text below -->
                    <!-- Lorem ipsum dolor sit amet. -->
                </p>
            </div>
        </div>
        
    </div>
</template>
  
<script setup lang="ts">
    import { IonIcon } from '@ionic/vue';
    defineProps({
        alertText: String,
    });

</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Inter');
    @import url('https://fonts.googleapis.com/css?family=Open+Sans');
    @import url('https://fonts.googleapis.com/css?family=Roboto');
    
    *{
        margin: 0;
        padding: 0;
    }
    .container {
        display: flex;
        justify-content: center;
        border: 1px solid black;
    }
    .container-inner {
        max-width: 250px;
        width: fit-content;
        height: fit-content;
        border-radius: 30px;
        background-color: whitesmoke;
        padding: 10px;
        margin: 0 auto;
        box-shadow: 1px 16px 23px -13px rgba(0,0,0,0.5);
        -webkit-box-shadow: 1px 16px 23px -13px rgba(0,0,0,0.5);
        -moz-box-shadow: 1px 16px 23px -13px rgba(0,0,0,0.5);
    }
    .inline-h {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        flex-direction: row;
        gap: 5px;
    }
    .float-center {
        position: absolute;
        width: 100%;
        bottom: 3%;
    }
    .alert-icon {
        font-size: 25px;
    }
    .container {
        padding: 10px;
    }
    .alert-text p {
        font-size: 16px;
    }
    
</style>
  