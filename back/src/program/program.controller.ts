import { Body, Controller, Get, Post } from '@nestjs/common';
import { ExecInputDto } from './dto/exec-input.dto';
import { HttpService } from '@nestjs/axios';
import { WandboxOutputDto } from './dto/wandbox-output.dto';
import { lastValueFrom, map } from 'rxjs';
import { ErrorResolveInputDto } from './dto/error-resolve-input.dto';
import { ErrorResolveTableDto } from './dto/error-resolve-table.dto';
import { ErrorResolveMethodsDto } from './dto/error-resolve-methods.dto';
import { CheckMissInputDto } from './dto/check-miss-input.dto';
import { MissTableDto } from './dto/miss-table.dto';
import { FindMissesDto } from './dto/find-misses.dto';

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
        compiler: 'gcc-13.2.0-c',
        'compiler-option-raw': '-Dx=hogefuga\n-O3',
      };
    } else {
      bodyData = {
        code: code,
        stdin: input,
        options: 'warning,gnu++1y',
        compiler: 'gcc-13.2.0-c',
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
      console.log('ローデータ：' + result.compiler_error);
      result.compiler_error.split('prog.c:').forEach((value, index) => {
        console.log(index + '番目：' + value);
        if (value.match(/\d+:\d+:/)) {
          console.log(index + '番目を処理');
          console.log(value);
          errors.push(value);
        }
      });
      return { status: 'error', error: errors };
    }
  }

  @Post('/error-resolve')
  errorResolve(@Body() errorResolveDto: ErrorResolveInputDto) {
    const errors: string[] = errorResolveDto.errors;
    let resolveMethods: ErrorResolveMethodsDto[] = [];
    //変更場所: エラーのパターンや説明を追加するにはここを編集する
    const errorTable: ErrorResolveTableDto[] = [
      {
        pattern: /expected '\S+' before '\S+'/,
        description:
          '{position}の前に、{name}があるはずですが、忘れているようです。',
        resolveMethod: '{position}の前に、{name}を追加してください。',
      },
      {
        pattern: /expected declaration or statement at end of input/,
        description: '閉じの中カッコの数が足りません。',
        resolveMethod:
          '開きカッコと閉じカッコの対応が取れているか確認してください。',
      },
      {
        pattern: /undeclared (first use in this function)/,
        description: '宣言されていない変数{name}を使おうとしています。',
        resolveMethod: '変数{name}を宣言するか、正しい変数名に直してください。',
      },
      {
        pattern: /implicit declaration of function '\S+'; did you mean '\S+'? /,
        description:
          '宣言されていない関数{name}を使おうとしています。{name}の間違いですか？',
        resolveMethod: '関数{name}を宣言するか、正しい関数名に直してください。',
      },
      {
        pattern: /implicit declaration of function '\S+' /,
        description: '宣言されていない関数{name}を使おうとしています。',
        resolveMethod: '関数{name}を宣言するか、正しい関数名に直してください。',
      },
      {
        pattern: /\S+: No such file or directory/,
        description: '{name}は存在しないファイルです。',
        resolveMethod:
          '{name}というファイルを作成するか、正しいファイル名（パス）に直してください',
      },
      {
        pattern: /incompatible implicit declaration of built-in function '\S+'/,
        description: '{name}は存在しないファイルです。',
        resolveMethod:
          '{name}というファイルを作成するか、正しいファイル名（パス）に直してください',
      },
    ];
    //全てのエラーに対して、errorTableに該当するものがあるかを確認する
    const placeTmp = /:/; //行と列の場所を取り出すためのテンプレ
    errors.map((errorStr) => {
      if (errorStr != '') {
        const place = errorStr.split(placeTmp);
        let findFlag: boolean = false;
        //パターンに一致するかどうか見る
        errorTable.map((checkError) => {
          if (errorStr.match(checkError.pattern)) {
            //エラー文と説明文、解決方法の文をreplaceNameに渡し、{name}を置き換える
            const [newErrorStr, newDescription, newMethod] = this.replaceName(
              errorStr,
              checkError.description,
              checkError.resolveMethod,
            );
            const method: ErrorResolveMethodsDto = {
              error: newErrorStr,
              row: Number(place[0]),
              column: Number(place[1]),
              description: newDescription,
              method: newMethod,
            };
            resolveMethods.push(method);
            findFlag = true;
          }
        });
        if (!findFlag) {
          const method: ErrorResolveMethodsDto = {
            error: errorStr,
            row: Number(place[0]),
            column: Number(place[1]),
            description: 'まれなエラーが発生しています。',
            method: 'TAに尋ねてみてください。',
          };
          resolveMethods.push(method);
        }
      }
    });
    return { resolve: resolveMethods };
  }

  @Post('check-miss')
  checkMiss(@Body() checkMissInputDto: CheckMissInputDto) {
    const code = checkMissInputDto.code;
    let findMisses: FindMissesDto[] = [];
    const missTable: MissTableDto[] = [
      { pattern: /int a;/, description: '説明' },
    ];
    //コードの行ごとにミスが含まれるかを確かめる
    const splitCode: string[] = code.split('\\n');
    splitCode.map((row, index) => {
      missTable.map((miss) => {
        if (row.match(miss.pattern)) {
          console.log('missを発見しました');
          const findMiss: FindMissesDto = {
            row: index + 1,
            column: 0,
            description: miss.description,
          };
          findMisses.push(findMiss);
        }
      });
    });
    return { misses: findMisses };
  }

  //エラー文と説明文、解決方法の文を受け取って、{name}を置き換える
  replaceName(error: string, description: string, method: string): string[] {
    //受け取ったerrorから、''で囲まれた文字列を取り出す
    const nameTmp = /'\S+'/;
    const name = error.match(nameTmp)[0];
    const errorStr = error.replace('{name}', name);
    const descriptionStr = description.replace('{name}', name);
    const methodStr = method.replace('{name}', name);
    console.log(
      '置き換え後の説明文と解決方法文: ' + descriptionStr + ' ' + methodStr,
    );
    return [errorStr, descriptionStr, methodStr];
  }
}
