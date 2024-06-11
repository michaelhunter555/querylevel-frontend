import { AuthActionTypes } from "./authActions";

interface InitializedState {
  accountId: string | null;
  merchantCenterId: string | null;
  listingScope: any;
}

export const initialState: InitializedState = {
  accountId: null,
  merchantCenterId: null,
  listingScope: {},
};

export const authReducer = (state: any, action: any) => {
  switch (action.type) {
    case AuthActionTypes.LOGIN:
      return {
        ...state,
        accountId: action.accountId,
      };
    case AuthActionTypes.LOGOUT:
      return initialState;

    case AuthActionTypes.UPDATE_ACCOUNT_ID:
      return {
        ...state,
        accountId: action.accountId,
      };

    case AuthActionTypes.UPDATE_MERCHANT_CENTER_ID:
      return {
        ...state,
        merchantCenterId: action.merchantCenterId,
      };

    case AuthActionTypes.SET_LISTING_SCOPE_DATA:
      return {
        ...state,
        listingScope: action.listingScope,
      };
    default:
      return state;
  }
};
