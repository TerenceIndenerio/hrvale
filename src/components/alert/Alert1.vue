<template>
    <div class="float-center">
        <div class="container-inner">
            <div class="alert-title line">
                <h4 class="inline-h">
                    <strong>
                        {{ alertTitle }}
                        <!-- delete the text below -->
                        <!-- Lorem ipsum -->
                    </strong>
                    <ion-icon class="alert-icon" name="alert-circle-outline" ></ion-icon>
                </h4>
            </div>
            <div class="alert-text">
                <p>
                    {{ alertText }}
                    <!-- delete the text below -->
                    <!-- Lorem ipsum dolor sit amet consectetur -->
                </p>
            </div>
        </div>
        
    </div>
</template>
  
<script setup lang="ts">
    import { IonIcon } from '@ionic/vue';
    defineProps({
        alertTitle: String,
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
    }
    .container-inner {
        width: 250px;
        height: fit-content;
        border-radius: 10px;
        background-color: whitesmoke;
        padding: 10px;
        margin: 0 auto;
        box-shadow: 3px 8px 25px 0px rgba(0,0,0,0.75);
        -webkit-box-shadow: 3px 8px 25px 0px rgba(0,0,0,0.75);
        -moz-box-shadow: 3px 8px 25px 0px rgba(0,0,0,0.75);
    }
    .line {
        border-bottom: 1px solid black;
    }
    .inline-h {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        gap: 5px;
    }
    .float-center {
        position: absolute;
        width: 100%;
        top: 50%;
    }
    .alert-icon {
        font-size: 25px;
    }
    .container {
        padding: 10px;
    }
    .alert-title h4 {
        font-size: 18px;
        padding: 5px 0;
    }
    .alert-text p {
        font-size: 16px;
        padding: 5px 10px;
    }
    
</style>
  