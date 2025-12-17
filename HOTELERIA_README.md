# Hotelería - Congreso Médico

## Descripción
Esta página presenta información sobre hotelería para el Congreso de Pediatría, incluyendo el hotel sede principal y opciones adicionales de alojamiento.

## Características

### 🏨 Hotel Sede (La Sede)
- **Hotel Bourbon**: Hotel principal del congreso
- Información detallada sobre ubicación y facilidades
- Conectado al Centro de Convenciones Conmebol
- Acceso directo al Museo Sudamericano de Fútbol
- Botón "Como llegar" que abre Google Maps
- Número de teléfono clickeable

### 🏢 Otros Hoteles
- Lista de 6 hoteles adicionales en la zona
- Información de contacto y distancia al venue
- Botones "Como llegar" funcionales
- Diseño responsive en grid

### 🎯 Atractivos Turísticos
- 4 lugares de interés turístico
- Información de ubicación y contacto
- Mismo diseño que los hoteles para consistencia

## Componentes

### FeaturedHotel
- Componente principal para el hotel sede
- Layout de dos columnas (imagen + información)
- Botones interactivos para direcciones y teléfono

### HotelCard
- Tarjeta reutilizable para hoteles y atracciones
- Diseño responsive y consistente
- Funcionalidad de contacto integrada

### HotelesSection
- Contenedor principal que organiza todas las secciones
- Datos mock para demostración
- Estructura modular y escalable

## Funcionalidades

- **Navegación**: Integrada en el menú principal
- **Responsive**: Diseño adaptativo para móviles y desktop
- **Interactivo**: Botones funcionales para direcciones y contacto
- **Accesible**: Enlaces y botones con funcionalidad real

## Rutas

- **Página principal**: `/hoteleria`
- **Navegación**: Menú principal con enlace "Hotelería"

## Tecnologías

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion (para animaciones del menú)

## Personalización

Los datos de hoteles y atracciones se pueden modificar fácilmente en el archivo `HotelesSection.tsx`. Para integrar con una API real, simplemente reemplazar los arrays de datos mock con llamadas a la API.

## Imágenes

- Utiliza la imagen `hotel-dazzler.jpg` del directorio público
- Las imágenes se pueden personalizar cambiando las rutas en los componentes
