import { local as localStorage } from './storage';

const localStorageKey = 'hopkins-seek-find';

const clearGameState = () => {
  localStorage.remove(localStorageKey)
};

const loadGameState = () => {
  return localStorage.get(localStorageKey) || [];
};

const saveGameState = (data) => {
  try {
    return localStorage.set(localStorageKey, data);
  } catch (e) {
    return false;
  }
};

export {
  clearGameState,
  loadGameState,
  saveGameState,
};
