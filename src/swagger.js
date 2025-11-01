import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';

const swaggerPath = path.join(process.cwd(), 'docs', 'swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

export const swaggerServe = swaggerUi.serve;
export const swaggerSetup = swaggerUi.setup(swaggerDocument, {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true,
  },
});