import { Module, GetterTree } from 'vuex';

interface LoaderState {
  isLoading: boolean;
}

const state: LoaderState = {
    isLoading: false,
};

const mutations = {
  updateLoader(state: any, newValue: boolean) {
    state.isLoading = newValue;
  },
};

const actions = {};

const getters: GetterTree<LoaderState, any> = {
  getLoader(state): boolean {
    return state.isLoading;
  },
};

const loader: Module<LoaderState, any> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export default loader;
