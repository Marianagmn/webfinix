// scripts/generate-dtos.ts
// Generate TypeScript DTOs from OpenAPI/Swagger spec
// Run: npx ts-node scripts/generate-dtos.ts

import { generateApi } from 'swagger-typescript-api';
import * as fs from 'fs';
import * as path from 'path';

const BACKEND_SWAGGER_URL = 'http://localhost:3000/api/docs.json';
const OUTPUT_DIR = path.join(__dirname, '../src/app/data-access/dto');

async function generateDTOs() {
  console.log('🔄 Generating DTOs from Swagger spec...');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  try {
    const files = await generateApi({
      name: 'api-client.ts',
      output: OUTPUT_DIR,
      url: BACKEND_SWAGGER_URL,
      httpClientType: 'angular',
      modular: true,
      extractRequestParams: true,
      extractRequestBody: true,
      extractEnums: true,
      extractResponseHeaders: true,
      extractResponseBody: true,
      extractResponseError: true,
      singleHttpClient: true,
      cleanOutput: false,
      enumNamesAsValues: false,
      useEnumType: true,
      useSingleRequestParameter: false,
      sortRouters: true,
      sortTypes: true,
      sortProperties: true,
      prettier: {
        printWidth: 120,
        tabWidth: 2,
        trailingComma: 'all',
        singleQuote: true,
      },
      defaultResponseType: false,
      generateClient: true,
      generateUnionEnums: false,
      toJS: false,
      templateParams: {
        apiInstance: 'Api',
      },
      hooks: {
        onCreateComponent: (component) => {
          // Customize component generation if needed
          return component;
        },
      },
    });

    console.log('✅ DTOs generated successfully!');
    console.log(`📁 Output directory: ${OUTPUT_DIR}`);
    console.log('📄 Generated files:', files);
  } catch (error) {
    console.error('❌ Error generating DTOs:', error);
    process.exit(1);
  }
}

generateDTOs();
