import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProgramController } from './program/program.controller';
import { ProgramService } from './program/program.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AppController, ProgramController],
  providers: [AppService, ProgramService],
})
export class AppModule {}
