import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { EntityManager, Repository } from 'typeorm';
import { Node } from '../nodes/entities/node.entity';
import { Property } from './entities/property.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Node)
    private readonly nodesRepository: Repository<Node>,
    private readonly entityManager: EntityManager,
  ) {}
  //create the property in DB
  async create(createPropertyDto: CreatePropertyDto) {
    const validNode = await this.nodesRepository.findOne({
      where: { id: createPropertyDto.nodeId },
    });
    // if the node is valid property will be created otherwise exception will be thrown
    if (!validNode) {
      throw new NotFoundException('Not a valid node');
    }

    const property = new Property({
      name: createPropertyDto.name,
      value: createPropertyDto.value,
      nodeId: createPropertyDto.nodeId,
    });
    return this.entityManager.save(property);
  }
}
