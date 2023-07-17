import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DefaultConfig } from 'src/config/default.config';

export const setSwagger = (app: any) => {
  const config = new DocumentBuilder()
    .setTitle(DefaultConfig.swagger.title)
    .setDescription(DefaultConfig.swagger.description)
    .setVersion(DefaultConfig.swagger.version)
    .addTag(DefaultConfig.swagger.tag)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
};
