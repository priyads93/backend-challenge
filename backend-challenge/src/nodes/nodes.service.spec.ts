/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { NodesService } from './nodes.service';
import { EntityManager } from 'typeorm';
import { CreateNodeDto } from './dto/create-node.dto';
import { Node } from './entities/node.entity';
import { PropertiesService } from '../properties/properties.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Property } from '../properties/entities/property.entity';

const mockEntityManager = {
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  getTreeRepository: jest.fn().mockReturnValue({
    findTrees: jest.fn().mockReturnValue([]),
    findDescendantsTree: jest.fn().mockReturnValue([]),
  }),
};

const mockNodesRepository = {
  findOne: jest.fn((input: { where: { id: number } }) => {
    if (input.where.id === 1) {
      return {
        id: 1,
        name: 'Alpha PC',
      };
    }
  }),
};

describe('NodesService', () => {
  let service: NodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NodesService,
        PropertiesService,
        { provide: getRepositoryToken(Node), useValue: mockNodesRepository },
        { provide: getRepositoryToken(Property), useValue: {} },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<NodesService>(NodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create => Should create a new node and return its data', async () => {
    const createNodeDto = {
      name: 'Alpha PC',
      properties: [],
      parent: undefined,
    } as CreateNodeDto;

    const node = {
      id: 1,
      name: 'Alpha PC',
      properties: [],
      parent: undefined,
    } as Partial<Node>;

    jest.spyOn(mockEntityManager, 'save').mockReturnValue(node);

    // act
    const result = await service.create(createNodeDto);

    // assert
    expect(mockEntityManager.save).toHaveBeenCalled();
    expect(mockEntityManager.save).toHaveBeenCalledWith(createNodeDto);

    expect(result).toEqual(node);
  });

  it('create => Should create a new node, along with parent and return its data', async () => {
    // arrange
    const createNodeDto = {
      name: 'Processing',
      properties: [],
      parent: '1',
    };

    const node = {
      id: 2,
      name: 'Processing',
      properties: [],
      parent: {
        id: 1,
        name: 'Alpha PC',
      },
    };

    jest.spyOn(mockEntityManager, 'save').mockReturnValue(node);

    // act
    const result = await service.create(createNodeDto);

    // assert
    expect(mockNodesRepository.findOne).toHaveBeenCalled();
    expect(mockNodesRepository.findOne).toHaveBeenCalledWith({
      relations: undefined,
      where: { id: 1 },
    });
    expect(mockEntityManager.save).toHaveBeenCalled();
    expect(mockEntityManager.save).toHaveBeenCalledWith({
      ...createNodeDto,
      parent: { id: 1, name: 'Alpha PC' },
    });

    expect(result).toEqual(node);
  });

  it('create => Results in error when invalid parent Id is supplied', async () => {
    // arrange
    const createNodeDto = {
      name: 'CPU',
      properties: [],
      parent: '2',
    };
    try {
      await service.create(createNodeDto);
    } catch (error) {
      expect(error.response).toStrictEqual({
        message: 'Not a valid parent node',
        error: 'Not Found',
        statusCode: 404,
      });
    }
  });

  it('findAllTrees => Should return all trees present in DB', async () => {
    const response = await service.findAll();
    // assert
    expect(mockEntityManager.getTreeRepository().findTrees).toHaveBeenCalled();
    console.log('response', response);
    expect(response).toEqual([]);
  });

  it('findAllTreesByNodeId => Should return specific trees present in DB', async () => {
    const response = await service.findAll('1');
    // assert
    expect(mockNodesRepository.findOne).toHaveBeenCalled();
    expect(
      mockEntityManager.getTreeRepository().findDescendantsTree,
    ).toHaveBeenCalled();
    expect(response).toEqual([]);
  });
});
