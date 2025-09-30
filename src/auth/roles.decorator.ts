import { SetMetadata } from '@nestjs/common';
export const ROLES_KEY = 'roles';
export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'CREW';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
