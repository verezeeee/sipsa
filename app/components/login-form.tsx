"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };
    console.log(data);
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8">
      <Image src="/login/logo.png" alt="SISPA Logo" width={150} height={50} />
      <h2 className="text-xl text-gray-500 mt-4 font-medium">Tecnologia a serviço da vida</h2>
      <form className="w-full max-w-sm mt-8" onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="username">
            Usuário
          </label>
          <input
            className="bg-[#F3F6FF] appearance-none rounded-lg w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            name="username"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="password">
            Senha
          </label>
          <input
            className="bg-[#F3F6FF] appearance-none rounded-lg w-full py-4 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            name="password"
          />
          <a href="#" className="text-sm text-gray-500 hover:text-blue-500">
            Esqueci minha senha
          </a>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full"
            type="submit"
          >
            Acessar
          </button>
          <a href="#" className="inline-block align-baseline font-bold text-sm text-gray-500 hover:text-blue-800 mt-4">
            Crie sua conta SISPA
          </a>
        </div>
      </form>
    </div>
  );
}
