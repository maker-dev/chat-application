interface User {
    _id: string;
    name: string;
    email: string;
    pic: string;
    token: string;
}

interface ChatUser {
    _id: string;
    name: string;
    email: string;
    pic: string;
    createdAt: string;
    updatedAt: string;
    isAdmin?: boolean;
}


const getSender = (loggedUser: User, users: ChatUser[]) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
}

export default getSender;