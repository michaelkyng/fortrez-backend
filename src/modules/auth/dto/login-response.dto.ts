import { ApiProperty } from '@nestjs/swagger';
import { SafeUser } from '@fortrez/interfaces';

export class LoginResponseDto {
  @ApiProperty({ description: 'Status message' })
  message: string;

  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'User information' })
  user: SafeUser;
}
