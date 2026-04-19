import Image from "next/image";
import LoginForm from "./components/login-form";

export default function Home() {
  return (
    <div className="grid grid-cols-12 grid-rows-12 bg-[#EFF4FF] w-screen h-screen p-7">
      <main className="col-span-full row-span-full flex rounded-3xl bg-white shadow-2xl">
        <div className="w-[64%] h-full relative">  
          <Image
            src="/login/sideimg.png"
            alt="Hero"
            fill
            className="object-contain"
          />
        </div>
        <div className=" h-full w-full flex items-center justify-center"> 
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
