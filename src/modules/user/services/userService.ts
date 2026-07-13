const BASE = '/users'

export const userService = {
  getUsers: () => BASE,
  getUserById: (id: number | string) => `${BASE}/${id}`,
  createUser: () => BASE,
  updateUser: (id: number | string) => `${BASE}/${id}`,
  deleteUser: (id: number | string) => `${BASE}/${id}`,
}
