import * as mongoose from 'mongoose';
import { Constants, ProviderTokens } from '../constants';

export const databaseProviders = [
  {
    provide: ProviderTokens.Database,
    useFactory: async() => {
      (mongoose as any).Promise = global.Promise;

      if (Constants.Environment === 'test') {
        // Do MockGoose stuff here
      } else {
        return await mongoose.connect(Constants.DBConnection);
      }
    }
  }
];
