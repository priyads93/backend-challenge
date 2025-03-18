/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { NodesService } from '../nodes/nodes.service';
import { Property } from '../../entities/property.entity';
import { Node } from '../../entities/node.entity';
import { PropertiesService } from './properties.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreatePropertyDto } from './dto/create-property.dto';

const mockEntityManager = {
  save: jest.fn(),
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

describe('PropertiesService', () => {
  let service: PropertiesService;

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

    service = module.get<PropertiesService>(PropertiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create => Should create a new property and return its data', async () => {
    // arrange
    const createPropertyDto = {
      name: 'Height',
      value: 450.0,
      nodeId: 1,
    } as CreatePropertyDto;

    const property = {
      id: 1,
      name: 'Height',
      value: 450.0,
    } as Partial<Property>;

    jest.spyOn(mockEntityManager, 'save').mockReturnValue(property);

    // act
    const result = await service.create(createPropertyDto);

    // assert
    expect(mockEntityManager.save).toHaveBeenCalled();
    expect(mockEntityManager.save).toHaveBeenCalledWith(createPropertyDto);

    expect(result).toEqual(property);
  });

  it('create => Results in error when invalid node Id is supplied', async () => {
    // arrange
    const createPropertyDto = {
      name: 'Height',
      value: 450.0,
      nodeId: 2,
    } as CreatePropertyDto;

    try {
      await service.create(createPropertyDto);
    } catch (error) {
      expect(error.response).toStrictEqual({
        message: 'Not a valid node',
        error: 'Not Found',
        statusCode: 404,
      });
    }
  });
});
