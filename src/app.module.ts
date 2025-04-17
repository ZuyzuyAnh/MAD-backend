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
import { QuestionsModule } from './questions/questions.module';
import { ExamsModule } from './exams/exams.module';
import { VocabGamesModule } from './vocab_games/vocab_games.module';
import { VocabGameChallangesModule } from './vocab_game_challanges/vocab_game_challanges.module';
import { UserSessionModule } from './user_session/user_session.module';
import { ExerciseResultsModule } from './exercise_results/exercise-results.module';
import { VocabTopicProgressModule } from './vocab_topic_progress/vocab_topic_progress.module';
import { ExerciseQuestionsModule } from './exercise_questions/exercise_questions.module';
import { ExamSectionsModule } from './exam_sections/exam_sections.module';
import { ExamSectionItemsModule } from './exam_section_items/exam_section_items.module';
import { ExamSingleQuestionsModule } from './exam_single_questions/exam_single_questions.module';
import { ExamResultsModule } from './exam_results/exam_results.module';
import { PostsModule } from './posts/posts.module';
import { PostLikesModule } from './post_likes/post_likes.module';
import { PostCommentsModule } from './post_comments/post_comments.module';

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
    // BootstrapModule,
    ProgressModule,
    ExercisesModule,
    VocabRepetitionsModule,
    QuestionsModule,
    ExamsModule,
    VocabGamesModule,
    VocabGameChallangesModule,
    UserSessionModule,
    ExerciseResultsModule,
    VocabTopicProgressModule,
    ExerciseQuestionsModule,
    ExamSectionsModule,
    ExamSectionItemsModule,
    ExamSingleQuestionsModule,
    ExamResultsModule,
    PostsModule,
    PostLikesModule,
    PostCommentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
