const HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  Authorization: 'App c44acc494d49755b84f74e530378c3da-578a1a8d-853d-4a6c-b915-bfa2bc615588'
}

export async function get<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: 'GET',
    headers: HEADERS
  })

  const data = await response.json()

  if (response.status !== 200) {
    throw data
  }

  return data
}

export async function post<T, P>(url: string, payload: P): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(payload)
  })

  const data = await response.json()

  if (response.status !== 200) {
    throw data
  }

  return data
}

export default { post, get }
