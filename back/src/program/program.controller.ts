import { Body, Controller, Get, Post } from '@nestjs/common';
import { ExecInputDto } from './dto/exec-input.dto';

@Controller('program')
export class ProgramController {
    @Get('hello')
    hello(): {message: string} {
        return {message: "hello program api!"};
    }
    @Post('exec')
    execCode(@Body() execInputDto: ExecInputDto): {message: string} {
        return {message: "hello exec api!"};
    }
}
