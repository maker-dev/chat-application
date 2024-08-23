import { axiosClient } from "../AxiosSingleton";


const sendNewMessage = async (chatId: string , content: string, token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const data = {
        content,
        chatId
    }

    return axiosClient.post("/message", data, config); 
}

const fetchAllMessages = async (chatId: string, token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    return axiosClient.get("/message/" + chatId, config);
}

export {sendNewMessage, fetchAllMessages}