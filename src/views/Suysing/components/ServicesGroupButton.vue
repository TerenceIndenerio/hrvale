<template>
  <div class="button-container">
    <!-- Attendance -->
    <div
      :class="[
        `card btn-text`,
        { soon: !isAttendanceAllowed, hidden: !isAttendanceShown },
      ]"
      expand="full"
      color="none"
    >
      <a
        @click="navigateattendancecorrection"
        :style="{
          background: `#DDA24B`,
          color: theme.primaryFontColor,
        }"
        disabled
      >
        <h4 :style="{ color: btnTextColor }">Attendance Correction</h4>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon icon-btn"
          viewBox="0 0 512 512"
          :style="{ color: btnSecondaryColor }"
        >
          <path
            fill="currentColor"
            d="M416 64h-16V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 00368 48v16H144V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 00112 48v16H96a64 64 0 00-64 64v12a4 4 0 004 4h440a4 4 0 004-4v-12a64 64 0 00-64-64zM477 176H35a3 3 0 00-3 3v237a64 64 0 0064 64h320a64 64 0 0064-64V179a3 3 0 00-3-3zM224 307.43A28.57 28.57 0 01195.43 336h-70.86A28.57 28.57 0 0196 307.43v-70.86A28.57 28.57 0 01124.57 208h70.86A28.57 28.57 0 01224 236.57z"
          />
        </svg>
      </a>
    </div>
    <!-- payslip -->
    <div
      :class="[
        `card btn-text`,
        { soon: !isPayslipAllowed, hidden: !isPayslipShown },
      ]"
      expand="full"
      color="none"
    >
      <a
        @click="navigateViewPayslip"
        :style="{
          background: `#61B26C`,
          color: theme.primaryFontColor,
        }"
        disabled
      >
        <h4 :style="{ color: btnTextColor }">Payslip</h4>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon icon-btn"
          viewBox="0 0 512 512"
          :style="{ color: btnSecondaryColor }"
        >
          <path
            fill="currentColor"
            d="M483.82 32.45a16.28 16.28 0 00-11.23 1.37L448 46.1l-24.8-12.4a16 16 0 00-14.31 0l-25.11 12.41L359 33.7a16 16 0 00-14.36 0L320 46.07l-24.45-12.34a16 16 0 00-14.35-.06L256 46.12l-24.8-12.43a16.05 16.05 0 00-14.33 0L192 46.1l-24.84-12.41a16 16 0 00-19.36 3.94 16.25 16.25 0 00-3.8 10.65V288l.05.05H336a32 32 0 0132 32V424c0 30.93 33.07 56 64 56h12a52 52 0 0052-52V48a16 16 0 00-12.18-15.55zM416 240H288.5c-8.64 0-16.1-6.64-16.48-15.28A16 16 0 01288 208h127.5c8.64 0 16.1 6.64 16.48 15.28A16 16 0 01416 240zm0-80H224.5c-8.64 0-16.1-6.64-16.48-15.28A16 16 0 01224 128h191.5c8.64 0 16.1 6.64 16.48 15.28A16 16 0 01416 160z"
          />
          <path
            fill="currentColor"
            d="M336 424v-88a16 16 0 00-16-16H48a32.1 32.1 0 00-32 32.05c0 50.55 5.78 71.57 14.46 87.57C45.19 466.79 71.86 480 112 480h245.68a4 4 0 002.85-6.81C351.07 463.7 336 451 336 424z"
          />
        </svg>
      </a>
    </div>
    <!-- Leave -->
    <div
      :class="[
        `card btn-text`,
        { soon: !isleaveAllowed, hidden: !isleaveShown },
      ]"
      expand="full"
    >
      <a
        @click="navigateLeave"
        :style="{
          background: `#CF88C7`,
          color: theme.primaryFontColor,
        }"
        disabled
      >
        <h4 :style="{ color: btnTextColor }">Leave</h4>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon icon-btn"
          viewBox="0 0 512 512"
          :style="{ color: btnSecondaryColor }"
        >
          <path
            fill="currentColor"
            d="M336 376V272H191a16 16 0 010-32h145V136a56.06 56.06 0 00-56-56H88a56.06 56.06 0 00-56 56v240a56.06 56.06 0 0056 56h192a56.06 56.06 0 0056-56zM425.37 272l-52.68 52.69a16 16 0 0022.62 22.62l80-80a16 16 0 000-22.62l-80-80a16 16 0 00-22.62 22.62L425.37 240H336v32z"
          />
        </svg>
      </a>
    </div>
    <!-- OT -->
    <div
      :class="[`card btn-text`, { soon: !isOTAllowed, hidden: !isOTShown }]"
      expand="full"
      color="none"
    >
      <a
        @click="navigateOTApply"
        :style="{
          background: `#5F8EA1`,
          color: theme.primaryFontColor,
        }"
        disabled
      >
        <h4 :style="{ color: btnTextColor }">OT</h4>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon icon-btn"
          viewBox="0 0 512 512"
          :style="{ color: btnSecondaryColor }"
        >
          <path
            fill="currentColor"
            d="M480 128a64 64 0 00-64-64h-16V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 00368 48v16H144V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 00112 48v16H96a64 64 0 00-64 64v12a4 4 0 004 4h440a4 4 0 004-4zM32 416a64 64 0 0064 64h320a64 64 0 0064-64V180a4 4 0 00-4-4H36a4 4 0 00-4 4z"
          />
        </svg>
      </a>
    </div>
    <!-- vale -->
    <div
      :class="[`card btn-text`, { soon: !isValeAllowed, hidden: !isValeShown }]"
      expand="full"
      color="none"
    >
      <a
        @click="navigateVale"
        :style="{
          background: `#EDA67F`,
          color: theme.primaryFontColor,
        }"
      >
        <h4 :style="{ color: btnTextColor }">Vale</h4>

        <img
          src="@/assets/images/hrvalewhiteicon.png"
          alt="Vale Icon"
          class="icon-btn"
          id="vale-mask"
        />
      </a>
    </div>
    <!-- Other Loans -->
    <div
      :class="[
        `card btn-text`,
        { soon: !isOtherLoanAllowed, hidden: !isOtherLoanShown },
      ]"
      expand="full"
      color="none"
    >
      <a
        @click="navigateloanBal"
        :style="{
          background: `#875982`,
          color: theme.primaryFontColor,
        }"
        disabled
      >
        <h4 :style="{ color: btnTextColor }">Other Loan</h4>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon icon-btn"
          viewBox="0 0 512 512"
          :style="{ color: btnSecondaryColor }"
        >
          <path
            fill="currentColor"
            d="M448 400H64a16 16 0 010-32h384a16 16 0 010 32zM416 448H96a16 16 0 010-32h320a16 16 0 010 32zM32 272H16v48a32 32 0 0032 32h48v-16a64.07 64.07 0 00-64-64z"
          />
          <path
            fill="currentColor"
            d="M480 240h16v-64h-16a96.11 96.11 0 01-96-96V64H128v16a96.11 96.11 0 01-96 96H16v64h16a96.11 96.11 0 0196 96v16h256v-16a96.11 96.11 0 0196-96zm-224 64a96 96 0 1196-96 96.11 96.11 0 01-96 96z"
          />
          <circle fill="currentColor" cx="256" cy="208" r="64" />
          <path
            fill="currentColor"
            d="M416 336v16h48a32 32 0 0032-32v-48h-16a64.07 64.07 0 00-64 64zM480 144h16V96a32 32 0 00-32-32h-48v16a64.07 64.07 0 0064 64zM96 80V64H48a32 32 0 00-32 32v48h16a64.07 64.07 0 0064-64z"
          />
        </svg>
      </a>
    </div>
    <!-- Change DO / schedule Adjustment -->
    <div
      :class="[
        `card btn-text`,
        { soon: !isSchedAdjustment, hidden: !ischangeDOShown },
      ]"
      expand="full"
      color="none"
    >
      <a
        @click="navigateSchedAdjustment"
        :style="{
          background: `#84DD90`,
          color: theme.primaryFontColor,
        }"
        disabled
      >
        <h4 :style="{ color: btnTextColor }">Change DO</h4>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon icon-btn"
          viewBox="0 0 512 512"
          :style="{ color: btnSecondaryColor }"
        >
          <path
            fill="currentColor"
            d="M416 64h-16V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 00368 48v16H144V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 00112 48v16H96a64 64 0 00-64 64v12a4 4 0 004 4h440a4 4 0 004-4v-12a64 64 0 00-64-64zM476 176H36a4 4 0 00-4 4v236a64 64 0 0064 64h320a64 64 0 0064-64V180a4 4 0 00-4-4zM239.58 401.1c-12.17 9.61-28.75 14.9-46.7 14.9-27.87 0-48.48-18.16-57.66-33.7a16 16 0 0127.56-16.3c1.08 1.84 11.15 18 30.1 18 16.66 0 36.12-7.29 36.12-27.82 0-6.25-1.22-14.95-7-20.88-8.54-8.74-22.75-12.67-30.11-12.67a16 16 0 010-32c4.85 0 17.41-2.6 25.28-10.65a22 22 0 006.57-16.08c0-23.23-28.63-23.9-31.89-23.9-17.34 0-23.8 10.61-24.07 11.06a16 16 0 11-27.55-16.26c7.64-13 25.22-26.8 51.62-26.8 16.44 0 31.76 4.77 43.13 13.42 13.39 10.2 20.76 25.28 20.76 42.48A54 54 0 01240 302.35c-1.15 1.18-2.36 2.28-3.59 3.35a66.18 66.18 0 018.42 7.23c10.56 10.8 16.14 25.75 16.14 43.25.03 18.06-7.58 34.01-21.39 44.92zM368 396a16 16 0 01-32 0V256.29l-22.51 16.59a16 16 0 11-19-25.76l43.42-32a16 16 0 019.49-3.12h4.6a16 16 0 0116 16z"
          />
        </svg>
      </a>
    </div>
    <!-- Benefits -->
    <div
      :class="[
        `card btn-text`,
        { soon: !isBenefitsAllowed, hidden: !isBenefitsShown },
      ]"
      expand="full"
      color="none"
    >
      <a
        @click="navigateBenefits"
        :style="{
          background: `#66A9E9`,
          color: theme.primaryFontColor,
        }"
        disabled
      >
        <h4 :style="{ color: btnTextColor }">Benefits</h4>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon icon-btn"
          viewBox="0 0 512 512"
          :style="{ color: btnSecondaryColor }"
        >
          <path
            d="M200 144h40v-40a40 40 0 10-40 40zM352 104a40 40 0 00-80 0v40h40a40 40 0 0040-40z"
            fill="none"
          />
          <path
            fill="currentColor"
            d="M80 416a64 64 0 0064 64h92a4 4 0 004-4V292a4 4 0 00-4-4H88a8 8 0 00-8 8zM240 252V144h32v108a4 4 0 004 4h140a47.93 47.93 0 0016-2.75A48.09 48.09 0 00464 208v-16a48 48 0 00-48-48h-40.54a2 2 0 01-1.7-3A72 72 0 00256 58.82 72 72 0 00138.24 141a2 2 0 01-1.7 3H96a48 48 0 00-48 48v16a48.09 48.09 0 0032 45.25A47.93 47.93 0 0096 256h140a4 4 0 004-4zm32-148a40 40 0 1140 40h-40zm-74.86-39.9A40 40 0 01240 104v40h-40a40 40 0 01-2.86-79.89zM276 480h92a64 64 0 0064-64V296a8 8 0 00-8-8H276a4 4 0 00-4 4v184a4 4 0 004 4z"
          />
        </svg>
      </a>
    </div>

    <!-- Loan Ledger -->
    <div
      :class="[
        `card btn-text`,
        { soon: !isBenefitsAllowed, hidden: !isBenefitsShown },
      ]"
      expand="full"
      color="none"
    >
      <a
        @click="navigateLoanLedger"
        :style="{
          background: `#944547`,
          color: theme.primaryFontColor,
        }"
        disabled
      >
        <h4 :style="{ color: btnTextColor }">Loan Ledger</h4>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon icon-btn"
          viewBox="0 0 512 512"
          :style="{ color: btnSecondaryColor }"
        >
          <rect
            x="112"
            y="48"
            width="288"
            height="416"
            rx="32"
            ry="32"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          />
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
            d="M160.01 112H352v64H160.01z"
          />
          <circle cx="168" cy="248" r="24" fill="currentColor" />
          <circle cx="256" cy="248" r="24" fill="currentColor" />
          <circle cx="344" cy="248" r="24" fill="currentColor" />
          <circle cx="168" cy="328" r="24" fill="currentColor" />
          <circle cx="256" cy="328" r="24" fill="currentColor" />
          <circle cx="168" cy="408" r="24" fill="currentColor" />
          <circle cx="256" cy="408" r="24" fill="currentColor" />
          <rect
            x="320"
            y="304"
            width="48"
            height="128"
            rx="24"
            ry="24"
            fill="currentColor"
          />
        </svg>
      </a>
    </div>

    <!-- Approval -->
    <div
      :class="[`card btn-text`, { soon: !isApprovalAllowed }]"
      expand="full"
      color="none"
      v-if="isUserRoleESS"
    >
      <a
        @click="navigateApproval"
        :style="{
          background: `#BD4E4E`,
          color: theme.primaryFontColor,
        }"
        disabled
      >
        <h4 :style="{ color: btnTextColor }">Approval</h4>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon icon-btn"
          viewBox="0 0 512 512"
          :style="{ color: btnSecondaryColor }"
        >
          <path
            fill="currentColor"
            d="M400 48H112a64.07 64.07 0 00-64 64v288a64.07 64.07 0 0064 64h288a64.07 64.07 0 0064-64V112a64.07 64.07 0 00-64-64zm-35.75 138.29l-134.4 160a16 16 0 01-12 5.71h-.27a16 16 0 01-11.89-5.3l-57.6-64a16 16 0 1123.78-21.4l45.29 50.32 122.59-145.91a16 16 0 0124.5 20.58z"
          />
        </svg>
      </a>
    </div>
    <!--Trainings -->
    <div
      :class="[
        `card btn-text`,
        { soon: !isMyTrainingAllowed, hidden: !isTrainingShown },
      ]"
      expand="full"
      color="none"
    >
      <a
        @click="navigateMyTraining"
        :style="{
          background: `#773188`,
          color: theme.primaryFontColor,
        }"
        disabled
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          class="ionicon icon-btn"
          :style="{ color: btnSecondaryColor }"
        >
          <path
            fill="currentColor"
            d="M312.55 479.9l-56.42-114-44.62-57a72.37 72.37 0 01-10.06-36.9V143.64H217a40 40 0 0140 40v182.21"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          />
          <path
            d="M127.38 291.78v-74.07s37-74.07 74.07-74.07"
            fill="currentColor"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          />
          <path
            fill="currentColor"
            d="M368.09 291.78a18.49 18.49 0 01-10.26-3.11L297.7 250a21.18 21.18 0 01-9.7-17.79v-23.7a5.65 5.65 0 018.69-4.77l81.65 54.11a18.52 18.52 0 01-10.29 33.93zM171.91 493.47a18.5 18.5 0 01-14.83-7.41c-6.14-8.18-4-17.18 3.7-25.92l59.95-74.66a7.41 7.41 0 0110.76 2.06c1.56 2.54 3.38 5.65 5.19 9.09 5.24 9.95 6 16.11-1.68 25.7-8 10-52 67.44-52 67.44-2.62 2.98-7.23 3.7-11.09 3.7z"
          />
          <circle
            fill="currentColor"
            cx="257"
            cy="69.56"
            r="37.04"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          />
        </svg>

        <h4 :style="{ color: btnTextColor }">Trainings</h4>
      </a>
    </div>
    <!-- Documents -->
    <div
      :class="[
        `card btn-text`,
        { soon: !isDocumentAllowed, hidden: !isDocumentShown },
      ]"
      expand="full"
      color="none"
    >
      <h4 :style="{ color: btnTextColor }">Documents</h4>
      <a
        @click="navigateDocument"
        :style="{
          background: `#EDA67F`,
          color: theme.primaryFontColor,
        }"
        disabled
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon icon-btn"
          :style="{ color: btnSecondaryColor }"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M428 224H288a48 48 0 01-48-48V36a4 4 0 00-4-4h-92a64 64 0 00-64 64v320a64 64 0 0064 64h224a64 64 0 0064-64V228a4 4 0 00-4-4zm-92 160H176a16 16 0 010-32h160a16 16 0 010 32zm0-80H176a16 16 0 010-32h160a16 16 0 010 32z"
          />
          <path
            fill="currentColor"
            d="M419.22 188.59L275.41 44.78a2 2 0 00-3.41 1.41V176a16 16 0 0016 16h129.81a2 2 0 001.41-3.41z"
          />
        </svg>
      </a>
    </div>
    <!-- ApplyPreApprovedOT -->
    <div
      :class="[
        `card btn-text`,
        {
          soon: !isApplyPreApprovedOTAllowed,
          hidden: !isApplyPreApprovedOTShown,
        },
      ]"
      expand="full"
      color="none"
    >
      <a
        @click="navigateApplyPreApprovedOT"
        :style="{
          background: `linear-gradient(to right, ${theme.primaryGradientStartColor}, ${theme.primaryGradientEndColor})`,
          color: theme.primaryFontColor,
        }"
        disabled
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon icon-btn"
          :style="{ color: btnSecondaryColor }"
          viewBox="0 0 512 512"
        >
          <circle fill="currentColor" cx="256" cy="272" r="16" />
          <path
            fill="currentColor"
            d="M280 81.5V72a24 24 0 00-48 0v9.5a191 191 0 00-84.43 32.13L137 103a24 24 0 00-34 34l8.6 8.6A191.17 191.17 0 0064 272c0 105.87 86.13 192 192 192s192-86.13 192-192c0-97.74-73.42-178.66-168-190.5zM256 320a48 48 0 01-16-93.25V152a16 16 0 0132 0v74.75A48 48 0 01256 320z"
          />
        </svg>

        <h4 :style="{ color: btnTextColor }">Pre Approved <br />OT</h4>
      </a>
    </div>
  </div>
</template>
<script>
import { IonButton, IonCol, IonGrid, IonRow, IonIcon } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { IonButton, IonCol, IonGrid, IonRow, IonIcon },
  props: {
    btnColor: String,
    btnTextColor: String,
    btnSecondaryColor: String,
    theme: Object,
  },
  computed: {
    isValeAllowed() {
      return this.servicesConfig?.vale?.hidden ?? false;
    },
    servicesConfig() {
      return JSON.parse(localStorage.getItem("servicesConfig"));
    },
    isUserRoleESS() {
      const myDetails = JSON.parse(localStorage.getItem("myDetails"));
      console.log(myDetails);
      return myDetails.isApprover;
    },
    isleaveAllowed() {
      return this.servicesConfig?.leave?.hidden ?? false;
    },
    isScheduleAllowed() {
      return this.servicesConfig?.schedule?.hidden ?? false;
    },
    isAttendanceAllowed() {
      return this.servicesConfig?.attendance?.hidden ?? false;
    },
    isOTAllowed() {
      return this.servicesConfig?.ot?.hidden ?? false;
    },
    isPayslipAllowed() {
      return this.servicesConfig?.payslip?.hidden ?? false;
    },
    isBenefitsAllowed() {
      return this.servicesConfig?.benefits?.hidden ?? false;
    },
    isOtherLoanAllowed() {
      return this.servicesConfig?.otherLoan?.hidden ?? false;
    },
    isSchedAdjustment() {
      return this.servicesConfig?.changeDO?.hidden ?? false;
    },
    isApprovalAllowed() {
      return this.servicesConfig?.approval?.hidden ?? false;
    },
    isDocumentAllowed() {
      return this.servicesConfig?.documents?.hidden ?? false;
    },
    isMyTrainingAllowed() {
      return this.servicesConfig?.trainings?.hidden ?? false;
    },
    isApplyPreApprovedOTAllowed() {
      return this.servicesConfig?.applyPreApprovedOT?.hidden ?? false;
    },
    // shown
    isValeShown() {
      return this.servicesConfig?.vale?.allowed ?? false;
    },
    isScheduleShown() {
      return this.servicesConfig?.schedule?.allowed ?? false;
    },
    isTrainingShown() {
      return this.servicesConfig?.trainings?.allowed ?? false;
    },
    isDocumentShown() {
      return this.servicesConfig?.documents?.allowed ?? false;
    },
    ischangeDOShown() {
      return this.servicesConfig?.changeDO?.allowed ?? false;
    },
    isAttendanceShown() {
      return this.servicesConfig?.attendance?.allowed ?? false;
    },

    isleaveShown() {
      return this.servicesConfig?.leave?.allowed ?? false;
    },
    isOTShown() {
      return this.servicesConfig?.ot?.allowed ?? false;
    },
    isPayslipShown() {
      return this.servicesConfig?.payslip?.allowed ?? false;
    },
    isBenefitsShown() {
      return this.servicesConfig?.benefits?.allowed ?? false;
    },
    isOtherLoanShown() {
      return this.servicesConfig?.otherLoan?.allowed ?? false;
    },
    isApplyPreApprovedOTShown() {
      return this.servicesConfig?.applyPreApprovedOT?.allowed ?? false;
    },
  },
  methods: {
    navigateSoon() {
      this.$router.push("/soon");
    },
    navigateLeave() {
      if (this.isleaveAllowed) {
        this.$router.push("/suysing_leave");
      } else {
        this.navigateSoon();
      }
    },
    navigateclockin() {
      this.$router.push("/clockin");
    },
    navigateviewschedule() {
      if (this.isScheduleAllowed) {
        this.$router.push("/viewschedule");
      } else {
        this.navigateSoon();
      }
    },
    navigateattendancecorrection() {
      if (this.isAttendanceAllowed) {
        this.$router.push("/suysing_attendancecorrection");
      } else {
        this.navigateSoon();
      }
    },
    navigateOTApply() {
      if (this.isOTAllowed) {
        this.$router.push("/suysing_applyot");
      } else {
        this.navigateSoon();
      }
    },
    navigateloanBal() {
      if (this.isOtherLoanAllowed) {
        this.$router.push("/suysing_otherloans");
      } else {
        this.navigateSoon();
      }
    },
    navigateBenefits() {
      if (this.isBenefitsAllowed) {
        this.$router.push("/benefits");
      } else {
        this.navigateSoon();
      }
    },
    navigateViewPayslip() {
      if (this.isPayslipAllowed) {
        this.$router.push("/pincode");
      } else {
        this.navigateSoon();
      }
    },
    navigateVale() {
      if (this.isValeShown) {
        this.$router.push("/suysing_vale");
      } else {
        this.navigateSoon();
      }
    },
    navigateApproval() {
      if (this.isApprovalAllowed) {
        this.$router.push("/tabs/suysing_approval");
      } else {
        this.navigateSoon();
      }
    },
    navigateSchedAdjustment() {
      if (this.isSchedAdjustment) {
        this.$router.push("/suysing_scheduleadjustment");
      } else {
        this.navigateSoon();
      }
    },
    navigateDocument() {
      if (this.isDocumentAllowed) {
        this.$router.push("/document");
      } else {
        this.navigateSoon();
      }
    },
    navigateMyTraining() {
      if (this.isMyTrainingAllowed) {
        this.$router.push("/mytraining");
      } else {
        this.navigateSoon();
      }
    },
    navigateApplyPreApprovedOT() {
      if (this.isApplyPreApprovedOTAllowed) {
        this.$router.push("/applypreapprovedot");
      } else {
        this.navigateSoon();
      }
    },
    navigateLoanLedger() {
      this.$router.push("/suysing_loanLedger");
    },
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

a {
  text-decoration: none;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
}
.button-container {
  display: flex;
  margin: 0;
  padding-top: 10px;
  display: flex;
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;
  max-width: 500px;
}

.title {
  margin-left: 10px;

  width: 120px;
  height: 30px;
  flex-shrink: 0;

  color: var(--oil-11, #0d0d0d);
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-family: Open Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
}
.ion-text-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-right: auto;
  mix-blend-mode: multiply;
  margin-left: 5px;
  gap: 10px;
}
.card {
  padding: 0;
  width: 150px;
  height: 100px;
  position: relative;
  margin: 5px;
  background-color: #ffffff;
  overflow: hidden;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  display: flex;
  border-radius: 10px;
}

.btn-text h4 {
  padding: 0;
  margin: 0;
  color: var(--oil-11, #0d0d0d);
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
}
.btn-text a {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
.icon-circle {
  border-radius: 100%;
}
.clockin {
  display: flex;
  align-items: center;
}
.icon-btn {
  font-size: 20px;
  height: 20px;
  width: fit-content;
}
.not-available-label {
  background-color: rgba(255, 255, 255, 0.593);
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  color: black;
  border-radius: 30px;
  padding: 20px 0;
}
.soon {
  opacity: 0.5;
}
.hidden {
  display: none;
}
</style>
