import { authRequest } from "./requests";

export const createUserByGoogle = async ({ displayName, email, photoUrl }) => {
  const query = `mutation Mutation($displayName: String!,$password: String, $email: String!, $photoUrl: String!){
    createUserByGoogle(displayName: $displayName, email:$email, photoUrl: $photoUrl){
        displayName,
        email,
        password
    }
  }`;
  const data = await authRequest({
    query,
    variables: { displayName, email, photoUrl },
  });
  return data;
};
