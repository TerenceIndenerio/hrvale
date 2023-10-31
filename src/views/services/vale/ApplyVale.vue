<template>
    <ion-page>
        <HeaderReturnWCardVale 
        :headerTitle="header.headerTitle"
        :daytime="header.daytime" 
        :userName="header.userName"
        :leavesNum="header.leavesNum"
        ></HeaderReturnWCardVale>
        <ion-content :fullscreen="true">

            <div class="max-credit-container">
                <h3>
                    Maximum Credits:
                </h3>
                <h1>
                    P 5,000
                </h1>
            </div>

            <div class="vh"></div>
            <ValeBottomInputContainer />
            
        </ion-content>
    </ion-page>
</template>

<script>
    import { IonPage, IonHeader, IonContent, IonIcon, IonFooter, IonToolbar, IonTitle } from '@ionic/vue';
    import ValeBottomInputContainer from './component/ValeBottomInputContainer.vue';
    import HeaderReturnWCardVale from '@/components/header/HeaderReturnWCardVale.vue';

    export default {
    components: {
        HeaderReturnWCardVale,
        ValeBottomInputContainer,
        IonPage,
        IonContent,
    },
    data() {
        return {
            header: {
                headerTitle: 'Apply Vale',
                daytime: 'Good Morning',
                userName: 'Al Guzman',
            }
        };
    }
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');
    .vh {
            height: 50vh;
        }
    .max-credit-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        margin-top: 10%;
    }
    .max-credit-container h4 {
        color: #010101;
        text-align: center;
        font-family: Open Sans;
        font-size: 20px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
    }
    .max-credit-container h1 {
        color: #D8C51A;
        text-align: center;
        font-family: Open Sans;
        font-size: 60px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        margin: 0;
    }
</style>