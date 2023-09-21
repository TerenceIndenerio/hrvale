<template>
    <ion-page>
        <HeaderReturnWSearchVale :headerTitle="headerTitle" />
        <ion-content :fullscreen="true" >
            <br>
            <div class="flex-center container">
                <ValeSliderCategories />
            </div>

            <div class="flex-center">
                <ValeStoreCarousel />
            </div>
            
            <div class="flex-center container">
                <ValePopularDeals />
            </div>
        </ion-content>
    </ion-page>
</template>
  
<script setup lang="ts">
    import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonCard, IonText } from '@ionic/vue';
    import HeaderReturnWSearchVale from '@/components/header/HeaderReturnWSearchVale.vue';
    import ValeStoreCarousel from '@/views/services/vale/component/ValeStoreCarousel.vue';
    import ValeSliderCategories from '@/views/services/vale/component/ValeSliderCategories.vue';
    import ValePopularDeals from '@/views/services/vale/component/ValePopularDeals.vue';

    const headerTitle = "Vale Store"
    
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Open+Sans');

    .flex-center {
        display: flex;
        justify-content: center;
    }
    .container {
        margin: 30px 10px;
    }
</style>
  