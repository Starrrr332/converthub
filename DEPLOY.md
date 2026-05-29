# Guía Rápida de Deploy

## 1. Instalar dependencias
```bash
cd converter-app
npm install
```

## 2. Ejutar en desarrollo
```bash
npm run dev
```
Esto abrirá la app en `http://localhost:5173`

## 3. Construir para producción
```bash
npm run build
```
Esto creará la carpeta `dist/` con los archivos optimizados.

## 4. Deploy a Cloudflare Pages

### Opción A: Via Dashboard (Recomendado)
1. Ir a https://dash.cloudflare.com
2. Click "Pages" → "Create a project"
3. Conectar repositorio de GitHub
4. Configurar:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Click "Save and Deploy"

### Opción B: Via CLI
```bash
# Instalar Wrangler CLI
npm install -g wrangler

# Login
wrangler login

# Deploy
wrangler pages deploy dist --project-name=converthub
```

## 5. Verificar
- Abrir URL de Cloudflare Pages
- Probar conversión de imágenes
- Verificar que funciona en móvil

## Variables de Entorno (opcional)
Para MercadoPago, crear archivo `.env`:
```
VITE_MERCADOPAGO_PUBLIC_KEY=tu_public_key
```

## Documentación completa
Ver carpeta `docs/` para documentación detallada.
