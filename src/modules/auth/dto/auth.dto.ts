import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    required: true
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password',
    minLength: 6,
    example: 'password123',
    required: true
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}

export class RegisterDto extends LoginDto {
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'User wallet address (optional)',
    example: '0x123...abc',
    required: false
  })
  @IsString()
  @IsNotEmpty()
  walletAddress?: string;
}
