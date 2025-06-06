import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { parseAdifText } from './adif-parser.util';
import { CreateAdifDto } from './dto/create-adif.dto';
import { UpdateAdifDto } from './dto/update-adif.dto';
import { AdifRecord } from './entities/adif.entity';

const REQUIRED_TAGS = [
  'RST_RCVD',
  'RST_SENT',
  'CALL',
  'OPERATOR',
  'TIME_ON',
  'QSO_DATE',
  'FREQ',
  'BAND',
  'MODE',
  'TX_PWR',
  'NAME',
  'GRIDSQUARE',
  'STATE',
  'QTH',
  'COUNTRY',
  'CNTY',
  'MY_GRIDSQUARE',
];

@Injectable()
export class AdifService {
  constructor(
    @InjectRepository(AdifRecord)
    private readonly adifRepo: Repository<AdifRecord>,
  ) {}

  create(createAdifDto: CreateAdifDto) {
    console.log('Creating adif with data:', createAdifDto);
    return 'This action adds a new adif';
  }

  async uploadFile(file: Express.Multer.File): Promise<AdifRecord[]> {
    const text: string = file.buffer.toString('utf8');

    let rawRecords: Array<Record<string, string>>;

    try {
      rawRecords = parseAdifText(text);
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new BadRequestException('Failed to parse ADIF: ' + msg);
    }

    const entities: AdifRecord[] = rawRecords.map((rec, idx) => {
      const missing = REQUIRED_TAGS.filter((tag) => !rec[tag]);
      if (missing.length) {
        throw new BadRequestException(
          `ADIF record #${idx + 1} missing required tags: ${missing.join(', ')}`,
        );
      }

      const plain: Partial<AdifRecord> = {
        rstRcvd: rec.RST_RCVD,
        rstSent: rec.RST_SENT,
        call: rec.CALL,
        operator: rec.OPERATOR,
        timeOn: rec.TIME_ON,
        qsoDate: rec.QSO_DATE,
        freq: rec.FREQ,
        band: rec.BAND,
        mode: rec.MODE,
        txPwr: rec.TX_PWR,
        name: rec.NAME,
        gridSquare: rec.GRIDSQUARE,
        state: rec.STATE,
        qth: rec.QTH,
        country: rec.COUNTRY,
        cnty: rec.CNTY,
        myGridSquare: rec.MY_GRIDSQUARE,
        // Optional tags:
        sigInfo: rec.SIG_INFO,
        mySigInfo: rec.MY_SIG_INFO,
        notes: rec.NOTES,
        comment: rec.COMMENT,
      };

      return this.adifRepo.create(plain);
    });

    const saved = await this.adifRepo.save(entities);
    return saved;
  }

  findAll() {
    return this.adifRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} adif`;
  }

  update(id: number, updateAdifDto: UpdateAdifDto) {
    console.log('Updating adif with id:', id, 'and data:', updateAdifDto);
    return `This action updates a #${id} adif`;
  }

  remove(id: number) {
    return `This action removes a #${id} adif`;
  }
}
