const API_BASE_URL = "http://localhost:8080";

export async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && {
                Authorization: `Bearer ${token}`,
            }),
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            errorText || `Request failed with status ${response.status}`
        );
    }

    return response;
}