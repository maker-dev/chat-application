import axios, {AxiosInstance} from 'axios';

class AxiosSingleton {

    private static instance: AxiosSingleton | null = null;

    private client: AxiosInstance;

    private constructor() { 
        this.client = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }
    
    public static getInstance(): AxiosSingleton {
        if (!AxiosSingleton.instance) {
            AxiosSingleton.instance = new AxiosSingleton();
        }
        
        return AxiosSingleton.instance;
    }

    public getClient(): AxiosInstance {
        return this.client;
    }
}

const axiosClient = AxiosSingleton.getInstance().getClient();

export default AxiosSingleton;

export { axiosClient };