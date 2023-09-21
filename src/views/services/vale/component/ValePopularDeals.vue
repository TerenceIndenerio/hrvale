<template>
    <div class="popular-deals-container">
      <div class="text-left">
        <p>Popular deals</p>
      </div>
      <div class="card-container">
        <div class="card-box" v-for="(image, index) in imageUrls" :key="index">
          <img :src="image.url" :alt="image.alt" />
        </div>
      </div>
    </div>
</template>
  
<script>
  export default {
    data() {
      return {
        imageUrls: [],
      };
    },
    created() {
      // Generate a list of image URLs with alt text
      for (let i = 1; i <= 6; i++) {
        this.imageUrls.push({
          url: `https://source.unsplash.com/1280x720/?groceries=${i}`,
          alt: `pop${i}`,
        });
      }
    },
  };
</script>

<style scoped>
    .text-left {
        text-align: left;
    }
    .text-left p {
        color: #3B3C3E;
        font-family: Inter;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
    }
    .popular-deals-container {
        margin: 0 10px;
        padding: 0 10px 10px 10px;
        border-radius: 20px;
        border: 0px solid #000;
        background: #FFF;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    }
    .card-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }
    .card-box {
        width: 100px;
        height: 100px;
        border-radius: 20px;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
        border: 3px solid whitesmoke;
        border-radius: 10px;
        overflow: hidden;
    }
    .card-box img {
        width: 100px;
        height: 100px;
        object-fit: cover;
    }
</style>