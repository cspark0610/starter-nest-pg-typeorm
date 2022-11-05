import { ConfigService } from '@nestjs/config';
import { writeFile } from 'fs/promises';
import { join } from 'path';

/**
 * This script will generate the ormconfig.json based on your Global Config
 * @param config Config Service for accessing the ENV Variables
 */
const generateTypeormConfigFile = async (
  config: ConfigService,
): Promise<{
  message: string;
  context: string;
}> => {
  const typeormConfig = config.get('database');
  const filePath = join(process.cwd(), 'ormconfig.json');
  await writeFile(filePath, JSON.stringify(typeormConfig, null, 2));

  return {
    message: 'Generated TypeORM Config File',
    context: 'TypeORM',
  };
};

export { generateTypeormConfigFile };
