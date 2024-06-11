import { createContext, Dispatch } from "react";

import { AuthActionTypes } from "./authActions";

interface AuthState {
  accountId: string | null;
  merchantCenterId: string | null;
  updateAccountId: (val: string) => void;
  updateMerchantCenterId: (val: string) => void;
  listingScope: any;
}

type AuthAction =
  | {
      type: AuthActionTypes.LOGIN;
      accountId: string | number;
      merchantCenterId?: string | number;
    }
  | { type: AuthActionTypes.LOGOUT }
  | {
      type: AuthActionTypes.UPDATE_MERCHANT_CENTER_ID;
      merchantCenterId: string | number;
    }
  | { type: AuthActionTypes.UPDATE_ACCOUNT_ID; accountId: string | number }
  | { type: AuthActionTypes.SET_LISTING_SCOPE_DATA; listingScope: any };

export const AuthContext = createContext<
  | {
      state: AuthState;
      dispatch: Dispatch<AuthAction>;
    }
  | undefined
>(undefined);
