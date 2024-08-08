import { axiosClient } from "../AxiosSingleton"

const accessChat = async (userId: string, token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    return axiosClient.post("/chat", { userId }, config);
}

const fetchChats = async (token: string) => {
    
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    return axiosClient.get("/chat", config);

}


const createGroup = async (name: string, users: string, token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const data = {
        name,
        users
    }
    return axiosClient.post(`/chat/group`, data, config);
}

export { accessChat, fetchChats, createGroup};