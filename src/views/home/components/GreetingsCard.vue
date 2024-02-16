<template>
  <div class="neomorphic-card-1 card-box">
    <div class="inline-v text-container">
      <h3 class="cardHeader" :style="{ color: theme.primaryColor }">
        <ion-icon name="newspaper-outline" class="newsfeed-icon"></ion-icon>
        {{ cardHeader }}
      </h3>
    </div>
  </div>
</template>

<script>
import { IonCard, IonIcon } from "@ionic/vue";
import { defineProps, ref, onMounted } from "vue";
import { getThemeData } from "@/theme/theme";

export default {
  components: {
    IonCard,
    IonIcon,
  },
  setup() {
    const theme = ref({});

    onMounted(() => {
      const storedThemeData = getThemeData();
      if (storedThemeData) {
        theme.value = storedThemeData;
      }
    });

    return {
      theme,
    };
  },
  props: {
    cardHeader: String,
    cardText: String,
    img_src: String,
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Inter");
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
@import url("https://fonts.googleapis.com/css?family=Roboto");

* {
  margin: 0;
  padding: 0;
}

.card {
  padding: 0 10px;
  margin: 0;
  border-radius: 10px;
  height: fit-content;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8), 0px -4px 8px rgba(0, 0, 0, 0.05);
}
.inline-v {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.inline-h {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.container {
  padding: 10px;
}
.text-container {
  padding: 15px 0;
}
.float-right {
  position: absolute;
  right: 0;
  left: 0;
  width: 100%;
}
/* specifics */

.cardText {
  color: var(--ion-text-color);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-indent: 20px;
  text-align: justify;
}
.p-container {
  margin: 0 20px;
  display: flex;
  justify-content: center;
}
.cardHeader {
  font-family: Open Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
  /* text-indent: 10px; */
  text-align: center;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
.img-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.img {
  height: fit-content;
  width: fit-content;
  max-height: 150px;
  max-width: auto;
}
.card-box {
  width: 100%;
  margin: 0 auto;
  padding: 0;
}
.newsfeed-icon {
  font-size: 20px;
  padding: 0;
  margin: 0;
}
</style>
