<template>
    
    <!-- <ion-text>
        <h1 class="card-title">
            {{ cardTitle }}
        </h1>  
    </ion-text> -->

    <ion-card class="card-top">
        <ion-badge class="status" v-bind:color="colorBadge">{{ status }}</ion-badge>
        <ion-list lines="none">
            <ion-item lines="none">
                <div class="icon-item-container">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="25" viewBox="0 0 22 25" fill="none">
                        <path d="M0 22.6562C0 23.9502 1.0498 25 2.34375 25H19.5312C20.8252 25 21.875 23.9502 21.875 22.6562V9.375H0V22.6562ZM15.625 13.0859C15.625 12.7637 15.8887 12.5 16.2109 12.5H18.1641C18.4863 12.5 18.75 12.7637 18.75 13.0859V15.0391C18.75 15.3613 18.4863 15.625 18.1641 15.625H16.2109C15.8887 15.625 15.625 15.3613 15.625 15.0391V13.0859ZM15.625 19.3359C15.625 19.0137 15.8887 18.75 16.2109 18.75H18.1641C18.4863 18.75 18.75 19.0137 18.75 19.3359V21.2891C18.75 21.6113 18.4863 21.875 18.1641 21.875H16.2109C15.8887 21.875 15.625 21.6113 15.625 21.2891V19.3359ZM9.375 13.0859C9.375 12.7637 9.63867 12.5 9.96094 12.5H11.9141C12.2363 12.5 12.5 12.7637 12.5 13.0859V15.0391C12.5 15.3613 12.2363 15.625 11.9141 15.625H9.96094C9.63867 15.625 9.375 15.3613 9.375 15.0391V13.0859ZM9.375 19.3359C9.375 19.0137 9.63867 18.75 9.96094 18.75H11.9141C12.2363 18.75 12.5 19.0137 12.5 19.3359V21.2891C12.5 21.6113 12.2363 21.875 11.9141 21.875H9.96094C9.63867 21.875 9.375 21.6113 9.375 21.2891V19.3359ZM3.125 13.0859C3.125 12.7637 3.38867 12.5 3.71094 12.5H5.66406C5.98633 12.5 6.25 12.7637 6.25 13.0859V15.0391C6.25 15.3613 5.98633 15.625 5.66406 15.625H3.71094C3.38867 15.625 3.125 15.3613 3.125 15.0391V13.0859ZM3.125 19.3359C3.125 19.0137 3.38867 18.75 3.71094 18.75H5.66406C5.98633 18.75 6.25 19.0137 6.25 19.3359V21.2891C6.25 21.6113 5.98633 21.875 5.66406 21.875H3.71094C3.38867 21.875 3.125 21.6113 3.125 21.2891V19.3359ZM19.5312 3.125H17.1875V0.78125C17.1875 0.351562 16.8359 0 16.4062 0H14.8438C14.4141 0 14.0625 0.351562 14.0625 0.78125V3.125H7.8125V0.78125C7.8125 0.351562 7.46094 0 7.03125 0H5.46875C5.03906 0 4.6875 0.351562 4.6875 0.78125V3.125H2.34375C1.0498 3.125 0 4.1748 0 5.46875V7.8125H21.875V5.46875C21.875 4.1748 20.8252 3.125 19.5312 3.125Z" fill="#9D409F"/>
                    </svg>
                </div>
                <div class="text-item-container">
                    <p>Applied Duration</p>
                    <h4>{{ appliedDuration }}</h4>
                </div>
            </ion-item>
            
            <ion-item lines="none">
                <div class="icon-item-container">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                        <path d="M22.6562 4.6875H18.75V2.34375C18.75 1.0498 17.7002 0 16.4062 0H8.59375C7.2998 0 6.25 1.0498 6.25 2.34375V4.6875H2.34375C1.0498 4.6875 0 5.7373 0 7.03125V21.0938C0 22.3877 1.0498 23.4375 2.34375 23.4375H22.6562C23.9502 23.4375 25 22.3877 25 21.0938V7.03125C25 5.7373 23.9502 4.6875 22.6562 4.6875ZM9.375 3.125H15.625V4.6875H9.375V3.125ZM17.1875 15.2344C17.1875 15.4492 17.0117 15.625 16.7969 15.625H14.0625V18.3594C14.0625 18.5742 13.8867 18.75 13.6719 18.75H11.3281C11.1133 18.75 10.9375 18.5742 10.9375 18.3594V15.625H8.20312C7.98828 15.625 7.8125 15.4492 7.8125 15.2344V12.8906C7.8125 12.6758 7.98828 12.5 8.20312 12.5H10.9375V9.76562C10.9375 9.55078 11.1133 9.375 11.3281 9.375H13.6719C13.8867 9.375 14.0625 9.55078 14.0625 9.76562V12.5H16.7969C17.0117 12.5 17.1875 12.6758 17.1875 12.8906V15.2344Z" fill="#FD2B83"/>
                    </svg>
                </div>
                <div class="text-item-container">
                    <p>Type of Leave</p>
                    <h4>{{ typeOfLeave }}</h4>
                </div>
            </ion-item>

            <ion-item lines="none">
                <div class="icon-item-container">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                        <path d="M17.1875 4.6875C17.1875 2.09863 15.0889 0 12.5 0C9.91113 0 7.8125 2.09863 7.8125 4.6875C7.8125 7.27637 9.91113 9.375 12.5 9.375C15.0889 9.375 17.1875 7.27637 17.1875 4.6875ZM11.4058 11.7725C8.50879 9.99902 3.81641 9.51172 1.45508 9.37744C0.661621 9.33252 0 9.93701 0 10.7002V21.5791C0 22.2788 0.565918 22.8623 1.29346 22.8999C3.42529 23.0117 7.73828 23.4214 10.7192 24.9229C11.1768 25.1533 11.7192 24.8394 11.7192 24.3433V12.332C11.7188 12.104 11.606 11.895 11.4058 11.7725ZM23.5449 9.37744C21.1841 9.51123 16.4912 9.99902 13.5947 11.7725C13.3945 11.895 13.2817 12.1123 13.2817 12.3403V24.3418C13.2817 24.8394 13.8257 25.1538 14.2847 24.9229C17.2651 23.4229 21.5757 23.0132 23.707 22.9014C24.4346 22.8633 25.0005 22.2798 25.0005 21.5801V10.7002C25 9.93701 24.3384 9.33252 23.5449 9.37744Z" fill="#5690FF"/>
                    </svg>
                </div>
                <div class="text-item-container">
                    <p>Reason</p>
                    <h4>{{ reason }}</h4>
                </div>
            </ion-item>

        </ion-list>
        
            <ion-button expand="full" color="light" @click="redirectToApplyLeave">View Details</ion-button>
       
    </ion-card>

</template>
  
<script>
    import { IonCard, IonText, IonBadge, IonItem, IonList, IonButton } from '@ionic/vue';

    export default {
        components: {
            IonCard, 
            IonText, 
            IonBadge, 
            IonItem, 
            IonList, 
            IonButton,
        },
        props: {
            cardTitle: String,
            appliedDuration: String,
            reason: String,
            typeOfLeave: String,
            status: String,
            colorBadge: String,
        },
        emits: ['view-details-clicked'],
        methods: {
            redirectToApplyLeave() {
                this.$emit('view-details-clicked');
            },
        },
    }
</script>
    
  <style scoped>
  @import url('https://fonts.googleapis.com/css?family=Open+Sans');
  @import url('https://fonts.googleapis.com/css?family=Roboto');

  *{
    padding: 0;
    margin: 0;
  }
  
  .card-top {
      border-radius: 5px;
      margin: 0 10% 20px 10%;
  }
  .status {
      float: right;
      border-radius: 20px 0px 0px 20px;
      padding: 5px 10px;
      color: white;
  }
  .card-title {
      color: #3B3C3E;
      font-family: 'Open Sans';
      font-size: 19px;
      font-style: normal;
      font-weight: bold;
      line-height: normal;
      margin-left: 10%;
  }
  .icon-item-container {
      margin-right: 10px;
  }
  .text-item-container p {
      margin: 0;
      color: #7B808B;
      font-family: var(--ion-font-font1);
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
  }
  .text-item-container h4 {
      color: #3B3C3E;
      font-family: var(--ion-font-font1);
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
  }
  </style>