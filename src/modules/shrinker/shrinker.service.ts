import { Injectable } from '@nestjs/common';
import Hashids from 'hashids';

@Injectable()
export class ShrinkerService {
  async getShortUrl(id: number): Promise<string> {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const minLength = 1;
    const hashids = new Hashids('', minLength, alphabet);
    const result = hashids.encode(id);
    return result;
  }
}
