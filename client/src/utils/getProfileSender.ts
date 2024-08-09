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

interface ProfileUser {
    name: string;
    email: string;
    pic: string;
}

const getProfileSender = (loggedUser: User, users: ChatUser[]): ProfileUser => {
    const user =  users[0]._id === loggedUser._id ? users[1] : users[0];
    return {
        name: user.name,
        email: user.email,
        pic: user.pic
    }
}

export default getProfileSender;