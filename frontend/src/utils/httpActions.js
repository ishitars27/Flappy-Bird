const httpAction = async (data) => {
  try {
    // 1. Get the token from localStorage
    const token = localStorage.getItem('token');

    // 2. Initialize headers with Content-Type
    const headers = {
      "Content-Type": "application/json",
    };

    // 3. If a token exists, add it to the Authorization header
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(data.url, {
      method: data.method || "GET",
      body: data.body
        ? JSON.stringify(data.body)
        : data.data // Keep this alternative body handling if you use it
        ? JSON.stringify(data.data)
        : null,
      headers: headers, // Use the dynamically created headers object
      credentials: "include", // Keep this if your backend also uses cookies for sessions
    });

    const contentType = response.headers.get("content-type");
    const result = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    // Specific handling for 401 Unauthorized might be useful here
    if (response.status === 401) {
        // Optionally, clear the token and redirect to login if 401 is received
        localStorage.removeItem('token');
        // You might want to throw a specific error or trigger a global logout
        throw new Error("Unauthorized: Please log in again.");
    }

    if (!response.ok) {
      // If response is not OK, throw an error including the message from the backend
      throw new Error(result?.message || result || "Something went wrong");
    }

    return result;
  } catch (error) {
    console.error("HTTP Action Error:", error.message);
    // Re-throw the error so the calling component can handle it (e.g., show a toast)
    throw error;
  }
};

export default httpAction;
