<template>
    <ion-page>
        <HeaderReturn :headerTitle="headerTitle"></HeaderReturn>
        <ion-content :fullscreen="true">
            <Refresher />
            <Calendar />
            <div class="vh"></div>

            <ApplyLeaveBottomContainer :leaveOptions="leaveOptions" />
            
        </ion-content>
    </ion-page>
</template>

<script>
    import { IonPage, IonContent } from '@ionic/vue';
    import ApplyLeaveBottomContainer from '@/views/services/leave/components/ApplyLeaveBottomContainer.vue';
    import HeaderReturn from '@/components/header/HeaderReturn.vue';
    import Calendar from '@/components/calendar/Calendar.vue';
    import { defineComponent } from 'vue';
    import Refresher from '@/components/refresher/Refresher.vue'

    export default defineComponent({
        components: {
            IonPage,    
            IonContent, 
            HeaderReturn,
            ApplyLeaveBottomContainer,
            Calendar,
            Refresher,
        },
        data() {
            return {
                headerTitle: 'Apply Leave',
                leaveOptions: [
                    { label: 'Unpaid Leave', value: 'unpaid_leave' },
                    { label: 'Paid Leave', value: 'paid_leave' },
                    { label: 'Vacation Leave', value: 'vacation_leave' },
                ],
            }
        }
    });
</script>

<style scoped>
    .vh {
            height: 50vh;
        }
</style>