import api from "../axiosConfig";

export const getUsers = async () => {
  try {
    const response = await api.get("/users");

    return { data: response.data };
  } catch (error) {
    console.error(
      "Error al obtener usuarios:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};
