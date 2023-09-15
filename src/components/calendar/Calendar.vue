<template>
    <div class="calendar-container">
        <ion-datetime presentation="date"></ion-datetime>
    </div>
</template>

<script lang="ts">
    import { IonDatetime } from '@ionic/vue';
    import { defineComponent } from 'vue';

    export default defineComponent({
        components: { IonDatetime },
    });
</script>

<style scoped>
    .calendar-container {
        width: 100%;
        display: flex;
        justify-content: center;
    }
</style>