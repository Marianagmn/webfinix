# Guía Senior para Copilot Chat — Web Finix
**Objetivo:** Implementar Web Finix a nivel production-ready integrando con el backend Finix  
**Herramienta:** GitHub Copilot Chat en VS Code  
**Cómo usar esta guía:** Abre Copilot Chat (`Ctrl+Shift+I`), selecciona el modo **Agent** y pega cada prompt en orden. Si el archivo/carpeta ya existe, Copilot lo detecta y solo aplica cambios faltantes.

---

> **REGLA GLOBAL para Copilot**  
> Antes de pegar cualquier prompt, abre Copilot Chat en modo **Agent** (`@workspace`).  
> Cada prompt es autónomo: incluye todo el contexto necesario.  
> Si Copilot pide confirmación para crear archivos, responde **"Yes to all"**.

---

## FASE 0 — Contexto global del proyecto
**Pegar UNA SOLA VEZ al inicio de cada sesión de Copilot**

```
@workspace Eres un Senior Angular Engineer implementando Web Finix, un frontend Angular 21 
que se conecta al backend Finix (Node.js + Express + MongoDB).

Contexto del backend Finix:
- Base URL local: http://localhost:3000
- Todas las respuestas exitosas siguen el contrato: { success: true, data: T, meta: { timestamp, requestId, pagination? }, message? }
- Todos los errores siguen: { success: false, code: string, message: string }
- Auth: JWT Bearer token en Authorization header. Access token (15min), refresh via cookie httpOnly
- Endpoints disponibles:
  POST   /api/auth/register      → { accessToken, refreshToken, user }
  POST   /api/auth/login         → { accessToken, refreshToken, user }
  POST   /api/auth/refresh       → { accessToken, refreshToken, user }
  POST   /api/auth/logout        → void
  GET    /api/auth/me            → { user }
  GET    /api/users/me           → { user }
  PATCH  /api/users/me           → { user }
  PATCH  /api/users/me/password  → void
  DELETE /api/users/me           → void
  GET    /api/accounts           → Account[]
  POST   /api/accounts           → Account
  GET    /api/accounts/:id       → Account
  PUT    /api/accounts/:id       → Account
  DELETE /api/accounts/:id       → void (204)
  GET    /api/categories         → Category[]
  POST   /api/categories         → Category
  PUT    /api/categories/:id     → Category
  DELETE /api/categories/:id     → void (204)
  GET    /api/personal-finance               → PaginatedResponse<Transaction>
  POST   /api/personal-finance              → Transaction
  GET    /api/personal-finance/:id          → Transaction
  PUT    /api/personal-finance/:id          → Transaction
  DELETE /api/personal-finance/:id          → void (204)
  GET    /api/personal-finance/analysis     → AnalysisData
  GET    /api/personal-finance/prediction   → PredictionData
  GET    /api/personal-finance/simulation   → SimulationData
  GET    /api/business-finance              → PaginatedResponse<BusinessTransaction>
  POST   /api/business-finance             → BusinessTransaction
  GET    /api/business-finance/:id         → BusinessTransaction
  PUT    /api/business-finance/:id         → BusinessTransaction
  DELETE /api/business-finance/:id         → void (204)
  POST   /api/business-finance/:id/submit  → BusinessTransaction
  POST   /api/business-finance/:id/approve → BusinessTransaction (requiere rol: aprobador)
  POST   /api/business-finance/:id/reject  → BusinessTransaction (requiere rol: aprobador)
  POST   /api/business-finance/:id/post    → BusinessTransaction (requiere rol: contador)
  POST   /api/business-finance/:id/reverse → BusinessTransaction (requiere rol: contador)
  POST   /api/business-finance/:id/payments → BusinessTransaction
  GET    /api/business-finance/approvals/pending → BusinessTransaction[]
  GET    /api/business-finance/overdue/:tipo     → BusinessTransaction[]

Roles de usuario: 'user' | 'admin' | 'superadmin' | 'aprobador' | 'contador'

Reglas de código que SIEMPRE debes seguir:
1. Cero tipos `any` — todo tipado estrictamente
2. Componentes standalone (no NgModules)
3. Signals para estado local, Observables para HTTP
4. takeUntilDestroyed() en todas las suscripciones manuales
5. Control flow moderno: @if, @for, @switch (NO *ngIf, *ngFor)
6. Reactive Forms con validadores tipados
7. Inyección con inject() no con constructor DI
8. Lazy loading en todas las rutas de features
9. Sin console.log en código fuente
10. Inglés para nombres de variables/métodos, Español para textos de UI
```

---

## FASE 1 — Configuración base (Sin esto, nada funciona)

### Prompt 1.1 — Environments
```
@workspace Crea los archivos de environments que no existen. Si ya existen, verifica que tengan 
el contenido correcto y corrígelos.

Archivo: src/environments/environment.ts
Contenido exacto:
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  appName: 'Finix',
  version: '1.0.0',
};

Archivo: src/environments/environment.prod.ts
Contenido exacto:
export const environment = {
  production: true,
  apiUrl: 'https://api.finix.tudominio.com',
  appName: 'Finix',
  version: '1.0.0',
};

Si los archivos ya existen con contenido diferente, muéstrame el diff antes de aplicar.
```

### Prompt 1.2 — Proxy corregido
```
@workspace Corrige el archivo proxy.conf.json. El archivo actual tiene una ruta incorrecta 
(/api/finix) que no coincide con el backend Finix que expone /api.

Reemplaza el contenido completo de proxy.conf.json con:
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": {}
  }
}

Luego abre angular.json y dentro de "serve" > "options" añade la propiedad:
"proxyConfig": "proxy.conf.json"

Verifica que quede dentro de la configuración "development" del servidor.
```

### Prompt 1.3 — index.html y styles globales
```
@workspace Realiza estos dos cambios:

1. En src/index.html cambia lang="en" por lang="es" y actualiza el title a "Finix — 
   Gestión Financiera Inteligente". Agrega estas meta tags en el <head> si no existen:
   <meta name="description" content="Plataforma de gestión financiera personal y empresarial">
   <meta name="theme-color" content="#1a73e8">

2. Reemplaza el contenido de src/styles.css con:

@import 'bootstrap/dist/css/bootstrap.min.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';
@import 'ngx-toastr/toastr.css';

:root {
  --finix-primary: #1a73e8;
  --finix-primary-dark: #1557b0;
  --finix-primary-light: #e8f0fe;
  --finix-success: #34a853;
  --finix-danger: #ea4335;
  --finix-warning: #fbbc04;
  --finix-info: #4285f4;
  --finix-surface: #ffffff;
  --finix-bg: #f8f9fa;
  --finix-bg-dark: #f1f3f4;
  --finix-text: #202124;
  --finix-text-muted: #5f6368;
  --finix-border: #dadce0;
  --finix-shadow: 0 1px 3px rgba(60,64,67,.3), 0 4px 8px rgba(60,64,67,.15);
  --finix-shadow-hover: 0 1px 3px rgba(60,64,67,.4), 0 8px 16px rgba(60,64,67,.2);
  --finix-radius: 8px;
  --finix-radius-lg: 12px;
  --sidebar-width: 260px;
  --navbar-height: 64px;
  --transition: 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

*, *::before, *::after { box-sizing: border-box; }

body {
  font-family: 'Google Sans', 'Segoe UI', system-ui, -apple-system, sans-serif;
  background-color: var(--finix-bg);
  color: var(--finix-text);
  margin: 0;
  -webkit-font-smoothing: antialiased;
}

a { color: var(--finix-primary); text-decoration: none; }
a:hover { text-decoration: underline; }

/* Bootstrap overrides */
.btn-primary {
  background-color: var(--finix-primary);
  border-color: var(--finix-primary);
}
.btn-primary:hover, .btn-primary:focus {
  background-color: var(--finix-primary-dark);
  border-color: var(--finix-primary-dark);
}

.card {
  border: 1px solid var(--finix-border);
  border-radius: var(--finix-radius-lg);
  box-shadow: var(--finix-shadow);
  transition: box-shadow var(--transition);
}
.card:hover { box-shadow: var(--finix-shadow-hover); }

.form-control:focus, .form-select:focus {
  border-color: var(--finix-primary);
  box-shadow: 0 0 0 3px var(--finix-primary-light);
}

/* Utility classes */
.text-income  { color: var(--finix-success) !important; }
.text-expense { color: var(--finix-danger) !important; }
.text-transfer { color: var(--finix-info) !important; }

.badge-income   { background-color: #e6f4ea; color: var(--finix-success); }
.badge-expense  { background-color: #fce8e6; color: var(--finix-danger); }
.badge-transfer { background-color: #e8f0fe; color: var(--finix-info); }

/* Loading skeleton */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}
@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Scroll */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--finix-border); border-radius: 3px; }
```

### Prompt 1.4 — app.config.ts corregido
```
@workspace Reemplaza COMPLETAMENTE el contenido de src/app/app.config.ts con la versión 
correcta. El archivo actual está incompleto: le falta provideHttpClient, los interceptores 
y las animaciones para que ngx-toastr funcione.

El nuevo contenido debe ser exactamente este:

import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideAnimations(),
    provideToastr({
      timeOut: 3500,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
    }),
  ],
};

Los archivos authInterceptor y errorInterceptor serán creados en prompts posteriores.
Por ahora crea los imports como comentarios o como stubs si TypeScript los requiere para compilar.
```

---

## FASE 2 — Modelos TypeScript (Contratos del API)

### Prompt 2.1 — Modelos de API y respuesta genérica
```
@workspace Crea el archivo src/app/models/api-response.model.ts con este contenido exacto.
Si la carpeta models no existe, créala.

// src/app/models/api-response.model.ts
// Contrato de respuesta del backend Finix — NO modificar sin sincronizar con el backend

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta: ApiMeta;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  message?: string;
  meta: ApiMeta & { pagination: PaginationMeta };
}

export interface ApiMeta {
  timestamp: string;
  requestId?: string;
  pagination?: PaginationMeta;
  [key: string]: unknown;
}

export interface PaginationMeta {
  type: 'offset' | 'cursor';
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextCursor?: string;
}

export interface ApiError {
  success: false;
  code: string;
  message: string;
  meta?: ApiMeta;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;
```

### Prompt 2.2 — Modelo de autenticación y usuario
```
@workspace Crea src/app/models/auth.model.ts y src/app/models/user.model.ts.
Si existen, verifica que el contenido sea correcto y reemplázalos si difieren.

// src/app/models/user.model.ts
export type UserRole = 'user' | 'admin' | 'superadmin' | 'aprobador' | 'contador';

export interface User {
  id: string;
  name?: string;
  email: string;
  roles: UserRole[];
  provider: 'local' | 'google' | 'github';
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface UpdateProfileDto {
  name?: string;
  email?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

// src/app/models/auth.model.ts
import { User } from './user.model';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name?: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface JwtPayload {
  userId: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
  type: 'access' | 'refresh';
}
```

### Prompt 2.3 — Modelos financieros
```
@workspace Crea los siguientes archivos de modelos en src/app/models/.
Estos modelos reflejan exactamente los schemas del backend Finix.

--- Archivo: src/app/models/account.model.ts ---

export type AccountType = 'efectivo' | 'ahorro' | 'corriente' | 'credito' | 'inversion';
export type Currency = 'COP' | 'USD' | 'EUR';

export interface Account {
  id: string;
  userId: string;
  nombre: string;
  tipo: AccountType;
  moneda: Currency;
  balance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountDto {
  nombre: string;
  tipo: AccountType;
  moneda?: Currency;
  balance?: number;
}

export type UpdateAccountDto = Partial<CreateAccountDto>;

--- Archivo: src/app/models/category.model.ts ---

import { TransactionType } from './transaction.model';

export interface Category {
  id: string;
  userId: string;
  nombre: string;
  tipo: TransactionType;
  color?: string;
  icono?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  nombre: string;
  tipo: TransactionType;
  color?: string;
  icono?: string;
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>;

--- Archivo: src/app/models/transaction.model.ts ---

import { Category } from './category.model';

export type TransactionType = 'ingreso' | 'gasto' | 'transferencia';
export type TransactionStatus = 'pendiente' | 'completado' | 'cancelado';
export type PaymentMethod =
  | 'efectivo'
  | 'transferencia'
  | 'tarjeta_credito'
  | 'tarjeta_debito'
  | 'cheque'
  | 'otro';

export interface Transaction {
  id: string;
  userId: string;
  tipo: TransactionType;
  monto: number;
  moneda: 'COP' | 'USD' | 'EUR';
  tasaCambio: number;
  categoria: Category | string;
  cuentaOrigenId?: string;
  cuentaDestinoId?: string;
  metodoPago: PaymentMethod;
  descripcion?: string;
  fecha: string;
  estado: TransactionStatus;
  esAhorro: boolean;
  tags: string[];
  source: 'manual' | 'ia' | 'importado';
  aiMetadata?: TransactionAiMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionAiMetadata {
  clasificacion?: {
    categoriaSugerida?: string;
    confianza?: number;
  };
  analisis?: {
    patronDetectado?: string;
    alerta?: string;
  };
  predicciones?: {
    gastoMensual?: number;
  };
}

export interface CreateTransactionDto {
  tipo: TransactionType;
  monto: number;
  moneda?: 'COP' | 'USD' | 'EUR';
  categoriaId: string;
  cuentaOrigenId?: string;
  cuentaDestinoId?: string;
  metodoPago?: PaymentMethod;
  descripcion?: string;
  fecha?: string;
  estado?: TransactionStatus;
  esAhorro?: boolean;
  tags?: string[];
}

export type UpdateTransactionDto = Partial<CreateTransactionDto>;

export interface TransactionFilter {
  page?: number;
  limit?: number;
  tipo?: TransactionType;
  estado?: TransactionStatus;
  categoriaId?: string;
  cuentaOrigenId?: string;
  cuentaDestinoId?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  montoMin?: number;
  montoMax?: number;
  sortBy?: 'fecha' | 'monto' | 'createdAt';
  order?: 'asc' | 'desc';
}

--- Archivo: src/app/models/business-finance.model.ts ---

export type BusinessTransactionType =
  | 'ingreso' | 'gasto' | 'transferencia'
  | 'factura_venta' | 'factura_compra'
  | 'nota_credito' | 'nota_debito'
  | 'nomina' | 'activo_fijo'
  | 'provision' | 'ajuste_contable'
  | 'anticipo' | 'devolucion';

export type BusinessTransactionStatus =
  | 'borrador' | 'pendiente_aprobacion' | 'aprobado'
  | 'rechazado' | 'contabilizado' | 'completado'
  | 'revertido' | 'anulado' | 'en_disputa';

export interface BusinessTransaction {
  id: string;
  businessId: string;
  tipo: BusinessTransactionType;
  estado: BusinessTransactionStatus;
  monto: number;
  moneda: string;
  descripcion?: string;
  fecha: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBusinessTransactionDto {
  tipo: BusinessTransactionType;
  monto: number;
  moneda?: string;
  descripcion?: string;
  fecha?: string;
}

export type UpdateBusinessTransactionDto = Partial<CreateBusinessTransactionDto>;

--- Archivo: src/app/models/analytics.model.ts ---

export interface AnalysisData {
  totalIngresos: number;
  totalGastos: number;
  balance: number;
  porCategoria: CategorySummary[];
  porMes: MonthlySummary[];
  tendencia: 'positiva' | 'negativa' | 'estable';
}

export interface CategorySummary {
  categoria: string;
  total: number;
  porcentaje: number;
  count: number;
}

export interface MonthlySummary {
  mes: string;
  ingresos: number;
  gastos: number;
  balance: number;
}

export interface PredictionData {
  gastoEstimadoProximoMes: number;
  ingresoEstimadoProximoMes: number;
  categoriasMayorGasto: CategorySummary[];
  alertas: string[];
  confianza: number;
}

export interface SimulationData {
  escenarios: SimulationScenario[];
}

export interface SimulationScenario {
  nombre: string;
  descripcion: string;
  proyeccion: MonthlySummary[];
  balanceFinal: number;
}

--- Archivo: src/app/models/index.ts ---
// Re-exporta todos los modelos para imports limpios
export * from './api-response.model';
export * from './user.model';
export * from './auth.model';
export * from './account.model';
export * from './category.model';
export * from './transaction.model';
export * from './business-finance.model';
export * from './analytics.model';
```

---

## FASE 3 — Store de autenticación

### Prompt 3.1 — AuthStore con Angular Signals
```
@workspace Crea el archivo src/app/store/auth.store.ts.
Si la carpeta store no existe, créala.
Este store gestiona el estado global de autenticación usando Angular Signals.

import { Injectable, computed, signal } from '@angular/core';
import { User, UserRole } from '../models/user.model';
import { JwtPayload } from '../models/auth.model';

const TOKEN_KEY = 'finix_access_token';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _token = signal<string | null>(this._loadToken());
  private readonly _currentUser = signal<User | null>(this._decodeUser(this._loadToken()));

  // ── Señales públicas (read-only) ──────────────────────────────────────────
  readonly token = this._token.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();

  // ── Señales derivadas (computed) ──────────────────────────────────────────
  readonly isAuthenticated = computed(
    () => !!this._token() && !this._isTokenExpired(this._token())
  );

  readonly userRoles = computed(() => this._currentUser()?.roles ?? []);

  readonly isAdmin = computed(() =>
    this.userRoles().some((r) => r === 'admin' || r === 'superadmin')
  );

  readonly isAprobador = computed(() =>
    this.userRoles().some((r) =>
      (['admin', 'superadmin', 'aprobador'] as UserRole[]).includes(r)
    )
  );

  readonly isContador = computed(() =>
    this.userRoles().some((r) =>
      (['admin', 'superadmin', 'contador'] as UserRole[]).includes(r)
    )
  );

  readonly displayName = computed(
    () => this._currentUser()?.name ?? this._currentUser()?.email ?? 'Usuario'
  );

  // ── Mutaciones ────────────────────────────────────────────────────────────

  setAuth(token: string, user: User): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // Entorno sin localStorage (SSR o modo privado estricto)
    }
    this._token.set(token);
    this._currentUser.set(user);
  }

  updateUser(user: User): void {
    this._currentUser.set(user);
  }

  clearAuth(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // silencioso
    }
    this._token.set(null);
    this._currentUser.set(null);
  }

  hasRole(...roles: UserRole[]): boolean {
    return roles.some((r) => this.userRoles().includes(r));
  }

  // ── Helpers privados ──────────────────────────────────────────────────────

  private _loadToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  private _decodeUser(token: string | null): User | null {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1])) as JwtPayload;
      if (this._isTokenExpired(token)) return null;
      // Reconstruir User mínimo desde el payload del JWT
      return {
        id: payload.userId,
        email: payload.email,
        roles: payload.roles as UserRole[],
        provider: 'local',
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date(payload.iat * 1000).toISOString(),
      };
    } catch {
      return null;
    }
  }

  private _isTokenExpired(token: string | null): boolean {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as JwtPayload;
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
```

---

## FASE 4 — Infraestructura Core

### Prompt 4.1 — Interceptor de autenticación
```
@workspace Crea el archivo src/app/core/interceptors/auth.interceptor.ts.
Si las carpetas core/ o interceptors/ no existen, créalas.

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../../store/auth.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const token = authStore.token();

  // No añadir token en rutas públicas de auth
  const isAuthRoute =
    req.url.includes('/api/auth/login') ||
    req.url.includes('/api/auth/register') ||
    req.url.includes('/api/auth/refresh');

  if (!token || isAuthRoute) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
```

### Prompt 4.2 — Interceptor de errores
```
@workspace Crea el archivo src/app/core/interceptors/error.interceptor.ts.

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from '../../store/auth.store';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const authStore = inject(AuthStore);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Extraer mensaje del backend si existe
      const backendMessage: string =
        error.error?.message ?? error.message ?? 'Error desconocido';

      switch (error.status) {
        case 401:
          // Solo redirigir si no es el intento de login en sí
          if (!req.url.includes('/auth/login') && !req.url.includes('/auth/register')) {
            authStore.clearAuth();
            router.navigate(['/auth/login'], {
              queryParams: { returnUrl: router.url },
            });
            toastr.warning('Tu sesión expiró. Por favor inicia sesión nuevamente.');
          }
          break;

        case 403:
          toastr.error('No tienes permisos para realizar esta acción.');
          if (!router.url.includes('/dashboard')) {
            router.navigate(['/dashboard']);
          }
          break;

        case 404:
          toastr.error(backendMessage || 'El recurso no fue encontrado.');
          break;

        case 409:
          // Conflicto (email ya registrado, nombre duplicado, etc.)
          toastr.error(backendMessage);
          break;

        case 429:
          toastr.warning('Demasiadas solicitudes. Espera un momento e intenta de nuevo.');
          break;

        case 0:
          // Sin conexión o CORS
          toastr.error('Sin conexión al servidor. Verifica tu internet.');
          break;

        default:
          if (error.status >= 500) {
            toastr.error('Error del servidor. Intenta nuevamente en unos momentos.');
          }
      }

      return throwError(() => error);
    })
  );
};
```

### Prompt 4.3 — Guards de ruta
```
@workspace Crea los archivos de guards en src/app/core/guards/.
Si la carpeta no existe, créala. Reemplaza el guard actual (que siempre retorna true).

--- Archivo: src/app/core/guards/auth.guard.ts ---
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../../store/auth.store';

export const authGuard: CanActivateFn = (_route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url },
  });
};

--- Archivo: src/app/core/guards/public.guard.ts ---
// Redirige a dashboard si ya está autenticado (para login/register)
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../../store/auth.store';

export const publicGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};

--- Archivo: src/app/core/guards/role.guard.ts ---
// Guard de roles para rutas de aprobador/contador
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../../store/auth.store';
import { UserRole } from '../../models/user.model';

export const roleGuard = (...requiredRoles: UserRole[]): CanActivateFn =>
  () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    if (authStore.hasRole(...requiredRoles)) {
      return true;
    }

    return router.createUrlTree(['/dashboard']);
  };

Asegúrate de que el archivo original src/app/guards/auth-guard.ts también quede 
actualizado o sea reemplazado por el nuevo para evitar conflictos de importación.
```

---

## FASE 5 — Servicios HTTP

### Prompt 5.1 — AuthService
```
@workspace Reemplaza el contenido de src/app/services/auth.ts con la implementación 
completa. Renombra la clase de Auth a AuthService para seguir la convención de Angular.

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthStore } from '../store/auth.store';
import { ApiResponse } from '../models/api-response.model';
import {
  AuthResponse,
  LoginDto,
  RegisterDto,
} from '../models/auth.model';
import { User, UpdateProfileDto, ChangePasswordDto } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private readonly authUrl = `${environment.apiUrl}/api/auth`;
  private readonly usersUrl = `${environment.apiUrl}/api/users`;

  login(dto: LoginDto): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.authUrl}/login`, dto)
      .pipe(
        tap((res) => {
          if (res.success) {
            this.authStore.setAuth(res.data.accessToken, res.data.user);
          }
        })
      );
  }

  register(dto: RegisterDto): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.authUrl}/register`, dto)
      .pipe(
        tap((res) => {
          if (res.success) {
            this.authStore.setAuth(res.data.accessToken, res.data.user);
          }
        })
      );
  }

  logout(): Observable<ApiResponse<null>> {
    return this.http
      .post<ApiResponse<null>>(`${this.authUrl}/logout`, {})
      .pipe(tap(() => this.authStore.clearAuth()));
  }

  refreshTokens(): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.authUrl}/refresh`, {})
      .pipe(
        tap((res) => {
          if (res.success) {
            this.authStore.setAuth(res.data.accessToken, res.data.user);
          }
        })
      );
  }

  getMe(): Observable<ApiResponse<User>> {
    return this.http
      .get<ApiResponse<User>>(`${this.authUrl}/me`)
      .pipe(
        tap((res) => {
          if (res.success) this.authStore.updateUser(res.data);
        })
      );
  }

  updateProfile(dto: UpdateProfileDto): Observable<ApiResponse<User>> {
    return this.http
      .patch<ApiResponse<User>>(`${this.usersUrl}/me`, dto)
      .pipe(
        tap((res) => {
          if (res.success) this.authStore.updateUser(res.data);
        })
      );
  }

  changePassword(dto: ChangePasswordDto): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(
      `${this.usersUrl}/me/password`,
      dto
    );
  }

  deleteAccount(): Observable<ApiResponse<void>> {
    return this.http
      .delete<ApiResponse<void>>(`${this.usersUrl}/me`)
      .pipe(tap(() => this.authStore.clearAuth()));
  }
}
```

### Prompt 5.2 — Servicios de datos (Account, Category, PersonalFinance)
```
@workspace Reemplaza el contenido de los tres servicios existentes. 
Todos deben renombrar su clase agregando "Service" al nombre.

--- Archivo: src/app/services/account.ts — clase: AccountService ---

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Account, CreateAccountDto, UpdateAccountDto } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/accounts`;

  getAll(): Observable<ApiResponse<Account[]>> {
    return this.http.get<ApiResponse<Account[]>>(this.baseUrl);
  }

  getById(id: string): Observable<ApiResponse<Account>> {
    return this.http.get<ApiResponse<Account>>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateAccountDto): Observable<ApiResponse<Account>> {
    return this.http.post<ApiResponse<Account>>(this.baseUrl, dto);
  }

  update(id: string, dto: UpdateAccountDto): Observable<ApiResponse<Account>> {
    return this.http.put<ApiResponse<Account>>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

--- Archivo: src/app/services/category.ts — clase: CategoryService ---

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../models/category.model';
import { TransactionType } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/categories`;

  getAll(tipo?: TransactionType): Observable<ApiResponse<Category[]>> {
    const params = tipo ? new HttpParams().set('tipo', tipo) : undefined;
    return this.http.get<ApiResponse<Category[]>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateCategoryDto): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(this.baseUrl, dto);
  }

  update(id: string, dto: UpdateCategoryDto): Observable<ApiResponse<Category>> {
    return this.http.put<ApiResponse<Category>>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

--- Archivo: src/app/services/personal-finance.ts — clase: PersonalFinanceService ---

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionFilter,
} from '../models/transaction.model';
import { AnalysisData, PredictionData, SimulationData } from '../models/analytics.model';

@Injectable({ providedIn: 'root' })
export class PersonalFinanceService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/personal-finance`;

  getAll(filter: TransactionFilter = {}): Observable<PaginatedResponse<Transaction>> {
    const cleanFilter = Object.fromEntries(
      Object.entries(filter).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ) as Record<string, string>;
    const params = new HttpParams({ fromObject: cleanFilter });
    return this.http.get<PaginatedResponse<Transaction>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<ApiResponse<Transaction>> {
    return this.http.get<ApiResponse<Transaction>>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateTransactionDto): Observable<ApiResponse<Transaction>> {
    return this.http.post<ApiResponse<Transaction>>(this.baseUrl, dto);
  }

  update(id: string, dto: UpdateTransactionDto): Observable<ApiResponse<Transaction>> {
    return this.http.put<ApiResponse<Transaction>>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getAnalysis(): Observable<ApiResponse<AnalysisData>> {
    return this.http.get<ApiResponse<AnalysisData>>(`${this.baseUrl}/analysis`);
  }

  getPrediction(): Observable<ApiResponse<PredictionData>> {
    return this.http.get<ApiResponse<PredictionData>>(`${this.baseUrl}/prediction`);
  }

  getSimulation(): Observable<ApiResponse<SimulationData>> {
    return this.http.get<ApiResponse<SimulationData>>(`${this.baseUrl}/simulation`);
  }
}
```

### Prompt 5.3 — BusinessFinanceService y UserService
```
@workspace Reemplaza los servicios de business-finance.ts y user.ts con implementaciones reales.

--- Archivo: src/app/services/business-finance.ts — clase: BusinessFinanceService ---

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import {
  BusinessTransaction,
  CreateBusinessTransactionDto,
  UpdateBusinessTransactionDto,
} from '../models/business-finance.model';

@Injectable({ providedIn: 'root' })
export class BusinessFinanceService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/business-finance`;

  getAll(filter: Record<string, string> = {}): Observable<PaginatedResponse<BusinessTransaction>> {
    const params = new HttpParams({ fromObject: filter });
    return this.http.get<PaginatedResponse<BusinessTransaction>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<ApiResponse<BusinessTransaction>> {
    return this.http.get<ApiResponse<BusinessTransaction>>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateBusinessTransactionDto): Observable<ApiResponse<BusinessTransaction>> {
    return this.http.post<ApiResponse<BusinessTransaction>>(this.baseUrl, dto);
  }

  update(id: string, dto: UpdateBusinessTransactionDto): Observable<ApiResponse<BusinessTransaction>> {
    return this.http.put<ApiResponse<BusinessTransaction>>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ── Flujo de aprobación ────────────────────────────────────────────────────
  submit(id: string): Observable<ApiResponse<BusinessTransaction>> {
    return this.http.post<ApiResponse<BusinessTransaction>>(`${this.baseUrl}/${id}/submit`, {});
  }

  approve(id: string, comment?: string): Observable<ApiResponse<BusinessTransaction>> {
    return this.http.post<ApiResponse<BusinessTransaction>>(`${this.baseUrl}/${id}/approve`, { comment });
  }

  reject(id: string, reason: string): Observable<ApiResponse<BusinessTransaction>> {
    return this.http.post<ApiResponse<BusinessTransaction>>(`${this.baseUrl}/${id}/reject`, { reason });
  }

  // ── Contabilización ────────────────────────────────────────────────────────
  post(id: string): Observable<ApiResponse<BusinessTransaction>> {
    return this.http.post<ApiResponse<BusinessTransaction>>(`${this.baseUrl}/${id}/post`, {});
  }

  reverse(id: string, reason: string): Observable<ApiResponse<BusinessTransaction>> {
    return this.http.post<ApiResponse<BusinessTransaction>>(`${this.baseUrl}/${id}/reverse`, { reason });
  }

  // ── Pagos ──────────────────────────────────────────────────────────────────
  applyPayment(id: string, payment: unknown): Observable<ApiResponse<BusinessTransaction>> {
    return this.http.post<ApiResponse<BusinessTransaction>>(`${this.baseUrl}/${id}/payments`, payment);
  }

  // ── Consultas especiales ───────────────────────────────────────────────────
  getPendingApprovals(): Observable<ApiResponse<BusinessTransaction[]>> {
    return this.http.get<ApiResponse<BusinessTransaction[]>>(`${this.baseUrl}/approvals/pending`);
  }

  getOverdue(tipo: 'cobrar' | 'pagar'): Observable<ApiResponse<BusinessTransaction[]>> {
    return this.http.get<ApiResponse<BusinessTransaction[]>>(`${this.baseUrl}/overdue/${tipo}`);
  }
}

--- Archivo: src/app/services/user.ts — clase: UserService ---

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/users`;

  getMe(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/me`);
  }

  // Admin only
  listUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(this.baseUrl);
  }

  getUserById(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/${id}`);
  }

  setUserStatus(id: string, isActive: boolean): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.baseUrl}/${id}/status`, { isActive });
  }
}
```

---

## FASE 6 — Rutas con Lazy Loading

### Prompt 6.1 — Rutas raíz y rutas de features
```
@workspace Reemplaza src/app/app.routes.ts con la configuración completa de rutas.
Luego crea los archivos de rutas de cada feature si no existen.

--- Reemplazar: src/app/app.routes.ts ---

import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [publicGuard],
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'personal-finance',
        loadChildren: () =>
          import('./features/personal-finance/personal-finance.routes').then(
            (m) => m.PERSONAL_FINANCE_ROUTES
          ),
      },
      {
        path: 'business-finance',
        loadChildren: () =>
          import('./features/business-finance/business-finance.routes').then(
            (m) => m.BUSINESS_FINANCE_ROUTES
          ),
      },
      {
        path: 'accounts',
        loadChildren: () =>
          import('./features/accounts/accounts.routes').then((m) => m.ACCOUNTS_ROUTES),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./features/categories/categories.routes').then(
            (m) => m.CATEGORIES_ROUTES
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./features/user/user.routes').then((m) => m.USER_ROUTES),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

--- Crear: src/app/features/auth/auth.routes.ts ---
import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('../../components/auth/login/login').then((m) => m.Login),
    title: 'Iniciar sesión — Finix',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('../../components/auth/register/register').then((m) => m.Register),
    title: 'Registrarse — Finix',
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('../../components/auth/forgot-password/forgot-password').then(
        (m) => m.ForgotPassword
      ),
    title: 'Recuperar contraseña — Finix',
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

--- Crear: src/app/features/dashboard/dashboard.routes.ts ---
import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../components/dashboard/main/main').then((m) => m.Main),
    title: 'Dashboard — Finix',
  },
];

--- Crear: src/app/features/personal-finance/personal-finance.routes.ts ---
import { Routes } from '@angular/router';

export const PERSONAL_FINANCE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../components/personal-finance/transaction-list/transaction-list').then(
        (m) => m.TransactionList
      ),
    title: 'Mis Transacciones — Finix',
  },
  {
    path: 'analysis',
    loadComponent: () =>
      import('../../components/personal-finance/analysis-view/analysis-view').then(
        (m) => m.AnalysisView
      ),
    title: 'Análisis — Finix',
  },
  {
    path: 'prediction',
    loadComponent: () =>
      import('../../components/personal-finance/prediction-view/prediction-view').then(
        (m) => m.PredictionView
      ),
    title: 'Predicciones — Finix',
  },
  {
    path: 'simulation',
    loadComponent: () =>
      import('../../components/personal-finance/simulation-view/simulation-view').then(
        (m) => m.SimulationView
      ),
    title: 'Simulación — Finix',
  },
];

--- Crear: src/app/features/business-finance/business-finance.routes.ts ---
import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const BUSINESS_FINANCE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../components/business-finance/business-list/business-list').then(
        (m) => m.BusinessList
      ),
    title: 'Finanzas Empresariales — Finix',
  },
  {
    path: 'approvals',
    canActivate: [roleGuard('aprobador', 'admin', 'superadmin')],
    loadComponent: () =>
      import('../../components/business-finance/approval-list/approval-list').then(
        (m) => m.ApprovalList
      ),
    title: 'Aprobaciones — Finix',
  },
];

--- Crear: src/app/features/accounts/accounts.routes.ts ---
import { Routes } from '@angular/router';

export const ACCOUNTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../components/accounts/account-list/account-list').then(
        (m) => m.AccountList
      ),
    title: 'Mis Cuentas — Finix',
  },
];

--- Crear: src/app/features/categories/categories.routes.ts ---
import { Routes } from '@angular/router';

export const CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../components/categories/category-list/category-list').then(
        (m) => m.CategoryList
      ),
    title: 'Categorías — Finix',
  },
];

--- Crear: src/app/features/user/user.routes.ts ---
import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../components/user/profile/profile').then((m) => m.Profile),
    title: 'Mi Perfil — Finix',
  },
  {
    path: 'change-password',
    loadComponent: () =>
      import('../../components/user/change-password/change-password').then(
        (m) => m.ChangePassword
      ),
    title: 'Cambiar Contraseña — Finix',
  },
];
```

---

## FASE 7 — Componentes de Autenticación

### Prompt 7.1 — Login Component completo
```
@workspace Reemplaza COMPLETAMENTE los archivos del componente Login.
La clase debe mantener el nombre Login pero añadir la implementación completa.

--- Reemplazar: src/app/components/auth/login/login.ts ---

import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth';
import { LoginDto } from '../../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  readonly isLoading = signal(false);
  readonly showPassword = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  get emailError(): string | null {
    const ctrl = this.form.controls.email;
    if (!ctrl.dirty && !ctrl.touched) return null;
    if (ctrl.hasError('required')) return 'El email es obligatorio';
    if (ctrl.hasError('email')) return 'Ingresa un email válido';
    return null;
  }

  get passwordError(): string | null {
    const ctrl = this.form.controls.password;
    if (!ctrl.dirty && !ctrl.touched) return null;
    if (ctrl.hasError('required')) return 'La contraseña es obligatoria';
    if (ctrl.hasError('minlength')) return 'Mínimo 8 caracteres';
    return null;
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    const dto = this.form.getRawValue() as LoginDto;

    this.authService.login(dto).subscribe({
      next: () => {
        this.toastr.success('¡Bienvenido a Finix!');
        const returnUrl =
          new URLSearchParams(window.location.search).get('returnUrl') ?? '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        const msg = err.error?.message ?? 'Credenciales incorrectas';
        this.toastr.error(msg);
        this.isLoading.set(false);
      },
    });
  }
}

--- Reemplazar: src/app/components/auth/login/login.html ---

<div class="auth-wrapper">
  <div class="auth-card card p-4 p-md-5">

    <div class="text-center mb-4">
      <h1 class="h3 fw-bold text-primary mb-1">Finix</h1>
      <p class="text-muted mb-0">Gestión financiera inteligente</p>
    </div>

    <h2 class="h5 fw-semibold mb-4">Iniciar sesión</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>

      <!-- Email -->
      <div class="mb-3">
        <label for="email" class="form-label fw-medium">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          class="form-control"
          [class.is-invalid]="emailError"
          formControlName="email"
          placeholder="tu@email.com"
          autocomplete="email"
          aria-describedby="emailError"
        />
        @if (emailError) {
          <div id="emailError" class="invalid-feedback">{{ emailError }}</div>
        }
      </div>

      <!-- Contraseña -->
      <div class="mb-4">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <label for="password" class="form-label fw-medium mb-0">
            Contraseña
          </label>
          <a routerLink="/auth/forgot-password" class="small">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        <div class="input-group">
          <input
            id="password"
            [type]="showPassword() ? 'text' : 'password'"
            class="form-control"
            [class.is-invalid]="passwordError"
            formControlName="password"
            placeholder="Tu contraseña"
            autocomplete="current-password"
            aria-describedby="passwordError"
          />
          <button
            type="button"
            class="btn btn-outline-secondary"
            (click)="togglePassword()"
            [attr.aria-label]="showPassword() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
          >
            <i class="bi" [class.bi-eye]="!showPassword()" [class.bi-eye-slash]="showPassword()"></i>
          </button>
        </div>
        @if (passwordError) {
          <div id="passwordError" class="invalid-feedback d-block">{{ passwordError }}</div>
        }
      </div>

      <!-- Submit -->
      <button
        type="submit"
        class="btn btn-primary w-100 py-2 fw-medium"
        [disabled]="isLoading()"
      >
        @if (isLoading()) {
          <span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
          Ingresando...
        } @else {
          Iniciar sesión
        }
      </button>

    </form>

    <p class="text-center text-muted mt-4 mb-0 small">
      ¿No tienes cuenta?
      <a routerLink="/auth/register" class="fw-medium">Regístrate gratis</a>
    </p>

  </div>
</div>

--- Reemplazar: src/app/components/auth/login/login.css ---

.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--finix-primary-light) 0%, #fff 60%);
  padding: 1rem;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  border-radius: var(--finix-radius-lg);
}
```

### Prompt 7.2 — Register Component
```
@workspace Reemplaza COMPLETAMENTE los archivos del componente Register.

--- Reemplazar: src/app/components/auth/register/register.ts ---

import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth';
import { RegisterDto } from '../../../models/auth.model';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm = control.get('passwordConfirm')?.value;
  return password && confirm && password !== confirm
    ? { passwordMismatch: true }
    : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  readonly isLoading = signal(false);
  readonly showPassword = signal(false);

  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator }
  );

  get emailError(): string | null {
    const c = this.form.controls.email;
    if (!c.touched) return null;
    if (c.hasError('required')) return 'El email es obligatorio';
    if (c.hasError('email')) return 'Ingresa un email válido';
    return null;
  }

  get passwordError(): string | null {
    const c = this.form.controls.password;
    if (!c.touched) return null;
    if (c.hasError('required')) return 'La contraseña es obligatoria';
    if (c.hasError('minlength')) return 'Mínimo 8 caracteres';
    return null;
  }

  get confirmError(): string | null {
    const c = this.form.controls.passwordConfirm;
    if (!c.touched) return null;
    if (c.hasError('required')) return 'Confirma tu contraseña';
    if (this.form.hasError('passwordMismatch')) return 'Las contraseñas no coinciden';
    return null;
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    const { name, email, password, passwordConfirm } = this.form.getRawValue();
    const dto: RegisterDto = { email, password, passwordConfirm, ...(name ? { name } : {}) };

    this.authService.register(dto).subscribe({
      next: () => {
        this.toastr.success('¡Cuenta creada! Bienvenido a Finix.');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const msg = err.error?.message ?? 'Error al crear la cuenta';
        this.toastr.error(msg);
        this.isLoading.set(false);
      },
    });
  }
}

--- Reemplazar: src/app/components/auth/register/register.html ---

<div class="auth-wrapper">
  <div class="auth-card card p-4 p-md-5">
    <div class="text-center mb-4">
      <h1 class="h3 fw-bold text-primary mb-1">Finix</h1>
      <p class="text-muted mb-0">Crea tu cuenta gratuita</p>
    </div>

    <h2 class="h5 fw-semibold mb-4">Registro</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
      <div class="mb-3">
        <label for="name" class="form-label fw-medium">Nombre <span class="text-muted fw-normal">(opcional)</span></label>
        <input id="name" type="text" class="form-control" formControlName="name" placeholder="Tu nombre" autocomplete="name" />
      </div>

      <div class="mb-3">
        <label for="email" class="form-label fw-medium">Correo electrónico</label>
        <input id="email" type="email" class="form-control" [class.is-invalid]="emailError"
          formControlName="email" placeholder="tu@email.com" autocomplete="email" />
        @if (emailError) { <div class="invalid-feedback">{{ emailError }}</div> }
      </div>

      <div class="mb-3">
        <label for="password" class="form-label fw-medium">Contraseña</label>
        <div class="input-group">
          <input id="password" [type]="showPassword() ? 'text' : 'password'"
            class="form-control" [class.is-invalid]="passwordError"
            formControlName="password" placeholder="Mínimo 8 caracteres" autocomplete="new-password" />
          <button type="button" class="btn btn-outline-secondary" (click)="showPassword.update(v => !v)" aria-label="Mostrar contraseña">
            <i class="bi" [class.bi-eye]="!showPassword()" [class.bi-eye-slash]="showPassword()"></i>
          </button>
        </div>
        @if (passwordError) { <div class="invalid-feedback d-block">{{ passwordError }}</div> }
      </div>

      <div class="mb-4">
        <label for="passwordConfirm" class="form-label fw-medium">Confirmar contraseña</label>
        <input id="passwordConfirm" type="password" class="form-control"
          [class.is-invalid]="confirmError"
          formControlName="passwordConfirm" placeholder="Repite tu contraseña" autocomplete="new-password" />
        @if (confirmError) { <div class="invalid-feedback">{{ confirmError }}</div> }
      </div>

      <button type="submit" class="btn btn-primary w-100 py-2 fw-medium" [disabled]="isLoading()">
        @if (isLoading()) {
          <span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Creando cuenta...
        } @else { Crear cuenta }
      </button>
    </form>

    <p class="text-center text-muted mt-4 mb-0 small">
      ¿Ya tienes cuenta? <a routerLink="/auth/login" class="fw-medium">Inicia sesión</a>
    </p>
  </div>
</div>

--- Reemplazar: src/app/components/auth/register/register.css ---
@import '../login/login.css';
```

---

## FASE 8 — Layout de la Aplicación

### Prompt 8.1 — Layout Shell
```
@workspace Crea el componente LayoutComponent que actúa como shell de la app autenticada.
Si la carpeta src/app/layout/ no existe, créala.

--- Crear: src/app/layout/layout.component.ts ---

import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../store/auth.store';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  readonly sidebarOpen = signal(true);

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.toastr.info('Sesión cerrada');
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        // Limpiar estado local aunque falle el servidor
        this.authStore.clearAuth();
        this.router.navigate(['/auth/login']);
      },
    });
  }
}

--- Crear: src/app/layout/layout.component.html ---

<div class="layout-wrapper" [class.sidebar-collapsed]="!sidebarOpen()">

  <!-- Sidebar -->
  <aside class="sidebar" [class.open]="sidebarOpen()" aria-label="Menú principal">
    <div class="sidebar-header">
      <span class="sidebar-brand">
        <i class="bi bi-graph-up-arrow text-primary"></i>
        <span class="brand-text">Finix</span>
      </span>
    </div>

    <nav class="sidebar-nav">
      <ul class="nav flex-column gap-1" role="list">
        <li>
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
            <i class="bi bi-speedometer2"></i>
            <span>Dashboard</span>
          </a>
        </li>
        <li>
          <a routerLink="/personal-finance" routerLinkActive="active" class="nav-link">
            <i class="bi bi-wallet2"></i>
            <span>Finanzas personales</span>
          </a>
        </li>
        <li>
          <a routerLink="/personal-finance/analysis" routerLinkActive="active" class="nav-link sub-link">
            <i class="bi bi-bar-chart"></i>
            <span>Análisis</span>
          </a>
        </li>
        <li>
          <a routerLink="/personal-finance/prediction" routerLinkActive="active" class="nav-link sub-link">
            <i class="bi bi-graph-up"></i>
            <span>Predicciones</span>
          </a>
        </li>
        @if (authStore.isAprobador() || authStore.isContador()) {
          <li class="nav-section-label">Empresarial</li>
          <li>
            <a routerLink="/business-finance" routerLinkActive="active" class="nav-link">
              <i class="bi bi-building"></i>
              <span>Finanzas empresariales</span>
            </a>
          </li>
          @if (authStore.isAprobador()) {
            <li>
              <a routerLink="/business-finance/approvals" routerLinkActive="active" class="nav-link sub-link">
                <i class="bi bi-check2-circle"></i>
                <span>Aprobaciones</span>
              </a>
            </li>
          }
        }
        <li class="nav-section-label">Configuración</li>
        <li>
          <a routerLink="/accounts" routerLinkActive="active" class="nav-link">
            <i class="bi bi-credit-card"></i>
            <span>Mis cuentas</span>
          </a>
        </li>
        <li>
          <a routerLink="/categories" routerLinkActive="active" class="nav-link">
            <i class="bi bi-tags"></i>
            <span>Categorías</span>
          </a>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <a routerLink="/profile" class="user-info">
        <div class="user-avatar" aria-hidden="true">
          {{ authStore.displayName().charAt(0).toUpperCase() }}
        </div>
        <div class="user-details">
          <span class="user-name">{{ authStore.displayName() }}</span>
          <span class="user-role">{{ authStore.userRoles()[0] }}</span>
        </div>
      </a>
      <button type="button" class="btn-logout" (click)="logout()" aria-label="Cerrar sesión">
        <i class="bi bi-box-arrow-right"></i>
      </button>
    </div>
  </aside>

  <!-- Main content -->
  <div class="main-wrapper">
    <header class="topbar">
      <button type="button" class="btn-toggle-sidebar" (click)="toggleSidebar()"
        [attr.aria-expanded]="sidebarOpen()" aria-label="Alternar menú">
        <i class="bi bi-list fs-5"></i>
      </button>
      <div class="topbar-actions">
        <a routerLink="/profile" class="btn btn-sm btn-outline-secondary">
          <i class="bi bi-person-circle me-1"></i>Mi perfil
        </a>
      </div>
    </header>

    <main class="content-area" id="main-content">
      <router-outlet />
    </main>
  </div>

</div>

--- Crear: src/app/layout/layout.component.css ---

.layout-wrapper {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  min-height: 100vh;
  transition: grid-template-columns var(--transition);
}

.layout-wrapper.sidebar-collapsed {
  grid-template-columns: 0 1fr;
}

/* Sidebar */
.sidebar {
  background: #fff;
  border-right: 1px solid var(--finix-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--finix-border);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--finix-text);
  text-decoration: none;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0.75rem;
  overflow-y: auto;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.875rem;
  border-radius: var(--finix-radius);
  color: var(--finix-text-muted);
  font-size: 0.9rem;
  transition: all var(--transition);
  text-decoration: none;
}

.nav-link:hover {
  background: var(--finix-bg);
  color: var(--finix-text);
}

.nav-link.active {
  background: var(--finix-primary-light);
  color: var(--finix-primary);
  font-weight: 600;
}

.nav-link i { font-size: 1.1rem; width: 1.25rem; }

.sub-link { padding-left: 2.5rem; font-size: 0.85rem; }

.nav-section-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--finix-text-muted);
  padding: 1rem 0.875rem 0.25rem;
}

.sidebar-footer {
  padding: 1rem 0.75rem;
  border-top: 1px solid var(--finix-border);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
  text-decoration: none;
  color: inherit;
  border-radius: var(--finix-radius);
  padding: 0.375rem 0.5rem;
  transition: background var(--transition);
}

.user-info:hover { background: var(--finix-bg); }

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--finix-primary-light);
  color: var(--finix-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.user-details { min-width: 0; }
.user-name { display: block; font-size: 0.85rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--finix-text); }
.user-role { display: block; font-size: 0.75rem; color: var(--finix-text-muted); }

.btn-logout {
  background: none;
  border: none;
  color: var(--finix-text-muted);
  padding: 0.5rem;
  border-radius: var(--finix-radius);
  cursor: pointer;
  transition: all var(--transition);
  flex-shrink: 0;
}

.btn-logout:hover { background: #fce8e6; color: var(--finix-danger); }

/* Topbar */
.main-wrapper { display: flex; flex-direction: column; min-width: 0; }

.topbar {
  height: var(--navbar-height);
  background: #fff;
  border-bottom: 1px solid var(--finix-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.btn-toggle-sidebar {
  background: none;
  border: none;
  color: var(--finix-text-muted);
  padding: 0.375rem 0.5rem;
  border-radius: var(--finix-radius);
  cursor: pointer;
  transition: all var(--transition);
}

.btn-toggle-sidebar:hover { background: var(--finix-bg); color: var(--finix-text); }

.content-area { flex: 1; padding: 1.5rem 2rem; }

/* Responsive */
@media (max-width: 768px) {
  .layout-wrapper { grid-template-columns: 0 1fr; }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    transform: translateX(-100%);
    width: var(--sidebar-width);
    transition: transform var(--transition);
  }

  .sidebar.open { transform: translateX(0); box-shadow: var(--finix-shadow-hover); }

  .content-area { padding: 1rem; }
}
```

---

## FASE 9 — Componentes Compartidos

### Prompt 9.1 — Loading Spinner y Error Message
```
@workspace Reemplaza los componentes compartidos con implementaciones reales.

--- Reemplazar: src/app/components/shared/loading-spinner/loading-spinner.ts ---

import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="spinner-wrapper" [class.fullscreen]="fullscreen()" role="status" aria-label="Cargando">
      <div class="spinner-border text-primary" [style.width.rem]="size()" [style.height.rem]="size()">
        <span class="visually-hidden">Cargando...</span>
      </div>
      @if (message()) {
        <p class="spinner-message text-muted mt-2 mb-0 small">{{ message() }}</p>
      }
    </div>
  `,
  styles: [`
    .spinner-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .spinner-wrapper.fullscreen {
      position: fixed;
      inset: 0;
      background: rgba(255,255,255,0.8);
      z-index: 9999;
    }
  `]
})
export class LoadingSpinnerComponent {
  readonly size = input<number>(2);
  readonly message = input<string>('');
  readonly fullscreen = input<boolean>(false);
}

--- Reemplazar: src/app/components/shared/error-message/error-message.ts ---

import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  template: `
    <div class="alert alert-danger d-flex align-items-start gap-2" role="alert">
      <i class="bi bi-exclamation-triangle-fill flex-shrink-0 mt-1"></i>
      <div class="flex-grow-1">
        <strong>{{ title() }}</strong>
        @if (message()) {
          <p class="mb-0 mt-1 small">{{ message() }}</p>
        }
      </div>
      @if (retryLabel()) {
        <button type="button" class="btn btn-sm btn-outline-danger" (click)="retry.emit()">
          <i class="bi bi-arrow-clockwise me-1"></i>{{ retryLabel() }}
        </button>
      }
    </div>
  `
})
export class ErrorMessageComponent {
  readonly title = input<string>('Ocurrió un error');
  readonly message = input<string>('');
  readonly retryLabel = input<string>('');
  readonly retry = output<void>();
}

--- Reemplazar: src/app/components/shared/confirm-modal/confirm-modal.ts ---

import { Component, inject, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  template: `
    <div class="modal-overlay" (click)="onCancel()" role="dialog" aria-modal="true"
      [attr.aria-label]="title()">
      <div class="modal-box card p-4" (click)="$event.stopPropagation()">
        <div class="d-flex align-items-center gap-2 mb-3">
          <i class="bi bi-exclamation-triangle text-warning fs-4"></i>
          <h5 class="modal-title mb-0">{{ title() }}</h5>
        </div>
        <p class="text-muted mb-4">{{ message() }}</p>
        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-outline-secondary" (click)="onCancel()">
            Cancelar
          </button>
          <button type="button" class="btn btn-danger" (click)="onConfirm()">
            {{ confirmLabel() }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center;
      z-index: 1050; padding: 1rem;
      animation: fadeIn 150ms ease;
    }
    .modal-box { max-width: 440px; width: 100%; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class ConfirmModalComponent {
  readonly title = input<string>('¿Confirmar acción?');
  readonly message = input<string>('Esta acción no se puede deshacer.');
  readonly confirmLabel = input<string>('Eliminar');
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  onConfirm(): void { this.confirmed.emit(); }
  onCancel(): void { this.cancelled.emit(); }
}
```

---

## FASE 10 — Componente Transaction List (patrón de referencia)

### Prompt 10.1 — Transaction List como Smart Component
```
@workspace Reemplaza los archivos de TransactionList con una implementación completa.
Este componente es el patrón de referencia que deben seguir el resto de listados.

--- Reemplazar: src/app/components/personal-finance/transaction-list/transaction-list.ts ---

import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PersonalFinanceService } from '../../../services/personal-finance';
import { CategoryService } from '../../../services/category';
import { Transaction, TransactionFilter, TransactionType } from '../../../models/transaction.model';
import { Category } from '../../../models/category.model';
import { PaginationMeta } from '../../../models/api-response.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner';
import { ErrorMessageComponent } from '../../shared/error-message/error-message';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    DatePipe,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    ConfirmModalComponent,
  ],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css',
})
export class TransactionList implements OnInit {
  private readonly service = inject(PersonalFinanceService);
  private readonly categoryService = inject(CategoryService);
  private readonly toastr = inject(ToastrService);

  // ── Estado ────────────────────────────────────────────────────────────────
  readonly transactions = signal<Transaction[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly pagination = signal<PaginationMeta | null>(null);
  readonly isLoading = signal(false);
  readonly hasError = signal(false);
  readonly filter = signal<TransactionFilter>({ page: 1, limit: 20, order: 'desc', sortBy: 'fecha' });
  readonly deleteTargetId = signal<string | null>(null);

  // ── Computed ──────────────────────────────────────────────────────────────
  readonly totalItems = computed(() => this.pagination()?.total ?? 0);
  readonly currentPage = computed(() => this.filter().page ?? 1);
  readonly totalPages = computed(() => this.pagination()?.totalPages ?? 1);
  readonly hasNextPage = computed(() => this.pagination()?.hasNextPage ?? false);
  readonly hasPrevPage = computed(() => this.pagination()?.hasPrevPage ?? false);
  readonly showDeleteModal = computed(() => !!this.deleteTargetId());

  readonly totalIngresos = computed(() =>
    this.transactions()
      .filter((t) => t.tipo === 'ingreso')
      .reduce((sum, t) => sum + t.monto, 0)
  );

  readonly totalGastos = computed(() =>
    this.transactions()
      .filter((t) => t.tipo === 'gasto')
      .reduce((sum, t) => sum + t.monto, 0)
  );

  ngOnInit(): void {
    this.loadCategories();
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.service.getAll(this.filter()).subscribe({
      next: (res) => {
        this.transactions.set(res.data);
        this.pagination.set(res.meta?.pagination ?? null);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (res) => this.categories.set(res.data),
      error: () => {},
    });
  }

  onFilterChange(partial: Partial<TransactionFilter>): void {
    this.filter.update((f) => ({ ...f, ...partial, page: 1 }));
    this.loadTransactions();
  }

  onPageChange(page: number): void {
    this.filter.update((f) => ({ ...f, page }));
    this.loadTransactions();
  }

  requestDelete(id: string): void {
    this.deleteTargetId.set(id);
  }

  confirmDelete(): void {
    const id = this.deleteTargetId();
    if (!id) return;

    this.service.delete(id).subscribe({
      next: () => {
        this.toastr.success('Transacción eliminada');
        this.deleteTargetId.set(null);
        this.loadTransactions();
      },
      error: () => {
        this.toastr.error('No se pudo eliminar la transacción');
        this.deleteTargetId.set(null);
      },
    });
  }

  cancelDelete(): void {
    this.deleteTargetId.set(null);
  }

  getCategoryName(categoriaId: string | object): string {
    if (typeof categoriaId === 'object' && categoriaId !== null) {
      return (categoriaId as Category).nombre;
    }
    const cat = this.categories().find((c) => c.id === categoriaId);
    return cat?.nombre ?? '—';
  }

  tipoLabel(tipo: TransactionType): string {
    const labels: Record<TransactionType, string> = {
      ingreso: 'Ingreso',
      gasto: 'Gasto',
      transferencia: 'Transferencia',
    };
    return labels[tipo];
  }
}

--- Reemplazar: src/app/components/personal-finance/transaction-list/transaction-list.html ---

<div class="page-header d-flex align-items-center justify-content-between mb-4">
  <div>
    <h1 class="h4 fw-bold mb-1">Mis Transacciones</h1>
    <p class="text-muted mb-0 small">{{ totalItems() }} transacciones en total</p>
  </div>
  <a routerLink="/personal-finance/create" class="btn btn-primary">
    <i class="bi bi-plus-lg me-1"></i>Nueva transacción
  </a>
</div>

<!-- Resumen -->
<div class="row g-3 mb-4">
  <div class="col-sm-6 col-lg-3">
    <div class="card p-3">
      <p class="text-muted small mb-1">Ingresos (página actual)</p>
      <p class="h5 fw-bold text-income mb-0">
        {{ totalIngresos() | currency:'COP':'symbol-narrow':'1.0-0':'es-CO' }}
      </p>
    </div>
  </div>
  <div class="col-sm-6 col-lg-3">
    <div class="card p-3">
      <p class="text-muted small mb-1">Gastos (página actual)</p>
      <p class="h5 fw-bold text-expense mb-0">
        {{ totalGastos() | currency:'COP':'symbol-narrow':'1.0-0':'es-CO' }}
      </p>
    </div>
  </div>
</div>

<!-- Filtros rápidos -->
<div class="card mb-4 p-3">
  <div class="row g-2 align-items-end">
    <div class="col-sm-auto">
      <label class="form-label small fw-medium">Tipo</label>
      <select class="form-select form-select-sm"
        (change)="onFilterChange({ tipo: $any($event.target).value || undefined })">
        <option value="">Todos</option>
        <option value="ingreso">Ingresos</option>
        <option value="gasto">Gastos</option>
        <option value="transferencia">Transferencias</option>
      </select>
    </div>
    <div class="col-sm-auto">
      <label class="form-label small fw-medium">Estado</label>
      <select class="form-select form-select-sm"
        (change)="onFilterChange({ estado: $any($event.target).value || undefined })">
        <option value="">Todos</option>
        <option value="completado">Completado</option>
        <option value="pendiente">Pendiente</option>
        <option value="cancelado">Cancelado</option>
      </select>
    </div>
    <div class="col-sm-auto">
      <label class="form-label small fw-medium">Desde</label>
      <input type="date" class="form-control form-control-sm"
        (change)="onFilterChange({ fechaDesde: $any($event.target).value || undefined })" />
    </div>
    <div class="col-sm-auto">
      <label class="form-label small fw-medium">Hasta</label>
      <input type="date" class="form-control form-control-sm"
        (change)="onFilterChange({ fechaHasta: $any($event.target).value || undefined })" />
    </div>
  </div>
</div>

<!-- Cargando -->
@if (isLoading()) {
  <app-loading-spinner message="Cargando transacciones..." />
}

<!-- Error -->
@if (hasError() && !isLoading()) {
  <app-error-message
    title="Error al cargar transacciones"
    message="No se pudieron obtener los datos del servidor."
    retryLabel="Reintentar"
    (retry)="loadTransactions()"
  />
}

<!-- Tabla -->
@if (!isLoading() && !hasError()) {
  @if (transactions().length === 0) {
    <div class="text-center py-5">
      <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
      <p class="text-muted">No hay transacciones con estos filtros.</p>
      <a routerLink="/personal-finance/create" class="btn btn-outline-primary btn-sm">
        <i class="bi bi-plus-lg me-1"></i>Crear tu primera transacción
      </a>
    </div>
  } @else {
    <div class="card">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col">Fecha</th>
              <th scope="col">Tipo</th>
              <th scope="col">Descripción</th>
              <th scope="col">Categoría</th>
              <th scope="col" class="text-end">Monto</th>
              <th scope="col">Estado</th>
              <th scope="col" class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (tx of transactions(); track tx.id) {
              <tr>
                <td class="text-muted small">{{ tx.fecha | date:'dd/MM/yyyy' }}</td>
                <td>
                  <span class="badge"
                    [class.badge-income]="tx.tipo === 'ingreso'"
                    [class.badge-expense]="tx.tipo === 'gasto'"
                    [class.badge-transfer]="tx.tipo === 'transferencia'">
                    {{ tipoLabel(tx.tipo) }}
                  </span>
                </td>
                <td class="text-truncate" style="max-width:200px">
                  {{ tx.descripcion || '—' }}
                </td>
                <td class="small">{{ getCategoryName($any(tx.categoria)) }}</td>
                <td class="text-end fw-semibold"
                  [class.text-income]="tx.tipo === 'ingreso'"
                  [class.text-expense]="tx.tipo === 'gasto'">
                  {{ tx.monto | currency:'COP':'symbol-narrow':'1.0-0':'es-CO' }}
                </td>
                <td>
                  <span class="badge"
                    [class.bg-success]="tx.estado === 'completado'"
                    [class.bg-warning]="tx.estado === 'pendiente'"
                    [class.bg-secondary]="tx.estado === 'cancelado'">
                    {{ tx.estado }}
                  </span>
                </td>
                <td class="text-center">
                  <div class="btn-group btn-group-sm">
                    <a [routerLink]="['/personal-finance', tx.id, 'edit']"
                      class="btn btn-outline-secondary" aria-label="Editar">
                      <i class="bi bi-pencil"></i>
                    </a>
                    <button type="button" class="btn btn-outline-danger"
                      (click)="requestDelete(tx.id)" aria-label="Eliminar">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      @if (totalPages() > 1) {
        <div class="card-footer d-flex align-items-center justify-content-between py-2 px-3">
          <span class="text-muted small">
            Página {{ currentPage() }} de {{ totalPages() }} ({{ totalItems() }} registros)
          </span>
          <nav aria-label="Paginación">
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" [class.disabled]="!hasPrevPage()">
                <button class="page-link" (click)="onPageChange(currentPage() - 1)"
                  [disabled]="!hasPrevPage()" aria-label="Anterior">
                  <i class="bi bi-chevron-left"></i>
                </button>
              </li>
              <li class="page-item" [class.disabled]="!hasNextPage()">
                <button class="page-link" (click)="onPageChange(currentPage() + 1)"
                  [disabled]="!hasNextPage()" aria-label="Siguiente">
                  <i class="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      }
    </div>
  }
}

<!-- Modal de confirmación de eliminación -->
@if (showDeleteModal()) {
  <app-confirm-modal
    title="Eliminar transacción"
    message="¿Estás seguro de eliminar esta transacción? Esta acción no se puede deshacer."
    confirmLabel="Eliminar"
    (confirmed)="confirmDelete()"
    (cancelled)="cancelDelete()"
  />
}
```

---

## FASE 11 — Verificación final y ESLint

### Prompt 11.1 — Verificación de compilación
```
@workspace Ejecuta una verificación de compilación del proyecto en modo estricto.
Busca en todo el codebase de src/app/:

1. Archivos que aún tienen `export class X {}` vacíos (cuerpo de clase vacío) y lista cuáles son
2. Archivos que usan el tipo `any` explícitamente
3. Suscripciones a Observables sin takeUntilDestroyed() o async pipe
4. Imports que referencian archivos que no existen
5. Uso de *ngIf o *ngFor (deben reemplazarse por @if y @for)
6. console.log en código de producción

Para cada problema encontrado, muéstrame el archivo y la línea, y propón la corrección.
```

### Prompt 11.2 — tsconfig paths (imports limpios)
```
@workspace Añade path aliases en tsconfig.json para imports más limpios.
Agrega dentro de compilerOptions estas entradas:

"paths": {
  "@models/*":       ["src/app/models/*"],
  "@services/*":     ["src/app/services/*"],
  "@store/*":        ["src/app/store/*"],
  "@core/*":         ["src/app/core/*"],
  "@shared/*":       ["src/app/components/shared/*"],
  "@env":            ["src/environments/environment"],
  "@features/*":     ["src/app/features/*"]
}

Luego actualiza tsconfig.app.json para heredar estos paths si no los tiene.
Verifica que angular.json no requiera cambios adicionales para soportar los paths.
Nota: los paths solo ayudan en DX local; asegúrate de que el builder de Angular los resuelva.
```

---

## Prompts de uso continuo (para cada componente nuevo)

### Plantilla para implementar cualquier componente
```
@workspace Implementa el componente [NOMBRE] siguiendo estas reglas del proyecto:

Contexto:
- Archivo: src/app/components/[ruta]/[nombre].ts
- Propósito: [describe qué hace]
- Servicio que consume: [NombreService]
- Datos que muestra: [Tipo del modelo]

Reglas que DEBEN cumplirse:
1. Clase standalone con imports explícitos
2. Signals para TODA la lógica de estado (isLoading, hasError, data)
3. inject() para dependencias (NO constructor DI)
4. @if y @for en el template (NO *ngIf, *ngFor)
5. takeUntilDestroyed() en cualquier suscripción manual
6. Formulario con FormBuilder.nonNullable.group() si el componente tiene form
7. Validadores con getters tipados para mensajes de error
8. Toastr para feedback de acciones (success/error)
9. Componentes shared: <app-loading-spinner>, <app-error-message>, <app-confirm-modal>
10. Sin console.log, sin any, sin as any
11. Accesibilidad: labels en inputs, aria-label en botones de icono

Genera: el .ts, el .html y el .css completos.
```

### Plantilla para implementar un servicio nuevo
```
@workspace Crea el servicio [NombreService] en src/app/services/[archivo].ts.

El servicio debe:
- Usar inject(HttpClient) en lugar de constructor DI
- Tipar todas las respuestas con ApiResponse<T> o PaginatedResponse<T>
- Usar environment.apiUrl como base
- No tener lógica de estado (el estado va en el componente o en un Store)
- Manejar los query params con HttpParams filtrando valores undefined/null/''
- Devolver Observable<T> sin suscribirse internamente salvo para tap() en auth

Endpoints a implementar: [lista de endpoints del backend]
Tipos a usar: [lista de interfaces del modelo]
```

---

## Orden de ejecución recomendado

```
┌─────────────────────────────────────────────────────────┐
│                    ORDEN DE PROMPTS                      │
├─────────────────────────────────────────────────────────┤
│  1. Prompt global de contexto (una vez por sesión)      │
│  2. Fase 1: Configuración base (1.1 → 1.2 → 1.3 → 1.4) │
│  3. Fase 2: Modelos (2.1 → 2.2 → 2.3)                  │
│  4. Fase 3: AuthStore (3.1)                             │
│  5. Fase 4: Interceptores y guards (4.1 → 4.2 → 4.3)   │
│  6. Fase 5: Servicios HTTP (5.1 → 5.2 → 5.3)           │
│  7. Fase 6: Rutas (6.1)                                 │
│  8. Fase 7: Auth components (7.1 → 7.2)                │
│  9. Fase 8: Layout (8.1)                                │
│  10. Fase 9: Shared components (9.1)                    │
│  11. Fase 10: Transaction list — patrón (10.1)          │
│  12. Fase 11: Verificación (11.1 → 11.2)               │
│  13. Resto de componentes usando plantillas del final   │
└─────────────────────────────────────────────────────────┘

Tiempo estimado: 2-3 sesiones de trabajo
Prerequisito: backend Finix corriendo en localhost:3000
```

---

*Guía generada como resultado de la auditoría técnica completa del proyecto Finix — Mayo 2025*