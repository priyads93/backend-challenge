/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { NodesController } from './nodes.controller';
import { NodesService } from './nodes.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Node } from '../../entities/node.entity';

const mockNodesService = {
  findAll: jest.fn(),
  create: jest.fn(),
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

describe('NodesController', () => {
  let controller: NodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NodesController],
      providers: [
        {
          provide: NodesService,
          useValue: mockNodesService,
        },
        { provide: getRepositoryToken(Node), useValue: mockNodesRepository },
      ],
    }).compile();

    controller = module.get<NodesController>(NodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    jest.spyOn(mockNodesService, 'create').mockReturnValue(node);

    // act
    const result = await controller.create(createNodeDto);

    // assert
    expect(mockNodesService.create).toHaveBeenCalled();
    expect(mockNodesService.create).toHaveBeenCalledWith(createNodeDto);

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
    jest.spyOn(mockNodesService, 'create').mockReturnValue(node);
    const result = await controller.create(createNodeDto);

    expect(mockNodesService.create).toHaveBeenCalled();

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
      await controller.create(createNodeDto);
    } catch (error) {
      expect(error.response).toStrictEqual({
        message: 'Not a valid parent node',
        error: 'Not Found',
        statusCode: 404,
      });
    }
  });
});
