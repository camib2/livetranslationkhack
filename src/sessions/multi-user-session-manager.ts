import type { WebSocket } from "ws";

export interface SessionUser {
  id: string;
  profile: "support" | "enduser";
  language: string;
  socket: WebSocket;
  expectedUserLanguage: string;
  agentLanguage: string;
  name?: string;
  status?: "free" | "busy"; // For support agents
}

export interface MultiUserSession {
  id: string;
  code: string;
  createdAt: Date;
  users: Map<string, SessionUser>;
  supportUser?: SessionUser;
  endUser?: SessionUser;
  isPoolSession?: boolean; // Indicates this is a waiting pool for support
}

export class SessionManager {
  private sessions = new Map<string, MultiUserSession>();
  private sessionsByCode = new Map<string, MultiUserSession>();
  private userSessions = new Map<string, MultiUserSession>();
  private poolSessions = new Map<string, MultiUserSession>(); // Pool code -> waiting support session

  /**
   * Generate a 6-character session code
   */
  private generateSessionCode(): string {
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
  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create a new session for an end user
   */
  createSession(profile: "support" | "enduser", language: string): { sessionId: string; sessionCode: string } {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const sessionCode = this.generateSessionCode();

    const session: MultiUserSession = {
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
  addUserToSession(
    sessionId: string,
    profile: "support" | "enduser",
    language: string,
    expectedUserLanguage: string,
    agentLanguage: string,
    socket: WebSocket,
    userName?: string
  ): { success: boolean; message: string; session?: MultiUserSession } {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return { success: false, message: "Session not found" };
    }

    const userId = this.generateUserId();
    const user: SessionUser = {
      id: userId,
      profile,
      language,
      socket,
      expectedUserLanguage,
      agentLanguage,
      name: userName
    };

    // Add user to session
    session.users.set(userId, user);
    this.userSessions.set(userId, session);

    // Assign to profile-specific slot
    if (profile === "support") {
      session.supportUser = user;
    } else {
      session.endUser = user;
    }

    return { success: true, message: "User added to session", session };
  }

  /**
   * Join a session by code
   */
  joinSessionByCode(
    joinCode: string,
    profile: "support" | "enduser",
    language: string,
    expectedUserLanguage: string,
    agentLanguage: string,
    socket: WebSocket
  ): { success: boolean; message: string; sessionId?: string; session?: MultiUserSession } {
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
    const user: SessionUser = {
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
    } else {
      session.endUser = user;
    }

    return { success: true, message: "Joined session", sessionId: session.id, session };
  }

  /**
   * Get session for a user
   */
  getSessionForUser(userId: string): MultiUserSession | undefined {
    return this.userSessions.get(userId);
  }

  /**
   * Remove user from session
   */
  removeUserFromSession(userId: string): void {
    const session = this.userSessions.get(userId);
    if (!session) {
      return;
    }

    const user = session.users.get(userId);
    if (user) {
      session.users.delete(userId);

      if (user.profile === "support") {
        session.supportUser = undefined;
      } else {
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
  getOtherUsersInSession(userId: string): SessionUser[] {
    const session = this.userSessions.get(userId);
    if (!session) {
      return [];
    }

    return Array.from(session.users.values()).filter((u) => u.id !== userId);
  }

  /**
   * Check if session has both users
   */
  isSessionFull(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }
    return Boolean(session.supportUser && session.endUser);
  }

  /**
   * Get session info
   */
  getSessionInfo(sessionId: string): { userCount: number; hasSupport: boolean; hasEndUser: boolean } | null {
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

  /**
   * Create a pool session for a support agent to wait for users
   */
  createPoolSession(profile: "support", language: string, expectedUserLanguage: string, agentLanguage: string, socket: WebSocket): { sessionId: string; poolCode: string; supportUserId: string } {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const poolCode = this.generateSessionCode();

    const session: MultiUserSession = {
      id: sessionId,
      code: poolCode,
      createdAt: new Date(),
      users: new Map(),
      isPoolSession: true,
      endUser: undefined,
      supportUser: undefined
    };

    const userId = this.generateUserId();
    const user: SessionUser = {
      id: userId,
      profile,
      language,
      socket,
      expectedUserLanguage,
      agentLanguage,
      status: "free" // Default support agents to free status
    };

    session.users.set(userId, user);
    session.supportUser = user;

    this.sessions.set(sessionId, session);
    this.sessionsByCode.set(poolCode, session);
    this.userSessions.set(userId, session);
    this.poolSessions.set(poolCode, session);

    return { sessionId, poolCode, supportUserId: userId };
  }

  /**
   * Join a pool session as an end user (removes pool session from pool list, converts to regular session)
   */
  joinPoolSession(
    poolCode: string,
    profile: "enduser",
    language: string,
    expectedUserLanguage: string,
    agentLanguage: string,
    socket: WebSocket
  ): { success: boolean; message: string; sessionId?: string; session?: MultiUserSession } {
    const poolSession = this.poolSessions.get(poolCode);
    if (!poolSession) {
      return { success: false, message: "Invalid pool code or no support available" };
    }

    // Add end user to the pool session
    const userId = this.generateUserId();
    const user: SessionUser = {
      id: userId,
      profile,
      language,
      socket,
      expectedUserLanguage,
      agentLanguage
    };

    poolSession.users.set(userId, user);
    poolSession.endUser = user;
    this.userSessions.set(userId, poolSession);

    // Remove from pool (now it's an active session)
    this.poolSessions.delete(poolCode);
    poolSession.isPoolSession = false;

    return { success: true, message: "Joined support pool", sessionId: poolSession.id, session: poolSession };
  }

  /**
   * Get all waiting pool sessions (for admin dashboard if needed)
   */
  getWaitingPoolSessions(): MultiUserSession[] {
    return Array.from(this.poolSessions.values());
  }

  /**
   * Check if a pool session exists and is waiting
   */
  isPoolWaiting(poolCode: string): boolean {
    return this.poolSessions.has(poolCode);
  }

  /**
   * Get available support agents (status = "free")
   */
  getAvailableSupportAgents(): MultiUserSession[] {
    const available: MultiUserSession[] = [];
    for (const session of this.poolSessions.values()) {
      if (session.supportUser) {
        // Treat undefined status as "free" by default
        const status = session.supportUser.status || "free";
        if (status === "free") {
          available.push(session);
        }
      }
    }
    return available;
  }

  /**
   * Assign an end user to the first available support agent
   */
  assignUserToAvailableAgent(
    profile: "enduser",
    language: string,
    expectedUserLanguage: string,
    agentLanguage: string,
    socket: WebSocket,
    userName?: string
  ): { success: boolean; message: string; sessionId?: string; session?: MultiUserSession; supportAgent?: SessionUser } {
    const availableAgents = this.getAvailableSupportAgents();
    
    if (availableAgents.length === 0) {
      return { success: false, message: "No available support agents" };
    }

    // Take the first available agent
    const agentSession = availableAgents[0];
    
    // Add the end user to this session
    const userId = this.generateUserId();
    const user: SessionUser = {
      id: userId,
      profile,
      language,
      socket,
      expectedUserLanguage,
      agentLanguage,
      name: userName
    };

    agentSession.users.set(userId, user);
    this.userSessions.set(userId, agentSession);
    agentSession.endUser = user;

    // Remove from pool sessions since it's now matched
    this.poolSessions.delete(agentSession.code);
    agentSession.isPoolSession = false;

    return {
      success: true,
      message: "Assigned to support agent",
      sessionId: agentSession.id,
      session: agentSession,
      supportAgent: agentSession.supportUser
    };
  }

  /**
   * Update support agent status
   */
  updateAgentStatus(userId: string, status: "free" | "busy"): { success: boolean; message: string } {
    const session = this.userSessions.get(userId);
    if (!session || !session.supportUser || session.supportUser.id !== userId) {
      return { success: false, message: "User not found or not a support agent" };
    }

    session.supportUser.status = status;
    return { success: true, message: `Agent status updated to ${status}` };
  }
}

export const sessionManager = new SessionManager();
