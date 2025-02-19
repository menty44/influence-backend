import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CampaignModule } from './campaign/campaign.module';
import 'dotenv/config'

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_STRING),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      }),
    UsersModule,
    AuthModule,
    CampaignModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
