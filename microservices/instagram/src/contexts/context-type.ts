export interface UserContextType{
    user: {
        username:string,
        avatar:string,
        fullname:string
    },
    setUser: (user:any) => void;
}