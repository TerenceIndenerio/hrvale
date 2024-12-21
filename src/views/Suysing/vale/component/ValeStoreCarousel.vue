<template>
  <div class="carousel" @mousedown="startDrag" @mousemove="drag" @mouseup="endDrag">
    <div class="slides" :style="{ left: slideLeft + '%' }">
      <img
        v-for="(slide, index) in slideImages"
        :key="index"
        :src="slide.src"
        :alt="'slide image ' + (index + 1)"
        class="slide"
      />
    </div>
    <div class="controls">
      <div class="control prev-slide" @click="changeSlide(false)">&#9668;</div>
      <div class="control next-slide" @click="changeSlide(true)">&#9658;</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      delay: 3000, // ms
      slideImages: [
        { src: 'https://source.unsplash.com/1280x720/?groceries=2' },
        { src: 'https://source.unsplash.com/1280x720/?canned-goods=2' },
        { src: 'https://source.unsplash.com/1280x720/?laundry-soap=2' },
      ],
      slideLeft: 0,
      currentSlide: 0,
      autoChange: null,
      isDragging: false,
      dragStartX: 0,
      dragOffsetX: 0,
    };
  },
  methods: {
    changeSlide(next = true) {
      if (next) {
        this.currentSlide = (this.currentSlide + 1) % this.slideImages.length;
      } else {
        this.currentSlide = (this.currentSlide - 1 + this.slideImages.length) % this.slideImages.length;
      }
      this.slideLeft = -this.currentSlide * 100;
      this.restart();
    },
    restart() {
      clearInterval(this.autoChange);
      this.autoChange = setInterval(() => this.changeSlide(true), this.delay);
    },
    startDrag(event) {
      this.isDragging = true;
      this.dragStartX = event.clientX;
    },
    drag(event) {
      if (this.isDragging) {
        this.dragOffsetX = event.clientX - this.dragStartX;
        this.slideLeft = -this.currentSlide * 100 + (this.dragOffsetX * 100) / window.innerWidth;
      }
    },
    endDrag() {
      if (this.isDragging) {
        this.isDragging = false;
        if (Math.abs(this.dragOffsetX) > window.innerWidth / 4) {
          this.changeSlide(this.dragOffsetX > 0);
        }
        this.dragOffsetX = 0;
      }
    },
  },
  mounted() {
    this.autoChange = setInterval(() => this.changeSlide(true), this.delay);
  },
};
</script>

<style lang="scss" scoped>

$carousel-height: 175px;
$control-size: 35px;

body {
  background: #3e3e3e;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.carousel {
  width: 80vw;
  height: $carousel-height;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  
  &:hover .controls {
    opacity: 1;
  }
  
  .controls {
    opacity: 0;
    display: flex;
    position: absolute;
    top: 40%;
    left: 0;
    justify-content: space-between;
    width: 100%;
    z-index: 99999;
    transition: all ease 0.5s;
    
    .control {
      margin: 0 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      width: 40px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.7);
      opacity: .5;
      transition: ease .3s;
      cursor: pointer;
      
      &:hover {
        opacity: 1;
      }
    }
  }
  
    .slides {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      display: flex;
      width: 100%;
      transition: 1s ease-in-out all;
      
      
      .slide {
        min-width: 100%;
        min-height: $carousel-height;
        height: auto;
      }
    }
}

</style>