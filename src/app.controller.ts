import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrentUser } from './shared/decorators/current-user.decorator';
import { User } from './user/entities/user.entity';
import { UserToken } from './shared/models/UserToken';
import { UserFromJwt } from './shared/models/UserFromJwt';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/me')
  getMe(@CurrentUser() user: User) {
    return user
  }
}
