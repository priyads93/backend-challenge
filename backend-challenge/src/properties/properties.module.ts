import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { Node } from 'src/nodes/entities/node.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Property, Node])],
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
