import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminUserDto } from './create-admin_user.dto';
export class UpdateAdminUserDto extends PartialType(CreateAdminUserDto) {
}
