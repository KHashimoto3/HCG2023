import { IsNotEmpty } from "class-validator";

export class ErrorResolveInputDto {
    @IsNotEmpty()
    errors: string[];
}