import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { User, UserDocument } from '@fortrez/schemas';
import { SafeUser } from '@fortrez/interfaces';
import { Document } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private sanitizeUser(user: UserDocument): SafeUser {
    const { password, ...result } = user.toObject();
    return result as unknown as SafeUser;
  }

  async validateUser(email: string, password: string): Promise<SafeUser | null> {
    const user = await this.userService.findOne(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return this.sanitizeUser(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOne(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const sanitizedUser = this.sanitizeUser(user);

    const payload = { email: sanitizedUser.email, sub: sanitizedUser._id };

    return {
      user: sanitizedUser,
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.userService.findOne(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const sanitizedUser = this.sanitizeUser(newUser);

    const payload = { email: sanitizedUser.email, sub: sanitizedUser._id };

    return {
      user: sanitizedUser,
      access_token: this.jwtService.sign(payload),
    };
  }
}
