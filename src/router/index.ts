import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import TabsPage from "../views/TabsPage.vue";
import Leave from "@/views/services/leave/LeaveDashboard.vue";
import ApplyLeave from "@/views/services/leave/ApplyLeave.vue";
import RetractLeave from "@/views/services/leave/RetractLeave.vue";
import LeaveRequest from "@/views/services/leave/LeaveRequest.vue";
import ClockIn from "@/views/services/clock_in/ClockIn.vue";
import AttendanceCorrection from "@/views/services/attendance/AttendanceCorrection.vue";
import Login from "@/views/login/Login.vue";
import SetupLogin from "@/views/login/SetupLogin.vue";
import Flash from "@/views/login/Flash.vue";
import ApplyOT from "@/views/services/ot/ApplyOT.vue";
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
import LoginPinCodeSetup from "@/views/login/LoginPinCodeSetup.vue";
import PrivacyPolicy from "@/views/legal/PrivacyPolicy.vue";
import TermsAndCondition from "@/views/legal/TermsAndCondition.vue";
import Welcome from "@/views/welcome/WelcomePage1.vue";
import Welcome2 from "@/views/welcome/WelcomePage2.vue";
import Welcome3 from "@/views/welcome/WelcomePage3.vue";
import WelcomePage from "@/views/welcome/WelcomePage.vue";
import WelcomeTermsAndCondition from "@/views/welcome/TermsAndCondition.vue";
import WelcomePrivacyAndPolicy from "@/views/welcome/PrivacyAndPolicy.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/setuppincodelogin",
    component: LoginPinCodeSetup,
  },
  {
    path: "/welcome",
    component: Welcome,
  },
  {
    path: "/welcome2",
    component: Welcome2,
  },
  {
    path: "/welcome3",
    component: Welcome3,
  },
  {
    path: "/welcomepage",
    component: WelcomePage,
  },
  {
    path: "/welcometermsandcondition",
    component: WelcomeTermsAndCondition,
  },
  {
    path: "/welcomeprivacyandpolicy",
    component: WelcomePrivacyAndPolicy,
  },
  {
    path: "/tabs/",
    component: TabsPage,
    children: [
      {
        path: "",
        redirect: "/tabs/buzzfeed",
      },
      {
        path: "home",
        component: () => import("@/views/home/HomePage.vue"),
      },
      {
        path: "buzzfeed",
        component: () => import("@/views/home/BuzzFeed.vue"),
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
        path: "/retractleave",
        component: RetractLeave,
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
        path: "/applyot",
        component: ApplyOT,
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
      {
        path: "/privacypolicy",
        component: PrivacyPolicy,
      },
      {
        path: "/termsandcondition",
        component: TermsAndCondition,
      },
    ],
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/setuplogin",
    component: SetupLogin,
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
