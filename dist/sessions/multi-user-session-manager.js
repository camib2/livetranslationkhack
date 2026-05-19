export class SessionManager {
    sessions = new Map();
    sessionsByCode = new Map();
    userSessions = new Map();
    /**
     * Generate a 6-character session code
     */
    generateSessionCode() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }
    /**
     * Generate a unique user ID
     */
    generateUserId() {
        return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * Create a new session for an end user
     */
    createSession(profile, language) {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const sessionCode = this.generateSessionCode();
        const session = {
            id: sessionId,
            code: sessionCode,
            createdAt: new Date(),
            users: new Map(),
            endUser: undefined,
            supportUser: undefined
        };
        this.sessions.set(sessionId, session);
        this.sessionsByCode.set(sessionCode, session);
        return { sessionId, sessionCode };
    }
    /**
     * Add a user to a session
     */
    addUserToSession(sessionId, profile, language, expectedUserLanguage, agentLanguage, socket) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            return { success: false, message: "Session not found" };
        }
        const userId = this.generateUserId();
        const user = {
            id: userId,
            profile,
            language,
            socket,
            expectedUserLanguage,
            agentLanguage
        };
        // Add user to session
        session.users.set(userId, user);
        this.userSessions.set(userId, session);
        // Assign to profile-specific slot
        if (profile === "support") {
            session.supportUser = user;
        }
        else {
            session.endUser = user;
        }
        return { success: true, message: "User added to session", session };
    }
    /**
     * Join a session by code
     */
    joinSessionByCode(joinCode, profile, language, expectedUserLanguage, agentLanguage, socket) {
        const session = this.sessionsByCode.get(joinCode);
        if (!session) {
            return { success: false, message: "Invalid session code" };
        }
        // Check if session already has both users
        if (session.supportUser && session.endUser) {
            return { success: false, message: "Session is full" };
        }
        // Add user to session
        const userId = this.generateUserId();
        const user = {
            id: userId,
            profile,
            language,
            socket,
            expectedUserLanguage,
            agentLanguage
        };
        session.users.set(userId, user);
        this.userSessions.set(userId, session);
        if (profile === "support") {
            session.supportUser = user;
        }
        else {
            session.endUser = user;
        }
        return { success: true, message: "Joined session", sessionId: session.id, session };
    }
    /**
     * Get session for a user
     */
    getSessionForUser(userId) {
        return this.userSessions.get(userId);
    }
    /**
     * Remove user from session
     */
    removeUserFromSession(userId) {
        const session = this.userSessions.get(userId);
        if (!session) {
            return;
        }
        const user = session.users.get(userId);
        if (user) {
            session.users.delete(userId);
            if (user.profile === "support") {
                session.supportUser = undefined;
            }
            else {
                session.endUser = undefined;
            }
            // Clean up empty sessions
            if (session.users.size === 0) {
                this.sessions.delete(session.id);
                this.sessionsByCode.delete(session.code);
            }
        }
        this.userSessions.delete(userId);
    }
    /**
     * Get other users in the same session
     */
    getOtherUsersInSession(userId) {
        const session = this.userSessions.get(userId);
        if (!session) {
            return [];
        }
        return Array.from(session.users.values()).filter((u) => u.id !== userId);
    }
    /**
     * Check if session has both users
     */
    isSessionFull(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            return false;
        }
        return Boolean(session.supportUser && session.endUser);
    }
    /**
     * Get session info
     */
    getSessionInfo(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            return null;
        }
        return {
            userCount: session.users.size,
            hasSupport: Boolean(session.supportUser),
            hasEndUser: Boolean(session.endUser)
        };
    }
}
export const sessionManager = new SessionManager();
