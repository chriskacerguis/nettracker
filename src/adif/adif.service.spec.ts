import { Test, TestingModule } from '@nestjs/testing';
import { AdifService } from './adif.service';

describe('AdifService', () => {
  let service: AdifService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdifService],
    }).compile();

    service = module.get<AdifService>(AdifService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
