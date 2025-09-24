import { createStore, Store } from "vuex";
import loader from "./loader/loader";
import token from "./token/token";
import leave from "./leave/leave";
import adminUser from "./login/onLoad";
import internet from "./checkInternet/internet";
import auth from "./auth";

// Explicitly import the types
import type { LoaderState } from "./loader/loader";
import type { TokenState } from "./token/token";
import type { AuthState } from "./auth";

// Define RootState correctly
export interface RootState {
  loader: LoaderState;
  token: TokenState;
  leave: any; // Define the correct type if possible
  adminUser: any; // Define the correct type if possible
  internet: any;
  auth: AuthState;
}

// Create Vuex store with typed RootState
const store: Store<RootState> = createStore({
  modules: {
    loader,
    token,
    leave,
    adminUser,
    internet,
    auth,
  },
});

export default store;
