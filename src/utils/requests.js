import { GraphqlServer } from "./constants";

export const graphQLRequest = async (payload, options = {}) => {};
export const authRequest = async (payload, options) => {
  const res = await fetch(`${GraphqlServer}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      //   Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      ...options,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    if (res.status === 403) {
      return null;
    }
  }

  const { data } = await res.json();
  return data;
};
