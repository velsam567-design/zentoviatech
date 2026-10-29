import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}



  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email.toLowerCase(),
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User account is not active');
    }

    const passwordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const roles = user.roles.map((item) => item.role.name);

    const permissions = [
      ...new Set(
        user.roles.flatMap((item) =>
          item.role.permissions.map(
            (permission) => permission.permission.name,
          ),
        ),
      ),
    ];

    const payload = {
      sub: user.id,
      email: user.email,
      roles,
      permissions,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: 900,
    });

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        type: 'refresh',
      },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: 604800,
      },
    );

    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshTokenHash,
        lastLoginAt: new Date(),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        roles,
        permissions,
      },
    };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User not found or inactive');
    }

    const roles = user.roles.map((item) => item.role.name);

    const permissions = [
      ...new Set(
        user.roles.flatMap((item) =>
          item.role.permissions.map(
            (permission) => permission.permission.name,
          ),
        ),
      ),
    ];

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      status: user.status,
      roles,
      permissions,
      lastLoginAt: user.lastLoginAt,
    };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshTokenHash: null,
      },
    });

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (
      !user ||
      user.status !== 'ACTIVE' ||
      !user.refreshTokenHash
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const valid = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );

    if (!valid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: 900,
      },
    );

    return {
      accessToken,
    };
  }
}