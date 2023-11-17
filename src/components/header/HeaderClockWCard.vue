<template>
  <ion-header class="header" :style="{ backgroundColor: headerColor }">
    <a href="/tabs/services"
      ><ion-icon name="arrow-back-outline" class="icon1"></ion-icon
    ></a>
    <h2 class="title" :style="{ color: headerTextColor }">{{ headerTitle }}</h2>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="23"
      viewBox="0 0 26 23"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16 18H20.5858C21.3668 18 22 17.3668 22 16.5858C22 16.2107 21.851 15.851 21.5858 15.5858L20.5858 14.5858C20.2107 14.2107 20 13.702 20 13.1716L20 9.97067C20 5.56859 16.4314 2 12.0293 2C7.61789 2 4.04543 5.58319 4.05867 9.9946L4.06814 13.1476C4.06977 13.6922 3.84928 14.2139 3.45759 14.5922L2.42864 15.586C2.15471 15.8506 2 16.2151 2 16.5959C2 17.3714 2.62863 18 3.40408 18H8C8 20.2091 9.79086 22 12 22C14.2091 22 16 20.2091 16 18ZM19.5251 15.6464L20.3787 16.5H3.64147L4.49967 15.6711C5.18513 15.009 5.57099 14.0961 5.56813 13.1431L5.55867 9.9901C5.54792 6.40887 8.44807 3.5 12.0293 3.5C15.603 3.5 18.5 6.39702 18.5 9.97067L18.5 13.1716C18.5 14.0998 18.8687 14.9901 19.5251 15.6464ZM14.5 18H9.5C9.5 19.3807 10.6193 20.5 12 20.5C13.3807 20.5 14.5 19.3807 14.5 18Z"
        fill="white"
      />
    </svg>

    <ion-card class="card-top">
      <div class="flex-inline">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="17"
          viewBox="0 0 20 17"
          fill="none"
        >
          <path
            d="M10 0C4.47581 0 0 3.80444 0 8.5C0 13.1956 4.47581 17 10 17C15.5242 17 20 13.1956 20 8.5C20 3.80444 15.5242 0 10 0ZM12.3024 11.9994L8.74597 9.80242C8.62097 9.72359 8.54839 9.6002 8.54839 9.46996V3.70161C8.54839 3.4754 8.76613 3.29032 9.03226 3.29032H10.9677C11.2339 3.29032 11.4516 3.4754 11.4516 3.70161V8.42117L14.0121 10.0046C14.2298 10.1383 14.2742 10.3954 14.1169 10.5804L12.9798 11.9103C12.8226 12.0919 12.5202 12.1331 12.3024 11.9994Z"
            fill="#F2994A"
          />
        </svg>
        <p class="text-bold">HOURS</p>
      </div>
      <div class="flex-inline">
        <p class="text-orange">Clock In :</p>
        <p class="text-bold">{{ clockin }}</p>
      </div>
      <div class="flex-inline">
        <p class="text-orange">Clock Out :</p>
        <p class="text-bold">{{ clockout }}</p>
      </div>
    </ion-card>
  </ion-header>
</template>

<script setup lang="ts">
import { IonHeader, IonIcon, IonCard } from "@ionic/vue";

defineProps({
  headerTitle: String,
  clockin: String,
  clockout: String,
  headerColor: String,
  headerTextColor: String,
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Inter");
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
@import url("https://fonts.googleapis.com/css?family=Roboto");
/* specifics */
.header {
  height: 120px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 0 40px 40px;
  padding: 0 29px;
  box-shadow: none;
  text-align: center;
}
.icon1 {
  font-size: 30px;
  color: var(--ion-color-primary-contrast);
}
.icon2 {
  font-size: 30px;
  color: var(--ion-color-primary-contrast);
}
.title {
  color: var(--ion-color-primary-contrast);
  text-align: center;
  font-family: var(--ion-font-font2);
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.card-top {
  padding: 0 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  box-shadow: 0px 4px 3px 0px rgb(175, 175, 175);
  width: fit-content;
  margin-right: auto;
  margin-left: auto;

  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
}
.flex-inline {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 0;
  padding: 0;
  height: 20px;
}

.card {
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80vw;
  margin: 0 auto;
  padding-left: 10px;
  position: absolute;
  left: 0;
  right: 0;
  top: 90px;
}
.container-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
}
.card-text-container h3,
h4 {
  padding: 0;
  margin: 0;
}
.card-text-container h3 {
  color: #5a5656;
  text-align: center;
  font-family: "Open Sans";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.card-text-container h4 {
  color: #000;
  text-align: center;
  font-family: "Open Sans";
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.container-right {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 20px;
  background-color: #eed709;
  padding: 0px 10px;
}
.container-right h1 {
  color: #fff;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
  font-size: 32px;
  font-weight: 800;
  margin: 0;
}
.container-right p {
  color: #797979;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0);
  font-family: Open Sans;
  font-size: 12px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
}
</style>
