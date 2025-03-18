import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNodeDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  parent?: string;
}
