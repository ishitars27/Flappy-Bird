const apis = () => {
  const local = "http://localhost:3000";
  const list = {
    registerUser: `${local}/users/register`,
    loginUser : `${local}/users/login`,
    userProfile : `${local}/users/get-user`,
    saveScore: `${local}/api/scores/save`,
    getUserHighestScore: `${local}/api/scores/my-highest` ,// Add this line
    logout : `${local}/users/logout`,
    forgetPassword: `${local}/users/forget`,
    otpVerify: `${local}/users/otp/verify`
  };
  return list;
};

export default apis;
