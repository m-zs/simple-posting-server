export const formatDuplicateMessage = (details: string) => {
  const matches = details.match(/\(.*?\)/g)?.map((x) => x.replace(/[()]/g, ''));

  // [0] should be key name
  // [1] should be key value
  if (matches?.[1] && matches?.[0]) {
    return `Value ${matches[1]} for ${matches[0]} exists already`;
  }
};
