import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthLoginDto } from './create-auth_login.dto';
export class UpdateAuthLoginDto extends PartialType(CreateAuthLoginDto) {
}
