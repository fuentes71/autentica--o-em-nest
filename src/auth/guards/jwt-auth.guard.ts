import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/shared/decorators/is-public.decorator';
import { UnauthorizedError } from 'src/shared/error/unauthorizedError.error';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt' ) {

    constructor(private reflector: Reflector) {
        super();
    }
    private jwtAuth = process.env.JWT_AUTH_DEV;

    canActivate(context: ExecutionContext): Promise<boolean> | boolean {

        if (this.jwtAuth === "true") return true;

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const canActivate = super.canActivate(context);

        if (typeof canActivate === 'boolean') {
            return canActivate;
        }

        const canActivatePromise = canActivate as Promise<boolean>;

        return canActivatePromise.catch((error) => {
            if (error instanceof UnauthorizedError) {
                throw new UnauthorizedException(error.message);
            }

            throw new UnauthorizedException("Acesso não autorizado");
        });
    }
}