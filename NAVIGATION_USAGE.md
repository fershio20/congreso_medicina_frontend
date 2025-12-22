# Guía de Uso del Plugin Navigation

## Endpoint REST

El plugin Navigation expone un endpoint REST para obtener la estructura de navegación:

```
GET /api/navigation/render/:navigationIdOrSlug
```

### Parámetros

- **`:navigationIdOrSlug`** (requerido): ID numérico o slug de la navegación
  - Ejemplo por ID: `/api/navigation/render/1`
  - Ejemplo por slug: `/api/navigation/render/main-menu`

### Query Parameters (opcionales)

- **`type`**: Define la estructura de la navegación
  - `FLAT`: Estructura plana (array simple)
  - `TREE`: Estructura anidada (por defecto)
  - Ejemplo: `?type=FLAT`

- **`menu`**: Booleano para incluir solo elementos del menú
  - `true`: Solo elementos adjuntos al menú
  - Ejemplo: `?menu=true`

- **`path`**: Filtrar elementos por ruta específica
  - Ejemplo: `?path=/home/about-us`

## Ejemplos de Uso

### 1. Obtener navegación completa (estructura anidada)

```typescript
import { fetchNavigation } from '@/lib/api';

// Por ID
const navigation = await fetchNavigation(1);

// Por slug
const navigation = await fetchNavigation('main-menu');
```

### 2. Obtener navegación en formato plano

```typescript
const navigation = await fetchNavigation('main-menu', {
    type: 'FLAT'
});
```

### 3. Obtener solo elementos del menú

```typescript
const navigation = await fetchNavigation('main-menu', {
    type: 'TREE',
    menu: true
});
```

### 4. Filtrar por ruta específica

```typescript
const navigation = await fetchNavigation('main-menu', {
    path: '/home/about-us'
});
```

## Ejemplo en un Componente React

```typescript
import { useEffect, useState } from 'react';
import { fetchNavigation, NavigationResponse } from '@/lib/api';

export default function NavigationComponent() {
    const [navigation, setNavigation] = useState<NavigationResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadNavigation() {
            const nav = await fetchNavigation('main-menu', {
                type: 'TREE'
            });
            setNavigation(nav);
            setLoading(false);
        }
        loadNavigation();
    }, []);

    if (loading) return <div>Cargando navegación...</div>;
    if (!navigation) return <div>No se pudo cargar la navegación</div>;

    return (
        <nav>
            <ul>
                {navigation.items.map((item) => (
                    <li key={item.id}>
                        <a href={item.path}>{item.title}</a>
                        {item.items && item.items.length > 0 && (
                            <ul>
                                {item.items.map((subItem) => (
                                    <li key={subItem.id}>
                                        <a href={subItem.path}>{subItem.title}</a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
}
```

## Ejemplo con SWR (Client-side)

```typescript
import useSWR from 'swr';
import { fetchNavigation, NavigationResponse } from '@/lib/api';
import { URL_DOMAIN } from '@/lib/globalConstants';

const fetcher = async (url: string): Promise<NavigationResponse | null> => {
    const response = await fetch(url);
    if (!response.ok) return null;
    return response.json();
};

export default function NavigationComponent() {
    const { data: navigation, error } = useSWR<NavigationResponse | null>(
        `${URL_DOMAIN}/api/navigation/render/main-menu?type=TREE`,
        fetcher
    );

    if (error) return <div>Error al cargar navegación</div>;
    if (!navigation) return <div>Cargando...</div>;

    return (
        <nav>
            {/* Renderizar navegación */}
        </nav>
    );
}
```

## Estructura de Respuesta

```typescript
interface NavigationResponse {
    id: number;
    name: string;
    slug: string;
    visible: boolean;
    items: NavigationItem[];
}

interface NavigationItem {
    id: number;
    title: string;
    type: string;
    path: string;
    externalPath?: string | null;
    uiRouterKey?: string | null;
    menuAttached?: boolean;
    order?: number;
    parent?: number | null;
    related?: {
        id: number;
        __typename: string;
        [key: string]: any;
    } | null;
    items?: NavigationItem[]; // Solo presente en tipo TREE
}
```

## Endpoints Completos

### REST API

- **Obtener navegación**: `GET /api/navigation/render/:idOrSlug`
- **Listar todas las navegaciones**: `GET /api/navigation`
- **Obtener una navegación específica**: `GET /api/navigation/:id`

### GraphQL

Si tienes GraphQL habilitado, también puedes usar:

```graphql
query {
  renderNavigation(idOrSlug: "main-menu", type: TREE) {
    id
    name
    slug
    visible
    items {
      id
      title
      path
      items {
        id
        title
        path
      }
    }
  }
}
```

## Notas Importantes

1. **Primero debes crear la navegación en Strapi**: Ve al panel de administración → Plugins → Navigation → Manage, y crea una nueva navegación.

2. **El slug o ID**: Una vez creada la navegación, puedes usar su ID numérico o el slug que le asignes.

3. **Permisos**: Asegúrate de que el endpoint esté accesible públicamente o que tengas los permisos necesarios configurados en Strapi.

4. **CORS**: Si consumes desde el frontend, asegúrate de que CORS esté configurado correctamente en `config/cors.ts` y `config/middlewares.ts`.

