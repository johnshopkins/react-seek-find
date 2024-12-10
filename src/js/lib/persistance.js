import { local as localStorage } from './storage';

const clearGameState = (key = 'hopkins-seek-find') => {
  localStorage.remove(key)
};

const loadGameState = (key = 'hopkins-seek-find') => {
  return localStorage.get(key) || [];
};

const saveGameState = (data, key = 'hopkins-seek-find') => {
  try {
    return localStorage.set(key, data);
  } catch (e) {
    return false;
  }
};

export {
  clearGameState,
  loadGameState,
  saveGameState,
};
