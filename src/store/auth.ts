import type { Employee } from '../employee/employee';
import { ActionContext } from 'vuex';

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: Employee | null;
  error: string | null;
}

export default {
  namespaced: true,
  state: {
    isAuthenticated: false,
    currentUser: null,
    error: null
  },
  getters: {
    isAuthenticated: (state: AuthState) => state.isAuthenticated,
    currentUser: (state: AuthState) => state.currentUser,
    authError: (state: AuthState) => state.error
  },
  mutations: {
    setAuthStatus(state: AuthState, status: boolean) {
      state.isAuthenticated = status;
    },
    setCurrentUser(state: AuthState, user: Employee | null) {
      state.currentUser = user;
    },
    setError(state: AuthState, error: string | null) {
      state.error = error;
    }
  },
  actions: {
    login({ commit }: ActionContext<AuthState, any>, user: Employee) {
      commit('setCurrentUser', user);
      commit('setAuthStatus', true);
      commit('setError', null);
    },
    logout({ commit }: ActionContext<AuthState, any>) {
      commit('setCurrentUser', null);
      commit('setAuthStatus', false);
      commit('setError', null);
    }
  }
};
