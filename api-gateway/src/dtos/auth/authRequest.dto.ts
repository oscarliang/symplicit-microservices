import { ApiProperty } from '@nestjs/swagger';
import { Length, IsStrongPassword } from 'class-validator';

export class AuthRequestDto {
  @ApiProperty({ required: true })
  @Length(0, 50, {
    message: 'Max length is 50',
  })
  readonly username: string;

  @ApiProperty({ required: true })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  readonly password: string;
}
