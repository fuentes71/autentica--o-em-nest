import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserPayload } from 'src/shared/models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from 'src/shared/models/UserToken';
@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) { }

    async login(user: User): Promise<UserToken> {
        const { id, email, name } = user;
        const payload: UserPayload = { sub: id, email, name };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) throw new UnauthorizedException('Email ou senha invalidos.')

        return {
            ...user,
            password: undefined
        }
    }
}
