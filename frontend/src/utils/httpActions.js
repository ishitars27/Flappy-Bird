const httpAction = async (data) => {
  try {
    const response = await fetch(data.url, {
      method: data.method || "GET",
      body: data.body ? JSON.stringify(data.body) : null,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const contentType = response.headers.get("content-type");
    const result = contentType?.includes("application/json")
      ? await response.json()
      : await response.text(); // fallback if it's HTML

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
