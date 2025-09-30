import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { News } from './entities/news.entity';
import { S3Service } from '../common/aws/s3.service';
@Module({
    imports: [TypeOrmModule.forFeature([News])],
    controllers: [NewsController],
    providers: [NewsService, S3Service],
})
export class NewsModule {
}
