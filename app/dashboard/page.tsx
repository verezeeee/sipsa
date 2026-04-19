"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { dashboardMock as data } from "../mock/mock"; // <---- IMPORT YOUR MOCK DATA
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dynamic from "next/dynamic";

const DashboardMap = dynamic(() => import("../components/dashboard-map"), {
  ssr: false,
});

const Page = () => {
  const router = useRouter();
  return (
    <div className="bg-[#DFE9FF] min-h-screen w-screen p-7">
      {/* TOP NAV */}
      <div className="w-full h-[10%] bg-white rounded-t-3xl flex items-center justify-between px-10 py-8 gap-x-16">
        <Image src="/login/logo.png" alt="Logo" width={100} height={80} />

        <nav className="w-full">
          <ul className="flex space-x-8 text-gray-500">
            <li>
              <a
                href="#"
                className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
              >
                Home
              </a>
            </li>
            <li>
              <a className="hover:text-blue-600 opacity-50 pointer-events-none" href="#">
                Mapas
              </a>
            </li>
            <li>
              <a className="hover:text-blue-600 opacity-50 pointer-events-none" href="#">
                Meteorologia
              </a>
            </li>
            <li>
              <a onClick={() => router.push("/relatorios")} className="hover:text-blue-600 " href="#">
                Relatórios
              </a>
            </li>
          </ul>
        </nav>
        <button onClick={() => router.push("/")} className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded">
            Sair
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="w-full rounded-b-3xl p-6 grid grid-cols-3 gap-6 mt-[-2px] bg-[#EAF1FF]">
        {/* LEFT COLUMN */}
        <div className="col-span-1  flex flex-col gap-6">
          {/* WEATHER CARD */}
          <div className=" rounded-2xl text-white">
            <div className="flex bg-[#CBCFE8] rounded-2xl p-4 justify-between items-center">
              <div>
                <h1 className="text-6xl font-light">{data.weather.temperature}°</h1>
                <p className=" mt-[10px]">{data.weather.conditionLabel}</p>
                <p className="text-xs mt-1">
                  Máx: {data.weather.max}° • Min: {data.weather.min}°
                </p>
                <p className="text-xs">
                  Sensação térmica: {data.weather.feelsLike}°
                </p>
              </div>

              <Image
                src="/icons/cloud.png"
                alt="Weather"
                width={90}
                height={90}
                className="opacity-80"
              />
            </div>

            {/* HOURLY FORECAST */}
            <div className="flex justify-around mt-5 rounded-2xl">
              {data.weather.hourly.map((h) => (
                <div key={h.hour} className="text-center first-of-type:bg-[#ABB2D8] bg-[#CBCFE8] rounded-xl p-3">
                  <p className="text-xs ">{h.label}</p>
                  <p className="text-lg font-semibold">{h.temperature}°</p>
                  <Image
                    src="/icons/cloud.png"
                    width={30}
                    height={30}
                    alt="icon"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* DISEASE FORECAST */}
          <div className="bg-[#F6FAFF] rounded-2xl p-6 shadow h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-700">Previsão de Casos</h2>
              <Image src="/icons/filter.png" width={20} height={20} alt="filter" />
            </div>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-3 gap-3">
              {data.diseaseForecast.summaryCards.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg p-3 text-center shadow-sm"
                >
                  <p className="text-sm text-gray-500">{item.disease}</p>
                  <h2 className="text-2xl font-bold">{item.total}</h2>
                </div>
              ))}
            </div>

            {/* DEMOGRAPHIC BARS */}
            <div className="grid grid-cols-4 mt-6 h-[60%]">
              {data.diseaseForecast.demographic.map((d) => (
                <div key={d.group} className="text-center">
                  {/* Mini bars */}
                  <p className="text-sm mt-2 text-gray-600">{d.group}</p>
                  <div className="flex flex-col p-8 items-center gap-1 h-full">
                    <div className="w-2 h-[60%] bg-blue-300 rounded"></div>
                    <div className="w-2 h-[40%] bg-blue-400 rounded"></div>
                    <div className="w-2 h-[20%] bg-blue-500 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN - MAP */}
        <div className="col-span-2">
          <div className="flex gap-4 mb-4">
            {data.alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-[#F7F9FF] p-4 rounded-xl shadow flex-1"
              >
                <div className="flex gap-4 items-center justify-between">
                    <Image src={alert.icon} width={20} height={20} alt="filter" />
                    <h3 className="font-semibold">{alert.title}</h3>
                    <div></div>
                </div>
                <p className="text-gray-600 text-sm mt-4 text-center">{alert.description}</p>
                <p className="text-xs text-gray-400 mt-2 text-center">{alert.footer}</p>
              </div>
            ))}
          </div>

          {/* MAP SECTION */}
          <div className="bg-[#F0F4FF] rounded-2xl h-[340px] shadow p-3 flex items-center justify-center">
            <DashboardMap/>
          </div>

          {/* CONFIRMED CASES */}
          <div className="bg-[#F8FAFF] rounded-2xl p-6 shadow mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-700 font-semibold">Casos Confirmados</h2>
              <Image src="/icons/filter.png" width={20} height={20} alt="filter" />
            </div>

            <div className="w-full h-[220px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.confirmedCases.series}>
                  <XAxis
                    dataKey="index"
                    tickFormatter={(i: number) => (i % 7 === 0 ? i.toString() : "")}
                  />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4A6DFF"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
