import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json');

const DEFAULT_SETTINGS = {
  courierServiceEnabled: true,
  maintenanceMode: false,
  paymentSettings: {
    provider: 'iyzico',
    testMode: true,
    apiKey: '',
    secretKey: '',
  },
};

@Injectable()
export class SettingsService {
  private ensureFile() {
    const dir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
    }
  }

  getSettings(): Record<string, any> {
    this.ensureFile();
    try {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  updateSettings(updates: Record<string, any>): Record<string, any> {
    this.ensureFile();
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2));
    return updated;
  }
}
