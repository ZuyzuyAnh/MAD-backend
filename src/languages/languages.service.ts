import { Injectable } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from './entities/language.entity';
import NotfoundException from '../exception/notfound.exception';
import { PaginateDto } from '../common/dto/paginate.dto';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  async create(createLanguageDto: CreateLanguageDto): Promise<Language> {
    const language = this.languageRepository.create(createLanguageDto);
    return await this.languageRepository.save(language);
  }

  async findAll(paginateDto: PaginateDto, name?: string) {
    const { page, limit } = paginateDto;

    const queryBuilder = this.languageRepository.createQueryBuilder('language');

    if (name) {
      queryBuilder.andWhere('language.name LIKE :name', {
        name: `%${name}%`,
      });
    }

    const total = await queryBuilder.getCount();

    const languages = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('language.created_at', 'DESC')
      .getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data: languages,
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

  async findOne(id: number): Promise<Language> {
    const language = await this.languageRepository.findOneBy({ id });

    if (!language) {
      throw new NotfoundException('language', 'id', id);
    }

    return language;
  }

  async update(
    id: number,
    updateLanguageDto: UpdateLanguageDto,
  ): Promise<Language> {
    const language = await this.findOne(id);

    Object.assign(language, updateLanguageDto);

    return await this.languageRepository.save(language);
  }

  async remove(id: number): Promise<void> {
    const language = await this.findOne(id);
    await this.languageRepository.remove(language);
  }
}
