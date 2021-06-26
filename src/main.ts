import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  //Prefijo
  app.setGlobalPrefix('api');
  //Configuracion de swagger
  const config = new DocumentBuilder()
    .setTitle('Documentacion de proyecto Contatec')
    .setDescription('Proyecto similar a workana / chambeala')
    .setVersion('0.0.1')
    .setBasePath('api')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customCss: `.topbar-wrapper img {content:url(https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/UNMSM_coatofarms_seal.svg/1200px-UNMSM_coatofarms_seal.svg.png); width:50px; height:auto;}
    .swagger-ui .topbar { background-color: #000000; border-bottom: 20px solid #CB244D; }`,
    customSiteTitle: 'Contatec API',
  };

  SwaggerModule.setup('/', app, document, customOptions);

  //Middlewares
  app
    .use(cors())
    .use(helmet())
    .use(bodyParser.json())
    .use(
      bodyParser.urlencoded({
        extended: true,
      }),
    )
    .use(cookieParser())
    .use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 100, //  limitar cada hasta 100 solicitudes por ventana
      }),
    );

  //Cors
  // app.enableCors();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
