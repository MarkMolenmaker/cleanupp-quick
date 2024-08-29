import client from './index'

export async function getSettings(): Promise<any | null> {
  return await client.get('settings')
    .then((response: any) => response.data)
    .catch((error: any) => new Promise((_, reject) => reject(error.response.data)))
}

export async function getDashboardData(date: string): Promise<any | null> {
  return await client.get(`/reporting/getdashboarddata/${date}/${date}`)
    .then((response: any) => response.data)
    .catch((error: any) => new Promise((_, reject) => reject(error.response.data)))
}

export async function getTaskTodoRange(from: string, until: string): Promise<any | null> {
  return await client.get(`/tasks/todocountrange/${from}/${until}`)
    .then((response: any) => response.data)
    .catch((error: any) => new Promise((_, reject) => reject(error.response.data)))
}

export async function postMeasurementValue(json: string): Promise<any | null> {
  return await client.post(`/tasks/measurements/checkpoints/edit/1`, json, {
    headers: {'Content-Type': 'application/json'}
  })
    .then((response: any) => response.data)
    .catch((error: any) => error.response.data)
}

export async function postMultipleMeasurementValue(json: string): Promise<any | null> {
  return await client.post(`/tasks/measurements/checkpoints/editmultiple`, json, {
    headers: {'Content-Type': 'application/json'}
  })
    .then((response: any) => response.data)
    .catch((error: any) => new Promise((_, reject) => reject(error.response.data)))
}

