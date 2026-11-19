import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UserManagementService } from '../user-management/user-management.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestResponseDto } from './dto/request-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserManagementService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });
    return { message: 'User registered', user };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { 
      email: user.email, 
      userId: user.userID,
      role: user.primaryRole 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: { ...user, role: user.primaryRole },
    };
  }

  async createRequest(createRequestDto: CreateRequestDto) {
    try {
      const { password, organizationID, unitID, firstName, lastName, email, phone, address, role } = createRequestDto;
      const hashedPassword = await bcrypt.hash(password, 10);

      // Parse IDs to integers
      const parsedOrgId = parseInt(organizationID);
      const parsedUnitId = parseInt(unitID);

      if (isNaN(parsedOrgId) || isNaN(parsedUnitId)) {
        throw new Error('Invalid organization or unit ID');
      }

      return this.prisma.request.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          address,
          role,
          organizationID: parsedOrgId,
          unitID: parsedUnitId,
          password: hashedPassword,
          status: 'PENDING'
        },
        include: {
          organization: true,
          unit: true,
        },
      });
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }
  }

  async getRequests(unitId: number) {
    return this.prisma.request.findMany({
      where: {
        unitID: unitId,
      },
      include: {
        organization: true,
        unit: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async handleRequest(requestId: number, response: RequestResponseDto) {
    const request = await this.prisma.request.findUnique({
      where: { requestID: requestId },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (response.status === 'APPROVED') {
      // Create user from request
      const user = await this.prisma.user.create({
        data: {
          firstName: request.firstName,
          lastName: request.lastName,
          email: request.email,
          password: request.password,
          phone: request.phone,
          address: request.address,
          unitID: request.unitID,
          primaryRole: request.role,
          active: true,
        },
      });

      // Update request status
      await this.prisma.request.update({
        where: { requestID: requestId },
        data: { status: 'APPROVED' },
      });

      return user;
    } else {
      // Update request status to rejected
      return this.prisma.request.update({
        where: { requestID: requestId },
        data: { status: 'REJECTED' },
      });
    }
  }
}