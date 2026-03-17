import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const SECRET = 'SIPARIM_LICENSE_SECRET_2024_CAGLAYAN_KURTOGLU';

@Injectable()
export class LicenseService {
  private readonly logger = new Logger(LicenseService.name);
  private isValid = false;
  private licenseInfo: any = null;

  onModuleInit() {
    this.validateLicense();
  }

  private validateLicense() {
    const licenseFile = path.join(process.cwd(), 'license.key');
    if (!fs.existsSync(licenseFile)) {
      this.logger.warn('License key file not found. System will run in demo mode.');
      this.isValid = false;
      return;
    }
    try {
      const content = fs.readFileSync(licenseFile, 'utf-8').trim();
      const [data, signature] = content.split('.');
      const expectedSig = crypto.createHmac('sha256', SECRET).update(data).digest('hex');
      if (signature !== expectedSig) {
        this.logger.error('Invalid license key!');
        this.isValid = false;
        return;
      }
      const decoded = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
      // Check expiry
      if (decoded.expiresAt && new Date(decoded.expiresAt) < new Date()) {
        this.logger.error('License expired!');
        this.isValid = false;
        return;
      }
      // Check domain if domain-locked
      if (decoded.type === 'DOMAIN' && decoded.domain) {
        const currentDomain = process.env.SITE_DOMAIN || 'localhost';
        if (decoded.domain !== currentDomain && decoded.domain !== 'localhost') {
          this.logger.error(`License domain mismatch: ${decoded.domain} vs ${currentDomain}`);
          this.isValid = false;
          return;
        }
      }
      this.isValid = true;
      this.licenseInfo = decoded;
      this.logger.log(`✅ License valid: ${decoded.type} - ${decoded.owner} (${decoded.domain || 'Universal'})`);
    } catch (e) {
      this.logger.error('License validation error:', e.message);
      this.isValid = false;
    }
  }

  getLicenseStatus() {
    return {
      valid: this.isValid,
      info: this.licenseInfo ? {
        owner: this.licenseInfo.owner,
        type: this.licenseInfo.type,
        domain: this.licenseInfo.domain,
        expiresAt: this.licenseInfo.expiresAt,
      } : null,
    };
  }

  isLicenseValid(): boolean {
    return this.isValid;
  }
}
