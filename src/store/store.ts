import { createStore, Store } from 'vuex';
import loader from './loader/loader';
import token from './token/token';
import leave from './leave/leave';

interface RootState {
  loader: any;
  token: any;
}

const store: Store<RootState> = createStore({
  modules: {
    loader,
    token,
    leave
  },
});

export default store;
