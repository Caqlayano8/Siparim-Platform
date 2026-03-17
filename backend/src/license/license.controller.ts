import { Controller, Get } from '@nestjs/common';
import { LicenseService } from './license.service';

@Controller('license')
export class LicenseController {
  constructor(private licenseService: LicenseService) {}

  @Get('status')
  getStatus() {
    return this.licenseService.getLicenseStatus();
  }
}
