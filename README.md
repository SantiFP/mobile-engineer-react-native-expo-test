## Mobile Engineer Evaluation – React Native / Expo

## Nombre del candidato: Santiago Fuentes

# Instalación y ejecución del proyecto

1- Clonar el repositorio

git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>

2- Instalar dependencias

npm install

3- Ejecutar

npx expo start

4- Configuración de URLs

En `src/api/config.ts` se definen `apiUrl` y `socketUrl` según la plataforma.

- **iOS simulator:** `localhost` funciona directamente.
- **Expo Go en dispositivo físico o emulador Android:** reemplazar la URL por la dirección IP del equipo donde se ejecuta el backend, para que la aplicación pueda conectarse correctamente.

Esta configuración asegura que la app se conecte correctamente tanto a la API como a Socket.IO.

5- Credenciales de prueba

Para acceder a la aplicación, utilizar las siguientes credenciales de prueba:

- **Usuario:** testuser
- **Contraseña:** testpass123

Estas credenciales permiten iniciar sesión y probar las funcionalidades principales de la aplicación sin necesidad de crear un usuario nuevo.

## Descripción

Solución de la evaluación técnica para Mobile Developer en Torem. La aplicación ahora integra autenticación de usuarios, chat con soporte para imágenes, navegación fluida, persistencia de sesión, paginación eficiente y virtualización de listas, además se resolvió el problema de performance intencional.

Estado del proyecto

- Todas las funcionalidades requeridas del punto 1 al 5 de la evaluación fueron implementadas y funcionan correctamente.

- Código organizado y modular, con uso adecuado de hooks y manejo de estado mediante Redux y React Query.

- Resuelto el problema de performance intencional, mejorando la eficiencia en la carga y renderizado de mensajes.

- Aplicadas consideraciones de performance y escalabilidad en el chat y el listado de mensajes.

- Integración de NativeWind en varias pantallas y componentes.

- Integración de un sistema de notificaciones y feedback visual para errores de comunicación con la API: iniciar sesión, obtener mensajes y enviar imágenes.

  Puntos adicionales:

      - Se corrigió un error en la carga de mensajes que no estaba contemplado en la evaluación.La request original con Axios presentaba fallos al enviar el token y recuperar los mensajes, por lo que se reemplazó por `fetch` nativo, garantizando que la lista se renderice correctamente al abrir el chat.

          > **Nota:** Esta corrección implicó modificar la implementación de la request definida en  
          > `src/api/baseRepositories/api/http/axios/axios-http-service.ts`,  
          > asegurando el correcto envío del token y la obtención de los mensajes.

      - Se solucionó el flasheo de la imagen de fondo en el componente Body, ajustando dinámicamente su ancho y alto según el tamaño del dispositivo para garantizar un render estable y uniforme.

## Archivos y hooks creados para la prueba técnica

Durante la prueba se agregaron varios hooks y servicios dentro de la carpeta `src` que no formaban parte del proyecto original, con el fin de implementar la funcionalidad completa de chat, autenticación y manejo de errores.

### Hooks (`src/hooks`)

- `useAttachmentMenu.ts` → Maneja opciones de adjuntos y estado de envío.
- `useAuth.ts` → Gestiona autenticación y persistencia de sesión.
- `useChatPagination.ts` → Lógica de paginación de mensajes en el chat (solución al punto 4 de la evaluación).
- `useErrorMessage.ts` → Hook global para mostrar mensajes de error.
- `usePickImage.ts` → Selector de imágenes desde galería o cámara.
- `useRenderLogger.ts` → Auxiliar para debuggear renders de componentes.

### Componentes nuevos

- `Error.tsx` (`src/components`) → Componente para mostrar mensajes de error globales.  
  Se utiliza junto a un Provider que envuelve la app, permitiendo disparar errores desde cualquier componente de forma centralizada.

### Servicios (`src/services`)

Se agregó la carpeta `services` con funciones para centralizar la comunicación con la API y manejar datos de forma organizada:

- `postRequest.ts` → Wrapper general para POST requests, usado en login y envío de mensajes.
- `AuthService.ts` → Funciones para autenticación, manejo de tokens y persistencia de sesión.
- `SendImageService.ts` → Funciones para enviar imágenes al backend, manejando formatos y errores.

Estos hooks y servicios fueron creados específicamente para la prueba técnica y no existían en el proyecto original, contribuyendo a mantener el código más modular y claro.

## Detalle del problema de performance del punto 5:

- Problema: Cada render del componente Body recalculaba toda la lista de mensajes usando Object.values y sort,
  lo que provocaba ralentización de la aplicación cuando la cantidad de mensajes era elevada.

- Causa: El ordenamiento se realizaba directamente dentro del render, y la lista de mensajes se actualizaba constantemente.

- Solución aplicada:
  1. Se utilizó useMemo para memoizar la transformación y ordenamiento de los mensajes, de modo que solo se recalculen cuando cambian los datos.
  2. Se empleó useCallback para memoizar la función renderItem y evitar su recreación en cada render.
  3. (Extra) En un proyecto real, se podría delegar el ordenamiento a un selector memoizado de Redux o al reducer para mayor eficiencia.

- Resultado: El componente Body ahora mantiene un rendimiento estable y consistente, incluso con grandes volúmenes de mensajes.

## Propuestas de mejora de arquitectura y/o performance general

- Organización de carpetas / arquitectura: Actualmente hay componentes, pantallas y layouts dentro de la carpeta features, lo que no refleja claramente su alcance o responsabilidad. Se podría reorganizar separando pantallas, layouts y componentes reutilizables de cada feature, mejorando la mantenibilidad, escalabilidad y claridad del proyecto.

- En Message.tsx cada mensaje se suscribe individualmente al store mediante un selector por ID. En listas grandes, esto puede generar múltiples evaluaciones cuando cambia el estado global del chat. Una alternativa sería pasar el mensaje ya resuelto desde la FlatList o
usar selectores memoizados.

- No es necesario un Provider para el componente Message, ya que su estado no se comparte con otros. Se recomienda manejar el id y el estado localmente dentro de Message para simplificar la arquitectura y mejorar la mantenibilidad.

- En Regular.tsx cada mensaje utiliza múltiples selectores individuales para obtener propiedades del estado global. En listas extensas, esto incrementa la cantidad de suscripciones y evaluaciones al store. Se sugiere agrupar las propiedades en un único selector memoizado o pasar el mensaje resuelto desde el contenedor.

- En Footer.tsx el valor del input se toma directamente del store de Redux. Esto hace que el componente se vuelva a renderizar cada vez que cambia algo del estado global, aunque no afecte al input. Se podría mejorar manejando el valor dentro del componente o usando un selector que solo devuelva lo que realmente necesita.

- Actualmente en Header.tsx se define handleLogout dentro del componente y se usan estilos dinámicos en ThemedView. Para mejorar la performance, se podría memoizar handleLogout con useCallback y extraer los estilos fijos a StyleSheet.create para reducir cálculos en cada render.

- En Chat.tsx actualmente se utiliza useLayoutEffect para obtener los mensajes al montar el componente, lo que retrasa el primer render. Se podría usar useEffect para cargar los datos sin bloquear la UI.

- Login.tsx
  - React.memo: Actualmente se usa `React.memo`, pero al no recibir props ni depender de re-renders externos, no aporta beneficios reales y podría eliminarse.
  - Estado de inputs: Los campos `username` y `password` se manejan con `useState`. Esto funciona, pero si se agregan validaciones o más campos, se podría usar un hook de formulario o `useReducer` para centralizar el estado y reducir renders innecesarios.
  - Estilos: Los estilos aplicados a `ImageBackground` y `KeyboardAvoidingView` son fijos pero definidos en línea, lo que provoca recalculaciones en cada render. Extraerlos a `StyleSheet.create` puede mejorar la performance.

- Se movió la creación de QueryClient fuera del componente ReduxRootLayoutWrapper para evitar recrearlo en cada render. Esto mantiene el cache de React Query estable y mejora la eficiencia de la aplicación.

- Actualmente la app sigue el tema del sistema mediante useColorScheme(), pero no permite que el usuario cambie manualmente entre modo claro y oscuro. Se podría implementar un toggle o botón en la UI que actualice el estado del tema, guardándolo en Redux o Context, y pasando ese valor al ThemeProvider. Esto mejoraría la experiencia de usuario y daría mayor control sobre la apariencia de la app.

## Notas finales

La aplicación cumple con los requisitos de la evaluación técnica y muestra un rendimiento estable. Con más tiempo, se podrían implementar mejoras adicionales para incrementar la calidad y la mantenibilidad del proyecto:

Optimización de performance: Aunque se resolvió el problema intencional y se aplicaron memoizaciones en componentes clave, se podría mejorar aún más el manejo de listas grandes y los selectores de Redux para optimizar renders innecesarios.

Arquitectura y organización: La estructura de carpetas y componentes podría refinarse, separando de manera más clara pantallas, layouts y features, lo que facilitaría la incorporación de nuevas funcionalidades y su mantenimiento.

Gestión de estilos: Aunque NativeWind ya se utiliza para mantener consistencia visual, se podría estandarizar aún más el uso de variables de diseño y mejorar la modularidad de los estilos.

Robustez y testing: Se podrían agregar pruebas unitarias e integración en componentes críticos, así como tests de manejo de errores en la comunicación con la API y Socket.IO.

Mejoras de UX: Si bien se contemplan indicadores de carga y feedback básico ante errores, podrían incorporarse validaciones adicionales y una mayor claridad en algunos estados de la interfaz para cubrir escenarios límite y mejorar la experiencia general del usuario.

En resumen, la solución presentada es funcional, organizada y optimizada dentro del alcance de la evaluación, con espacio para mejoras de mayor alcance si se contara con más tiempo.
