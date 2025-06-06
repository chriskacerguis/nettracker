import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdifService } from './adif.service';
import { AdifValidationPipe } from './pipes/adif-validation.pipe';
import { CreateAdifDto } from './dto/create-adif.dto';
import { UpdateAdifDto } from './dto/update-adif.dto';

@Controller('adif')
export class AdifController {
  constructor(private readonly adifService: AdifService) {}

  @Post()
  create(@Body() createAdifDto: CreateAdifDto) {
    return this.adifService.create(createAdifDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        //.addFileTypeValidator({ fileType: 'text/*' })
        .addMaxSizeValidator({ maxSize: 500 * 1024 }) // 500 KB
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
      new AdifValidationPipe(),
    )
    file: Express.Multer.File,
  ) {
    return this.adifService.uploadFile(file);
  }

  @Get()
  findAll() {
    return this.adifService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adifService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdifDto: UpdateAdifDto) {
    return this.adifService.update(+id, updateAdifDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adifService.remove(+id);
  }
}
