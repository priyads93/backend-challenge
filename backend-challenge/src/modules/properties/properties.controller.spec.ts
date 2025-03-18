/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { Property } from '../../entities/property.entity';

const mockPropertiesService = {
  create: jest.fn(),
};

describe('PropertiesController', () => {
  let controller: PropertiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertiesController],
      providers: [
        {
          provide: PropertiesService,
          useValue: mockPropertiesService,
        },
      ],
    }).compile();

    controller = module.get<PropertiesController>(PropertiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    jest.spyOn(mockPropertiesService, 'create').mockReturnValue(property);

    // act
    const result = await controller.create(createPropertyDto);

    // assert
    expect(mockPropertiesService.create).toHaveBeenCalled();
    expect(mockPropertiesService.create).toHaveBeenCalledWith(
      createPropertyDto,
    );

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
      await controller.create(createPropertyDto);
    } catch (error) {
      expect(error.response).toStrictEqual({
        message: 'Not a valid node',
        error: 'Not Found',
        statusCode: 404,
      });
    }
  });
});
