import fetch from 'isomorphic-unfetch';

export default async function fetchJson(url: string) {
  const response = await fetch(url);
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  throw new Error(JSON.stringify(response));
}
