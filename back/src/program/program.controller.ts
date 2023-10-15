import { Body, Controller, Get, Post } from '@nestjs/common';
import { ExecInputDto } from './dto/exec-input.dto';
import { HttpService } from '@nestjs/axios';
import { WandboxOutputDto } from './dto/wandbox-output.dto';
import { lastValueFrom, map } from 'rxjs';
import { ErrorResolveInputDto } from './dto/error-resolve-input.dto';
import { ErrorResolveTableDto } from './dto/error-resolve-table.dto';
import { ErrorResolveMethodsDto } from './dto/error-resolve-methods.dto';

@Controller('program')
export class ProgramController {
  constructor(private readonly httpService: HttpService) {}

  @Get('hello')
  hello(): { message: string } {
    return { message: 'hello program api!' };
  }
  @Post('exec')
  async execCode(@Body() execInputDto: ExecInputDto) {
    const code = execInputDto.code;
    const input = execInputDto.input;

    let bodyData;
    if (input == 'none') {
      bodyData = {
        code: code,
        options: 'warning,gnu++1y',
        compiler: 'gcc-head',
        'compiler-option-raw': '-Dx=hogefuga\n-O3',
      };
    } else {
      bodyData = {
        code: code,
        stdin: input,
        options: 'warning,gnu++1y',
        compiler: 'gcc-head',
        'compiler-option-raw': '-Dx=hogefuga\n-O3',
      };
    }

    const url = 'https://wandbox.org/api/compile.json';
    const bodyObj = JSON.stringify(bodyData);
    let result: WandboxOutputDto;

    try {
      result = await lastValueFrom(
        this.httpService
          .post(url, bodyObj)
          .pipe(map((response) => response.data)),
      );
    } catch (e) {
      console.log(e.response);
      return { error: e.response };
    }

    //結果によって返すものを変える
    if (result.status == '0') {
      return { status: 'success', error: [] };
    } else {
      //エラーごとに分割して配列に格納
      let errors: string[] = [];
      result.compiler_error.split('prog.cc:').forEach((value) => {
        console.log(value);
        errors.push(value);
      });
      return { status: 'error', error: errors };
    }
  }

  @Post('/error-resolve')
  errorResolve(@Body() errorResolveDto: ErrorResolveInputDto) {
    const errors: string[] = errorResolveDto.errors;
    let resolveMethods: ErrorResolveMethodsDto[] = [];
    const errorTable: ErrorResolveTableDto[] = [
      {
        pattern: /was not declared in this scope/,
        description:
          '宣言されていない{name}という名前のものが使用されています。',
        resolveMethod:
          '{name}を宣言するか、宣言してある正しい名前に直してください。',
      },
    ];
    //全てのエラーに対して、errorTableに該当するものがあるかを確認する
    errors.map((errorStr) => {
      if (errorStr != '') {
        console.log('処理するエラー：' + errorStr);
        let findFlag: boolean = false;
        //パターンに一致するかどうか見る
        errorTable.map((checkError) => {
          if (errorStr.match(checkError.pattern)) {
            //TODO: 対象となる行と列を取り出す
            const method: ErrorResolveMethodsDto = {
              error: errorStr,
              row: 0,
              column: 0,
              description: checkError.description,
              method: checkError.resolveMethod,
            };
            resolveMethods.push(method);
            findFlag = true;
          }
        });
        if (!findFlag) {
          const method: ErrorResolveMethodsDto = {
            error: errorStr,
            row: 0,
            column: 0,
            description: 'まれなエラーが発生しています。',
            method: 'TAに尋ねてみてください。',
          };
          resolveMethods.push(method);
        }
      }
    });
    return { resolve: resolveMethods };
  }
}
