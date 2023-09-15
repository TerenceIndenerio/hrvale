<template>
    <ion-page>
        <div class="bottom container">
            <div class="inline-v">
                <h1 class="text-center shout-text">
                    Create PIN
                </h1>       
            </div>
            <div class="inline-v">
                <h4 class="input-title">
                    Create PIN
                </h4>
                <div class="flex-center text-pad">
                    <input
                    v-for="(input, index) in inputs"
                    :key="index"
                    :id="`input-${index}`"
                    v-model="inputs[index]"
                    @input="handleInput(index)"
                    maxlength="1"
                    class="otp-input"
                    />
                </div>
                
                <h4 class="input-title">
                    Confirm your PIN
                </h4>
                <div class="flex-center text-pad">
                    <input
                    v-for="(input, index) in inputs"
                    :key="index"
                    :id="`input-${index}`"
                    v-model="inputs[index]"
                    @input="handleInput(index)"
                    maxlength="1"
                    class="otp-input"
                    />
                </div>
            </div>
            <Button class="btn" :buttonText="buttonText" :url="Save" type="number"></Button>
        </div>
    </ion-page>
</template>

<script setup lang="ts">
    import { IonPage, IonInput, IonLabel, IonHeader, IonText, IonContent, IonIcon, IonFooter, IonToolbar, IonTitle, IonList, IonItem, IonSelect, IonTextarea, IonSelectOption } from '@ionic/vue';
    import Button from '@/components/buttons/Button.vue'
    import { ref, onMounted } from 'vue';
    
     //Button
     var buttonText= 'Save'
    //link Button
    const Save = "/changepw"

    const inputs = ref(['', '', '', '', '', ''])
    const handleInput = (index: number) => {
    if (index < inputs.value.length - 1 && inputs.value[index].length === 1) {
        const nextInput = document.getElementById(`input-${index + 1}`) as HTMLInputElement
        if (nextInput) {
        nextInput.focus()
        }
    }
    }

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Lato');
a {
        text-decoration: none;
        color: #000;
    }
    .inline-v {
        display: flex;
        flex-direction: column;
    }
    .text-center {
        text-align: center;
    }
    .flex-center {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 5px;
    }
    .float-r {
        width: 100%;
        text-align: right;
    }
    .text-pad {
        padding: 0 10px;
    }
    /* specifics */
    .shout-text {
        color: #313536;
        text-align: center;
        font-family: Lato;
        font-size: 39px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
    }
    .bottom {
        overflow-y: auto;
        position: fixed;
        bottom: 0px;
        width: 100%;
        padding: 20px;
        background-color: white;
    }
    .container {
        border-top: 1px solid rgb(157, 157, 157);
        height: 65%;
        width: 100%;
        border-radius: 50px 50px 0 0;
    }
    .box-container {
        border-radius: 9px;
        background-color: #E8E8E8;
    }
    .input-title {
        color: #3B3C3E;
        font-family: Inter;
        font-size: 19px;
        font-style: normal;
        font-weight: bold;
        line-height: normal;
    }
    .otp-input {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        text-align: center;
        background-color: #E8E8E8;
    }
    .verify-container {
        width: 100%;
        display: flex;
        justify-content: right;
        height: fit-content;
    }
    .verify-text {
        padding: 5px 10px;
        background-color: #EB7491;
        width: fit-content;
        text-align: right;
        border-radius: 30px;
        margin: 10px 0 0 0;
    }
    
</style>