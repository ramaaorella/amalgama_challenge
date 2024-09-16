import api from "../axiosConfig";

export const getBooks = async () => {
  try {
    const response = await api.get("/books");

    return { data: response.data };
  } catch (error) {
    console.error(
      "Error al obtener libros:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};
