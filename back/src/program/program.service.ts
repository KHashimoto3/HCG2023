import { Injectable } from '@nestjs/common';

@Injectable()
export class ProgramService {
    execCode(code: string, input: string) {
        if (input == "") {
            const bodyData = {
                code: code,
                options: "warning,gnu++1y",
                compiler: "gcc-head",
                "compiler-option-raw": "-Dx=hogefuga\n-O3",
            }
        }
    }
}
