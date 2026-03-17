import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  email: string;  // e-posta veya kullanıcı adı

  @IsString()
  password: string;
}
