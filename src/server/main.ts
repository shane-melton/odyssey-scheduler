// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

import { join } from 'path';

import { FOLDER_CLIENT, FOLDER_DIST } from '../shared/constants';

import { ApplicationModule } from './server.module';

const app = express();

async function bootstrap() {
  if (process.env.NODE_ENV === 'production') {

    app.use(express.static(join(FOLDER_DIST, FOLDER_CLIENT)));
  }

  const server = await NestFactory.create(ApplicationModule, app);

  await server.listen(process.env.PORT || 3666);
}

bootstrap();
