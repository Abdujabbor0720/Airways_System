import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PasswordResetTokensService } from './password_reset_tokens.service';
import { CreatePasswordResetTokenDto } from './dto/create-password_reset_token.dto';
import { UpdatePasswordResetTokenDto } from './dto/update-password_reset_token.dto';
@ApiTags('Password Reset Tokens')
@Controller('password-reset-tokens')
export class PasswordResetTokensController {
    constructor(private readonly passwordResetTokensService: PasswordResetTokensService) { }
    @Post()
    @ApiOperation({ summary: 'Create password reset token (internal)' })
    create(
    @Body()
    createPasswordResetTokenDto: CreatePasswordResetTokenDto) {
        return this.passwordResetTokensService.create(createPasswordResetTokenDto);
    }
    @Get()
    @ApiOperation({ summary: 'List password reset tokens with pagination' })
    findAll() {
        return this.passwordResetTokensService.findAll();
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get password reset token by ID' })
    findOne(
    @Param('id')
    id: string) {
        return this.passwordResetTokensService.findOne(+id);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update password reset token (not allowed)' })
    update(
    @Param('id')
    id: string, 
    @Body()
    updatePasswordResetTokenDto: UpdatePasswordResetTokenDto) {
        return this.passwordResetTokensService.update(+id, updatePasswordResetTokenDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete password reset token (not allowed)' })
    remove(
    @Param('id')
    id: string) {
        return this.passwordResetTokensService.remove(+id);
    }
}
