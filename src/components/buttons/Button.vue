<template>
    <div class="btn-container">
        <ion-button color="none" class="btn-AL">
            <a v-bind:href="url" class="btn-text">
                {{ buttonText }} {{ url }}
            </a>
        </ion-button>
    </div>
</template>

<script setup lang="ts">
    import { IonButton } from '@ionic/vue';
    
    defineProps ({
        buttonText: String,
        url :String,
    });
</script>

<style scoped>
    .btn-container {
        margin-top: 20px;
        text-align: center;
    }
    .btn-AL {
        border-radius: 15px;
        background-color: var(--ion-color-blue-theme);
        color: var(--ion-color-primary-contrast);
        width: fit-content;
        height: 50px;
        overflow: hidden;
        font-family: Open Sans;
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    }
    .btn-text {
        color: var(--ion-color-primary-contrast);
        text-decoration: none;
        width: 100%;
    }
</style>