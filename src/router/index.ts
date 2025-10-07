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
import FaceScan from "@/features/FaceScanner/views/FaceScannerPage.vue";
import RegisteredFaces from "@/views/login/RegisteredFaces.vue";
import SetUpLogin from "@/views/login/SetUpLogin.vue";
import Flash from "@/views/login/Flash.vue";
import ApplyOT from "@/views/services/ot/ApplyOT.vue";
import ApplyOTGlobal from "@/views/services/ot/ApplyOTGlobal.vue";
import ApplyPreApprovedOT from "@/views/services/ot/ApplyPreApprovedOT.vue";
import Vale from "@/views/services/vale/Vale.vue";
import ValeView from "@/views/services/vale/ValeView.vue";
import ApplyVale from "@/views/services/vale/ApplyVale.vue";
import ApplyValeGlobal from "@/views/services/vale/ApplyValeGlobal.vue";
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
import OtherLoans from "@/views/services/loanBalance/OtherLoans.vue";
import LoanBalance from "@/views/services/loanBalance/LoanBalance.vue";
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
import CashVale from "@/views/services/vale/cash_vale/CashVale.vue";
import LoadVale from "@/views/services/vale/load_vale/LoadVale.vue";
import BillsVale from "@/views/services/vale/bills_vale/BillsVale.vue";
// import GroceryVale from "@/views/services/vale/grocery_vale/GroceryVale.vue";
import Notification from "@/views/notification/Notification.vue";
import ValeMain from "@/views/services/vale/vale_main/ValeMain.vue";
import ScheduleAdjustment from "@/views/services/schedule_adjustment/ScheduleAdjustment.vue";
import ScheduleAdjustmentEdit from "@/views/services/schedule_adjustment/ScheduleAdjustmentEdit.vue";
import ValeSuysingVersion from "@/views/services/vale/ValeSuysingVersion.vue";
import ValeHistory from "@/views/services/vale/ValeHistory.vue";
import ElectricityBillers from "@/views/services/vale/bills_vale/ElectricityBillers.vue";
import WaterBillers from "@/views/services/vale/bills_vale/WaterBillers.vue";
import CableBillers from "@/views/services/vale/bills_vale/CableBillers.vue";
import TransportationBillers from "@/views/services/vale/bills_vale/TransportationBillers.vue";
import PayBill from "@/views/services/vale/bills_vale/PayBill.vue";
import GadgetsVale from "@/views/services/vale/gadgets_vale/GadgetsVale.vue";
import Document from "@/views/services/document/Document.vue";
import MyTraining from "@/views/services/trainings/MyTraining.vue";
import MyAssessment from "@/views/services/trainings/MyAssessment.vue";
import ViewEmployeeSession from "@/views/services/trainings/ViewEmployeeSession.vue";
import ApplyValeGlobalTest from "@/views/services/vale/ApplyValeGlobalTest.vue";
import SuysingNotification from "@/views/Suysing/notification/Notification.vue";
import SuysingClockIn from "@/views/Suysing/clock_in/ClockIn.vue";
import SuysingAttendanceCorrection from "@/views/Suysing/attendance/AttendanceCorrection.vue";
import ViewRecentAttendanceCorrection from "@/views/Suysing/attendance/ViewRecentAttendanceCorrection.vue";
import EditAttendanceCorrection from "@/views/Suysing/attendance/EditAttendanceCorrection.vue";
import SuysingLeave from "@/views/Suysing/leave/LeaveDashboard.vue";
import SuysingLeaveHistory from "@/views/Suysing/leave/LeaveHistory.vue";
import SuysingApplyLeave from "@/views/Suysing/leave/ApplyLeave.vue";
import SuysingRetractLeave from "@/views/Suysing/leave/RetractLeave.vue";
import SuysingLeaveRequest from "@/views/Suysing/leave/LeaveRequest.vue";
import SuysingleaveEntitlement from "@/views/Suysing/leave/LeaveEntitlement.vue";
import SuysingVale from "@/views/Suysing/vale/ValeSuysingVersion.vue";
import SuysingApplyVale from "@/views/Suysing/vale/ApplyVale.vue";
import SuysingScheduleAdjustment from "@/views/Suysing/schedule_adjustment/ScheduleAdjustment.vue";
import SuysingScheduleAdjustmentEdit from "@/views/Suysing/schedule_adjustment/ScheduleAdjustmentEdit.vue";
import SuysingRecentScheduleAdjustment from "@/views/Suysing/schedule_adjustment/RecentScheduleAdjustment.vue";
import SuysingOtherLoans from "@/views/Suysing/loanBalance/OtherLoans.vue";
import RecentOtherLoans from "@/views/Suysing/loanBalance/RecentOtherLoans.vue";
import RecentOtherLoansView from "@/views/Suysing/loanBalance/RecentOtherLoansView.vue";
import SuysingScheduleView from "@/views/Suysing/schedule/ViewSchedule.vue";
import SuysingApplyOT from "@/views/Suysing/OT/ApplyOT.vue";
import SuysingRecentApplyOT from "@/views/Suysing/OT/RecentApplyOT.vue";
import SuysingLoanLedger from "@/views/Suysing/ledger/loanLedger.vue";
import SuysingRecentApproval from "@/views/Suysing/approval/RecentApproval.vue";
import CantBeAccess from "@/views/CantBeAccess.vue";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/facescan",
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
    path: "/gpsoff",
    component: GPSOffline,
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
        path: "/scheduleadjustment",
        component: ScheduleAdjustment,
      },
      {
        path: "/scheduleadjustmentedit",
        component: ScheduleAdjustmentEdit,
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
        path: "/applyotglobal",
        component: ApplyOTGlobal,
      },
      {
        path: "/applypreapprovedot",
        component: ApplyPreApprovedOT,
      },
      {
        path: "/otherloans",
        component: OtherLoans,
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
        path: "/viewvale",
        component: ValeView,
      },

      {
        path: "/valesuysing",
        component: ValeSuysingVersion,
      },
      {
        path: "/applyvaleglobaltest",
        component: ApplyValeGlobalTest,
      },

      {
        path: "/soon",
        component: SoonPage,
      },

      {
        path: "/cantbeaccess",
        component: CantBeAccess,
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
      {
        path: "/notification",
        component: Notification,
      },
      {
        path: "/document",
        component: Document,
      },
      {
        path: "/mytraining",
        component: MyTraining,
      },
      {
        path: "/myassessment",
        component: MyAssessment,
      },
      {
        path: "/viewemployeesession",
        component: ViewEmployeeSession,
      },
      // Suysing
      {
        path: "suysing_services",
        component: () => import("@/views/Suysing/services/Services.vue"),
      },
      {
        path: "suysing_approval",
        component: () => import("@/views/Suysing/approval/Approval.vue"),
      },
      {
        path: "/suysing_notification",
        component: SuysingNotification,
      },
      {
        path: "/suysing_clockin",
        component: SuysingClockIn,
      },
      {
        path: "/suysing_attendancecorrection",
        component: SuysingAttendanceCorrection,
      },
      {
        path: "/suysing_editattendancecorrection",
        component: EditAttendanceCorrection,
      },
      {
        path: "/suysing_viewrecentattendancecorrection",
        component: ViewRecentAttendanceCorrection,
      },
      {
        path: "/suysing_leave",
        component: SuysingLeave,
      },
      {
        path: "/suysing_applyLeave",
        component: SuysingApplyLeave,
      },
      {
        path: "/suysing_retractleave",
        component: SuysingRetractLeave,
      },
      {
        path: "/suysing_leaveRequest",
        component: SuysingLeaveRequest,
      },
      {
        path: "/suysing_leaveEntitlement",
        component: SuysingleaveEntitlement,
      },
      {
        path: "/suysing_leavehistory",
        component: SuysingLeaveHistory,
      },
      {
        path: "/suysing_vale",
        component: SuysingVale,
      },
      {
        path: "/suysing_applyvale",
        component: SuysingApplyVale,
      },
      {
        path: "/suysing_scheduleadjustment",
        component: SuysingScheduleAdjustment,
      },
      {
        path: "/suysing_scheduleadjustmentedit",
        component: SuysingScheduleAdjustmentEdit,
      },
      {
        path: "/suysing_recentscheduleadjustment",
        component: SuysingRecentScheduleAdjustment,
      },
      {
        path: "/suysing_otherloans",
        component: SuysingOtherLoans,
      },
      {
        path: "/suysing_recentotherloans",
        component: RecentOtherLoans,
      },
      {
        path: "/suysing_recentotherloansview",
        component: RecentOtherLoansView,
      },
      {
        path: "/suysing_scheduleview",
        component: SuysingScheduleView,
      },
      {
        path: "/suysing_applyot",
        component: SuysingApplyOT,
      },
      {
        path: "/suysing_recentapplyot",
        component: SuysingRecentApplyOT,
      },
      {
        path: "/suysing_loanLedger",
        component: SuysingLoanLedger,
      },
      {
        path: "/suysing_recentapproval",
        component: SuysingRecentApproval,
      },
    ],
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/facescan",
    component: FaceScan,
  },
  {
    path: "/registeredfaces",
    component: RegisteredFaces,
  },
  {
    path: "/setuplogin",
    component: SetUpLogin,
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
  {
    path: "/cashvale",
    component: CashVale,
  },

  {
    path: "/loadvale",
    component: LoadVale,
  },
  // {
  //   path: "/groceryvale",
  //   component: GroceryVale,
  // },
  {
    path: "/applyvale",
    component: ApplyVale,
  },
  {
    path: "/applyvaleglobal",
    component: ApplyValeGlobal,
  },
  {
    path: "/vale",
    component: Vale,
  },
  {
    path: "/valehistory",
    component: ValeHistory,
  },
  {
    path: "/electricitybillers",
    component: ElectricityBillers,
  },
  {
    path: "/waterbillers",
    component: WaterBillers,
  },
  {
    path: "/cablebillers",
    component: CableBillers,
  },
  {
    path: "/transportationbillers",
    component: TransportationBillers,
  },
  {
    path: "/paybill",
    component: PayBill,
  },
  {
    path: "/billsvale",
    component: BillsVale,
  },
  {
    path: "/gadgetsvale",
    component: GadgetsVale,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
