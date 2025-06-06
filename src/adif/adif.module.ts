import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdifService } from './adif.service';
import { AdifController } from './adif.controller';
import { AdifValidationPipe } from './pipes/adif-validation.pipe';
import { AdifRecord } from './entities/adif.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdifRecord])],
  controllers: [AdifController],
  providers: [AdifService, AdifValidationPipe],
})
export class AdifModule {}
