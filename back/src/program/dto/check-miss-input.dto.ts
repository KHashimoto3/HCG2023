import { IsNotEmpty } from 'class-validator';

export class CheckMissInputDto {
  @IsNotEmpty()
  code: string;
}
