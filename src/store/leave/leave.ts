import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { leaveRequestAPi } from '../../services/api';

interface LeaveState {
  data: any;
}

const state: LeaveState = {
  data: null,
};

const mutations: MutationTree<LeaveState> = {
  updateData(state, newData) {
    state.data = newData;
  },
};

const actions: ActionTree<LeaveState, any> = {
  async getLeaveRequests({ commit }) {
    try {
      const response = await leaveRequestAPi();
      commit('updateData', response);
      return response;
    } catch (error) {
        console.error(error);
    }
  },
};

const getters: GetterTree<LeaveState, any> = {
    getLeaveRequestData(state): any {
      return state.data;
    },
};

const token: Module<LeaveState, any> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default token;
