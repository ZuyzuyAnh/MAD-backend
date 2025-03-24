import { Injectable } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from './entities/language.entity';
import DuplicateEntityException from '../exception/duplicate-entity.exception';
import NotfoundException from '../exception/notfound.exception';
import { PaginateDto } from '../common/dto/paginate.dto';
import { UploadFileService } from 'src/aws/uploadfile.s3.service';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
    private readonly uploadFileService: UploadFileService,
  ) {}

  async create(
    createLanguageDto: CreateLanguageDto,
    flag?: Express.Multer.File,
  ) {
    const existingLanguage = await this.languageRepository.findOneBy({
      name: createLanguageDto.name,
    });

    if (existingLanguage) {
      throw new DuplicateEntityException(
        'language',
        'name',
        createLanguageDto.name,
      );
    }

    const language = this.languageRepository.create(createLanguageDto);

    if (flag) {
      language.flag_url =
        await this.uploadFileService.uploadFileToPublicBucket(flag);
    }

    return this.languageRepository.save(language);
  }

  async findAll(paginateDto: PaginateDto, name?: string) {
    const { page, limit } = paginateDto;

    const queryBuilder = this.languageRepository.createQueryBuilder('language');

    if (name) {
      queryBuilder.where('language.name LIKE :name', { name: `%${name}%` });
    }

    const total = await queryBuilder.getCount();

    const results = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('language.name', 'ASC')
      .getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data: results,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: number) {
    const language = await this.languageRepository.findOneBy({ id });

    if (!language) {
      throw new NotfoundException('language', 'id', id);
    }

    return language;
  }

  async update(
    id: number,
    updateLanguageDto: UpdateLanguageDto,
    flag?: Express.Multer.File,
  ) {
    const language = await this.findOne(id);

    if (updateLanguageDto.name && updateLanguageDto.name !== language.name) {
      const existingLanguage = await this.languageRepository.findOneBy({
        name: updateLanguageDto.name,
      });

      if (existingLanguage) {
        throw new DuplicateEntityException(
          'language',
          'name',
          updateLanguageDto.name,
        );
      }
    }

    if (flag) {
      updateLanguageDto.flag_url =
        await this.uploadFileService.uploadFileToPublicBucket(flag);
    }

    Object.assign(language, updateLanguageDto);
    return this.languageRepository.save(language);
  }

  async remove(id: number) {
    const language = await this.findOne(id);

    if (!language) {
      throw new NotfoundException('language', 'id', id);
    }

    return this.languageRepository.remove(language);
  }
}
