const API_BASE_URL = "http://localhost:8080";


export async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    let response;

    try {
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(token && {
                    Authorization: `Bearer ${token}`,
                }),
                ...options.headers,
            },
        });
    } catch {
        throw new Error(
            "Unable to connect to the server. Please check your connection and try again."
        );
    }

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");

            window.dispatchEvent(new Event("auth:unauthorized"));
        }

        const errorText = await response.text();

        throw new Error(
            errorText || `Request failed with status ${response.status}`
        );
    }

    return response;
}