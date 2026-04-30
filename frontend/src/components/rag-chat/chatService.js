// src/services/chatService.js
const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:8081";

class ChatService {
  constructor() {
    this.getToken = () => localStorage.getItem("jwt_token");
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    if (!token) throw new Error("Authentication required");

    const response = await fetch(`${API_BASE_URL}/api/chat${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (response.status === 401)
      throw new Error("Session expired. Please login again.");
    if (response.status === 404) {
      console.warn(`[chatService] 404: /api/chat${endpoint}`);
      return null;
    }
    if (!response.ok) {
      let errorBody = null;
      try {
        errorBody = await response.json();
      } catch (_) {}
      console.error(
        `[chatService] ${response.status} /api/chat${endpoint}`,
        errorBody,
      );
      throw new Error(
        errorBody?.message ||
          errorBody?.title ||
          `Request failed with status ${response.status}`,
      );
    }
    if (response.status === 204) return null;
    return response.json();
  }

  // ─── Sessions ───────────────────────────────────────────────────────────────

  async getChatSessions() {
    return this.request("/sessions");
  }
  async getChatSession(sessionId) {
    return this.request(`/sessions/${sessionId}`);
  }

  async createSession(mode, model, title) {
    return this.request("/sessions", {
      method: "POST",
      body: JSON.stringify({
        title: title || "New Chat",
        mode: mode || "rag",
        model: model || "claude-sonnet-4-20250514",
      }),
    });
  }

  async deleteSession(sessionId) {
    return this.request(`/sessions/${sessionId}`, { method: "DELETE" });
  }

  async updateSessionTitle(sessionId, title) {
    return this.request(`/sessions/${sessionId}`, {
      method: "PUT",
      body: JSON.stringify({ title }),
    });
  }

  // ─── Messages ───────────────────────────────────────────────────────────────

  async getChatMessages(sessionId) {
    const result = await this.request(`/sessions/${sessionId}/messages`);
    return result || [];
  }

  async saveMessage(chatSessionId, role, messageObject) {
    return this.request("/messages", {
      method: "POST",
      body: JSON.stringify({
        chatSessionId,
        role,
        content: JSON.stringify(messageObject),
      }),
    });
  }
}

export const chatService = new ChatService();
