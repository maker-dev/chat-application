import { axiosClient } from "../AxiosSingleton"

interface UserRegister {
    name: string;
    email: string;
    password: string;
    pic: string;
    isAdmin?: boolean;
}

interface UserLogin {
    email: string;
    password: string;
}

const registerUser = async (data: UserRegister) => {
    return axiosClient.post("/api/user/register", data, {
        headers: {
            "Content-type": "application/json",
        }
    });
}

const loginUser = async (data: UserLogin) => {
    return axiosClient.post("/api/user/login", data, {
        headers: {
            "Content-type": "application/json",
        }
    })
}

const searchUser = async (keyword: string, token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    return axiosClient.get(`/api/user?search=${keyword}`, config);
}


export { registerUser, loginUser, searchUser };