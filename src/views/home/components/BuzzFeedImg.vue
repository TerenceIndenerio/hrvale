<template>
  <!-- Card Container -->
  <ion-card class="neomorphic-card-1 card-box">
    <!-- Card Header -->
    <div class="card-header">
      <div class="author">
        <div class="profile-img">
          <img :src="profileImg" alt="" />
        </div>
        <div>
          <div>
            <p class="author-name">{{ name }}</p>
          </div>
          <div>
            <p class="date-time">{{ date }} {{ time }}</p>
          </div>
        </div>
      </div>
      <div class="caption">
        {{ caption }}
      </div>
    </div>
    <!-- Card Content -->
    <div class="card-content">
      <div class="img-content">
        <img :src="photoLink" alt="" />
      </div>
    </div>
    <div class="action-btn-container">
      <div class="action-btn">
        <ion-icon name="heart" class="action-icon"></ion-icon>
        {{ numOfLikes }}
      </div>
    </div>
  </ion-card>
</template>

<script>
import {
  IonCard,
  IonCol,
  IonGrid,
  IonRow,
  IonIcon,
  IonButton,
} from "@ionic/vue";
import { getThemeData } from "@/theme/theme";

export default {
  components: {
    IonCard,
    IonCol,
    IonGrid,
    IonRow,
    IonIcon,
    IonButton,
  },
  props: {
    name: String,
    caption: String,
    numOfLikes: Number,
    numOfShares: Number,
    date: String,
    time: String,
    photoIds: Array,
    photoLink: String,
    postId: Number,
    empNumber: Number,
    profileImg: String,
  },
  data() {
    return {
      theme: {},
    };
  },
  methods: {
    async fetchTheme() {
      const storedThemeData = localStorage.getItem("theme");

      const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};

      this.theme = themeData;
    },
  },
  created() {
    this.fetchTheme();
  },
};
</script>

<style scoped>
p {
  padding: 0;
  margin: 0;
}
.badge-container {
  padding: 0;
  margin: 0;
  border-radius: 20px 0 0 20px;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
}
.badge-container p {
  padding: 5px 10px;
  margin: 0;
}

.col-label {
  color: #585b5f;
  font-family: Open Sans;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 107.682%;
}
.col-data {
  color: #0d0d0d;
  font-family: Open Sans;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 107.682%;
}
.card-content {
  margin: 10px;
}
.card-box {
  width: 90%;
  max-width: 500px;
  margin: 10px auto 20px auto;
  padding: 0;
}
.action-container {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.action-btn-container {
  margin: 10px 0;
  width: 100%;
  display: flex;
  justify-content: center;
}
.action-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 2px;
}
.author-name {
  font-size: 14px;
  font-weight: 700;
}
.date-time {
  font-size: 12px;
}
.card-header {
  padding: 10px;
}
.author {
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 10px;
}
.profile-img {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  border: 2px solid rgb(207, 207, 207);
  overflow: hidden;
  display: flex;
  justify-content: center;
}
.img-content {
  height: fit-content;
  width: auto;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--neomorphism-concave-2);
}

.action-icon {
  font-size: 25px;
}
</style>
