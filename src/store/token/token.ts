import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { generateToken } from '../../services/api';

interface TokenState {
  token: string | null;
}

const state: TokenState = {
  token: null,
};

const mutations: MutationTree<TokenState> = {
  updateToken(state, newData) {
    state.token = newData;
  },
};

const actions: ActionTree<TokenState, any> = {
  async generateToken({ commit }) {
    try {
      const response = await generateToken();
      const token = response.data.token;
      localStorage.setItem("_token", token);
      commit('updateToken', token);
    } catch (error) {
        console.error(error);
    }
  },
};

const getters: GetterTree<TokenState, any> = {
    getToken(state): string | null {
      return state.token;
    },
};

const token: Module<TokenState, any> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default token;
