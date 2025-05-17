import api from "../utils/axiosInstance";

interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

export const registerUser = async ({ name, email, password }: RegisterInput) => {
    console.log('passing the data into backend');
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
    });
  
    return response.data;
};

interface LoginInput {
  email: string;
  password: string;
}

export const loginUser = async ({ email, password }: LoginInput) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data; 
};