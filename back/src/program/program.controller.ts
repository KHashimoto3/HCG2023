import { Body, Controller, Get, Post } from '@nestjs/common';
import { ExecInputDto } from './dto/exec-input.dto';
import { HttpService } from '@nestjs/axios';
import { WandboxOutputDto } from './dto/wandbox-output.dto';
import { lastValueFrom, map } from 'rxjs';
import { ErrorResolveInputDto } from './dto/error-resolve-input.dto';

@Controller('program')
export class ProgramController {
    constructor(private readonly  httpService: HttpService) {}

    @Get('hello')
    hello(): {message: string} {
        return {message: "hello program api!"};
    }
    @Post('exec')
    async execCode(@Body() execInputDto: ExecInputDto) {
        const code = execInputDto.code;
        const input = execInputDto.input;

        let bodyData;
        if (input == "none") {
            bodyData = {
                code: code,
                options: "warning,gnu++1y",
                compiler: "gcc-head",
                "compiler-option-raw": "-Dx=hogefuga\n-O3",
            }
        } else {
            bodyData = {
                code: code,
                stdin: input,
                options: "warning,gnu++1y",
                compiler: "gcc-head",
                "compiler-option-raw": "-Dx=hogefuga\n-O3",
            }
        }

        const url = "https://wandbox.org/api/compile.json";
        const bodyObj = JSON.stringify(bodyData);
        let result: WandboxOutputDto;

        try {
            result = await lastValueFrom(
            this.httpService.post(url, bodyObj).pipe(map((response) => response.data))
        )
        }catch(e) {
            console.log(e.response);
            return {error: e.response}
        }
        
        
        //結果によって返すものを変える
        if (result.status == "0") {
            return {status: "success", error: []};
        } else {
            //エラーごとに分割して配列に格納
            let errors: string[] = [];
            result.compiler_error.split('prog.cc:').forEach((value) => {
                console.log(value);
                errors.push(value);
            })
            return {status: "error", error: errors};
        }
    }

    @Post('/error-resolve')
    errorResolve(@Body() errorResolveDto: ErrorResolveInputDto) {
        return {status: "hello! error-resolve api!"};
    }
}
