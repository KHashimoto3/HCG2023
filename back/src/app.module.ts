import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProgramController } from './program/program.controller';
import { ProgramService } from './program/program.service';

@Module({
  imports: [],
  controllers: [AppController, ProgramController],
  providers: [AppService, ProgramService],
})
export class AppModule {}
