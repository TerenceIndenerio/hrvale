<template>
    <div class="container">
        <div class="box left">
            <p>
                Total Absent
            </p>
            <h1>
                {{ totalAbsent1 }}
            </h1>
        </div>
        <div class="box right">
            <p>
                Total Absent
            </p>
            <h1>
                {{ totalAbsent2 }}
            </h1>
        </div>
    </div>
</template>

<script setup lang="ts">
    const totalAbsent1 = "21";
    const totalAbsent2 = "03"
</script>

<style scoped>
    .container {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        flex-direction: row;
        width: 100%;
        margin: 20px 0;
    }
    .box {
        width: 114px;
        height: 137px;
        border-radius: 20px;
    }
    .left {
        background: rgba(250, 55, 149, 0.96);
    }
    .right {
        background: #26ECF9;
    }
    .box p {
        color: #FFF;
        text-align: center;
        font-family: Open Sans;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }
    .box h1 {
        color: #FFF;
        text-align: center;
        font-family: Open Sans;
        font-size: 64px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    }
</style>