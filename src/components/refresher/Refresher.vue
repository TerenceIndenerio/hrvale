<template>
    <ion-refresher slot="fixed" @ionRefresh="doRefresh">
      <ion-refresher-content>
      </ion-refresher-content>
    </ion-refresher>
</template>

<script>
    import { IonRefresher, IonRefresherContent } from '@ionic/vue';

    export default {
        components: {
            IonRefresher,
            IonRefresherContent,
        },
        methods: {
            async doRefresh(event) {
            try {
                location.reload();
                await setTimeout(() => {
                console.log('Data refreshed');
                event.target.complete();
                }, 2000);
            } catch (error) {
                console.error('Error refreshing data:', error);
                event.target.complete();
            }
            },
        },
    };
</script>
  