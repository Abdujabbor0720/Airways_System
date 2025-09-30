import { Injectable, BadRequestException, NotFoundException, ForbiddenException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateAdminUserDto } from './dto/create-admin_user.dto';
import { UpdateAdminUserDto } from './dto/update-admin_user.dto';
import { AdminUser } from './entities/admin_user.entity';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AdminUsersService implements OnModuleInit {
    constructor(
    @InjectRepository(AdminUser)
    private readonly repo: Repository<AdminUser>, private readonly dataSource: DataSource, private readonly cfg: ConfigService) { }
    async onModuleInit() {
        const email = this.cfg.get<string>('SUPERADMIN_EMAIL');
        const password = this.cfg.get<string>('SUPERADMIN_PASSWORD');
        const fullName = this.cfg.get<string>('SUPERADMIN_FULLNAME');
        if (!email || !password || !fullName) return;
        try {
            const exists = await this.findByEmailLower(email);
            if (exists) return;
            const password_hash = await bcrypt.hash(password, 12);
            await this.dataSource.transaction(async (manager) => {
                const admin = manager.create(AdminUser, {
                    email: email.toLowerCase(),
                    password_hash,
                    full_name: fullName,
                    role: 'SUPER_ADMIN',
                    status: 'ACTIVE',
                });
                await manager.save(AdminUser, admin);
            });
        } catch {
        }
    }
    async create(dto: CreateAdminUserDto): Promise<AdminUser> {
        const email = dto.email.toLowerCase();
        const exists = await this.repo.findOne({ where: { email } });
        if (exists)
            throw new BadRequestException('Email already exists');
        const password_hash = await bcrypt.hash(dto.password, 12);
        return await this.dataSource.transaction(async (manager) => {
            const admin = manager.create(AdminUser, {
                email,
                password_hash,
                full_name: dto.full_name ?? null,
                role: dto.role,
                status: dto.status ?? 'ACTIVE',
            });
            return await manager.save(AdminUser, admin);
        });
    }
    async findAll(skip = 0, take = 20): Promise<{
        data: AdminUser[];
        count: number;
    }> {
        const [data, count] = await this.repo.findAndCount({ order: { id: 'ASC' }, skip, take });
        return { data, count };
    }
    async findOne(id: string): Promise<AdminUser> {
        const admin = await this.repo.findOne({ where: { id } });
        if (!admin)
            throw new NotFoundException('Admin not found');
        return admin;
    }
    async update(id: string, dto: UpdateAdminUserDto, currentUser: AdminUser): Promise<AdminUser> {
        const admin = await this.repo.findOne({ where: { id } });
        if (!admin)
            throw new NotFoundException('Admin not found');
        if (currentUser.role !== 'SUPER_ADMIN' && currentUser.id !== id) {
            throw new ForbiddenException('Only SUPER_ADMIN can update other admins');
        }
        let password_hash = admin.password_hash;
        if (dto.password) {
            password_hash = await bcrypt.hash(dto.password, 12);
        }
        return await this.dataSource.transaction(async (manager) => {
            manager.merge(AdminUser, admin, {
                ...dto,
                email: dto.email ? dto.email.toLowerCase() : admin.email,
                password_hash,
            });
            return await manager.save(AdminUser, admin);
        });
    }
    async remove(id: string, currentUser: AdminUser): Promise<{
        success: boolean;
    }> {
        if (currentUser.role !== 'SUPER_ADMIN') {
            throw new ForbiddenException('Only SUPER_ADMIN can delete admins');
        }
        const admin = await this.repo.findOne({ where: { id } });
        if (!admin)
            throw new NotFoundException('Admin not found');
        await this.dataSource.transaction(async (manager) => {
            await manager.delete(AdminUser, { id });
        });
        return { success: true };
    }
    async findByEmailLower(email: string): Promise<AdminUser | null> {
        return await this.repo.findOne({ where: { email: email.toLowerCase() } });
    }
}
