import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { TokensDto } from './dto/tokens.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from '../user/user.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {}

    @Post('sign-up')
    async signUp(@Body() signUpDto: SignUpDto): Promise<TokensDto> {
        const user = await this.usersService.create(signUpDto);
        return await this.authService.generateAuthTokens(user);
    }

    @Post('sign-in')
    async login(@Body() body: SignInDto): Promise<TokensDto> {
        const user = await this.authService.validateCredentials(body);
        return this.authService.generateAuthTokens(user);
    }

    @Post('refresh-token')
    async refreshToken(@Body() body: RefreshTokenDto): Promise<TokensDto> {
        return this.authService.refreshToken(body.refreshToken);
    }
}