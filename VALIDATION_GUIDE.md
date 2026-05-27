# Guía de Validación Runtime - Webfinix Frontend

## Preparación

1. **Instalar dependencias limpias**
   ```bash
   cd c:\Users\user\Documents\webfinix-1
   npm install
   ```

2. **Iniciar servidor de desarrollo**
   ```bash
   npm start
   ```
   El servidor iniciará en http://localhost:4200

3. **Abrir DevTools**
   - Presiona F12 o Ctrl+Shift+I
   - Pestaña Console
   - Pestaña Network
   - Pestaña Application (para localStorage/sessionStorage)

---

## 1. Validación de Build y Lint

### Verificar Build
```bash
ng build
```
**Esperado:** Build exitoso sin errores
**Si falla:** Revisar tsconfig.json y asegurar node_modules está instalado

### Verificar Lint
```bash
ng lint
```
**Esperado:** Sin errores críticos (warnings aceptables)
**Nota:** Los errores "Cannot find module" en el IDE son errores del language server, no del build real

---

## 2. Validación de Authentication Flow

### Login Exitoso
1. Navegar a http://localhost:4200/auth/login
2. Ingresar credenciales válidas
3. **Verificar:**
   - Redirect a dashboard
   - Console limpia (sin errores)
   - Network: POST /api/auth/login con status 200
   - Token almacenado en memoria (no localStorage)
   - Sidebar visible

### Login Fallido
1. Ingresar credenciales inválidas
2. **Verificar:**
   - Mensaje de error visible
   - No redirect
   - Console limpia

### Logout
1. Clic en botón logout en sidebar
2. **Verificar:**
   - Redirect a login
   - Token eliminado de memoria
   - Console limpia

### Token Refresh
1. Esperar 15 minutos (o modificar token expiration)
2. Hacer cualquier acción que requiera API
3. **Verificar:**
   - Token se refresca automáticamente
   - No hay redirect a login
   - Console limpia

---

## 3. Validación de Dashboard

### Carga Inicial
1. Navegar a http://localhost:4200/dashboard
2. **Verificar Console:**
   - Sin errores rojos
   - Sin warnings amarillos críticos
   - Loading spinner aparece y desaparece

3. **Verificar Network:**
   - GET /api/accounts con status 200
   - GET /api/personal-finance?page=1&limit=5 con status 200
   - No requests pending
   - No requests fallidos (status 4xx/5xx)

4. **Verificar UI:**
   - Stats cards muestran datos o "0"
   - Chart se renderiza o muestra estado vacío
   - Recent transactions list se muestra o estado vacío
   - No loading infinito

### Refresh de Página
1. Presionar F5
2. **Verificar:**
   - Dashboard carga correctamente
   - Usuario sigue autenticado
   - Console limpia
   - Network limpia

---

## 4. Validación de Profile

### Carga Inicial
1. Navegar a http://localhost:4200/user/profile
2. **Verificar Console:**
   - Sin errores
   - Loading spinner aparece y desaparece

3. **Verificar Network:**
   - GET /api/users/me con status 200
   - No requests pending

4. **Verificar UI:**
   - Formulario se llena con datos del usuario
   - No loading infinito

### Update Profile
1. Modificar nombre
2. Clic en "Guardar cambios"
3. **Verificar:**
   - PUT /api/users/me con status 200
   - Mensaje de éxito visible
   - Datos actualizados en UI
   - Console limpia

---

## 5. Validación de Transaction CRUD

### Transaction List
1. Navegar a http://localhost:4200/personal-finance
2. **Verificar Console:**
   - Sin errores
   - Loading spinner aparece y desaparece

3. **Verificar Network:**
   - GET /api/personal-finance con status 200
   - No requests pending

4. **Verificar UI:**
   - Lista se muestra o estado vacío
   - Paginación funciona
   - Filtering funciona

### Create Transaction
1. Clic en "Nueva transacción"
2. Llenar formulario con datos válidos
3. Clic en "Crear"
4. **Verificar:**
   - POST /api/personal-finance con status 200 o 201
   - Payload no tiene strings vacíos
   - Redirect a lista
   - Mensaje de éxito visible
   - Console limpia

### Edit Transaction
1. Clic en editar una transacción
2. Modificar datos
3. Clic en "Actualizar"
4. **Verificar:**
   - PUT /api/personal-finance/:id con status 200
   - Datos actualizados en UI
   - Console limpia

### Delete Transaction
1. Clic en eliminar una transacción
2. Confirmar en modal
3. **Verificar:**
   - DELETE /api/personal-finance/:id con status 200
   - Transacción removida de lista
   - Mensaje de éxito visible
   - Console limpia

---

## 6. Validación de Account CRUD

### Account List
1. Navegar a http://localhost:4200/accounts
2. **Verificar Console:**
   - Sin errores
   - Loading spinner aparece y desaparece

3. **Verificar Network:**
   - GET /api/accounts con status 200
   - No requests pending

4. **Verificar UI:**
   - Lista se muestra o estado vacío
   - Cards se renderizan correctamente

### Create Account
1. Clic en "Nueva Cuenta"
2. Llenar formulario
3. Clic en "Crear"
4. **Verificar:**
   - POST /api/accounts con status 200 o 201
   - Redirect a lista
   - Console limpia

### Delete Account
1. Clic en eliminar una cuenta
2. Confirmar
3. **Verificar:**
   - DELETE /api/accounts/:id con status 200
   - Cuenta removida de lista
   - Console limpia

---

## 7. Validación de Category CRUD

### Category List
1. Navegar a http://localhost:4200/categories
2. **Verificar Console:**
   - Sin errores
   - Loading spinner aparece y desaparece

3. **Verificar Network:**
   - GET /api/categories con status 200
   - No requests pending

### Create Category
1. Clic en "Nueva Categoría"
2. Llenar formulario
3. Clic en "Crear"
4. **Verificar:**
   - POST /api/categories con status 200
   - Console limpia

---

## 8. Validación de Sidebar

### Sidebar Expandido
1. **Verificar:**
   - Ancho completo (~250px)
   - Texto de navegación visible
   - Logout button con texto visible

### Sidebar Colapsado
1. Clic en botón de colapsar
2. **Verificar:**
   - Ancho 70px (NO 0px)
   - Solo iconos visibles
   - Texto oculto
   - Logout button con solo icono
   - NO overflow horizontal
   - NO scroll horizontal

### Logout Button
1. **Verificar:**
   - White-space: nowrap (no wrapping)
   - Overflow: hidden
   - Text-overflow: ellipsis
   - Padding correcto en estado colapsado

---

## 9. Validación de Error Handling

### 401 Unauthorized
1. Esperar expiración de token o eliminar token
2. Hacer cualquier acción
3. **Verificar:**
   - Redirect a login
   - Mensaje: "Tu sesión ha expirado"
   - Console limpia

### 403 Forbidden
1. Intentar acceder a ruta sin permisos
2. **Verificar:**
   - Mensaje: "No tienes permiso"
   - Console limpia

### 404 Not Found
1. Navegar a ruta inexistente
2. **Verificar:**
   - Mensaje: "El recurso solicitado no existe"
   - Console limpia

### 500 Server Error
1. Simular error del backend
2. **Verificar:**
   - Mensaje: "Error del servidor"
   - Console limpia

### Network Error
1. Desconectar internet
2. Intentar hacer acción
3. **Verificar:**
   - Mensaje: "No se pudo conectar al servidor"
   - Console limpia

---

## 10. Validación de Responsive Design

### Mobile (375px)
1. Abrir DevTools (F12)
2. Clic en icono de dispositivo móvil
3. Seleccionar iPhone SE o 375px
4. **Verificar:**
   - Sidebar colapsado por defecto
   - Menú hamburguesa visible
   - Tablas con scroll horizontal
   - Formularios usables
   - NO overflow horizontal en body
   - Botones touch-friendly (min 44px)

### Tablet (768px)
1. Seleccionar iPad o 768px
2. **Verificar:**
   - Sidebar adaptable
   - Tablas responsivas
   - Formularios usables
   - NO overflow horizontal

### Desktop (1440px)
1. Seleccionar Desktop o 1440px
2. **Verificar:**
   - Sidebar expandido
   - Layout óptimo
   - Todo visible sin scroll

### Overflow Horizontal
1. En cada viewport
2. **Verificar:**
   - NO scroll horizontal en body
   - NO elementos fuera de viewport
   - CSS `overflow-x: hidden` donde sea necesario

---

## 11. Validación de Performance

### Console Performance
1. Pestaña Performance en DevTools
2. Grabar carga de dashboard
3. **Verificar:**
   - Tiempo de carga < 3s
   - No long tasks (>50ms)
   - No memory leaks

### Memory Leaks
1. Pestaña Memory en DevTools
2. Tomar snapshot antes y después de navegar
3. **Verificar:**
   - No aumento significativo de memoria
   - No detached DOM nodes

---

## 12. Validación de Tests

### Ejecutar Tests
```bash
ng test
```
**Esperado:** Tests pasan
**Archivos críticos:**
- dashboard/main.spec.ts
- profile/profile.spec.ts
- transaction-list/transaction-list.spec.ts

---

## Checklist Final

Antes de considerar production-ready, confirma:

- [ ] Console limpia en todas las páginas
- [ ] Network limpia (sin requests pending)
- [ ] No errores 4xx/5xx inesperados
- [ ] Loading states funcionan correctamente
- [ ] No loading infinito
- [ ] Sidebar colapsa a 70px
- [ ] Logout button no tiene text wrapping
- [ ] CRUD operations funcionan
- [ ] Error handling funciona para todos los códigos
- [ ] Responsive design funciona en mobile/tablet/desktop
- [ ] No overflow horizontal
- [ ] ng build exitoso
- [ ] ng test exitoso
- [ ] Refresh de página funciona
- [ ] Token refresh funciona

---

## Reportar Resultados

Documenta cualquier problema encontrado:

**Página:** [nombre]
**Problema:** [descripción]
**Error en Console:** [copiar error]
**Error en Network:** [status, endpoint, response]
**Screenshot:** [si es posible]
