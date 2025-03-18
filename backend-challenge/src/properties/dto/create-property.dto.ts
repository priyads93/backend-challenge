import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePropertyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 10 })
  value: number;

  @IsNotEmpty()
  @IsNumber()
  nodeId: number;
}
