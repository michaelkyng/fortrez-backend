import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User email address',
    example: 'new.email@example.com'
  })
  @IsEmail()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'New password (min 6 characters)',
    minLength: 6,
    example: 'newpassword123'
  })
  @MinLength(6)
  @IsString()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    description: 'User full name',
    example: 'Jane Doe'
  })
  @IsString()
  @IsOptional()
  name?: string;
}
