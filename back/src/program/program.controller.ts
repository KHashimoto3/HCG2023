import { Controller, Get } from '@nestjs/common';

@Controller('program')
export class ProgramController {
    @Get('hello')
    hello(): {message: string} {
        return {message: "hello program api!"};
    }
}
