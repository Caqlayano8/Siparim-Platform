import { Controller, Get } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('admin')
export class PublicSettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('public-settings')
  getPublicSettings() {
    const settings = this.settingsService.getSettings();
    return {
      supportPhone: settings.supportPhone,
      supportWhatsappEnabled: settings.supportWhatsappEnabled,
      supportWhatsappMessage: settings.supportWhatsappMessage,
    };
  }
}
