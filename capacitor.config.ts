import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'es.fullstackpro.svtickets',
  appName: 'SvTickets',
  webDir: 'www',
  android: {
    allowMixedContent: true,
  },
  plugins: {
    Camera: {
      presentationStyle: 'fullscreen',
    },
  },
};

export default config;
