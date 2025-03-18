import { Module } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { Node } from '../../entities/node.entity';
import { NodesController } from './nodes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from '../../entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Node, Property])],
  controllers: [NodesController],
  providers: [NodesService],
})
export class NodesModule {}
