import {forwardRef, Module} from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TagsModule } from '../tags/tags.module';
import {CustomerModule} from "../customer/customer.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN')},
      }),
      inject: [ConfigService],
    }),
    TagsModule,
      CustomerModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, JwtModule]
})
export class UserModule {}
