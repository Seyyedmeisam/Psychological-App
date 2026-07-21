import { requestHandler } from '@/core/api/requestHandler'
import { userService } from '@/modules/user/services/userService'
import type { User, UserFormValues, UsersListParams } from '@/modules/user/types/user.types'

const toUserPayload = (values: UserFormValues) => {
  const payload: Record<string, string> = {
    name: values.name,
    mobile: values.mobile,
    role: values.role,
  }

  if (values.email) {
    payload.email = values.email
  }

  if (values.password) {
    payload.password = values.password
    if (values.password_confirmation) {
      payload.password_confirmation = values.password_confirmation
    }
  }

  return payload
}

export const getUsers = async (params?: UsersListParams) => {
  const response = await requestHandler.get<User[] | { data: User[] }>(
    userService.getUsers(),
    { params },
  )
  return response.data
}

export const getUserById = async (id: number) => {
  const response = await requestHandler.get<User | { data: User }>(
    userService.getUserById(id),
  )
  return response.data
}

export const createUser = async (values: UserFormValues) => {
  const response = await requestHandler.post<User | { data: User }>(
    userService.createUser(),
    toUserPayload(values),
  )
  return response.data
}

export const updateUser = async (id: number, values: UserFormValues) => {
  const response = await requestHandler.put<User | { data: User }>(
    userService.updateUser(id),
    toUserPayload(values),
  )
  return response.data
}

export const deleteUser = async (id: number) => {
  const response = await requestHandler.delete<void>(userService.deleteUser(id))
  return response.data
}
