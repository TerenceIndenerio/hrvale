import axios from "axios";
import { ActionContext } from "vuex";
import { RootState } from "@/store/store"; // Ensure this is a named import

interface Employee {
  empNumber: string | null;
}

interface AdminUserDetails {
  employee?: Employee;
}

interface State {
  adminUserDetails: AdminUserDetails | null;
  empNumber: string | null;
}

const state: State = {
  adminUserDetails: null,
  empNumber: null,
};

const mutations = {
  SET_ADMIN_USER_DETAILS(state: State, details: AdminUserDetails) {
    state.adminUserDetails = details;
    state.empNumber = details?.employee?.empNumber || null;
  },
};

const actions = {
  async fetchAdminUserDetails(
    { commit }: ActionContext<State, RootState>, // Now correctly typed
    id: string
  ) {
    try {
      const storedToken = localStorage.getItem("token");
      const baseURL = localStorage.getItem("baseUrl");
      if (!storedToken || !baseURL) {
        throw new Error("Missing authentication details");
      }

      const headers = { Authorization: `Bearer ${storedToken}` };
      const api = `${baseURL}api/v2/admin/users/${id}`;
      const response = await axios.get<{ data: AdminUserDetails }>(api, {
        headers,
      });
      const details = response.data.data;

      commit("SET_ADMIN_USER_DETAILS", details);
    } catch (error) {
      console.error("Error fetching admin user details: ", error);
    }
  },
};

const getters = {
  adminUserDetails: (state: State): AdminUserDetails | null =>
    state.adminUserDetails,
  empNumber: (state: State): string | null => state.empNumber,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
