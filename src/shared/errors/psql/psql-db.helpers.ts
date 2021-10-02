export const getErrorData = (
  details: string,
): { name?: string; value?: string } => {
  const matches = details.match(/\(.*?\)/g)?.map((x) => x.replace(/[()]/g, ''));

  // [0] should be key name
  // [1] should be key value
  return {
    name: matches?.[0],
    value: matches?.[1],
  };
};
