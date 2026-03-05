export function getSessionId(): string {
    if (typeof window === "undefined") return "server-side";
    let sessionId = localStorage.getItem("vca_session_id");
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("vca_session_id", sessionId);
    }
    return sessionId;
}

export async function trackEvent(name: string, metadata?: Record<string, any>) {
    if (typeof window === "undefined") return;

    // Non-blocking fire and forget
    fetch("/api/track", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            sessionId: getSessionId(),
            metadata,
        }),
    }).catch(err => console.error("Tracking Error:", err));
}
