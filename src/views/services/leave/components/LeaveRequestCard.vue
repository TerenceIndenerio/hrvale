<template>
    <ion-card class="card">
      <ion-grid>
        <ion-row>
          <div class="leave-type outline" v-bind:style="outlineColor">
            <p>{{ leaveType }}</p>
          </div>
        </ion-row>
        <ion-row class="pad-w">

          <ion-col class="col-name">
            <p>Status: </p>
            <p>Leave Date: </p>
            <p>Leave Balance (Days): </p>
            <p>Duration (Hours): </p>
            <p>Reason: </p>
          </ion-col>

          <ion-col class="col-data">
            <p>{{ status }}</p>
            <p>{{ dateText }}</p>
            <p>{{ leaveBalance }}</p>
            <p>{{ duration }}</p>
            <p>{{ comment }}</p>
          </ion-col>
        </ion-row>
        <ion-row>

          <ion-col>
            <button type="button" class="btn btn2">Cancel</button>
          </ion-col>
          
        </ion-row>
      </ion-grid>
    </ion-card>
</template>
  
<script>
  import { IonCard, IonCol, IonGrid, IonRow, IonIcon } from '@ionic/vue';
  
  export default {
    components: {
        IonCard, 
        IonCol, 
        IonGrid, 
        IonRow, 
        IonIcon,
    },
    props: {
        employeeName: String,
        dateText: String,
        outlineColor: String,
        leaveType: String,
        leavePeriod: String,
        duration: String,
        leaveBalance: String,
        reason: String,
        duration: String,
        comment: String,
        status: String,
    },
  };
  </script>
<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Inter');
    @import url('https://fonts.googleapis.com/css?family=Open+Sans');
    @import url('https://fonts.googleapis.com/css?family=Roboto');

    .inline-v {
        display: flex;
        flex-direction: column;
    }
    .inline-w {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .pad-w {
        padding: 0 10px;
    }
    p {
        padding: 0;
        margin: 5px 0;
    }

    /* specifics */
    .icon1 {
        font-size: 30px;
        color: black;
    }
    .leave-type {
        padding: 0;
        margin: 0;
        border-radius: 50px;

    }
    .leave-type p {
        padding: 5px 10px;
        margin: 0;
    }
    .btn {
        color: black;
        width: 100%;
        height: 35px;
        border-radius: 5px
    }
    .btn1 {
        background-color: #D1EFEA;
        color: #319582;
    }
    .btn2 {
        background-color: rgba(254, 138, 138, 0.20);
        color: #FF3535;
    }
    .btn3 {
        background-color: #fff;
        color: #2F80ED;
        width: 50px;
    }
    .username-text {
        color: #000;
        font-family: Open Sans;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }
    .col-name {
        color: #585B5F;
        font-family: Open Sans;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 107.682%;
    }
    .col-data {
        color: #0D0D0D;
        font-family: Open Sans;
        font-size: 12px;
        font-style: normal;
        font-weight: 600;
        line-height: 107.682%;
    }
</style>