import { Controller, Get } from '@nestjs/common';

@Controller('program')
export class ProgramController {
    @Get()
    hello(): string {
        return "hello! program^-api!";
    }
}
