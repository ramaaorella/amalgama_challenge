## Ejercicio 2

1- La forma más óptima de guardar la información estará dada en sí por cómo se consume esa información en la app. Asumiendo que se quiere mantener toda la información disponible de forma local para distintas operaciones, lo más conveniente es:

- Evitar la redundancia de información para minimizar el uso de memoria y evitar duplicaciones.
- Analizar cómo optimizar la búsqueda con estructuras de datos acordes (indexadas).
- Tener algún índice adicional si existen consultas frecuentes. Por ejemplo, al normalizar la información, se podría mantener referencias a los libros de cada autor para poder listarlos ya filtrados; aunque esto duplica estado que hay que mantener sincronizado ante manipulaciones.
- Si bien no está directamente relacionado con cómo se almacena la información, utilizar librerías de data-fetching como React Query puede ayudar a sincronizar eficientemente los datos entre el servidor y el estado local; manteniendo este estado actualizado mediante la cache de las respuestas, evitando así realizar múltiples llamadas manuales a la API y por consecuencia, múltiple normalizaciones.

```js
import { useState } from 'react';
import { useQuery } from 'react-query';

const fetchBooks = async () => {
  const res = await fetch('https://api.org/books');
  const data = await res.json();

  const booksById = {};
  const authorsById = {};

  data.response.forEach((book) => {
    booksById[book.id] = {
      id: book.id,
      title: book.title,
      authorId: book.author.id
    };

    if (!authorsById[book.author.id]) {
      authorsById[book.author.id] = {
        id: book.author.id,
        name: book.author.name,
      };
  });

  return { books: booksById, authors: authorsById };
};

const fetchUsers = async () => {
  const res = await fetch('https://api.org/users');
  const data = await res.json();

  const usersById = {};

  data.response.forEach((user) => {
    usersById[user.id] = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      favoriteBookIds: user.favorite_books.map((book) => book.id)
    };
  });

  return usersById;
};

const Component = () => {
  const { data: bookData, isLoading: booksLoading } = useQuery('books', fetchBooks);
  const { data: userData, isLoading: usersLoading } = useQuery('users', fetchUsers);
  const { books, authors } = bookData || {};
  ...
}
```

2-

```json
{
  "authors": {
    "1": { "id": 1, "name": "Uncle Bob" }
  },
  "books": {
    "1": { "id": 1, "title": "Clean Code", "authorId": 1 },
    "2": { "id": 2, "title": "Clean Architecture", "authorId": 1 }
  },
  "users": {
    "1": {
      "id": 1,
      "email": "chano@amalgama.co",
      "nickname": "Chano",
      "favoriteBookIds": [1]
    },
    "2": {
      "id": 2,
      "email": "sebastian@amalgama.co",
      "nickname": "Biche",
      "favoriteBookIds": [1, 2]
    }
  }
}
```

3- La solución propuesta permite evitar la redundancia al almacenar datos normalizados, minimizando el uso de memoria y previniendo duplicaciones. A su vez, al hacer uso de los id's como índices, se facilita la búsqueda y la gestión de datos (sean operaciones de filtrado, búsqueda y/o actualización).

Por su parte, la separación de entidades (libros, autores, usuarios) hace que las actualizaciones y modificaciones sean más manejables. Cuando se realiza una actualización en un libro o autor, solo se necesita modificar una entrada en el estado, y todas las referencias a esos datos se actualizan automáticamente.

Esto hace que el manejo del estado sea más flexible y fácilmente escalable ya sea para manejar más datos o tipos adicionales de entidades. Si en el futuro se añaden nuevos tipos de datos o relaciones, se puede expandir la estructura sin necesidad de reestructurar el estado existente.

Por último, al utilizar React Query para manejar la sincronización de datos con el servidor se facilita la caché y la actualización de datos, asegurando que la UI tenga los datos más recientes sin necesidad de llamadas manuales adicionales a la API ni de normalizar de más.
 