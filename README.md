# Documentación

## Integrantes y contribuciones

### Vladimir Kozik (rama: `alumno1_kozik`)

Implementación del modelo de **alumno** (`AlumnoModel`) y colaboración en el desarrollo del recurso **alumnos**. Se trabajó en la migración de código JavaScript a TypeScript, adaptación de la estructura del proyecto a `.ts`, apoyo en controladores, validaciones y demás lógica relacionada con alumnos, además del despliegue y la documentación en Postman.

### Laureano Kronemberger (rama: `alumno3_kronemberger`)

Implementación del recurso **materias**. Se desarrolló la lógica necesaria para administrar materias, incluyendo rutas, controladores, modelo, lectura y escritura sobre `materias.json`, búsqueda por identificador y filtros por query params.

### Santino Aloisio (rama: `alumno4_aloisio`)

Colaboración en el desarrollo de controladores y en el recurso **alumnos**. Se trabajó sobre la lógica necesaria para consultar, crear, modificar y eliminar alumnos, junto con el armado de funciones de apoyo para el manejo del recurso.

### Conrado Lanusse (rama: `alumno2_lanusse`)

Implementación de la funcionalidad de **notas** en TypeScript. Se desarrollaron los controladores `getNotasAll`, `getNotaById`, `updateNota`, `createNota` y `deleteNota`, junto con sus rutas correspondientes en `notas.routes.ts`.

Se agregaron los endpoints:

- `GET /notas`
- `GET /notas/:id`
- `POST /notas`
- `PUT /notas/:id`
- `DELETE /notas/:id`

La ruta de `GET /notas` acepta parámetros de búsqueda para filtrar los resultados (`idMateria` y `legajo`). Las acciones de `POST`, `PUT` y `DELETE` se hacen persistentes al modificar la data en los archivos JSON de origen.

### Francisco Jaszczuk (rama: `alumno5_jaszczuk`)

Implementación de la funcionalidad de **alumnos** en TypeScript. Se desarrollaron los controladores `getAlumnoAll`, `getAlumnoById` y `postNewAlumno`, junto con sus rutas correspondientes en `alumno.routes.ts`.

Se agregaron los endpoints:

- `GET /alumnos`
- `GET /alumnos/:legajo`
- `POST /alumnos`

Además, se incorporó lectura y escritura sobre `alumnos.json`, búsqueda por legajo, validación de email duplicado, generación automática de legajo y uso del middleware `validateInputAlumno` para validar los datos de entrada.

## Links

- Deploy en Render: https://tp4-backend-grupo-5.onrender.com
- Repositorio del front-end: no.

## Ejecucion del proyecto

Instalar dependencias:

```bash
npm install
```

Ejecutar en modo desarrollo:

```bash
npm run dev
```

Compilar TypeScript:

```bash
npm run build
```

Ejecutar la version compilada:

```bash
npm start
```

La API queda disponible por defecto en:

```txt
http://localhost:3000
```

El puerto se define en `core/server.ts` con `process.env.PORT || 3000`, por eso puede usar un puerto configurado por entorno o, si no existe, el puerto `3000`.

## Rutas activas

| Recurso | Ruta base | Archivo de rutas |
|---|---|---|
| Alumnos | `/alumnos` | `routes/alumno.routes.ts` |
| Materias | `/materias` | `routes/materia.routes.ts` |
| Notas | `/notas` | `routes/notas.routes.ts` |

## Documentacion para Postman

### https://documenter.getpostman.com/view/55411762/2sBXwnusTW#65b7171d-5c70-4d4e-9616-e0cc4986d994

```txt
base_url = http://localhost:3000
```

## Funciones principales explicadas

### `app.ts`

`app.ts` es el archivo de entrada porque importa la clase `Server`, crea el servidor y llama a `listen()`.
No contiene rutas ni logica de negocio solo inicia la aplicacion.

### `Server` en `core/server.ts`

`constructor()` ejecuta dos pasos al crear el servidor: primero configura middlewares y despues monta rutas.

`middleware()` registra configuraciones generales de Express:

- `cors()` permite solicitudes desde otros origenes.
- `express.json()` permite leer bodies JSON.
- `express.static('client/static')` deja preparada una carpeta estatica si se necesita servir archivos, pero no esta hecho.

`rutas()` conecta las rutas base con sus routers:

- `/alumnos` usa `alumnoRoutes`.
- `/notas` usa `notasRoutes`.
- `/materias` usa `materiaRoutes`.

Tambien define la respuesta para rutas no encontradas y el manejador general de errores.

`listen()` inicia el servidor en el puerto configurado.

### Controlador de alumnos

`leerAlumnos()` lee `data/alumnos.json`, transforma el contenido con `JSON.parse()` y devuelve un array de alumnos.

`escribirAlumnos()` recibe un array y lo guarda nuevamente en `data/alumnos.json` usando `JSON.stringify()`.

`buscarIndexPorLegajo()` convierte el parametro `legajo` a numero y busca la posicion del alumno dentro del array. Devuelve el indice si existe o `-1` si no existe.

`buscarIndexPorEmail()` normaliza el email con `trim()` y `toLowerCase()` para detectar emails repetidos aunque cambien mayusculas o espacios.

`generarNuevoLegajo()` recorre todos los alumnos, busca el legajo mayor y devuelve el siguiente, asi el usuario no decide el legajo.

`getAlumnoAll()` lista alumnos y si recibe `isActive`, filtra por activos o inactivos pero si recibe `apellido`, filtra por coincidencia parcial.

`getAlumnoById()` busca un alumno por `legajo` y si no existe `404`.

`postNewAlumno()` crea un alumno nuevo y valida que el email no exista, genera legajo automatico, crea un `AlumnoModel`, guarda en JSON y responde `201`.

`putAlumnoBylegajo()` modifica un alumno existente y busca por legajo, valida que el email no pertenezca a otro alumno, actualiza los campos enviados y cambia la fecha de modificacion.

`deleteAlumnoByLegajo()` elimina fisicamente el alumno del array y guarda el JSON actualizado.

### Controlador de materias

`leerMaterias()` lee `data/materias.json` y devuelve el array de materias.

`escribirMaterias()` guarda el array actualizado en `data/materias.json`.

`normalizarIdMateria()` limpia espacios y convierte el id a mayusculas, esto evita que `prog1` y `PROG1` se traten como materias distintas.

`obtenerParametro()` tooma un parametro de ruta y asegura que se trabaje con un string.

`obtenerQueryParam()` transforma un query param en string o devuelve `undefined` si no fue enviado.

`buscarIndexPorIdMateria()` busca una materia por `idMateria`, normalizando ambos valores antes de comparar.

`getMateriaAll()` lista materias ypuede filtrar por `cuatrimestre` o por coincidencia parcial de `nombre`.

`getMateriaById()` busca una materia especifica por `idMateria`.

`postNewMateria()` crea una materia, normaliza su id, valida que no exista otra con el mismo id y guarda el nuevo registro.

`putMateriaById()` modifica el nombre y/o cuatrimestre de una materia existente.

`deleteMateriaById()` elimina una materia del archivo JSON.

### Controlador de notas

`leerNotas()` lee `data/notas.json` y devuelve el array de notas.

`escribirNotas()` guarda el array actualizado en `data/notas.json`.

`buscarIndexPorId()` busca una nota por su `id`.

`generarNuevoId()` recorre todas las notas, obtiene el id mas alto y devuelve el siguiente.

`getNotasAll()` lista notas y puede filtrar por `legajo` y por `idMateria`.

`getNotaById()` busca una nota puntual por id.

`createNota()` crea una nota nueva, el id se genera automaticamente y la fecha se genera desde el modelo.

`updateNota()` modifica solamente el campo `nota` de una nota existente. Mantiene el mismo `id`, `legajo`, `idMateria` y `fecha`.

`deleteNota()` elimina una nota del array y guarda el json actualizado.

### Modelos

`PersonaModel` representa datos comunes de una persona: `nombre`, `apellido` y `email`.
    Se usa como clase base para alumnos.

`AlumnoModel` extiende `PersonaModel` y agrega `legajo`, `fechaAlta`, `modificacion` e `isActive`.
    Tambien valida que el legajo no venga en el body, que los textos no esten vacios, que el email tenga formato valido y que `isActive` sea booleano.

`MateriaModel` representa una materia con `idMateria`, `nombre` y `cuatrimestre`.
    Incluye validaciones para id, texto y cuatrimestre.

`NotasModel` representa una nota con `id`, `legajo`, `idMateria`, `nota` y `fecha`.
    Valida que la nota sea numerica y este entre `0` y `10`, y evita modificar desde el body campos que no deberian cambiar.

### Middlewares

`validateInputAlumno()` se ejecuta antes de crear o modificar alumnos. Usa `AlumnoModel.validarDatos()` y corta la request con `400` si hay errores. En `PUT`, tambien exige que el body tenga al menos un campo.

`validateInputNota()` se ejecuta antes de crear o modificar notas. Usa `NotasModel.validarDatos()`. En `PUT`, exige que se envie el campo `nota`.

`validateRelacionNota()` se ejecuta solo al crear notas.
Lee alumnos, materias y notas para comprobar:

- Que exista el alumno del `legajo`.
- Que exista la materia del `idMateria`.
- Que no exista ya una nota para la misma combinacion.
