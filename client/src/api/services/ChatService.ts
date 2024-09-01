import { axiosClient } from "../AxiosSingleton"

const accessChat = async (userId: string, token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    return axiosClient.post("/api/chat", { userId }, config);
}

const fetchChats = async (token: string) => {
    
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    return axiosClient.get("/api/chat", config);

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
    return axiosClient.post(`/api/chat/group`, data, config);
}

const renameGroup = async (chatId: string, chatName: string, token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const data = {
        chatId,
        chatName
    }

    return axiosClient.put("/api/chat/rename", data, config);
}

const groupAdd = async (chatId: string, userId: string, token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const data = {
        chatId,
        userId
    }

    return axiosClient.put("/api/chat/groupAdd", data, config);
}

const groupRemove = async (chatId: string, userId: string, token: string) => {

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    const data = {
        chatId,
        userId
    }

    return axiosClient.delete("/api/chat/groupRemove", {headers, data});

}
 
export { accessChat, fetchChats, createGroup, renameGroup, groupAdd, groupRemove};