"use client";

import React, { useState } from "react";
import { ChevronRight, Activity, AlertCircle, Thermometer, ShieldAlert, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types & Data ---

type Step = "profile" | "body-part" | "symptom-selection" | "triage" | "result";

const bodyParts = [
    { id: "head", label: "Baş & Boyun", icon: "🤕" },
    { id: "chest", label: "Göğüs & Sırt", icon: "🫁" },
    { id: "stomach", label: "Karın & Mide", icon: "🤢" },
    { id: "limbs", label: "Kol & Bacak", icon: "💪" },
    { id: "skin", label: "Cilt & Döküntü", icon: "🦠" },
    { id: "general", label: "Genel / Davranış", icon: "🌡️" },
];

const symptomsByPart: Record<string, { id: string, label: string }[]> = {
    head: [
        { id: "headache", label: "Baş Ağrısı" },
        { id: "earache", label: "Kulak Ağrısı" },
        { id: "sore-throat", label: "Boğaz Ağrısı" },
        { id: "eye-red", label: "Göz Kızarıklığı" },
    ],
    stomach: [
        { id: "abdominal-pain", label: "Karın Ağrısı" },
        { id: "vomiting", label: "Kusma" },
        { id: "diarrhea", label: "İshal" },
        { id: "constipation", label: "Kabızlık" },
    ],
    general: [
        { id: "fever", label: "Ateş" },
        { id: "crying", label: "Sürekli Ağlama" },
        { id: "fatigue", label: "Halsizlik / Uyku Hali" },
    ],
    // Fallback for others to generic
    chest: [{ id: "cough", label: "Öksürük" }, { id: "breathing", label: "Nefes Darlığı" }],
    limbs: [{ id: "pain", label: "Eklem Ağrısı" }, { id: "limping", label: "Topallama" }],
    skin: [{ id: "rash", label: "Döküntü" }, { id: "bite", label: "Böcek Isırığı" }],
};

const severityQuestions: Record<string, { q: string, urgent: boolean }[]> = {
    "fever": [
        { q: "Çocuğunuz 3 aydan küçük ve ateşi 38°C'nin üzerinde mi?", urgent: true },
        { q: "Nefes almakta zorlanıyor mu, dudakları morarıyor mu?", urgent: true },
        { q: "Ense sertliği var mı veya ışığa bakınca ağlıyor mu?", urgent: true },
        { q: "Ateş düşürücüye rağmen 3 gündür düşmüyor mu?", urgent: false }, // Critical but maybe not ER immediate if specific
    ],
    "abdominal-pain": [
        { q: "Ağrı sağ alt karın bölgesinde şiddetli mi? (Apandisit riski)", urgent: true },
        { q: "Dışkıda kan veya jöle kıvamında akıntı var mı?", urgent: true },
        { q: "Yeşil safra kusuyor mu?", urgent: true },
    ]
};

// --- Components ---

function ProgressIndicator({ currentStep }: { currentStep: Step }) {
    const steps = ["profile", "body-part", "symptom-selection", "triage", "result"];
    const currentIndex = steps.indexOf(currentStep);
    const progress = Math.max(5, ((currentIndex) / (steps.length - 1)) * 100);

    return (
        <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
            <div
                className="bg-hc-orange h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}

export default function SymptomCheckerPage() {
    const [step, setStep] = useState<Step>("profile");
    const [profile, setProfile] = useState<{ age: string, gender: string } | null>(null);
    const [selectedPart, setSelectedPart] = useState<string | null>(null);
    const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
    const [triageAnswers, setTriageAnswers] = useState<boolean[]>([]);
    const [result, setResult] = useState<"urgent" | "doctor" | "home" | null>(null);

    const handleRestart = () => {
        setStep("profile");
        setProfile(null);
        setSelectedPart(null);
        setSelectedSymptom(null);
        setTriageAnswers([]);
        setResult(null);
    }

    // LOGIC
    const selectProfile = (p: any) => {
        setProfile(p);
        setStep("body-part");
    };

    const selectPart = (partId: string) => {
        setSelectedPart(partId);
        setStep("symptom-selection");
    };

    const selectSymptom = (sympId: string) => {
        setSelectedSymptom(sympId);
        setStep("triage");
        setTriageAnswers([]); // Reset previous answers
    };

    const answerTriage = (answer: boolean, index: number) => {
        // Basic logic: If ANY urgent question is YES -> Urgent Result immediately
        const questions = severityQuestions[selectedSymptom!] || severityQuestions["fever"]; // Default to fever logic for demo

        if (answer && questions[index].urgent) {
            setResult("urgent");
            setStep("result");
            return;
        }

        // Creating a new array to store answers
        const newAnswers = [...triageAnswers];
        newAnswers[index] = answer;
        setTriageAnswers(newAnswers);

        // If last question
        if (index === questions.length - 1) {
            // If we got here without urgent exit, it's either Doctor or Home
            // Simplified Logic: If ANY yes to non-urgent -> Doctor, else Home
            if (newAnswers.some(a => a)) {
                setResult("doctor");
            } else {
                setResult("home");
            }
            setStep("result");
        }
    };

    return (
        <div className="min-h-screen bg-[#f9f9f9] font-sans pb-20">

            {/* Header */}
            <div className="bg-hc-blue text-white py-8 px-4 text-center">
                <h1 className="text-3xl font-serif font-bold mb-2">Semptom Kontrolü</h1>
                <p className="opacity-90 max-w-lg mx-auto text-sm">
                    Çocuğunuzun belirtilerini seçin, olası nedenleri ve atmanız gereken adımları öğrenin.
                    <br /><span className="font-bold text-hc-orange mt-2 block">UYARI: Bu araç tıbbi teşhis koymaz. Acil durumlarda 112'yi arayın.</span>
                </p>
            </div>

            <div className="max-w-3xl mx-auto -mt-6 bg-white rounded-lg shadow-lg border border-gray-200 p-6 md:p-10 min-h-[500px] flex flex-col">

                <ProgressIndicator currentStep={step} />

                {/* STEP 1: Profile */}
                {step === "profile" && (
                    <div className="flex flex-col gap-6 animate-fade-in">
                        <h2 className="text-2xl font-bold text-hc-blue text-center">Hasta Kim?</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => selectProfile({ age: "0-1", gender: "generic" })} className="p-6 border-2 border-gray-100 rounded-xl hover:border-hc-orange hover:bg-orange-50 transition-all flex flex-col items-center gap-3">
                                <div className="text-4xl">👶</div>
                                <span className="font-bold text-gray-700">Bebek (0-1 Yaş)</span>
                            </button>
                            <button onClick={() => selectProfile({ age: "1-5", gender: "generic" })} className="p-6 border-2 border-gray-100 rounded-xl hover:border-hc-orange hover:bg-orange-50 transition-all flex flex-col items-center gap-3">
                                <div className="text-4xl">🧒</div>
                                <span className="font-bold text-gray-700">Çocuk (1-12 Yaş)</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Body Part */}
                {step === "body-part" && (
                    <div className="flex flex-col gap-6 animate-fade-in">
                        <button onClick={() => setStep("profile")} className="text-xs text-gray-400 hover:text-black self-start">&larr; Geri Dön</button>
                        <h2 className="text-2xl font-bold text-hc-blue text-center">Sorun nerede?</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {bodyParts.map(part => (
                                <button key={part.id} onClick={() => selectPart(part.id)} className="p-4 border border-gray-200 rounded-lg hover:bg-hc-blue hover:text-white transition-all flex flex-col items-center gap-2 group shadow-sm bg-gray-50">
                                    <span className="text-3xl group-hover:scale-110 transition-transform">{part.icon}</span>
                                    <span className="font-bold text-sm">{part.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 3: Symptoms */}
                {step === "symptom-selection" && selectedPart && (
                    <div className="flex flex-col gap-6 animate-fade-in">
                        <button onClick={() => setStep("body-part")} className="text-xs text-gray-400 hover:text-black self-start">&larr; Geri Dön</button>
                        <h2 className="text-2xl font-bold text-hc-blue text-center">Hangi belirti görülüyor?</h2>
                        <div className="flex flex-col gap-3">
                            {symptomsByPart[selectedPart]?.map(symp => (
                                <button key={symp.id} onClick={() => selectSymptom(symp.id)} className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-hc-orange hover:shadow-md transition-all flex items-center justify-between group bg-white">
                                    <span className="font-semibold text-gray-700">{symp.label}</span>
                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-hc-orange" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 4: Triage Questions */}
                {step === "triage" && selectedSymptom && (
                    <div className="flex flex-col gap-8 animate-fade-in flex-1">
                        <h2 className="text-2xl font-bold text-hc-blue text-center flex items-center justify-center gap-2">
                            <Activity className="w-6 h-6 text-hc-orange" />
                            Belirti Analizi
                        </h2>

                        {/* Show current question */}
                        {(severityQuestions[selectedSymptom] || severityQuestions["fever"]).map((q, idx) => {
                            // Only show if it's the current question based on answers length
                            if (idx !== triageAnswers.length) return null;

                            return (
                                <div key={idx} className="flex flex-col gap-6 items-center text-center mt-4">
                                    <p className="text-xl font-medium text-gray-800 leading-relaxed">{q.q}</p>
                                    <div className="flex gap-4 w-full max-w-sm mt-4">
                                        <button onClick={() => answerTriage(true, idx)} className="flex-1 py-4 bg-hc-red/10 text-hc-red font-bold rounded-lg border-2 border-hc-red/20 hover:bg-hc-red hover:text-white transition-all">
                                            EVET
                                        </button>
                                        <button onClick={() => answerTriage(false, idx)} className="flex-1 py-4 bg-hc-green/10 text-hc-green font-bold rounded-lg border-2 border-hc-green/20 hover:bg-hc-green hover:text-white transition-all">
                                            HAYIR
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* STEP 5: Result */}
                {step === "result" && result && (
                    <div className="flex flex-col items-center gap-6 animate-fade-in text-center flex-1 justify-center">

                        {result === "urgent" && (
                            <div className="bg-red-50 p-8 rounded-xl border-2 border-red-100 flex flex-col items-center gap-4 max-w-lg">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                                    <ShieldAlert className="w-10 h-10 text-hc-red" />
                                </div>
                                <h2 className="text-3xl font-bold text-hc-red">ACİL MÜDAHALE GEREKEBİLİR</h2>
                                <p className="text-gray-700">Verdiğiniz yanıtlara göre çocuğunuzun durumu ciddiyet arz edebilir.</p>
                                <div className="w-full bg-white p-4 rounded border border-red-200 text-left text-sm text-red-800 font-bold mt-2">
                                    ÖNERİLEN EYLEM:
                                    <ul className="list-disc ml-5 font-normal mt-1">
                                        <li>Vakit kaybetmeden en yakın acil servise başvurun veya 112'yi arayın.</li>
                                        <li>Çocuğunuzu ağızdan beslemeye zorlamayın.</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {result === "doctor" && (
                            <div className="bg-orange-50 p-8 rounded-xl border-2 border-orange-100 flex flex-col items-center gap-4 max-w-lg">
                                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                                    <Thermometer className="w-10 h-10 text-hc-orange" />
                                </div>
                                <h2 className="text-3xl font-bold text-hc-orange">DOKTORA DANIŞIN</h2>
                                <p className="text-gray-700">Durum acil görünmese de, bir hekimin değerlendirmesi gerekmektedir.</p>
                                <ul className="text-gray-600 text-sm list-disc text-left w-full pl-6">
                                    <li>24 saat içinde randevu alın.</li>
                                    <li>Semptomlar kötüleşirse beklemeden acile gidin.</li>
                                </ul>
                            </div>
                        )}

                        {result === "home" && (
                            <div className="bg-green-50 p-8 rounded-xl border-2 border-green-100 flex flex-col items-center gap-4 max-w-lg">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                    <Activity className="w-10 h-10 text-hc-green" />
                                </div>
                                <h2 className="text-3xl font-bold text-hc-green">EVDE BAKIM UYGUN</h2>
                                <p className="text-gray-700">Şu an için endişe verici bir bulgu işaretlemediniz.</p>
                                <div className="text-gray-600 text-sm bg-white p-4 rounded border border-green-200 mt-2">
                                    <span className="font-bold block mb-1">Evde Ne Yapmalı?</span>
                                    Bol sıvı verin, dinlenmesini sağlayın. Ateş takibi yapın. Herhangi bir değişiklikte tekrar kontrol edin.
                                </div>
                            </div>
                        )}

                        <button onClick={handleRestart} className="mt-6 flex items-center gap-2 text-gray-500 hover:text-black font-semibold text-sm">
                            <RotateCcw className="w-4 h-4" />
                            Baştan Başla
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
