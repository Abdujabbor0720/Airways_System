import { PartialType } from '@nestjs/mapped-types';
import { CreateEmailVerificationTokenDto } from './create-email_verification_token.dto';
export class UpdateEmailVerificationTokenDto extends PartialType(CreateEmailVerificationTokenDto) {
}
