import {
  PipeTransform,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class AdifValidationPipe implements PipeTransform<Express.Multer.File> {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new UnprocessableEntityException('File must be provided');
    }

    const name = file.originalname.toLowerCase();
    if (!name.endsWith('.adi') && !name.endsWith('.adif')) {
      throw new UnprocessableEntityException(
        'Uploaded file must have .adi or .adif extension',
      );
    }

    const snippet = file.buffer.toString('utf8', 0, 200);
    if (!/<ADIF_VER[:>]/i.test(snippet) && !/<PROGRAMID[:>]/i.test(snippet)) {
      throw new UnprocessableEntityException(
        'File does not appear to be a valid ADIF log',
      );
    }

    return file;
  }
}
