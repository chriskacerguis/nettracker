import { IsString, IsOptional } from 'class-validator';

export class CreateAdifDto {
  @IsString()
  rstRcvd!: string;

  @IsString()
  rstSent!: string;

  @IsString()
  call!: string;

  @IsString()
  operator!: string;

  @IsString()
  timeOn!: string;

  @IsString()
  qsoDate!: string;

  @IsString()
  freq!: string;

  @IsString()
  band!: string;

  @IsString()
  mode!: string;

  @IsString()
  txPwr!: string;

  @IsString()
  name!: string;

  @IsString()
  gridSquare!: string;

  @IsString()
  state!: string;

  @IsString()
  qth!: string;

  @IsString()
  country!: string;

  @IsString()
  cnty!: string;

  @IsString()
  myGridSquare!: string;

  @IsOptional()
  @IsString()
  sigInfo?: string;

  @IsOptional()
  @IsString()
  mySigInfo?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  comment?: string;
}
