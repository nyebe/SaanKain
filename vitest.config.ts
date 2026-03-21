import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.{ts,tsx}'],
    env: {
      NEXT_PUBLIC_EXECUTE_API_CODE: 'pioneerdevai',
      MAX_MESSAGE_LENGTH: '500',
      FOURSQUARE_API_BASE: 'https://places-api.foursquare.com',
      FOURSQUARE_FIELDS: 'fsq_place_id,name,location,categories,distance,date_closed',
      FOURSQUARE_RESULT_LIMIT: '10',
    },
  },
})
