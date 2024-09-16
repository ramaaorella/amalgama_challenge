## Ejercicio 1:

1- **Problemas:**

- <ins>No hay separación de responsabilidades:</ins> No hay una clara separación de responsabilidades tanto entre componentes como entre la presentación y lógica de cada componente, lo cual atenta contra la mantenibilidad, escalabilidad y legibilidad del código.
  - El nav es un elemento de navegación que debería ser parte estructura general de la aplicación y no estar acoplado a una vista específica como _ContactsScreen_. Para una mejor separación, debería ser parte de un componente de layout que envuelva a las vistas que correspondan.
  - Por como se denominó al componente, con el sufijo "-Screen", lo más conveniente es que el mismo se encargue sólo de la presentación, y no de la transformación de datos. Puede ser que sea información que sólo se transforma para este componente y no se va a reutilizar en ninguna otra parte de la app; en ese caso, no estaría mal mantener acoplada la transformación a este componente. Al considerar que el proyecto puede escalar, se entiende que no conviene y que es mejor solución extraer la transformación ya sea a un custom hook o en su defecto, a una función utilitaria.
- <ins>No hay modularización para reutilizar componentes:</ins> Al tratarse de un componente con el sufijo "-Screen", en general, lo más conveniente es que arme la estructura de la vista a partir de componentes personalizados en lugar de construir la estructura directamente con elementos HTML. Esto asegura una mayor reutilización de componentes, dado que generalmente para mantener una cohesión dentro del diseño y funcionalidad del sistema, hay elementos que muy probablemente se van a repetir en distintas vistas. Además, permite mejorar nuevamente la mantenibilidad y legibilidad del código al compactar el componente.
- <ins>No se usa la prop _key_ al iterar y renderizar sobre el array de contactos:</ins> Al iterar con _.map()_ sobre el array de contactos y direcciones para renderizar elementos JSX es necesario asignarle un _key_ a cada elemento para que la biblioteca de React pueda identificar de manera eficiente a los elementos y mantener la consistencia entre renderizados. Además del error que detectará React, esto puede llevar a efectos no deseados en la UI.
- <ins>Faltan cuestiones de accesibilidad:</ins> Si bien se utilizan los elementos adecuados, faltan algunas cuestiones de accesibilidad como el _alt_ de las imágenes de los avatares y un role quizás a la lista de contactos que se renderiza como un _div_ para proporcionar mayor semántica.
- <ins>Se repite el proceso de normalización de la información ante cada re-renderizado del componente:</ins> Si bien el componente en principio parece ser bastante estático, tiene el problema que ante cada actualización de estado que trigeree un re-render va a provocar que se vuelva a hacer la transformación de toda la información para volver a renderizar el componente; lo cual es un problema sobretodo si se maneja una gran cantidad de información o si el componente se actualiza frecuentemente. Debería desacoplarse la transformación del componente o utilizar un hook como _useMemo_ que evite este problema de performance.
- <ins>Se asume que todos los datos están presentes:</ins> Se acceden todos los atributos directamente asumiendo que existen, y en caso de que algún dato falte habrá _undefined's_ que hará que no se renderice nada en la UI, lo cual por como está estructurada la vista no pareciera que sea un problema. Sin embargo, en el caso de _addresses_ si _contact.addresses_ es _undefined_ puede generar errores al querer acceder a la propiedad _length_. Debería asegurarse que al menos devuelve un array vacío. Lo mismo ocurre al normalizar el _phone_.

**Mejoras:**

- Entendiendo que aunque no se adjunte igualmente existe un diseño, sería conveniente aprovechar y evitar la repetición de ese diseño siguiendo un patrón como compound components. Este patrón también permitiría reutilizar funcionalidad si se extendiera a futuro. Igualmente me parece excesivo implementar el patrón con la context api para un componente relativamente simple; en principio puede implementarse de forma simplificada.
- El patrón render props también puede ser útil. Si se abstrae y se modulariza el componente para renderizar una lista (que quizás tiene una funcionalidad implementada, como togglear sobre elementos), el patrón render props permite mantener la flexibilidad de renderizar distintos tipos de datos y en diferentes formatos manteniendo la funcionalidad y el diseño.
- Usar Typescript para el tipado estricto de los datos y las propiedades de los componentes para mayor robustez al escalar.

**Algunas cuestiones de la implementación actual:**

- Si bien se desconoce la implementación del método _findById_ quizás podría ajustarse la estructura de datos de cities y states para facilitar y realizar una búsqueda más eficiente.
- Una alternativa podría ser llevar la transformación de datos al renderizado para achicar el componente. Además se aprovecharía la iteración que se hace para generar los elementos HTML para normalizar la información, y se evitaría la doble iteración actual. Esta alternativa igualmente sigue manteniendo posibles problemas de performance.
- La transformación de datos también podría mejorarse a menos que se esté seleccionando específicamente algunos atributos para la vista. Si la propiedad _contacts_ que recibe el componente no tiene más atributos que los que se acceden en esta vista, se podría utilizar el operador spread para evitar mapear algunos atributos innecesariamente. Si se está realizando una selección, achicando la estructura de _contacts_, entonces la transformación estaría bien hecha.
- El elemento principal podría ser un fragment, aunque se entiende que quizás está por cuestiones de diseño que no son parte del alcance del ejercicio es un _div_.

Los problemas más relevantes son el no uso de la prop _key_ para las listas, el no manejo de información faltante o malformada y el no cuidado del código que se ejecuta ante cada renderizado porque son aquellos más probables a generar errores o efectos no deseados en la experiencia de usuario.

2-
**_src/pages/ContactsScreen.jsx_**

```js
const ContactsScreen = ({ contacts, cities, states }) => {
  const contactsToDisplay = useContacts(contacts, cities, states);

  return (
    <>
      <h1>Contacts</h1>
      <List
        items={contactsToDisplay}
        renderAs={(contact) => (
          <>
            <ListItemHeader>
              <ListItemHeaderImage
                src={contact.avatar_url}
                alt={`Imagen de perfil de ${contact.full_name}`}
              />
              <ListItemHeaderTitle
                title={contact.full_name}
                subTitle={contact.company}
              />
            </ListItemHeader>
            <ListItemBody>
              <p>{contact.details}</p>
              <ul>
                <li>email: {contact.email}</li>
                <li>phone: {contact.phone_number}</li>
                <li>
                  👥
                  <h4>Address{contact.addresses.length > 1 && "es"}:</h4>
                  {contact.addresses.map((address) => (
                    <ul
                      key={`${address.line_1}-${address.line_2}-${address.zip_code}`}
                    >
                      <li>{address.line_1}</li>
                      <li>{address.line_2}</li>
                      <li>{address.zip_code}</li>
                      <li>{address.city.name}</li>
                      <li>{address.state.name}</li>
                    </ul>
                  ))}
                </li>
              </ul>
            </ListItemBody>
          </>
        )}
      />
    </>
  );
};
```

**_src/components/List.js_**

```js
const List = ({ items, renderAs }) => {
  return (
    <div>
      {items.map((item) => (
        <ListItem key={item.id}>{renderAs(item)}</ListItem>
      ))}
    </div>
  );
};

const ListItem = ({ children }) => {
  return <div>{children}</div>;
};

const ListItemHeader = ({ children }) => {
  return <div>{children}</div>;
};

const ListItemHeaderImage = ({ src, alt }) => {
  return <img src={src} alt={alt} />;
};

const ListItemHeaderTitle = ({ title, subTitle }) => {
  return (
    <span>
      <h3>{title}</h3> - <h4>{subTitle}</h4>
    </span>
  );
};

const ListItemBody = ({ children }) => {
  return <div>{children}</div>;
};

export {
  List,
  ListItemHeader,
  ListItemHeaderImage,
  ListItemHeaderTitle,
  ListItemBody,
};
```

**_src/hooks/useContacts.js_**

```js
const useContacts = (contacts, cities, states) => {
  return useMemo(
    () =>
      contacts.map((contact) => ({
        ...contact,
        full_name: `${contact.first_name} ${contact.last_name}`,
        details: truncate(contact.details, 100),
        phone_number: `(${contact.phone?.area_code || ""}) ${
          contact.phone?.number || ""
        }`,
        addresses:
          contact.addresses.map((address) => ({
            ...address,
            city: findById(cities, address.city_id),
            state: findById(states, address.state_id),
          })) || [],
      })),
    [contacts, cities, states]
  );
};
```

**_src/App.jsx_**

```js
function App() {
  return (
    <Layout>
      <ContactsScreen contacts={contacts} cities={cities} states={states} />
    </Layout>
  );
}
```

**_src/pages/Layout.jsx_**

```js
const Layout = ({ children }) => {
  return (
    <div>
      <Nav />
      {children}
    </div>
  );
};
```

**_src/components/Nav.jsx_**

```js
const Nav = () => {
  return (
    <nav>
      <ul>
        <li>
          <a href="/home">Home</a>
        </li>
        <li>
          <a href="/contacts">My Contacts</a>
        </li>
      </ul>
    </nav>
  );
};
```

3- El código refactorizado aporta lo siguiente a cada punto:

- <ins>Separación de Responsabilidades:</ins> La lógica de transformación de datos se movió al hook _useContacts_, separando la lógica del componente de presentación y mejorando la modularidad y mantenibilidad. Se extrajo el código del _nav_ y se crearon nuevos componentes para respetar la estructura y que cada uno tenga su propia responsabilidad.

- <ins>Modularización y Reutilización:</ins> Se crearon componentes específicos (List, ListItemHeader, etc.) para mejorar la legibilidad y la reutilización (que cobraría valor al proporcionarlos de funcionalidades e incluir el diseño css sobre esos elementos), y se usó el patrón de render props en List para mayor flexibilidad a la hora de definir que información mostrar.

- <ins>Uso de _key_ en listas:</ins> Se añadió la prop key a las listas para que React maneje eficientemente los elementos, evitando problemas de renderizado.

- <ins>Accesibilidad:</ins> Se incluyó el atributo alt en las imágenes para mejorar la accesibilidad.

- <ins>Optimización del renderizado:</ins> Se usó _useMemo_ en _useContacts_ para evitar recalcular los datos en cada renderizado, mejorando el rendimiento.

- <ins>Manejo de información faltante:</ins> Se agregaron valores por defecto para aquellas propiedades que podían dar error en el _useContacts_. Igualmente no es una buena solución, deberían implementarse validaciones o valores por defecto para todos los campos, pero es una solución tiene que ver más con el manejo de data que con este componente en sí.

4- Si bien los datos son parecidos y se entiende que la vista también lo sería, hay algunos atributos que son distintos entre _contacts_ y _users_: _contact.avatar_url vs user.avatar_, _contact.addresses vs user.address_, y aquellos atributos que los users no mantienen. Esto hace que el componente original no sea 100% reutilizable a priori. Podría aprovecharse y normalizar la información para que coincidan y así reutilizar más fácil el componente, pero la idea fue mostrar con esas pequeñas diferencias como podría ajustarse el componente _List_ a otros contextos, sin tener que recurrir a normalizar de nuevo la data.

```js
const UserScreen = ({ users }) => {
  return (
    <>
      <h1>Users</h1>
      <List
        items={users}
        renderAs={(user) => {
          const userFullName = user.first_name + " " + user.last_name;
          return (
            <>
              <ListItemHeader>
                <ListItemHeaderImage
                  src={user.avatar}
                  alt={`Imagen perfil de ${userFullName}`}
                />
                <ListItemHeaderTitle
                  title={userFullName}
                  subTitle={user.company}
                />
              </ListItemHeader>
              <ListItemBody>
                <ul>
                  <li>email: {user.email}</li>
                  <li>
                    👥
                    <h4>Address:</h4>
                    <ul key={user.address.line_1}>
                      <li>{user.address.line_1}</li>
                      <li>{user.address.line_2}</li>
                      <li>{user.address.zip_code}</li>
                      <li>{user.address.city}</li>
                      <li>{user.address.state}</li>
                    </ul>
                  </li>
                </ul>
              </ListItemBody>
            </>
          );
        }}
      />
    </>
  );
};
```
