const apis = () => {
  const local = "http://localhost:3000";
  const list = {
    registerUser: `${local}/users/register`,
    loginUser : `${local}/users/login`,
    userProfile : `${local}/users/get-user`
  };
  return list;
};

export default apis;
