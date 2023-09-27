<template>
    <ion-page>
        <ion-content :fullscreen="true">
            <HeaderReturn :headerTitle="headerTitle"></HeaderReturn>
            <Calendar />
            <div class="vh"></div>

            <ApplyLeaveBottomContainer />
            
        </ion-content>
    </ion-page>
</template>

<script>
    import { IonPage, IonContent } from '@ionic/vue';
    import ApplyLeaveBottomContainer from '@/views/services/leave/components/ApplyLeaveBottomContainer.vue';
    import HeaderReturn from '@/components/header/HeaderReturn.vue';
    import Calendar from '@/components/calendar/Calendar.vue';
    import { defineComponent } from 'vue';

    export default defineComponent({
        components: {
            IonPage,  
            IonContent, 
            HeaderReturn,
            ApplyLeaveBottomContainer,
            Calendar,
        },
        data() {
            return {
                headerTitle: 'Apply Leave',
            }
        }
    });
</script>

<style scoped>
    .vh {
            height: 50vh;
        }
</style>