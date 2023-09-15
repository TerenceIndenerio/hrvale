import { createStore } from 'vuex';

export default createStore({
  state: {
    isLoading: false,
  },
  mutations: {
    isLoading(state, newValue) {
      state.isLoading = newValue;
    },
  },
});
