const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:8081";

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}/api/chat${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (response.status === 401)
    throw new Error("Session expired. Please login again.");
  if (response.status === 204) return null;
  if (response.status === 404) return null;

  if (!response.ok) {
    let errorBody = null;
    try {
      errorBody = await response.json();
    } catch {}
    throw new Error(
      errorBody?.message ||
        errorBody?.title ||
        `Request failed: ${response.status}`,
    );
  }

  return response.json();
};

// ── Sessions ──────────────────────────────────────────────────────────────────

export const getChatSessions = () => request("/sessions");

export const getChatSession = (sessionId) => request(`/sessions/${sessionId}`);

export const createSession = (mode, model, title) =>
  request("/sessions", {
    method: "POST",
    body: JSON.stringify({
      title: title || "New Chat",
      mode: mode || "rag",
      model: model || "claude-sonnet-4-20250514",
    }),
  });

export const deleteSession = (sessionId) =>
  request(`/sessions/${sessionId}`, { method: "DELETE" });

export const updateSessionTitle = (sessionId, title) =>
  request(`/sessions/${sessionId}`, {
    method: "PUT",
    body: JSON.stringify({ title }),
  });

// ── Messages ──────────────────────────────────────────────────────────────────

export const getChatMessages = async (sessionId) => {
  const result = await request(`/sessions/${sessionId}/messages`);
  return result || [];
};

export const saveMessage = (chatSessionId, role, messageObject) =>
  request("/messages", {
    method: "POST",
    body: JSON.stringify({
      chatSessionId,
      role,
      content: JSON.stringify(messageObject),
    }),
  });
