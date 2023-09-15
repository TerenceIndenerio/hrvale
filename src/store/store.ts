import { createStore, Store } from 'vuex';
import loader from './loader/loader';
import token from './token/token';

interface RootState {
  loader: any;
}

const store: Store<RootState> = createStore({
  modules: {
    loader,
    token
  },
});

export default store;
