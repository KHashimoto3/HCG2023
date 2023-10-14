import { IsNotEmpty } from 'class-validator';

export class ExecInputDto {
    @IsNotEmpty()
    code: string;
    @IsNotEmpty()
    input: string;
}