<template>
    <div id="slider-container">
      <div class="jc-between">
        <p>Categories</p>
        <a href="/">See all</a>
      </div>
  
      <span @click="slideRight" class="btn" :class="{ inactive: currentPosition === 0 }"></span>
      <div id="slider" :style="{ marginLeft: currentMargin + '%' }">
        <div class="slide" v-for="(slide, index) in slides" :key="index">
          <div class="slide-image-container">
            <img :src="slide.imageSrc" :alt="slide.altText">
            <div class="text-overlay">{{ slide.overlayText }}</div>
          </div>
        </div>
      </div>
      <span @click="slideLeft" class="btn" :class="{ inactive: currentPosition === slidesCount }"></span>
    </div>
</template>
  
<script>
    export default {
        data() {
  return {
    containerWidth: 0,
    currentPosition: 0,
    currentMargin: 0,
    slidesPerPage: 0,
    slides: [
        {
          imageSrc: 'https://source.unsplash.com/1280x720/?vegetables=1',
          overlayText: 'Vegetable',
        },
        { 
            imageSrc: 'https://source.unsplash.com/1280x720/?fruits=1',
            overlayText: 'Fruits',
        },
        {
            imageSrc: 'https://source.unsplash.com/1280x720/?meat=1',
            overlayText: 'Meat',
        },
        { 
            imageSrc: 'https://source.unsplash.com/1280x720/?canned-goods=1',
            overlayText: 'Canned Goods', 
        },
        { 
            imageSrc: 'https://source.unsplash.com/1280x720/?beverages=1',
            overlayText: 'Beverages',
        },
        { 
            imageSrc: 'https://source.unsplash.com/1280x720/?laundry-soap=1',
            overlayText: 'Soap',
        },
      // Add more slide objects as needed
    ],
    slidesCount: 6,
  };
},
        computed: {
            buttons() {
                return [
                { type: 'prev', inactive: this.currentPosition === 0 },
                { type: 'next', inactive: this.currentPosition === this.slidesCount },
                ];
            },
        },
        methods: {
        checkWidth() {
            this.containerWidth = this.$el.offsetWidth;
            this.setParams(this.containerWidth);
        },
        setParams(w) {
            if (w < 551) {
            this.slidesPerPage = 1;
            } else if (w < 901) {
            this.slidesPerPage = 2;
            } else if (w < 1101) {
            this.slidesPerPage = 3;
            } else {
            this.slidesPerPage = 4;
            }
    
            this.slidesCount = this.slides.length - this.slidesPerPage;
    
            if (this.currentPosition > this.slidesCount) {
            this.currentPosition -= this.slidesPerPage;
            }
    
            this.currentMargin = -this.currentPosition * (100 / this.slidesPerPage);
        },
        slideRight() {
            if (this.currentPosition !== 0) {
            this.currentMargin += 100 / this.slidesPerPage;
            this.currentPosition--;
            }
        },
        slideLeft() {
            if (this.currentPosition !== this.slidesCount) {
            this.currentMargin -= 100 / this.slidesPerPage;
            this.currentPosition++;
            }
        },
        },
        mounted() {
        window.addEventListener("resize", this.checkWidth);
        this.checkWidth();
        },
        beforeDestroy() {
        window.removeEventListener("resize", this.checkWidth);
        },
    };
</script>
  

<style scoped>
    .slide-image-container {
        position: relative;
    }

    .text-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.5); /* Adjust the opacity as needed */
        color: white;
        padding: 10px;
        border-radius: 5px;
        text-align: center;
    }
    .jc-between {
        display: flex;
        justify-content: space-between !important;
        align-items: center;
        flex-direction: row;
    }
    .jc-between {
        color: #3B3C3E;
        font-family: Inter;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
    }
    .jc-between a {
        text-decoration: none;
        color: #56984B;
        font-family: Inter;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
    }

    #slider-container {
        height: fit-content;
        width: fit-content;
        max-width: 1400px;
        position: relative;
        overflow: hidden;
        padding: 0 20px 20px 20px;
        border-radius: 20px;
        background: #FFF;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.50);
    }

    #slider-container .btn {
        position: absolute;
        top: calc(60% - 30px);
        height: 30px;
        width: 30px;
        border-left: 8px solid rgb(195, 195, 195);
        border-top: 8px solid rgb(195, 195, 195);
    }

    #slider-container .btn:hover {
        transform: scale(1.2);
    }

    #slider-container .btn.inactive {
        border-color: rgb(239, 239, 239)
    }

    #slider-container .btn:first-of-type {
        transform: rotate(-45deg);
        left: 10px
    }

    #slider-container .btn:last-of-type {
        transform: rotate(135deg);
        right: 10px;
    }

    #slider-container #slider {
        display: flex;
        width: 1000%;
        height: 100%; 
        transition: all .5s;
    }

    #slider-container #slider .slide {
        height: 90%;
        margin: auto 10px;
        box-shadow: 2px 2px 4px 2px white, -2px -2px 4px 2px white;
        display: grid;
        place-items: center;
    }

    #slider-container #slider .slide span {
        color: white;
        font-size: 150px;
    }

    @media only screen and (min-width: 1100px) {

    #slider-container #slider .slide {
        width: calc(2.5% - 20px);
    }

    }

    @media only screen and (max-width: 1100px) {

    #slider-container #slider .slide {
        width: calc(3.3333333% - 20px);
    }

    }

    @media only screen and (max-width: 900px) {

    #slider-container #slider .slide {
        width: calc(5% - 20px);
    }

    }

    @media only screen and (max-width: 550px) {

    #slider-container #slider .slide {
        width: calc(10% - 20px);
    }

    }
</style>