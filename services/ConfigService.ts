
import DatabaseConnection from '@database/DatabaseConnection';
import { PrismaClient } from '@prisma/client';

const ConfigService = (database: PrismaClient) => {

  const saveConfig = async (key:string, value:string) => {
    await database.config.create({
      data: {
        key, value
      }
    });
  };

  const getConfig = async (key:string) : Promise<string> => {
    return await database.config.findUnique({
      where: {
        key
      }
    }).then(config => config.value);
  };

  const getNumberConfig = async (key: string) : Promise<number> => {
    return Number(await getConfig(key));
  };

  return {
    saveConfig,
    getConfig
  };
};

export default ConfigService(DatabaseConnection.getConnection());
