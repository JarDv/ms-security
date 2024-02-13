import {Controller, Get, Inject} from '@nestjs/common';
import { AppService } from './app.service';
import {ILoginFactory, IRegisterUserFactory, LOGIN_FACTORY_SERVICE, REGISTER_FACTORY_SERVICE} from "./interfaces";
import {MessagePattern} from "@nestjs/microservices";
import {RqLoginUserDto, RqRegisterUserDto} from "./dto";

@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,

      @Inject(LOGIN_FACTORY_SERVICE)
      private readonly loginFactoryService: ILoginFactory,

      @Inject(REGISTER_FACTORY_SERVICE)
      private readonly registerFactoryService: IRegisterUserFactory,
  ) {}

  /* --------------- */

  @MessagePattern('ms-security-login')
  async login(loginUserDto: RqLoginUserDto) {
    const loginData =
        this.loginFactoryService.DTORequesttoLoginEntity(loginUserDto);
    return await this.appService.login(loginData);
  }

  /* --------------- */

  @MessagePattern('ms-security-register')
  async register(registerUserDto: RqRegisterUserDto) {
    const userSecurityData =
        this.registerFactoryService.DTORequesttoRegisterEntity(registerUserDto);
    return await this.appService.register(userSecurityData);
  }
}
