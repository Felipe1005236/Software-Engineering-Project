import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private jwtService;
    constructor(jwtService: JwtService);
    register(username: string, email: string, password: string): Promise<{
        message: string;
        user: any;
    }>;
    validateUser(username: string, password: string): Promise<any>;
    login(user: any): Promise<{
        accessToken: string;
    }>;
    getProfile(userId: number): Promise<any>;
    updateProfile(userId: number, newData: any): Promise<any>;
}
