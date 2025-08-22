# Bienvenido a tu app Expo 👋

Este es un proyecto de [Expo](https://expo.dev) creado con [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Primeros pasos

1. Instala dependencias

   ```bash
   npm install
   ```

2. Inicia la app

   ```bash
   npx expo start
   ```

En la salida verás opciones para abrir la app en:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Emulador de Android](https://docs.expo.dev/workflow/android-studio-emulator/)
- [Simulador de iOS](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), un entorno limitado para probar desarrollo con Expo

Puedes empezar a desarrollar editando los archivos dentro del directorio **app**. Este proyecto usa [enrutamiento basado en archivos](https://docs.expo.dev/router/introduction).

## Nuevo: pestaña Clima

Agregamos una nueva pestaña para consultar el clima con una interfaz de tema animalista.

- **Archivo de pantalla**: `app/(tabs)/clima.tsx`
- **Registro en tabs**: `app/(tabs)/_layout.tsx` (nombre de ruta: `clima`)

### Cómo usar

1. Inicia la app: `npx expo start`.
2. Abre la app y navega a la pestaña "Clima".
3. Ingresa una ciudad y toca "Buscar" para obtener el clima actual desde OpenWeather.

### Características

- UI con estilo animalista y emojis que reaccionan a las condiciones del clima.
- Estado de carga y manejo de errores para ciudades inválidas o problemas con la API.
- Métricas mostradas: temperatura, sensación térmica, descripción (en español), humedad, viento.

### Configuración (API Key)

La pantalla actualmente usa una API key de OpenWeather embebida en `app/(tabs)/clima.tsx` (`API_KEY`). Para producción, es mejor usar variables de entorno:

- Agrega tu clave en `app.json` o `app.config.ts` bajo `extra`.
- Léela con `expo-constants`.

Example (app.config.ts):

```ts
import 'dotenv/config';
export default ({ config }) => ({
  ...config,
  extra: { OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY },
});
```

Luego, en la pantalla:

```ts
import Constants from 'expo-constants';
const API_KEY = Constants.expoConfig?.extra?.OPENWEATHER_API_KEY as string;
```

## Reiniciar proyecto

Cuando estés listo, ejecuta:

```bash
npm run reset-project
```

Este comando moverá el código de inicio al directorio **app-example** y creará un directorio **app** en blanco para que comiences a desarrollar.

## Aprende más

Para aprender más sobre cómo desarrollar tu proyecto con Expo, revisa estos recursos:

- [Documentación de Expo](https://docs.expo.dev/): Aprende lo fundamental o profundiza con nuestras [guías](https://docs.expo.dev/guides).
- [Tutorial de Expo](https://docs.expo.dev/tutorial/introduction/): Sigue un tutorial paso a paso para crear un proyecto que corre en Android, iOS y web.

## Únete a la comunidad

Únete a nuestra comunidad de desarrolladores creando apps universales.

- [Expo en GitHub](https://github.com/expo/expo): Mira nuestra plataforma open source y contribuye.
- [Comunidad en Discord](https://chat.expo.dev): Chatea con usuarios de Expo y haz preguntas.
