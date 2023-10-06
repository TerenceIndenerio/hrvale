<template>
    <div class="calendar-container">
        <ion-datetime presentation="date" @ionChange="handleDateChange"></ion-datetime>
    </div>
</template>

<script lang="ts">
import { IonDatetime } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
    components: { IonDatetime },
    data() {
        return {
            selectedDate: "",
        }
    },
    methods: {
        handleDateChange(event: CustomEvent) {
            const selectedDate = event.detail.value;
            this.$emit('date-selected', selectedDate);
        },
    },
});
</script>
