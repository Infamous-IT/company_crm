import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { TagsModule } from './tags/tags.module';
import AWS from 'aws-sdk';

@Module({
  imports: [
      UserModule,
      AuthModule,
      OrdersModule,
      TagsModule,
      ConfigModule.forRoot({isGlobal: true}),
      TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
              database: configService.get('DB_NAME'),
              entities: [__dirname + '/**/*.entity{.js, .ts}'],
              host: configService.get('DB_HOST'),
              password: configService.get('DB_PASSWORD'),
              port: configService.get('DB_PORT'),
              synchronize: true,
              type: 'postgres',
              username: configService.get('DB_USERNAME'),
              extra: {
                  // ssl: {
                  //     rejectUnauthorized: false,
                  // },
                  aws_rds: true,
                  aws_secret_name: configService.get('AWS_RESOURCE_NAME'),
                  aws_region: configService.get('AWS_REGION')
              }
          }),
          inject: [ConfigService],
      }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
