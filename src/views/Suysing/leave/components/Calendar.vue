<template>
  <ion-datetime
    presentation="date"
    :multiple="true"
    :value="selecteDates"
    :highlighted-dates="dates_"
    @ionChange="handleDateChange($event.detail.value)"
    class="custom-datetime"
  ></ion-datetime>
</template>

<script>
import { IonDatetime } from "@ionic/vue";
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  components: {
    IonDatetime,
  },
  props: {
    disabledDates: Array,
  },
  data() {
    return {
      selecteDates: null,
    };
  },
  setup(props, { emit }) {
    const dates_ = ref([]);

    const generateHighlightedDates = () => {
      dates_.value = props.disabledDates.map(
        ({ date, textColor, backgroundColor }) => ({
          date,
          textColor: textColor || "var(--ion-color-secondary-contrast)",
          backgroundColor: backgroundColor || "#ff8383",
        })
      );
    };

    const handleDateChange = (selectedDates) => {
      if (selectedDates && selectedDates.length > 0) {
        const firstSelectedDate = new Date(selectedDates[0]);
        const month = firstSelectedDate.getMonth() + 1;
        const year = firstSelectedDate.getFullYear();

        emit("selectedDatesChanged", {
          selectedDates,
          month,
          year,
        });
      } else {
        emit("selectedDatesChanged", {
          selectedDates: [],
          month: undefined,
          year: undefined,
        });
      }
    };

    watch(
      () => props.disabledDates,
      () => {
        generateHighlightedDates();
      },
      { immediate: true }
    );

    return {
      dates_,
      handleDateChange,
    };
  },
});
</script>
