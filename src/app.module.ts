import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { LanguagesModule } from './languages/languages.module';
import { AwsModule } from './aws/aws.module';
import { VocabTopicsModule } from './vocab_topics/vocab_topics.module';
import { VocabsModule } from './vocabs/vocabs.module';
import { BootstrapModule } from './bootstrap/bootstrap.module';
import { ProgressModule } from './progress/progress.module';
import { ExercisesModule } from './exercises/exercises.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabRepetitionsModule } from './vocab_repetitions/vocab_repetitions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(300),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        AWS_S3_REGION: Joi.string().required(),
        AWS_S3_ACCESSKEY: Joi.string().required(),
        AWS_S3_SECRETKEY: Joi.string().required(),
        AWS_S3_PUBLIC_BUCKET: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    LanguagesModule,
    AwsModule,
    VocabTopicsModule,
    VocabsModule,
    BootstrapModule,
    ProgressModule,
    ExercisesModule,
    VocabRepetitionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
