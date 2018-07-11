// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

import { join } from 'path';

import { FOLDER_CLIENT, FOLDER_DIST } from '@shared/constants';

import { ApplicationModule } from './server.module';
import { Catch, ExceptionFilter, HttpException, NotFoundException } from '@nestjs/common';
import { Response } from 'express';

const app = express();

@Catch(NotFoundException)
class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, response: Response) {
    response.sendFile(join(FOLDER_CLIENT, 'index.html'));
  }
}

async function bootstrap() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(FOLDER_CLIENT));
  }

  const server = await NestFactory.create(ApplicationModule, app, {});

  server.useGlobalFilters(new NotFoundExceptionFilter());

  await server.listen(process.env.PORT || 5400);
}

bootstrap();
