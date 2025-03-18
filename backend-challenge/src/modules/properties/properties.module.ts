import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from '../../entities/property.entity';
import { Node } from '../../entities/node.entity';
import { PropertiesService } from './properties.service';

@Module({
  imports: [TypeOrmModule.forFeature([Property, Node])],
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
