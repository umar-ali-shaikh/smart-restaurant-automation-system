import { apiClient } from "../../../api/client";

export const userService = {
    createSession() {
        if (!this.sessionPromise) {
            this.sessionPromise = apiClient.get("/users/session").catch((error) => {
                this.sessionPromise = null;
                throw error;
            });
        }
        return this.sessionPromise;
    },

    updateProfile(payload) {
        return apiClient.put("/users/profile", payload);
    },
};
