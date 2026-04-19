"use client"
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { mockRelatorios } from '../mock/mockRelatorios';
import SeasonalityRisk2026 from '../components/SeasonalityRisk2026';

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
                            onClick={() => router.push("/dashboard")}
                            className="hover:text-blue-600"
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
                          <a onClick={() => router.push("/relatorios")} className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1" href="#">
                            Relatórios
                          </a>
                        </li>
                      </ul>
                    </nav>
                    <button onClick={() => router.push("/")} className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                        Sair
                    </button>
                  </div>
            <div className="w-full rounded-b-3xl p-6 grid grid-cols-3 gap-6 mt-[-2px] bg-[#EAF1FF]">
                {/* Coluna Esquerda */}
                <div className="col-span-2 flex flex-col gap-6">
                    {/* Previsão de Riscos */}
                    <div className="bg-white p-6 rounded-2xl shadow">
                        <h2 className="font-semibold text-lg mb-4">Previsão de Riscos</h2>
                        <div className="flex items-center gap-2 text-red-600 font-bold mb-4">
                            <Image src="/icons/warning.png" width={20} height={20} alt="alerta" />
                            <span>Alerta {mockRelatorios.alert.level}!</span>
                        </div>
                        <ul className="space-y-3 text-sm text-gray-600 list-disc list-inside">
                            {mockRelatorios.alert.messages.map((msg, i) => (
                                <li key={i}>{msg}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Panorama Geral de Riscos */}
                    <div className="bg-white p-6 rounded-2xl shadow">
                        <h2 className="font-semibold text-lg mb-4">Panorama Geral de Riscos</h2>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            {Object.entries(mockRelatorios.riskOverview)
                                .filter(([key]) => key !== 'metadata')
                                .map(([key, value]) => {
                                    const risk = value as { score: number; value: number; level: string };
                                    const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                    const color = risk.level === 'ALTO' ? 'bg-red-500' : risk.level === 'MODERADO' ? 'bg-yellow-400' : 'bg-green-500';
                                    return (
                                        <div key={key}>
                                            <div className="flex justify-between text-sm">
                                                <span>{title}</span>
                                                <span>{risk.score.toFixed(2)}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1 flex">
                                                <div className={`${color} h-2.5 rounded-full`} style={{ width: `${risk.value}%` }}></div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{risk.value} de 100 {risk.level}</p>
                                        </div>
                                    )
                                })}
                        </div>
                        <p className="text-center text-xs text-gray-400 mt-6">
                            Amostra: {mockRelatorios.riskOverview.metadata.amostra} | Nível de Confiança: {mockRelatorios.riskOverview.metadata.nivelConfianca} | Margem de Erro: {mockRelatorios.riskOverview.metadata.margemErro}
                        </p>
                    </div>
                </div>

                {/* Coluna Direita */}
                <div className="col-span-1 bg-white p-6 rounded-2xl shadow flex flex-col h-[550px]">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="font-semibold text-lg">Gráficos de previsão de nº de casos por região</h2>
                        <Image src="/icons/filter.png" width={20} height={20} alt="filter" />
                    </div>
                    <h3 className="text-center text-gray-600 mb-4">{mockRelatorios.chartPrevisaoCasos.regiao}</h3>
                    <div className="grow w-full flex flex-col justify-end overflow-x-auto">
                        <div className="flex items-end justify-start gap-3 px-2 h-[85%]">
                            {mockRelatorios.chartPrevisaoCasos.valores.map(item => (
                                <div key={item.cidade} className="w-5 h-full flex items-end group">
                                    <div className="w-full bg-blue-500 rounded-t-md group-hover:bg-blue-700" style={{ height: `${(item.valor / 200) * 100}%` }}></div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-start gap-3 px-2 border-t-2 border-gray-200 pt-2 mt-2">
                            {mockRelatorios.chartPrevisaoCasos.valores.map(item => (
                                <div key={item.cidade} className="w-5 text-center h-20">
                                    <span className="text-xs text-gray-500 whitespace-nowrap transform -rotate-60 inline-block origin-top-left group-hover:font-bold">{item.cidade.slice(0, 10)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Linha Inferior */}
                <div className="col-span-1 bg-white p-6 rounded-2xl shadow flex flex-col items-center justify-center">
                    <h2 className="font-semibold text-lg mb-4">Performance do Modelo</h2>
                    <div className="relative w-48 h-48">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path
                                className="text-gray-200"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                            <path
                                className="text-blue-600"
                                strokeDasharray={`${mockRelatorios.modelPerformance.acuraciaGlobal * 100}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <span className="text-4xl font-bold">{mockRelatorios.modelPerformance.acuraciaGlobal * 100}%</span>
                            <p className="text-sm text-gray-600">Acurácia Global</p>
                        </div>
                    </div>
                    <div className="text-center text-sm mt-4">
                        <p>Sensibilidade: <span className="font-bold">{mockRelatorios.modelPerformance.sensibilidade * 100}%</span></p>
                        <p>Falsos Negativos: <span className="font-bold">&lt; {mockRelatorios.modelPerformance.falsoNegativos * 100}%</span></p>
                        <p className="text-xs text-gray-400 mt-2">Última leitura: {mockRelatorios.modelPerformance.dataAtualizacao}</p>
                    </div>
                </div>

                <div className="col-span-2">
                    <SeasonalityRisk2026 />
                </div>
            </div>
        </div>
    )
}

export default Page