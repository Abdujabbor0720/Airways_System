import { Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
@Injectable()
export class UsersService {
    constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>) { }
    async create(createUserDto: CreateUserDto) {
        if (!createUserDto.email || !createUserDto.password) {
            throw new BadRequestException('Email va password majburiy');
        }
        const exists = await this.repo.findOne({ where: { email: createUserDto.email.toLowerCase() } });
        if (exists)
            throw new ConflictException('Bu email allaqachon mavjud');
        const password_hash = 'hashed_' + createUserDto.password;
        let entity: User;
        await this.repo.manager.transaction(async (manager) => {
            entity = manager.create(User, {
                email: createUserDto.email.toLowerCase(),
                password_hash,
                full_name: createUserDto.full_name,
                phone: createUserDto.phone,
                birth_date: createUserDto.birth_date,
                loyalty_opt_in: createUserDto.loyalty_opt_in ?? true,
            });
            entity = await manager.save(entity);
        });
        return entity!;
    }
    async createInternal(data: Partial<User>) {
        const entity = this.repo.create(data);
        return this.repo.save(entity);
    }
    async findAll(skip = 0, take = 20) {
        const [items, total] = await this.repo.findAndCount({ order: { id: 'ASC' }, skip, take });
        return { items, total };
    }
    async findOne(id: string) {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity)
            throw new NotFoundException('User not found');
        return entity;
    }
    async update(id: string, updateUserDto: UpdateUserDto) {
        const current = await this.findOne(id);
        if (!current)
            throw new NotFoundException('User not found');
        if (updateUserDto.email && updateUserDto.email.toLowerCase() !== current.email) {
            const exists = await this.repo.findOne({ where: { email: updateUserDto.email.toLowerCase() } });
            if (exists && exists.id !== id)
                throw new ConflictException('Bu email allaqachon mavjud');
        }
        if (updateUserDto.password && updateUserDto.password.length < 8) {
            throw new BadRequestException('Password kamida 8 belgidan iborat bo‘lishi kerak');
        }
        let password_hash: string | undefined;
        if (updateUserDto.password)
            password_hash = 'hashed_' + updateUserDto.password;
        const patch: Partial<User> = {
            email: updateUserDto.email ? updateUserDto.email.toLowerCase() : current.email,
            full_name: updateUserDto.full_name ?? current.full_name,
            phone: updateUserDto.phone ?? current.phone,
            birth_date: updateUserDto.birth_date ?? current.birth_date,
            loyalty_opt_in: updateUserDto.loyalty_opt_in ?? current.loyalty_opt_in,
            status: updateUserDto.status ?? current.status,
            ...(password_hash ? { password_hash } : {}),
        };
        const updated = await this.repo.manager.transaction(async (manager) => {
            await manager.update(User, { id }, patch);
            const user = await manager.findOne(User, { where: { id } });
            if (!user)
                throw new NotFoundException('User not found after update');
            return user;
        });
        return updated;
    }
    async remove(id: string) {
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('User not found');
        return { success: true };
    }
    async findByEmailLower(email: string) {
        return this.repo.findOne({ where: { email: email.toLowerCase() } });
    }
    async updatePassword(id: string, password_hash: string) {
        await this.repo.update({ id }, { password_hash });
    }
}
