import config from '../config';

export async function getOrganizations() {
  try {
    const response = await fetch(`${config.baseUrl}/organizations`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}