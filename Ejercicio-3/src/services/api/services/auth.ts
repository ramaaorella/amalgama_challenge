import api from "../axiosConfig";

export const login = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });

    const { token } = response.data;
    localStorage.setItem("authToken", token);
    return token;
  } catch (error) {
    console.error(
      "Error al iniciar sesión:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};
