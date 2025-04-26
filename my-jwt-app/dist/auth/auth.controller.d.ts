import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: any): Promise<{
        message: string;
        user: any;
    }>;
    login(body: any): Promise<{
        accessToken: string;
    } | {
        message: string;
    }>;
    getProfile(req: any): Promise<any>;
    updateProfile(req: any, body: any): Promise<any>;
    refreshToken(body: any): Promise<{
        accessToken: string;
    } | {
        message: string;
    }>;
}
