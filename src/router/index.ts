import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import TabsPage from "../views/TabsPage.vue";
import Leave from "@/views/services/leave/LeaveDashboard.vue";
import ApplyLeave from "@/views/services/leave/ApplyLeave.vue";
import LeaveRequest from "@/views/services/leave/LeaveRequest.vue";
import ClockIn from "@/views/services/clock_in/ClockIn.vue";
import AttendanceCorrection from "@/views/services/attendance/AttendanceCorrection.vue";
import Login from "@/views/login/Login.vue";
import Flash from "@/views/login/Flash.vue";
import OTApply from "@/views/services/ot/OTApply.vue";
import Vale from "@/views/services/vale/Vale.vue";
import ValeView from "@/views/services/vale/ValeView.vue";
import ApplyVale from "@/views/services/vale/ApplyVale.vue";
import leaveEntitlement from "@/views/services/leave/LeaveEntitlement.vue";
import ViewSchedule from "@/views/services/schedule/ViewSchedule.vue";
import Benefits from "@/views/services/benefits/Benefits.vue";
import SoonPage from "@/views/SoonPage.vue";
import AttendanceCorrectionEdit from "@/views/services/attendance/AttendanceCorrectionEdit.vue";
import Tenant from "@/views/Tenant.vue";
import ViewPayslip from "@/views/services/view_payslip/ViewPayslip.vue";
import GPSOffline from "@/views/GPSOffline.vue";
import PinCode from "@/views/pincode/PinCode.vue";
import PinCodeSetup from "@/views/pincode/PinCodeSetup.vue";
import PinCodeAccountSettings from "@/views/pincode/PinCodeAccountSettings.vue";
import LoanBalance from "@/views/services/loanBalance/loanBalance.vue";
import LoanBalanceView from "@/views/services/loanBalance/LoanBalanceView.vue";

import NotifToken from "@/views/dev/NotifToken.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/tabs/",
    component: TabsPage,
    children: [
      {
        path: "",
        redirect: "/tabs/home",
      },
      {
        path: "home",
        component: () => import("@/views/home/HomePage.vue"),
      },
      {
        path: "services",
        component: () => import("@/views/services/Services.vue"),
      },

      {
        path: "approval",
        component: () => import("@/views/approval/Approval.vue"),
      },
      {
        path: "accsettings",
        component: () => import("@/views/AccountSettings.vue"),
      },
      {
        path: "/leave",
        component: Leave,
      },
      {
        path: "/applyLeave",
        component: ApplyLeave,
      },
      {
        path: "/leaveRequest",
        component: LeaveRequest,
      },
      {
        path: "/leaveEntitlement",
        component: leaveEntitlement,
      },
      {
        path: "/clockin",
        component: ClockIn,
      },
      {
        path: "/viewschedule",
        component: ViewSchedule,
      },
      {
        path: "/attendancecorrection",
        component: AttendanceCorrection,
      },
      {
        path: "/attendancecorrectionedit",
        component: AttendanceCorrectionEdit,
      },
      
      {
        path: "/otapply",
        component: OTApply,
      },
      
      {
        path: "/loanbalance",
        component: LoanBalance,
      },
      {
        path: "/loanbalanceview",
        component: LoanBalanceView,
      },
      {
        path: "/vale",
        component: Vale,
      },
      {
        path: "/viewvale",
        component: ValeView,
      },
      {
        path: "/applyvale",
        component: ApplyVale,
      },
      {
        path: "/soon",
        component: SoonPage,
      },
      {
        path: "/gpsoff",
        component: GPSOffline,
      },
      {
        path: "/benefits",
        component: Benefits,
      },
      {
        path: "/viewpayslip",
        component: ViewPayslip,
      },
    ],
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/tenant",
    component: Tenant,
  },
  {
    path: "/flash",
    component: Flash,
  },
  {
    path: "/pincode",
    component: PinCode,
  },
  {
    path: "/pincodesetup",
    component: PinCodeSetup,
  },
  {
    path: "/pincodeaccsettings",
    component: PinCodeAccountSettings,
  },
  {
    path: "/notiftoken",
    component: NotifToken,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
