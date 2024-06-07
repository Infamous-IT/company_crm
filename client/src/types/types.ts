export interface IUserData {
    email: string;
    password: string;
}

export interface SignUp {
    email: string;
    password: string;
    role: string;
    firstName: string;
    lastName: string;
}

export interface SignIn {
    email: string;
    password: string;
}

export interface IResponseUser {
    photoUrl?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    id?: string;
    role?: string;
    income: number;
    password: string;
    costs: number;
    orders?: OrderProps[];
    tags?: TagProps[];
    customers?: CustomerProps[];
}

export interface EditUserProps {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    income: number;
    costs: number;
}

export interface IResponseUserData {
    token: string;
    user: IResponseUser;
}

export interface IUser {
    id: string;
    email: string;
    token: string;
}

export interface TagProps {
    id?: string;
    title: string;
    order?: OrderProps;
    user?: IResponseUser;
}

export interface EditTagProps {
    id: string;
    title: string;
}

export interface OrderProps {
    id?: string;
    title: string;
    uniqueName: string;
    description: string;
    price: number;
    isComplete: boolean;
    estimatedTime: Date;
    status: string;
    tags?: TagProps[];
    user?: IResponseUser;
    customer?: CustomerProps;
}
export interface EditOrderProps {
    id?: string;
    title: string;
    uniqueName: string;
    description: string;
    price: number;
    isComplete: boolean;
    estimatedTime: Date;
    status: string;
}

export interface CustomerProps {
    id?: string;
    fullName: string;
    user?: IResponseUser;
    orders?: OrderProps[];
}

export interface EditCustomerProps {
    id?: string;
    fullName: string;
}





