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


export { accessChat, fetchChats};