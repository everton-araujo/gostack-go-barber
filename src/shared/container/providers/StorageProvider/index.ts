import { container } from 'tsyringe';
import uploadConfig from '@config/upload';

import IStorageProvider from './models/IStorageProvider';

import DiskStorageProvider from './implementations/DiskStorageProvider';
import S3torageProvider from './implementations/S3StorageProvider';

const providers = {
    disk: DiskStorageProvider,
    s3: S3torageProvider,
};

container.registerSingleton<IStorageProvider>(
    'StorageProvider',
    providers[uploadConfig.driver],
);
