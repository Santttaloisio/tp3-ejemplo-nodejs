# Documentación #
### El archivo README.md debe incluir lo siguiente: ###
- Número de grupo e integrantes.
- Nombre del proyecto y su descripción.
- Metodología de trabajo con Git y GitHub.
- División de los archivos entre los integrantes.
- Distribución de los archivos y carpetas.
- Un 90% de las funciones explicadas a detalle.
- Documentación con ‘Postman’ de todos los métodos (GET, PUT, DELETE, POST).
- Mínimo un ejemplo de la estructura de cada archivo JSON utilizado (no integrar varios “arrays” en un mismo archivo).
- Link del deploy en Render.
- Link al repositorio con el front-end.


Integrantes y contribuciones
Vladimir Kozik (rama: alumno1_kozik)

Conrado Lanusse (rama: alumno2_lanusse)


Laureano Kronemberger (rama: alumno3_kronemberger)


Santino Aloisio (rama: alumno4_aloisio)


### Conrado Lanusse (rama: `alumno2_lanusse`)

Implementación de la funcionalidad de **notas** en TypeScript. Se desarrollaron los controladores `getNotasAll`, `getNotaById`, `updateNota`, `createNota` y `deleteNota`, junto con sus rutas correspondientes en `notas.routes.ts`.

Se agregaron los endpoints:

- `GET /notas`
- `GET /notas/:id`
- `POST /notas`
- `PUT /notas`
- `DELETE /notas/:id`

La ruta de `GET /notas` acepta parámetros de búsqueda para filtrar los resultados (idMateria y legajo).
Las acciones de POST, PUT y DELETE se hacen persistentes al modificar la data en los archivos json de origen.

### Francisco Jaszczuk (rama: `alumno5_jaszczuk`)

Implementación de la funcionalidad de **alumnos** en TypeScript. Se desarrollaron los controladores `getAlumnoAll`, `getAlumnoById` y `postNewAlumno`, junto con sus rutas correspondientes en `alumno.routes.ts`.

Se agregaron los endpoints:

- `GET /alumnos`
- `GET /alumnos/:legajo`
- `POST /alumnos`

Además, se incorporó lectura y escritura sobre `alumnos.json`, búsqueda por legajo, validación de email duplicado, generación automática de legajo y uso del middleware `validateInputAlumno` para validar los datos de entrada.



