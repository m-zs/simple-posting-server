export const fetchFromApi = async <T>(url: string): Promise<T> => {
  const response = await fetch(`${process.env.PAGE_URL}/api/${url}`);
  const json = await response.json();

  return json;
};
