<template>
  <ion-page>
    <HeaderUser
      :headerTitle="headerTitle"
      :headerColor="theme.primaryColor"
    ></HeaderUser>
    <ion-content :fullscreen="true" v-if="!loading">
      <Refresher />
      <div id="header"></div>
      <ion-card class="neomorphic-card-1 request-type-container">
        <ion-select
          label="Select Request Type"
          label-placement="floating"
          class="select-option neomorphic-input-2"
          @ionChange="handleApprovalTypeChange($event.detail.value)"
        >
          <ion-select-option
            v-for="option in requestTypeOption"
            :key="option"
            :value="option"
            class="non-center"
          >
            {{ option }}
          </ion-select-option>
        </ion-select>
      </ion-card>

      <div
        v-for="(result, index) in filteredResults"
        :key="index"
        class="card-container"
      >
        <ApprovalCard
          :empId="result.employeeId"
          :status="result.status"
          :employeeName="result.employee"
          :requestType="result.requestType"
          :code="result.code"
          :requestDataId="result.requestDataId"
          :requestId="result.id"
          :date="result.date"
          @checkButtonClick="handleCheckButtonClick"
          @viewButtonClick="handleView"
        />
      </div>

      <ion-infinite-scroll threshold="100px" @ionInfinite="loadMoreData">
        <ion-infinite-scroll-content
          loading-spinner="bubbles"
          loading-text="Loading more data..."
        >
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>

      <ion-modal :is-open="isOpen" id="modal">
        <ion-card class="card-modal">
          <ion-icon
            @click="modalClose"
            name="close"
            :style="{ color: theme.primaryColor }"
            class="close-btn"
          ></ion-icon>
          <br />
          <h4 style="text-align: center">Details</h4>

          <ion-grid class="modal-content" v-if="responseDetails">
            <ion-row v-for="(value, key) in responseDetails" :key="key">
              <ion-col>
                <p>
                  <strong>{{ key }}</strong>
                </p>
              </ion-col>
              <ion-col>
                <p>{{ value }}</p>
              </ion-col>
            </ion-row>
          </ion-grid>

          <div
            class="edit-loan-container"
            v-if="responseDetails['Request Type'] === 'Vale Request'"
          >
            <ion-button @click="editApplyLoan()">
              <ion-icon name="create"></ion-icon>Edit Loan
            </ion-button>
          </div>

          <div
            class="edit-loan-container"
            v-if="responseDetails['Request Type'] === 'Attendance'"
          >
            <ion-button @click="downloadTimesheet()">
              <ion-icon name="create"></ion-icon>Download Timesheet
            </ion-button>
          </div>
        </ion-card>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonCard,
  IonSelect,
  IonSelectOption,
  toastController,
  IonModal,
  IonGrid,
  IonCol,
  IonRow,
  IonIcon,
  IonAlert,
  IonButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/vue";
import { defineComponent } from "vue";
import HeaderUser from "@/components/header/HeaderUser.vue";
import ApprovalCard from "@/views/approval/component/ApprovalCard.vue";
import Refresher from "@/components/refresher/Refresher.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import { GlobalConstants } from "@/config/constants";
import { alertController } from "@ionic/vue";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    HeaderUser,
    Refresher,
    IonCard,
    ApprovalCard,
    IonSelect,
    IonSelectOption,
    toastController,
    IonModal,
    IonGrid,
    IonCol,
    IonRow,
    IonIcon,
    IonAlert,
    IonButton,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  },
  setup() {
    return {
      router: useRouter(),
      store: useStore(),
    };
  },
  data() {
    return {
      headerTitle: "Approval",
      requestTypeOption: [
        "Leave Request",
        "Overtime Request",
        "Attendance Correction",
        "Vale Request",
        "Attendance",
        "Schedule Adjustment",
        "Other Loan",
      ],
      results: [],
      filteredResults: [],
      loanDetails: [],
      responseDetails: [],
      theme: {},
      loading: true,
      isOpen: false,
      applyLoanAmount: 0,
      requestDataIdStored: null,
      currentOffset: 0,
      limit: 10,
    };
  },
  methods: {
    // Expiration of token
    async checkTokenExpiration() {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        console.error("Token not available.");
        console.log("Token is missing. Redirecting to login...");
        this.router.push("/login");
        return;
      }

      const tokenData = JSON.parse(atob(storedToken.split(".")[1]));
      const expirationTime = tokenData.exp * 1000;

      if (Date.now() > expirationTime) {
        console.log("Token expired. Redirecting to login...");
        this.router.push("/login");
      }
    },

    async editApplyLoan() {
      console.log(this.requestDataIdStored);
      const alert = await alertController.create({
        header: "Edit Apply Loan Amount",

        inputs: [
          {
            name: "loanAmount",
            type: "number",
            placeholder: "Enter Loan Amount",
            value: this.applyLoanAmount,
          },
        ],

        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {
              console.log("Cancel clicked");
            },
          },
          {
            text: "Save",
            handler: async (data) => {
              console.log("Save clicked", data.loanAmount);
              await this.processEditApplyLoan(data.loanAmount);
            },
          },
        ],
      });

      await alert.present();
    },

    // Process Edit Apply Loan
    async processEditApplyLoan(loanAmount) {
      try {
        this.store.commit("loader/updateLoader", true);
        const baseURL = localStorage.getItem("baseUrl");
        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const payload = {
          loanAmount: loanAmount,
          requestId: this.requestDataIdStored,
          status: "approved",
        };

        const api = baseURL + `api/v2/vale/${this.requestDataIdStored}`;
        const dataResponse = await axios.put(api, payload, { headers });

        if (dataResponse.status >= 200 && dataResponse.status < 300) {
          await this.showSuccessMessage(
            "Successfully Saved Apply Loan Amount!"
          );
          window.location.reload();
        }

        this.store.commit("loader/updateLoader", false);
      } catch (error) {
        console.error(error);
        this.store.commit("loader/updateLoader", false);
      }
    },

    async handleCheckButtonClick(
      action,
      code,
      requestDataId,
      requestId,
      status,
      date
    ) {
      const alert = await alertController.create({
        header: "Confirm Action",
        message: `Do you want to ${action} this request?`,
        buttons: [
          {
            text: "No",
            role: "cancel",
            handler: () => {
              console.log("Action cancelled");
            },
          },
          {
            text: "Yes",
            handler: () => {
              this.processAction(
                action,
                code,
                requestDataId,
                requestId,
                status,
                date
              );
            },
          },
        ],
      });

      await alert.present();
    },

    processAction(action, code, requestDataId, requestId, status, date) {
      switch (code) {
        case "leave":
          this.leaveRequest(requestId, action);
          break;
        case "overtime":
          this.otRequest(requestId, action);
          break;
        case "attendance_correction":
          this.attendanceCorrection(requestId, action);
          break;
        case "vale":
          this.valeRequest(requestId, action, requestDataId);
          break;
        case "attendance":
          this.attendance(requestId, action, status, date);
          break;
        case "schedule_adjustment":
          this.scheduleAdjustment(requestDataId, action);
          break;
        case "other_loan":
          this.otherLoan(requestId, action, requestDataId);
          break;
        default:
          break;
      }
    },

    async fetchRequest(offset = 0, append = false) {
      try {
        this.store.commit("loader/updateLoader", true);
        const baseURL = localStorage.getItem("baseUrl");
        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const api =
          baseURL +
          `api/v2/admin/requests?limit=${this.limit}&offset=${offset}&sortField=e.dateApplied&sortOrder=DESC`;
        const dataResponse = await axios.get(api, { headers });

        if (dataResponse.data && Array.isArray(dataResponse.data.data)) {
          const uniqueRequestTypes = {};
          dataResponse.data.data.forEach((period) => {
            uniqueRequestTypes[period.requestType] = period.requestType;
          });

          const newResults = dataResponse.data.data.map((period) => ({
            id: period.id,
            employee: period.employeeName,
            requestTypeId: period.requestTypeId,
            requestType: period.requestType,
            code: period.code,
            requestDataId: period.requestDataId,
            status: period.status,
            date: period.dateApplied,
            employeeId: period.employeeId,
          }));

          if (append) {
            this.results = [...this.results, ...newResults];
          } else {
            this.results = newResults;
          }
          this.filteredResults = this.results;
        }
        this.store.commit("loader/updateLoader", false);
        this.loading = false;
      } catch (error) {
        console.error("Error fetching payroll period options: ", error);

        if (error.response && error.response.status === 401) {
          console.log("Session expired. Redirecting to login...");
          this.$router.push("/login");
        } else {
          this.showErrorMessage(error.response.error.message);
        }
      }
    },
    loadMoreData(event) {
      if (!isNaN(this.currentOffset)) {
        this.currentOffset += this.limit;
        this.fetchRequest(this.currentOffset, true)
          .then(() => {
            event.target.complete();
          })
          .catch(() => {
            event.target.complete(); // Ensure the scroll is stopped in case of error
          });
      } else {
        console.error("Invalid offset value");
        event.target.complete(); // Stop infinite scroll if offset is invalid
      }
    },
    // Approval Filter
    async handleApprovalTypeChange(selectedRequestType) {
      try {
        this.store.commit("loader/updateLoader", true);

        if (!this.results || !Array.isArray(this.results)) {
          throw new Error("Results data is not available.");
        }

        this.filteredResults = this.results.filter(
          (period) => period.requestType === selectedRequestType
        );

        this.store.commit("loader/updateLoader", false);
      } catch (error) {
        console.error("Error filtering payroll period options: ", error);
        this.showErrorMessage("An error occurred: " + error.message);
      }
    },
    // Leave Request
    async leaveRequest(requestId, action) {
      try {
        this.store.commit("loader/updateLoader", true);

        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        if (!storedToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const payloadVal = action === "approve" ? "approved" : "declined";
        const payload =
          action === "approve"
            ? { status: "approved" }
            : { status: "declined" };

        const api =
          baseURL +
          "api/v2/admin/update-request/" +
          requestId +
          "?status=" +
          payloadVal;

        const dataResponse = await axios.put(api, payload, { headers });

        const successMessage =
          action === "approve"
            ? "Request successfully approved!"
            : "Request successfully declined";

        if (dataResponse.status >= 200 && dataResponse.status < 300) {
          this.showSuccessMessage(successMessage);
        }

        this.store.commit("loader/updateLoader", false);
        this.fetchRequest();
      } catch (error) {
        console.error("Error updating Attendance Correction: ", error);
        this.showErrorMessage(error.response?.data?.error?.message);

        const errorMessage = error.response?.data?.error?.message;
        const fullErrorMessage = `An error occurred: ${errorMessage}`;
      }
    },
    // OT
    async otRequest(requestId, action) {
      try {
        this.store.commit("loader/updateLoader", true);

        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        if (!storedToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const payloadVal = action === "approve" ? "approved" : "declined";
        const payload =
          action === "approve"
            ? { status: "approved" }
            : { status: "declined" };

        const api =
          baseURL +
          "api/v2/admin/update-request/" +
          requestId +
          "?status=" +
          payloadVal;
        const dataResponse = await axios.put(api, payload, { headers });

        const successMessage =
          action === "approve"
            ? "Overtime request successfully approved!"
            : "Overtime request successfully declined";

        if (dataResponse.status >= 200 && dataResponse.status < 300) {
          this.showSuccessMessage(successMessage);
        }

        this.store.commit("loader/updateLoader", false);
        this.fetchRequest();
      } catch (error) {
        console.error("Error updating overtime request: ", error);
        this.showErrorMessage(error.response?.data?.error?.message);
      }
    },
    // Attendance
    async attendanceCorrection(requestId, action) {
      try {
        this.store.commit("loader/updateLoader", true);

        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        if (!storedToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const payloadVal = action === "approve" ? "approved" : "declined";
        const payload =
          action === "approve"
            ? { status: "approved" }
            : { status: "declined" };

        const api =
          baseURL +
          "api/v2/admin/update-request/" +
          requestId +
          "?status=" +
          payloadVal;
        const dataResponse = await axios.put(api, payload, { headers });

        const successMessage =
          action === "approve"
            ? "Attendance Correction successfully approved!"
            : "Attendance Correction successfully declined";

        if (dataResponse.status >= 200 && dataResponse.status < 300) {
          this.showSuccessMessage(successMessage);
        }

        this.store.commit("loader/updateLoader", false);
        this.fetchRequest();
      } catch (error) {
        console.error("Error updating Attendance Correction: ", error);
        this.showErrorMessage(error.response?.data?.error?.message);

        const errorMessage = error.response?.data?.error?.message;
        const fullErrorMessage = `An error occurred: ${errorMessage}`;
      }
    },
    // scheduleAdjustment
    async scheduleAdjustment(requestId, action) {
      try {
        this.store.commit("loader/updateLoader", true);

        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        if (!storedToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const payloadVal = action === "approve" ? "approved" : "declined";
        const payload =
          action === "approve"
            ? { status: "approved" }
            : { status: "declined" };

        const api =
          baseURL +
          "api/v2/admin/update-request/" +
          requestId +
          "?status=" +
          payloadVal;
        const dataResponse = await axios.put(api, payload, { headers });

        const successMessage =
          action === "approve"
            ? "Schedule Adjustment request successfully approved!"
            : "Schedule Adjustment request successfully declined";

        if (dataResponse.status >= 200 && dataResponse.status < 300) {
          this.showSuccessMessage(successMessage);
        }

        this.store.commit("loader/updateLoader", false);
        this.fetchRequest();
      } catch (error) {
        console.error("Error updating Attendance Correction: ", error);
        this.showErrorMessage(error.response?.data?.error?.message);

        const errorMessage = error.response?.data?.error?.message;
        const fullErrorMessage = `An error occurred: ${errorMessage}`;
      }
    },
    // Vale
    async valeRequest(requestId, action, requestDataId) {
      try {
        this.store.commit("loader/updateLoader", true);

        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        if (!storedToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const payloadVal = action === "approve" ? "approved" : "declined";
        const payload = { status: payloadVal };

        const api = `${baseURL}api/v2/admin/update-request/${requestId}?status=${payloadVal}`;
        const dataResponse = await axios.put(api, payload, { headers });

        const successMessage =
          action === "approve"
            ? "Vale successfully approved!"
            : "Vale successfully declined";

        if (dataResponse.status >= 200 && dataResponse.status < 300) {
          this.showSuccessMessage(successMessage);
        }

        await this.applyVale(requestDataId, action);
      } catch (error) {
        console.error(error);
        this.showErrorMessage(error.response?.data?.error?.message);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    // https://hrp-uat-app.bapplware.com/web/index.php/

    async applyVale(requestDataId, action) {
      try {
        this.store.commit("loader/updateLoader", true);

        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        if (!storedToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const status = action === "approve" ? "approved" : "declined";

        const api = `${baseURL}api/v2/apply-vale/${requestDataId}`;

        const dataResponse = await axios.put(api, null, { headers });

        const successMessage =
          action === "approve"
            ? "Vale successfully approved!"
            : "Vale successfully declined";

        if (dataResponse.status >= 200 && dataResponse.status < 300) {
          this.showSuccessMessage(successMessage);
        }

        this.fetchRequest();
      } catch (error) {
        console.error(error);
        this.showErrorMessage(error.response?.data?.error?.message);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },

    async valePayroll(requestDataId, action) {
      try {
        this.store.commit("loader/updateLoader", true);

        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        if (!storedToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const status = action === "approve" ? "approved" : "declined";

        const api = `${baseURL}api/payroll/vale/${requestDataId}?status=${status}`;

        const dataResponse = await axios.put(api, null, { headers });

        if (dataResponse.status >= 200 && dataResponse.status < 300) {
          this.showSuccessMessage(successMessage);
        }

        this.fetchRequest();
      } catch (error) {
        console.error("Error updating Attendance Correction: ", error);
        this.showErrorMessage(error.response?.data?.error?.message);
      } finally {
        this.store.commit("loader/updateLoader", false);
      }
    },
    // attendance
    async attendance(requestId, action, status, date) {
      try {
        this.store.commit("loader/updateLoader", true);

        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        if (!storedToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const payloadVal = action === "approve" ? "approved" : "declined";
        const payload =
          action === "approve"
            ? { status: "approved" }
            : { status: "declined" };

        const api =
          baseURL +
          "api/v2/admin/update-request/" +
          requestId +
          "?status=" +
          payloadVal;
        const dataResponse = await axios.put(api, payload, { headers });

        const successMessage =
          action === "approve"
            ? "Attendance successfully approved!"
            : "Attendance successfully declined";

        if (dataResponse.status >= 200 && dataResponse.status < 300) {
          this.showSuccessMessage(successMessage);
        }

        this.store.commit("loader/updateLoader", false);
        this.fetchRequest();
      } catch (error) {
        console.error("Error updating overtime request: ", error);
        this.showErrorMessage(error.response?.data?.error?.message);
      }
    },

    // Other Loan
    async otherLoan(requestId, action, requestDataId) {
      try {
        this.store.commit("loader/updateLoader", true);

        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        if (!storedToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const payloadVal = action === "approve" ? "approved" : "declined";
        const payload =
          action === "approve"
            ? { status: "approved" }
            : { status: "declined" };

        const api =
          baseURL +
          "api/v2/admin/update-request/" +
          requestId +
          "?status=" +
          payloadVal;
        const dataResponse = await axios.put(api, payload, { headers });

        await this.otherLoan2(requestId, action, requestDataId);

        const successMessage =
          action === "approve"
            ? "Other Loan successfully approved!"
            : "Other Loan successfully declined";

        if (dataResponse.status >= 200 && dataResponse.status < 300) {
          this.showSuccessMessage(successMessage);
        }

        this.store.commit("loader/updateLoader", false);
        this.fetchRequest();
      } catch (error) {
        this.store.commit("loader/updateLoader", false);
        console.error("Error updating overtime request: ", error);
        tthis.showErrorMessage(error.response?.data?.error?.message);
      }
    },
    // OtherLoan 2
    async otherLoan2(requestId, action, requestDataId) {
      try {
        this.store.commit("loader/updateLoader", true);

        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        if (!storedToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const payloadVal = action === "approve" ? "approved" : "declined";
        const payload =
          action === "approve"
            ? { status: "approved" }
            : { status: "declined" };

        const api = baseURL + "api/ess/other-loans/" + requestDataId;
        const dataResponse = await axios.put(api, payload, { headers });
      } catch (error) {
        console.error(error);
        this.showErrorMessage(error.response?.data?.error?.message);
      }
    },

    // fetchValeDetails
    async fetchValeDetails(requestDataId) {
      try {
        const storedToken = localStorage.getItem("token");
        const baseURL = localStorage.getItem("baseUrl");
        if (!storedToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const api = baseURL + `api/v2/vale/${requestDataId}`;
        const dataResponse = await axios.get(api, { headers });
        console.log(dataResponse.data.data.loanAmount);
        this.applyLoanAmount = dataResponse.data.data.loanAmount;
      } catch (error) {
        console.error(error);
        this.showErrorMessage(error.response?.data?.error?.message);
      }
    },

    // Handle View

    async handleView(
      action,
      code,
      requestDataId,
      requestId,
      employeeName,
      requestType,
      status,
      date,
      employeeId
    ) {
      await this.fetchLoanDetails(
        code,
        requestDataId,
        employeeName,
        requestType,
        status,
        date,
        employeeId
      );
    },

    async fetchLoanDetails(
      code,
      requestDataId,
      employeeName,
      requestType,
      status,
      date,
      employeeId
    ) {
      try {
        this.store.commit("loader/updateLoader", true);
        const baseURL = localStorage.getItem("baseUrl");
        const storedToken = localStorage.getItem("token");

        this.requestDataIdStored = requestDataId;

        if (!storedToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const api = `${baseURL}api/v2/request-details?requestId=${requestDataId}&requestType=${code}`;

        const response = await axios.get(api, { headers });

        this.responseDetails = response.data.data[0];

        switch (code) {
          case "attendance":
            console.log("Handling Attendance Request");

            this.responseDetails = {
              "Employee Id": employeeId,
              "Employee Name": employeeName,
              "Request Type": requestType,
              Status: status,
              "Date Applied": date,
              Id: response.data.data[0].id,
              "Date From": response.data.data[0].dateFrom,
              "Date To": response.data.data[0].dateTo,
            };
            break;
          case "leave":
            console.log("Handling Leave Request");
            this.responseDetails = {
              "Employee Id": employeeId,
              "Employee Name": employeeName,
              "Request Type": requestType,
              Status: status,
              "Date Applied": date,
              "Number Of Days": response.data.data[0].numberOfDays,
              "From Date": response.data.data[0].fromDate,
              "To Date": response.data.data[0].toDate,
              "Leave Type": response.data.data[0].leaveType,
              "Leave Balance": response.data.data[0].leaveBalance,
              "Duration Type": response.data.data[0].durationType,
            };
            break;
          case "vale":
            console.log("Handling Vale Request");
            this.responseDetails = {
              "Employee Id": employeeId,
              "Employee Name": employeeName,
              "Request Type": requestType,
              Status: status,
              "Date Applied": date,
              "Rule Per Year of Service":
                response.data.data[0].rulePerYearOfService,
              "Year Of Service": response.data.data[0].yearOfService,
              Budget: response.data.data[0].budget,
              "Previous Balance": response.data.data[0].previousBalance,
              "Loanable Amount": response.data.data[0].loanableAmount,
              Amortization: response.data.data[0].amortization,
              "Exceed Amount": response.data.data[0].exceedAmount,
              Interest: response.data.data[0].interest,
              "Loan Amount": response.data.data[0].loanAmountForApproval,
              Reason: response.data.data[0].reason,
              Comment: response.data.data[0].comment,
            };
            await this.fetchValeDetails(requestDataId);
            break;
          case "other_loan":
            console.log("Handling Other Loan Request");
            this.responseDetails = {
              "Employee Id": employeeId,
              "Employee Name": employeeName,
              "Request Type": requestType,
              Status: status,
              "Date Applied": date,
              "Loan Date": response.data.data[0].loanDate,
              "Loan Type Name": response.data.data[0].loanTypeName,
              "Emp Number": response.data.data[0].empNumber,
              Name: response.data.data[0].name,
              "Loan Amount": response.data.data[0].loanAmount,
              Reason: response.data.data[0].reason,
            };
            break;
          case "schedule_adjustment":
            console.log("Handling Schedule Adjustment Request");
            this.responseDetails = {
              "Employee Id": employeeId,
              "Employee Name": employeeName,
              "Request Type": requestType,
              Status: status,
              "Date Applied": date,
              Id: requestDataId,
              Employee: response.data.data[0].employee,
              "Change Date From": response.data.data[0].changeDateFrom,
              "Change Date To": response.data.data[0].changeDateTo,
              "Change Work Shift Code From":
                response.data.data[0].changeWorkShiftCodeFrom,
              "Change Work Shift Code To":
                response.data.data[0].changeWorkShiftCodeTo,
              Status: response.data.data[0].status,
              Reason: response.data.data[0].reason,
            };
            break;
          case "overtime":
            console.log("Handling overtime Request");
            this.responseDetails = {
              "Employee Id": employeeId,
              "Employee Name": employeeName,
              "Request Type": requestType,
              Status: status,
              "Date Applied": date,
              Date: response.data.data[0].date,
              "Total Hours": response.data.data[0].totalHours,
              Reason: response.data.data[0].reason,
            };
            break;
          case "attendance_correction":
            console.log("Handling attendance correction");
            this.responseDetails = {
              "Employee Id": employeeId,
              "Employee Name": employeeName,
              "Request Type": requestType,
              Status: status,
              "Date Applied": date,
              "Previous Actual In": response.data.data[0].previousActualIn,
              "Applying Actual In": response.data.data[0].applyingActualIn,
              "Previous Actual Out": response.data.data[0].previousActualOut,
              "Applying Actual Out": response.data.data[0].applyingActualOut,
              "Applied Date": response.data.data[0].appliedDate,
              Day: response.data.data[0].day,
              Reason: response.data.data[0].reason,
            };
            break;

          default:
            console.log("Unknown Request Type");

            break;
        }
        this.isOpen = true;

        this.store.commit("loader/updateLoader", false);
      } catch (error) {
        this.isOpen = false;
        if (error.response && error.response.status === 401) {
          console.log("Session expired. Redirecting to login...");
          this.$router.push("/login");
        } else {
          this.showErrorMessage(error.response?.data?.error?.message);
        }
      }
    },

    async downloadTimesheet() {
      try {
        this.store.commit("loader/updateLoader", true);
        const baseURL = localStorage.getItem("baseUrl");
        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
          throw new Error("Authentication token is missing.");
        }

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const api =
          baseURL + `api/report/maintenance/dtr-report/350?isExcel=true`;
        const dataResponse = await axios.get(api, { headers });

        if (dataResponse.status >= 200 && dataResponse.status < 300) {
          console.log(dataResponse.data);
          let base64String = dataResponse.data.data.excel;

          if (!base64String) {
            throw new Error("Excel data is missing in the response.");
          }

          while (base64String.length % 4 !== 0) {
            base64String += "=";
          }

          const byteCharacters = atob(base64String);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "timesheet.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          await this.showSuccessMessage("Successfully Downloaded Excel!");
        }

        this.store.commit("loader/updateLoader", false);
      } catch (error) {
        console.error(error);
        this.store.commit("loader/updateLoader", false);
      }
    },

    modalClose() {
      this.responseDetails = [];
      this.isOpen = false;
    },

    async showSuccessMessage(message) {
      const successToast = await toastController.create({
        message: message,
        duration: 5000,
        position: "top",
        buttons: [
          {
            icon: "checkmark-circle-outline",
            role: "cancel",
          },
        ],
      });

      await successToast.present();
    },

    async showErrorMessage(message) {
      const toast = await toastController.create({
        message: message,
        duration: 3000,
        position: "top",
        buttons: [
          {
            icon: "close-outline",
            role: "cancel",
          },
        ],
      });
      this.store.commit("loader/updateLoader", false);
      await toast.present();
    },

    fetchTheme() {
      const storedThemeData = localStorage.getItem("themeData");

      const themeData = storedThemeData ? JSON.parse(storedThemeData) : {};

      this.theme = themeData;
    },
  },

  created() {
    this.checkTokenExpiration();
    this.fetchRequest();
    this.fetchTheme();
  },
});
</script>

<style scoped>
.card {
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8);
}

.select-option {
  width: fit-content;
  min-width: 300px;
  background-color: rgba(128, 128, 128, 0.184);
  border-radius: 20px;
  padding: 0 10px;
  margin: 10px auto;
}
.card-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
.request-type-container {
  margin: 20px auto;
}
.close-btn {
  position: absolute;
  top: 5px;
  right: 10px;
  width: 30px;
  height: 30px;
  padding: 0;
  margin: 0;
  box-shadow: var(--neomorphism-convex-4);
  border-radius: 50%;
  background-color: rgb(246, 246, 246);
  overflow: hidden;
}
.modal-content {
  margin: 20px 0;
}
#modal {
  --background: rgba(255, 0, 0, 0);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 0 5px 0 20px;
}
.card-modal {
  border-radius: 20px;
  max-width: 400px;
  overflow-y: scroll;
}
.edit-loan-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}
</style>
