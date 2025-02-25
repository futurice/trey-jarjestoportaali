import config from "../config";

export async function getUsers() {
  try {
    const response = await fetch(`${config.api.baseUrl}/users`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

export async function getUser(userId: string) {
  try {
    const response = await fetch(`${config.api.baseUrl}/users/${userId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}
