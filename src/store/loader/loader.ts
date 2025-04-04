import { Module, GetterTree, MutationTree } from "vuex";

// ✅ Export interface explicitly
export interface LoaderState {
  isLoading: boolean;
}

const state: LoaderState = {
  isLoading: false,
};

const mutations: MutationTree<LoaderState> = {
  updateLoader(state, newValue: boolean) {
    state.isLoading = newValue;
  },
};

const actions = {};

const getters: GetterTree<LoaderState, any> = {
  getLoader(state): boolean {
    return state.isLoading;
  },
};

// Vuex Module
const loader: Module<LoaderState, any> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export default loader;
