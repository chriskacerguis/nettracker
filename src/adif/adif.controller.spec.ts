// src/adif/adif.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AdifController } from './adif.controller';
import { AdifService } from './adif.service';
import { CreateAdifDto } from './dto/create-adif.dto';
import { UpdateAdifDto } from './dto/update-adif.dto';
import type { Express } from 'express';

describe('AdifController', () => {
  let controller: AdifController;
  let service: Partial<Record<keyof AdifService, jest.Mock>>;

  beforeEach(async () => {
    // Create a partial mock of AdifService with jest.fn() for each method
    service = {
      create: jest.fn(),
      uploadFile: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdifController],
      providers: [
        {
          provide: AdifService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<AdifController>(AdifController);
  });

  describe('create', () => {
    it('should call adifService.create with the provided DTO and return its result', async () => {
      const dto: CreateAdifDto = {
        /* populate required fields */
      };
      const expected = { id: 1, ...dto };
      (service.create as jest.Mock).mockResolvedValueOnce(expected);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('uploadFile', () => {
    it('should call adifService.uploadFile with the provided file and return its result', async () => {
      // Create a minimal mock file fulfilling Express.Multer.File
      const mockFile: Partial<Express.Multer.File> = {
        originalname: 'test.adi',
        buffer: Buffer.from('<ADIF_VER: 3.1><PROGRAMID:Test>'),
        mimetype: 'text/plain',
        size: 100,
        fieldname: 'file',
        encoding: '7bit',
        destination: '/tmp',
        filename: 'test.adi',
        path: '/tmp/test.adi',
      };
      const expectedResponse = { recordsImported: 5 };
      (service.uploadFile as jest.Mock).mockResolvedValueOnce(expectedResponse);

      const result = await controller.uploadFile(mockFile as Express.Multer.File);

      expect(service.uploadFile).toHaveBeenCalledWith(mockFile);
      expect(result).toEqual(expectedResponse);
    });

    it('should propagate errors from the service', async () => {
      const mockFile: Partial<Express.Multer.File> = {
        originalname: 'invalid.txt',
        buffer: Buffer.from('not-adif-content'),
      };
      const error = new Error('Invalid ADIF');
      (service.uploadFile as jest.Mock).mockRejectedValueOnce(error);

      await expect(
        controller.uploadFile(mockFile as Express.Multer.File),
      ).rejects.toThrow(error);
      expect(service.uploadFile).toHaveBeenCalledWith(mockFile);
    });
  });

  describe('findAll', () => {
    it('should return an array of ADIF records from the service', async () => {
      const expected = [{ id: 1 }, { id: 2 }];
      (service.findAll as jest.Mock).mockResolvedValueOnce(expected);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a single ADIF record for the provided id', async () => {
      const id = '42';
      const expected = { id: 42 };
      (service.findOne as jest.Mock).mockResolvedValueOnce(expected);

      const result = await controller.findOne(id);
      expect(service.findOne).toHaveBeenCalledWith(42);
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should call adifService.update with numeric id and DTO, and return its result', async () => {
      const id = '7';
      const dto: UpdateAdifDto = {
        /* populate optional fields */
      };
      const expected = { id: 7, ...dto };
      (service.update as jest.Mock).mockResolvedValueOnce(expected);

      const result = await controller.update(id, dto);
      expect(service.update).toHaveBeenCalledWith(7, dto);
      expect(result).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('should call adifService.remove with numeric id and return its result', async () => {
      const id = '13';
      const expected = { deleted: true };
      (service.remove as jest.Mock).mockResolvedValueOnce(expected);

      const result = await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(13);
      expect(result).toEqual(expected);
    });
  });
});
