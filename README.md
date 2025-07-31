# PetHelp Frontend

Frontend para el sistema de registro de perros PetHelp.

## Características

- 📊 Dashboard con estadísticas de perros por raza, edad, tamaño y género
- 🔐 Sistema de autenticación (login/registro)
- 🐕 Formulario para registrar nuevos perros (solo usuarios autenticados)
- 📈 Gráficos interactivos usando Chart.js
- 🎨 Diseño moderno y responsive

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar el servidor de desarrollo:
```bash
npm start
```

La aplicación se abrirá en [http://localhost:3000](http://localhost:3000).

## Tecnologías utilizadas

- React 18
- TypeScript
- Chart.js con react-chartjs-2
- Axios para llamadas a la API
- CSS personalizado

## Estructura del proyecto

```
src/
├── components/          # Componentes React
│   ├── AuthModal.tsx   # Modal de autenticación
│   ├── Dashboard.tsx   # Dashboard principal
│   └── Header.tsx      # Header con navegación
├── contexts/           # Contextos de React
│   └── AuthContext.tsx # Contexto de autenticación
├── services/           # Servicios para API
│   ├── api.ts         # Configuración base de axios
│   ├── DistritoService.ts
│   ├── PerroService.ts
│   ├── RazaService.ts
│   └── UsuarioService.ts
├── App.tsx            # Componente principal
├── index.tsx          # Punto de entrada
└── index.css          # Estilos globales
```

## API Endpoints utilizados

- `GET /api/perros` - Obtener todos los perros
- `POST /api/perros` - Crear nuevo perro
- `GET /api/razas` - Obtener todas las razas
- `GET /api/distritos` - Obtener todos los distritos
- `GET /api/usuarios` - Obtener todos los usuarios
- `POST /api/usuarios` - Crear nuevo usuario

## Funcionalidades

### Dashboard público
- Visualización de estadísticas generales
- Gráfico de pie para perros por raza
- Gráfico de barras para categorías de edad
- Gráfico de barras para perros por tamaño
- Gráfico de pie para perros por género

### Funcionalidades para usuarios autenticados
- Formulario completo para registrar nuevos perros
- Campos: nombre, raza, distrito, tamaño, comportamiento, color, género, edad, vacunación, esterilización, dirección
- Validación de formularios
- Actualización automática de estadísticas

### Autenticación
- Login con email y contraseña
- Registro de nuevos usuarios
- Persistencia de sesión
- Cerrar sesión

## Notas

- El backend debe estar ejecutándose en `http://localhost:8080`
- La aplicación está configurada para conectarse al backend Spring Boot
- Los datos se obtienen en tiempo real desde la base de datos
