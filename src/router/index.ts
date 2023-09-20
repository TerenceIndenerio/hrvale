import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router'
import TabsPage from '../views/TabsPage.vue'
import Leave from '@/views/services/leave/LeaveDashboard.vue'
import ApplyLeave from '@/views/services/leave/ApplyLeave.vue'
import LeaveRequest from '@/views/services/leave/LeaveRequest.vue'
import ClockIn from '@/views/services/clock_in/ClockIn.vue'
import Schedule from '@/views/services/schedule/Schedule.vue'
import Attendance from '@/views/services/attendance/Attendance.vue'
import OTRequest from '@/views/services/ot/OTRequest.vue'
import Login from '@/views/login/Login.vue'
import Flash from '@/views/login/Flash.vue'
import ChangePassword from '@/views/forgot_password/ChangePassword.vue'
import ForgotPassword from '@/views/forgot_password/ForgotPassword.vue'
import ForgotPin from '@/views/forgot_password/ForgotPin.vue'
import ChangePin from '@/views/forgot_password/ChangePin.vue'
import CreatePin from '@/views/forgot_password/CreatePin.vue'
import OT from '@/views/services/ot/OT.vue';
import OTApply from '@/views/services/ot/OTApply.vue';
import Vale from '@/views/services/vale/Vale.vue';
import ApplyVale from '@/views/services/vale/ApplyVale.vue';
import ValeRequest from '@/views/services/vale/ValeRequest.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/home'
      },
      {
        path: 'home',
        component: () => import('@/views/home/HomePage.vue')
      },
      {
        path: 'services',
        component: () => import('@/views/services/Services.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/approval/Tab3Page.vue')
      },
      {
        path: 'tab4',
        component: () => import('@/views/more/Tab4Page.vue')
      },
      {
        path: '/leave',
        component: Leave
      },
      {
        path: '/applyLeave',
        component: ApplyLeave
      },
      {
        path: '/leaveRequest',
        component: LeaveRequest
      },
      {
        path: '/clockin',
        component: ClockIn
      },
      {
        path: '/Schedule',
        component: Schedule
      },
      {
        path: '/attendance',
        component: Attendance
      },
      {
        path: '/ot',
        component: OT
      },
      {
        path: '/otapply',
        component: OTApply
      },
      {
        path: '/otrequest',
        component: OTRequest
      },
      {
        path: '/vale',
        component: Vale
      },
      {
        path: '/applyvale',
        component: ApplyVale
      },
      {
        path: '/valerequest',
        component: ValeRequest
      }
      
    ]
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/flash',
    component: Flash
  },
  {
    path: '/changepw',
    component: ChangePassword
  },
  {
    path: '/forgotpw',
    component: ForgotPassword
  },
  {
    path: '/forgotpin',
    component: ForgotPin
  },
  {
    path: '/changepin',
    component: ChangePin
  },
  {
    path: '/createpin',
    component: CreatePin
  }
  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
