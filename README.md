# Libros RN (Expo)

Aplicación React Native (Expo) que busca libros en Google Books, muestra detalles en modal y permite guardar “Favoritos” localmente.

## Características
- Consumo de API compleja: Google Books.
- Búsqueda: título, autores, miniatura.
- Detalles en modal: portada, título, autores, descripción, fecha de publicación.
- Favoritos locales:
  - Android/iOS: SQLite (expo-sqlite).
  - Web: localStorage (fallback).
- Navegación con Expo Router.
- Manejo de carga y errores en búsqueda y detalles.

## Stack
- React Native + Expo SDK 53
- Expo Router
- Google Books API
- Almacenamiento local: `expo-sqlite` (nativo) / `localStorage` (web)
- TypeScript

## Estructura
- [app/_layout.tsx](cci:7://file:///c:/Users/oscar/Desktop/App_Clima/my-app/app/_layout.tsx:0:0-0:0): Stack + init BD. `book/[id]` como modal.
- [app/index.tsx](cci:7://file:///c:/Users/oscar/Desktop/App_Clima/my-app/app/index.tsx:0:0-0:0): Búsqueda y lista de resultados.
- `app/book/[id].tsx`: Detalles + Añadir/Quitar Favoritos (modal).
- [app/favorites.tsx](cci:7://file:///c:/Users/oscar/Desktop/App_Clima/my-app/app/favorites.tsx:0:0-0:0): Lista y eliminación de favoritos.
- [lib/api.ts](cci:7://file:///c:/Users/oscar/Desktop/App_Clima/my-app/lib/api.ts:0:0-0:0): Cliente Google Books (search, getById).
- [lib/db.ts](cci:7://file:///c:/Users/oscar/Desktop/App_Clima/my-app/lib/db.ts:0:0-0:0): Encaminador por plataforma hacia:
  - [lib/db.native.ts](cci:7://file:///c:/Users/oscar/Desktop/App_Clima/my-app/lib/db.native.ts:0:0-0:0) (SQLite en dispositivos)
  - [lib/db.web.ts](cci:7://file:///c:/Users/oscar/Desktop/App_Clima/my-app/lib/db.web.ts:0:0-0:0) (localStorage en web)
- [metro.config.js](cci:7://file:///c:/Users/oscar/Desktop/App_Clima/my-app/metro.config.js:0:0-0:0): Soporte `.wasm` si hiciera falta (evitado con fallback web).

## Ejecución
1) Instalar dependencias:
   - npm install
2) Arrancar (caché limpio recomendado):
   - npx expo start -c
3) Plataformas:
   - Android: npm run android
   - iOS: npm run ios
   - Web: npm run web

Si la web muestra advertencias de tipos de rutas, reinicia con caché limpio. En web, Favoritos usa localStorage.

## Uso
1) En la pantalla principal, busca (ej. “harry potter”) y pulsa “Buscar”.
2) Abre un resultado para ver detalles (modal).
3) Pulsa “Añadir a Favoritos”.
4) Ve a “Favoritos” para ver/retirar guardados.

## API
- Búsqueda: GET `https://www.googleapis.com/books/v1/volumes?q=<query>&maxResults=20`
- Detalle: GET `https://www.googleapis.com/books/v1/volumes/<id>`

No es necesaria API Key para búsquedas básicas (se puede parametrizar si se desea).

## Notas
- Prisma no se usa en apps RN para almacenamiento local (es para backend/Node). En dispositivo se usa SQLite.
- En web evitamos WASM/SharedArrayBuffer usando localStorage.
- Detalles se muestra como modal para mejor UX.

## Mejoras posibles
- Filtros avanzados (autor, fecha, categorías).
- Paginación/infinite scroll.
- Cache de resultados.
- Sincronización remota de favoritos.

