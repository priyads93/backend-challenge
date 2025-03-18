import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNodeDto } from './dto/create-node.dto';
import { Node } from './entities/node.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOptionsRelations, Repository } from 'typeorm';

@Injectable()
export class NodesService {
  constructor(
    @InjectRepository(Node)
    private readonly nodesRepository: Repository<Node>,
    private readonly entityManager: EntityManager,
  ) {}
  // create new node in the database
  async create(createNodeDto: CreateNodeDto) {
    const newNode = new Node({
      ...createNodeDto,
      parent: undefined,
      properties: [],
    });
    let parentNode: Node | null;
    // parent is an optional field (since no parent node for root node)
    if (createNodeDto.parent) {
      parentNode = await this.findOne(parseInt(createNodeDto.parent));
      if (!parentNode) {
        throw new NotFoundException('Not a valid parent node');
      }
      newNode.parent = parentNode;
    }

    return this.entityManager.save(newNode);
  }

  async findAll(nodeId?: string) {
    // if nodeId query variable is included in request we can use find descendants
    if (nodeId) {
      const node = await this.findOne(+nodeId, { properties: true });
      if (node) {
        return this.entityManager
          .getTreeRepository(Node)
          .findDescendantsTree(node, { relations: ['properties'] });
      }
      return [];
    }
    return this.entityManager
      .getTreeRepository(Node)
      .findTrees({ relations: ['properties'] });
  }

  // find the exisiting node details by Id
  async findOne(id: number, relations?: FindOptionsRelations<Node>) {
    return this.nodesRepository.findOne({
      where: { id },
      relations,
    });
  }
}
