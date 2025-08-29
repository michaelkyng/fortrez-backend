import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/users/user.module'
import { CampaignModule } from './modules/campaigns/campaign.module'
import { DonationModule } from './modules/donations/donation.module'
import { BlockchainModule } from './modules/blockchain/blockchain.module'
import { BlogModule } from './modules/blog/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
    UserModule,
    CampaignModule,
    DonationModule,
    BlockchainModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
