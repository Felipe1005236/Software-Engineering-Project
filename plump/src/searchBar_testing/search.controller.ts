import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchDto } from './search.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // For later

@Controller('search')
// @UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query() searchDto: SearchDto) {
    console.log('✅ Controller received searchTerm:', searchDto.searchTerm);
    return this.searchService.genericSearch(searchDto.searchTerm);
  }
}

