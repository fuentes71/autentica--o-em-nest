import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginRequestBody {
    @IsEmail({}, { message: "O email precisa ser válido." })
    @IsNotEmpty({message: "O email não pode ser vazio."})
    email: string;
    @IsString({ message: "A senha precisa ser uma string."})
    @IsNotEmpty({message: "A senha não pode ser vazia."})
    password: string;
}