import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ReviewModule } from './review/review.module';
import { WorkModule } from './work/work.module';
import { PostModule } from './post/post.module';
import { PayModule } from './pay/pay.module';
import { MessageModule } from './message/message.module';
import { CategoryModule } from './category/category.module';
@Module({
  imports: [
    //habilitar variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    //conexion a typeorm
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 3306,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    //modulos
    UserModule,
    ReviewModule,
    WorkModule,
    PostModule,
    PayModule,
    MessageModule,
    CategoryModule,
  ],
})
export class AppModule {}
