import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function appendSwagger(app: INestApplication) {
  const conf = new DocumentBuilder()
    .setTitle('API DOC')
    .setDescription("desc API")
    .setVersion('1.0')
    .addTag('tag api')
    .build();

  const document = SwaggerModule.createDocument(app, conf);
  SwaggerModule.setup('api', app, document);
}