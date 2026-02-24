import { AuthStore } from "../feature/auth/stores/auth-store";

export const isAuthenticated = () => {
    return AuthStore.getState().isAuthenticated;
};

export const getUser = () => {
    return AuthStore.getState().user;
};

export const logout = () => {
    return AuthStore.getState().logout();
};
