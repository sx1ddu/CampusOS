import axiosClient from './axiosClient'

export const favoriteApi = {
  getMyFavorites: () => axiosClient.get('/favorites'),
  addFavorite: (itemType, itemId) => axiosClient.post('/favorites', { itemType, itemId }),
  removeFavorite: (id) => axiosClient.delete(`/favorites/${id}`),
}
