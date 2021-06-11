import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Configuracion de swagger
  const config = new DocumentBuilder()
    .setTitle('Documentacion de proyecto')
    .setDescription('Proyecto similar a workana / chambeala')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  //Middlewares
  app
    .use(helmet())
    .use(bodyParser.json())
    .use(
      bodyParser.urlencoded({
        extended: true,
      }),
    )
    .use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 100, //  limitar cada hasta 100 solicitudes por ventana
      }),
    );

  //Prefijo
  app.setGlobalPrefix('api');
  //Cors
  app.enableCors();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
