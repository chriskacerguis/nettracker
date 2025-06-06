import { PartialType } from '@nestjs/mapped-types';
import { CreateAdifDto } from './create-adif.dto';

export class UpdateAdifDto extends PartialType(CreateAdifDto) {}
