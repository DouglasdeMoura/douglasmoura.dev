import api from './api';

export default async function getSiteTitleAndDescription() {
  const request = await api(`
    {
      allSettings {
        generalSettingsTitle
        generalSettingsDescription
      }
    }`
  );

  return {
    title: request?.allSettings.generalSettingsTitle,
    description: request?.allSettings.generalSettingsDescription,
  };
}
