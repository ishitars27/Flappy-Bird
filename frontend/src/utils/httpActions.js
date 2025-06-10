const httpAction = async (data) => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(data.url, {
      method: data.method || "GET",
      headers,
      body: data.body || data.data ? JSON.stringify(data.body || data.data) : undefined,
    });

    const contentType = response.headers.get("content-type");
    const result = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new Error(result?.message || result || "Something went wrong");
    }

    return result;
  } catch (error) {
    console.error("HTTP Error:", error.message);
    throw error;
  }
};

export default httpAction;
