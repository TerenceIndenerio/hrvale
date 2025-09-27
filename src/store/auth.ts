import authService from "@/services/auth";
import { ActionContext } from "vuex";

/** === Employee type (moved here so no import errors) === */
export interface Employee {
  id: string;
  name: string;
  face?: string;
}

/** === Auth State === */
export interface AuthState {
  isAuthenticated: boolean;
  currentUser: Employee | null;
  error: string | null;
}

/** === Vuex Auth Module === */
export default {
  namespaced: true,

  /** === State === */
  state: {
    isAuthenticated: false,
    currentUser: null,
    error: null,
  },

  /** === Getters === */
  getters: {
    isAuthenticated: (state: AuthState) => state.isAuthenticated,
    currentUser: (state: AuthState) => state.currentUser,
    authError: (state: AuthState) => state.error,
  },

  /** === Mutations === */
  mutations: {
    setAuthStatus(state: AuthState, status: boolean) {
      state.isAuthenticated = status;
    },
    setCurrentUser(state: AuthState, user: Employee | null) {
      state.currentUser = user;
    },
    setError(state: AuthState, error: string | null) {
      state.error = error;
    },
  },

  /** === Actions === */
  actions: {
    async biometricLogin(
      { commit }: ActionContext<AuthState, any>,
      employee: Employee
    ) {
      try {
        const response = await authService.biometricLogin(employee.name);
        if (response.success) {
          commit("setCurrentUser", employee);
          commit("setAuthStatus", true);
          commit("setError", null);
          return { success: true, data: response.data };
        } else {
          commit("setError", response.error || "Authentication failed");
          return { success: false, error: response.error };
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Authentication failed";
        commit("setError", errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    logout({ commit }: ActionContext<AuthState, any>) {
      commit("setCurrentUser", null);
      commit("setAuthStatus", false);
      commit("setError", null);
    },
  },
};
