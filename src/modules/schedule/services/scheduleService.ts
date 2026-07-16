const BASE = '/availability'

export const scheduleService = {
  template: () => `${BASE}/template`,
  mine: () => BASE,
} as const
