import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { ApiResponse } from '../../../models/api-response.model';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Usuarios</h2>
        <button class="btn btn-primary" (click)="refreshUsers()">
          <i class="bi bi-arrow-clockwise"></i> Actualizar
        </button>
      </div>

      <div *ngIf="loading()" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div *ngIf="!loading()" class="table-responsive">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Roles</th>
              <th>Estado</th>
              <th>Último Login</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users()">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span class="badge bg-secondary" *ngFor="let role of user.roles">
                  {{ role }}
                </span>
              </td>
              <td>
                <span class="badge" [class.bg-success]="user.isActive" [class.bg-danger]="!user.isActive">
                  {{ user.isActive ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>{{ user.lastLoginAt | date:'short' }}</td>
              <td>
                <button class="btn btn-sm btn-outline-primary me-1" (click)="editUser(user.id)">
                  Editar
                </button>
                <button class="btn btn-sm btn-outline-warning me-1" (click)="toggleStatus(user)">
                  {{ user.isActive ? 'Desactivar' : 'Activar' }}
                </button>
                <button class="btn btn-sm btn-outline-danger" (click)="deleteUser(user.id)">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .badge { margin-right: 4px; }
  `]
})
export class UserList implements OnInit {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  users = signal<User[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.userService.listUsers().pipe(takeUntilDestroyed()).subscribe({
      next: (response) => {
        this.users.set(response.items);
        this.loading.set(false);
      },
      error: (err) => {
        this.toastr.error('Error al cargar usuarios');
        this.loading.set(false);
      }
    });
  }

  refreshUsers(): void {
    this.loadUsers();
  }

  editUser(id: string): void {
    this.router.navigate(['/admin/users', id, 'edit']);
  }

  toggleStatus(user: User): void {
    this.userService.setUserStatus(user.id, !user.isActive).pipe(takeUntilDestroyed()).subscribe({
      next: () => {
        this.toastr.success(`Usuario ${user.isActive ? 'desactivado' : 'activado'} exitosamente`);
        this.loadUsers();
      },
      error: (err) => {
        this.toastr.error('Error al cambiar estado del usuario');
      }
    });
  }

  deleteUser(id: string): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.userService.deleteUser(id).pipe(takeUntilDestroyed()).subscribe({
        next: () => {
          this.toastr.success('Usuario eliminado exitosamente');
          this.loadUsers();
        },
        error: (err) => {
          this.toastr.error('Error al eliminar usuario');
        }
      });
    }
  }
}
