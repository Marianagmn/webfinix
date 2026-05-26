# 📋 PLAN DE ACCIÓN EJECUTABLE
## Roadmap Detallado - Semana 1

---

## ⏱️ TIMELINE

**Semana de Implementación:** 5 días laborales (40 horas)
- Día 1-2: Críticos (8 horas)
- Día 3-4: Altos (8 horas)  
- Día 5: Testing + Deploy (4 horas)
- Buffer: Imprevistos (20 horas)

---

## 📝 TAREAS POR PRIORIDAD

### 🔴 FASE 1: CORRECCIONES CRÍTICAS

#### **Tarea 1.1: Fix Transaction-Edit DTO Bug**
**Duración:** 1 hora  
**Responsable:** Frontend Developer  
**Bloqueador para:** Production deployment

##### Pasos:
1. Abrir archivo [src/app/components/personal-finance/transaction-edit/transaction-edit.ts](src/app/components/personal-finance/transaction-edit/transaction-edit.ts)
2. Ubicar método `onSubmit()` (~línea 75-150)
3. En la construcción del payload (alrededor de línea 130-140), cambiar:
   ```typescript
   // ANTES ❌
   const payload = {
     // ...
     categoriaId: raw.categoriaId || undefined,
     // ...
   };
   ```
   ```typescript
   // DESPUÉS ✅
   const payload = {
     // ...
     categoria: raw.categoriaId || undefined,
     // ...
   };
   ```
4. Verificar que NO hay otros usos incorrectos de `categoriaId` en el payload
5. Guardar archivo

##### Testing:
- [ ] Navegar a /personal-finance
- [ x ] Crear una transacción (debe funcionar)
- [ ] Editar esa transacción → cambiar categoría
- [ ] Guardar → Debe retornar 200 (no 422)
- [ ] Verificar en DB que categoria se actualizó

##### Criterio de Aceptación:
- ✅ PUT /api/personal-finance/:id retorna 200
- ✅ Cambios se persisten en BD

---

#### **Tarea 1.2: Create Business Guard**
**Duración:** 1.5 horas  
**Responsable:** Frontend Developer  
**Bloqueador para:** Business Finance feature

##### Pasos:

**A. Crear archivo guard:**
1. Crear archivo: `src/app/core/guards/business.guard.ts`
2. Copiar código de [SOLUCIONES_CONCRETAS.md > CRÍTICO #2](./SOLUCIONES_CONCRETAS.md)
3. Guardar

**B. Actualizar rutas:**
1. Abrir [src/app/app.routes.ts](src/app/app.routes.ts)
2. Buscar ruta `/business-finance`:
   ```typescript
   {
     path: 'business-finance',
     canActivate: [authGuard],  // ← Revisar
     loadChildren: () => import('./features/business-finance/business-finance.routes')
   }
   ```
3. Agregar import:
   ```typescript
   import { businessGuard } from './core/guards/business.guard';
   ```
4. Actualizar canActivate:
   ```typescript
   {
     path: 'business-finance',
     canActivate: [authGuard, businessGuard],  // ← Agregar businessGuard
     loadChildren: () => import('./features/business-finance/business-finance.routes')
   }
   ```
5. Guardar

##### Testing:
- [ ] Crear user TEST_USER sin businessId
- [ ] Login con TEST_USER
- [ ] Navegar a /business-finance
- [ ] Debe redirigir a /user/profile con toast "Configura tu negocio..."
- [ ] Crear user TEST_USER_2 CON businessId
- [ ] Login con TEST_USER_2
- [ ] Navegar a /business-finance
- [ ] Debe cargarse la lista de transacciones

##### Criterio de Aceptación:
- ✅ Usuario sin businessId → 403 error manejado elegantemente
- ✅ Usuario con businessId → acceso permitido
- ✅ Toast message claro

---

#### **Tarea 1.3: Standardize ApiResponse Structure**
**Duración:** 2 horas  
**Responsable:** Backend Developer  
**Bloqueador para:** Production deployment

##### Pasos:

**A. Backend - Estandarizar response.utils.js:**
1. Abrir [src/utils/response.utils.js](../Finix-1%20-%20copia/src/utils/response.utils.js)
2. Revisar todos los métodos: `success()`, `created()`, `paginated()`, `error()`, `noContent()`
3. Verificar que TODOS retornan estructura consistente:
   ```javascript
   {
     success: boolean,
     data?: T,
     message?: string,
     meta?: Record,
     code?: string  // Solo para errores
   }
   ```
4. Si no, actualizar según código en SOLUCIONES_CONCRETAS.md
5. Guardar

**B. Backend - Auditar todos los controllers:**
1. [src/controllers/personalFinance.controller.js](../Finix-1%20-%20copia/src/controllers/personalFinance.controller.js)
   - Buscar todos los `ApiResponse.success()`, `ApiResponse.created()`, etc.
   - Verificar que pasen estructura correcta
2. [src/controllers/businessFinance.controller.js](../Finix-1%20-%20copia/src/controllers/businessFinance.controller.js)
   - Mismo check
3. [src/controllers/auth.controller.js](../Finix-1%20-%20copia/src/controllers/auth.controller.js)
   - Mismo check
4. [src/controllers/account.controller.js](../Finix-1%20-%20copia/src/controllers/account.controller.js)
   - Mismo check

**C. Frontend - Actualizar tipos:**
1. Abrir [src/app/models/api-response.model.ts](src/app/models/api-response.model.ts)
2. Actualizar interfaces según SOLUCIONES_CONCRETAS.md
3. Guardar

##### Testing:
- [ ] Hacer GET /api/personal-finance
- [ ] Respuesta: `{ success: true, data: [...], meta: { page, limit, total } }`
- [ ] Hacer POST /api/personal-finance (crear transacción inválida)
- [ ] Respuesta: `{ success: false, message: '...', code: 'VALIDATION_ERROR' }`
- [ ] Toda estructura consistente

##### Criterio de Aceptación:
- ✅ Todas las responses usan estructura estándar
- ✅ Frontend puede parsear cualquier endpoint

---

#### **Tarea 1.4: Fix Personal Finance Pagination**
**Duración:** 1 hora  
**Responsable:** Frontend Developer  

##### Pasos:
1. Abrir [src/app/services/personal-finance.service.ts](src/app/services/personal-finance.service.ts)
2. Localizar método `getTransactions(filter?: TransactionFilter)`
3. Reemplazar con código mejorado de SOLUCIONES_CONCRETAS.md
4. Guardar

##### Testing:
- [ ] Frontend: GET /api/personal-finance?page=1&limit=20
- [ ] Backend retorna paginado correctamente
- [ ] Frontend pasa al siguiente parámetro: ?page=2&limit=20
- [ ] Funciona paginación

##### Criterio de Aceptación:
- ✅ Paginación funciona correctamente
- ✅ Filtros se aplican sin errores

---

### 🟡 FASE 2: CORRECCIONES ALTAS

#### **Tarea 2.1: Implement Soft Delete Restore UI**
**Duración:** 4 horas  
**Responsable:** Frontend Developer  

##### Pasos:

**A. Crear componente Trash:**
1. Crear ruta: `src/app/components/personal-finance/trash/`
2. Crear archivos:
   - `trash.ts` - Componente (copiar de SOLUCIONES_CONCRETAS.md)
   - `trash.html` - Template
   - `trash.css` - Estilos
3. Guardar

**B. Actualizar servicio:**
1. Abrir [src/app/services/personal-finance.service.ts](src/app/services/personal-finance.service.ts)
2. Agregar métodos de SOLUCIONES_CONCRETAS.md:
   - `getDeletedTransactions()`
   - `restoreTransaction(id)`
   - `permanentlyDeleteTransaction(id)`
3. Guardar

**C. Agregar rutas:**
1. Abrir [src/app/features/personal-finance/personal-finance.routes.ts](src/app/features/personal-finance/personal-finance.routes.ts)
2. Agregar ruta trash:
   ```typescript
   {
     path: 'trash',
     loadComponent: () => import('../../components/personal-finance/trash/trash').then(m => m.TransactionTrash)
   }
   ```

**D. Backend - Crear endpoints:**
1. [src/routes/personalFinance.routes.js](../Finix-1%20-%20copia/src/routes/personalFinance.routes.js)
   - Agregar `/restore` endpoint
   - Agregar `/permanent` endpoint
2. [src/controllers/personalFinance.controller.js](../Finix-1%20-%20copia/src/controllers/personalFinance.controller.js)
   - Implementar `restoreFinance()`
   - Implementar `permanentlyDeleteFinance()`

##### Testing:
- [ ] Crear transacción
- [ ] Soft-delete
- [ ] Navegar a /personal-finance/trash
- [ ] Ver transacción eliminada
- [ ] Click "Restore"
- [ ] Transacción vuelve a lista principal

##### Criterio de Aceptación:
- ✅ Usuarios pueden ver items eliminados
- ✅ Usuarios pueden restaurar

---

#### **Tarea 2.2: Implement Missing Business Finance Endpoints**
**Duración:** 2 horas  
**Responsable:** Backend Developer + Frontend Developer  

##### Endpoints a Implementar:
1. **POST /:id/reverse** - Reversar contabilización
2. **POST /:id/taxes/recalculate** - Recalcular impuestos

##### Backend Steps:
1. [src/routes/businessFinance.routes.js](../Finix-1%20-%20copia/src/routes/businessFinance.routes.js)
   - Agregar rutas según SOLUCIONES_CONCRETAS.md
2. [src/controllers/businessFinance.controller.js](../Finix-1%20-%20copia/src/controllers/businessFinance.controller.js)
   - Implementar lógica

##### Frontend Steps:
1. [src/app/services/business-finance.service.ts](src/app/services/business-finance.service.ts)
   - Agregar métodos `reverse()` y `recalculateTaxes()`
2. Componentes que consuman estos métodos

##### Testing:
- [ ] POST /api/business-finance/:id/reverse retorna 200
- [ ] POST /api/business-finance/:id/taxes/recalculate retorna 200

---

#### **Tarea 2.3: Improve Auth Interceptor - Add Timeout**
**Duración:** 1 hora  
**Responsable:** Frontend Developer  

##### Pasos:
1. Abrir [src/app/core/interceptors/auth.interceptor.ts](src/app/core/interceptors/auth.interceptor.ts)
2. Ubicar sección de refresh token (~línea 50-80)
3. Agregar `timeout()` operator:
   ```typescript
   return http
     .post<ApiResponse<{ accessToken: string; user: User }>>(
       `${environment.apiUrl}/auth/refresh`,
       {},
       { withCredentials: true }
     )
     .pipe(
       timeout(5000),  // ← AGREGAR: 5 segundos timeout
       switchMap((res) => {
         // ...
       }),
       catchError((refreshErr) => {
         // ...
       })
     );
   ```
4. Guardar

##### Import requerido:
```typescript
import { timeout } from 'rxjs';
```

##### Testing:
- [ ] Token expira
- [ ] Interceptor intenta refresh
- [ ] Si backend no responde en 5s → logout
- [ ] Usuario ve mensaje "Sesión expirada"

---

### 🟢 FASE 3: VALIDACIONES Y TESTING

#### **Tarea 3.1: Sync Password Validators**
**Duración:** 1.5 horas  
**Responsable:** Frontend Developer  

##### Pasos:
1. Backend password policy (ya existe en Zod):
   - Min 8 chars
   - Max 72 chars
   - Mayúsculas, minúsculas, números
2. Frontend - Crear validador custom:
   - Crear archivo: `src/app/core/validators/password.validator.ts`
   - Implementar según SOLUCIONES_CONCRETAS.md
3. Aplicar en componentes:
   - [src/app/components/user/change-password/change-password.ts](src/app/components/user/change-password/change-password.ts)
   - [src/app/components/auth/register/register.ts](src/app/components/auth/register/register.ts)
4. Guardar

##### Testing:
- [ ] Password < 8 chars → Error validación
- [ ] Password sin mayúscula → Error
- [ ] Password sin minúscula → Error
- [ ] Password sin número → Error
- [ ] Password válido → Acepta

---

#### **Tarea 3.2: Fix Account Balance - Cents vs Decimal**
**Duración:** 1 hora  
**Responsable:** Frontend Developer  

##### Pasos:
1. Abrir [src/app/services/account.service.ts](src/app/services/account.service.ts)
2. En método `createAccount()` y `updateAccount()`:
   ```typescript
   createAccount(data: CreateAccountDto) {
     // Backend espera balance en centavos
     const payload = {
       ...data,
       balance: data.balance * 100,  // ← Convertir a cents
     };
     return this.http.post(this.apiUrl, payload);
   }
   ```
3. En GET (cuando viene del backend):
   ```typescript
   getAccounts(): Observable<Account[]> {
     return this.http.get<Account[]>(this.apiUrl).pipe(
       map(accounts => accounts.map(acc => ({
         ...acc,
         balance: acc.balance / 100,  // ← Convertir de cents a decimal
       })))
     );
   }
   ```

---

#### **Tarea 3.3: Add Unit Tests - Core Services**
**Duración:** 3 horas  
**Responsable:** QA/Frontend Developer  

##### Tests requeridos:
1. `auth.service.spec.ts`
   - login()
   - register()
   - logout()
2. `personal-finance.service.spec.ts`
   - createTransaction()
   - getTransactions()
   - updateTransaction()
3. `business-finance.service.spec.ts`
   - createTransaction()
   - submitForApproval()
4. Guards:
   - auth.guard.spec.ts
   - business.guard.spec.ts

##### Comando:
```bash
ng generate service services/personal-finance --skip-tests=false
```

##### Criterio de Aceptación:
- ✅ 80%+ código coverage
- ✅ Todos los tests pasan

---

### 🔵 FASE 4: INTEGRATION & VALIDATION

#### **Tarea 4.1: End-to-End Testing**
**Duración:** 2 horas  
**Responsable:** QA  

##### Test Cases:

**Personal Finance Flow:**
- [ ] Login → Crear transacción → Editar → Deletar → Restaurar
- [ ] Aplicar filtros (tipo, fecha, etc.)
- [ ] Paginación funciona
- [ ] Analytics/Prediction retorna datos
- [ ] Rate limiting no afecta uso normal

**Business Finance Flow:**
- [ ] Login (usuario con businessId)
- [ ] Crear transacción empresarial
- [ ] Cambiar estado a "Pendiente Aprobación"
- [ ] Approver: Aprobar transacción
- [ ] Contador: Contabilizar (post)
- [ ] Verificar cambios se persisten

**Auth Flow:**
- [ ] Register → Verify email → Login
- [ ] Change password
- [ ] Logout → Verify session cleared

---

#### **Tarea 4.2: Performance Testing**
**Duración:** 1 hora  
**Responsable:** DevOps  

##### Checks:
- [ ] Endpoint /personal-finance?page=1&limit=100 → < 500ms
- [ ] Endpoint /analysis → < 1000ms (incluida cache)
- [ ] Login → < 300ms
- [ ] Frontend bundle size < 500KB

---

#### **Tarea 4.3: Security Audit**
**Duración:** 1 hora  
**Responsable:** Security Engineer  

##### Checks:
- [ ] JWT tokens solo en memory (not localStorage)
- [ ] httpOnly cookies configuradas
- [ ] CORS whitelist correcto
- [ ] CSRF token implementado (si required)
- [ ] Inputs sanitizados contra XSS
- [ ] Rate limiting activo

---

### 🚀 FASE 5: DEPLOYMENT

#### **Tarea 5.1: Pre-Production Checklist**
**Duración:** 1 hora  
**Responsable:** DevOps/Tech Lead  

- [ ] Todas las correcciones críticas ✅
- [ ] Unit tests pasen ✅
- [ ] E2E tests pasen ✅
- [ ] Security audit completado ✅
- [ ] Performance acceptable ✅
- [ ] Environment variables configuradas ✅
- [ ] Database backups configurados ✅
- [ ] Monitoring/Alerting setup ✅
- [ ] Documentation actualizada ✅
- [ ] Team capacity para soporte ✅

#### **Tarea 5.2: Production Deployment**
**Duración:** 1 hora  
**Responsable:** DevOps  

```bash
# Backend
cd Finix-1
npm run build
npm run migrate  # Si hay migrations
npm start

# Frontend
cd webfinix
npm run build
# Servir dist/ con nginx/apache
```

---

## 📊 TRACKING & MONITORING

### Daily Standup Template
```
## Day X - Standup

### Completed ✅
- [ ] Tarea 1.1: Fix Transaction-Edit DTO
- [ ] Tarea 1.2: Create Business Guard

### In Progress 🔄
- [ ] Tarea 1.3: Standardize ApiResponse

### Blocked 🚫
- [ ] None

### Notes
- Descubrimiento X...
- Riesgo Y...

### ETA for Go-Live
- Críticos: ✅ (Día 1-2)
- Altos: 🔄 (Día 3)
- Testing: 📋 (Día 4)
```

---

## 📞 ESCALATION CONTACTS

### Si encuentras problemas:

| Problema | Contacto | Slack |
|----------|----------|-------|
| Backend API issue | Backend Lead | #backend-ops |
| Frontend bug | Frontend Lead | #frontend-support |
| Database issue | DevOps | #devops-alerts |
| Deployment blocker | Tech Lead | #critical-issues |

---

## ✅ SIGN-OFF

- [ ] Tech Lead: Reviewed and approved
- [ ] QA Lead: Testing plan acknowledged
- [ ] DevOps: Deployment ready
- [ ] Product: Feature complete

**Go-Live Date:** [Llenar con fecha]  
**Rollback Plan:** [Preparar antes de ir a producción]

---

Fin del Plan de Acción Ejecutable.
