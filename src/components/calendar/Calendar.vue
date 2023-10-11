<template>
    <div class="calendar-container">
        <ion-datetime presentation="date" display-timezone="false" @ionChange="handleDateChange"></ion-datetime>
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
            const dateObj = new Date(selectedDate);
            const formattedDate = dateObj.toISOString().split('T')[0];
            
            this.$emit('date-selected', formattedDate);
        },
    },
});
</script>
