import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactECharts from "echarts-for-react";
import { supabase } from "../../supabase/SupabaseClient";
import { ArrowRight } from "lucide-react";

export default function AnalyticsPage() {
    const { chatId } = useParams();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        supabase
            .from("user_chats")
            .select("analysis")
            .eq("id", chatId)
            .single()
            .then(({ data }) => setStats(data.analysis.stats));
    }, [chatId]);

    if (!stats) return <div className="pt-28 text-center">Loading analytics…</div>;

    const h = stats.plant_health;
    const i = stats.image_analysis;

    /* ---------------- MAPPINGS ---------------- */
    const mapLevel = { LOW: 30, MEDIUM: 60, HIGH: 90 };
    const mapStage = { EARLY: 25, MID: 55, LATE: 85 };

    /* ---------------- CHART OPTIONS ---------------- */

    // 1️⃣ Health Gauge
    const healthGauge = {
        series: [{
            type: "gauge",
            progress: { show: true, width: 20 },
            axisLine: { lineStyle: { width: 20 } },
            axisLabel: {
                show: true,
                distance: 30, // 🔥 increase this (try 30–40)
                fontSize: 12,
                formatter: v => v % 10 === 0 ? v : ""
            },
            detail: {
                formatter: "{value}%",
                fontSize: 26,
                offsetCenter: [0, "80%"]
            },
            data: [{ value: h.health_score }]
        }]
    };

    // 2️⃣ Stress vs Infection
    const stressInfection = {
        xAxis: { type: "category", data: ["Stress", "Infected Area"] },
        yAxis: { max: 100 },
        series: [{
            type: "bar",
            data: [
                h.stress_percentage,
                i.infected_area_percent
            ],
            itemStyle: {
                color: (p) =>
                    p.value > 70 ? "#ef4444"
                        : p.value > 40 ? "#facc15"
                            : "#22c55e"
            }
        }]
    };

    // 3️⃣ Risk & Recovery Radar (ALL FACTORS)
    const systemRadar = {
        tooltip: {
            trigger: "item",
            formatter: (p) => {
                const labels = [
                    "Health",
                    "Stress",
                    "Infection",
                    "Survivability",
                    "Recovery",
                    "Care Load"
                ];

                return labels
                    .map((l, i) => `${l}: ${p.value[i]}%`)
                    .join("<br/>");
            }
        },
        radar: {
            indicator: [
                { name: "Health", max: 100 },
                { name: "Stress", max: 100 },
                { name: "Infection", max: 100 },
                { name: "Survivability", max: 100 },
                { name: "Recovery", max: 100 },
                { name: "Care Load", max: 100 },
            ]
        },
        series: [{
            type: "radar",
            areaStyle: { opacity: 0.4 },
            data: [{
                value: [
                    h.health_score,
                    h.stress_percentage,
                    i.infected_area_percent,
                    h.survivability_score * 100,
                    mapLevel[h.recovery_potential],
                    mapLevel[h.care_urgency],
                ]
            }]
        }]
    };

    // 4️⃣ Infection Ring
    const infectionRing = {
        tooltip: {
            trigger: "item",
            formatter: "{b}: {d}%" // 🔥 name + percentage
        },
        series: [{
            type: "pie",
            radius: ["70%", "90%"],
            label: { show: false },
            data: [
                { value: i.infected_area_percent, name: "Affected" },
                { value: 100 - i.infected_area_percent, name: "Healthy" }
            ],
            itemStyle: {
                color: (p) =>
                    p.name === "Affected"
                        ? p.value > 50 ? "#ef4444" : "#facc15"
                        : "#4CAF50"
            }
        }]
    };

    return (
        <div className="max-w-5xl mx-auto pt-28 px-4 font-poppins space-y-16">

            {/* CORE HEALTH */}
            <Section title="Overall Plant Health">
                <ReactECharts option={healthGauge} style={{ height: 400 }} />
                <p className="text-gray-600 text-sm mt-2">
                    Combined physiological condition of the plant based on stress, infection, and survivability.
                </p>
            </Section>

            {/* STRESS & DAMAGE */}
            <Section title="Stress & Damage Levels">
                <ReactECharts option={stressInfection} style={{ height: 260 }} />
                <p className="text-gray-600 text-sm mt-2">
                    <span className="font-poppins">Stress</span>
                    <span className="mx-2 text-gray-500 inline-flex items-center">
                        <ArrowRight size={11} />
                    </span>
                    <span>Indicates internal strain.</span>
                </p>
                <p className="text-gray-600 text-sm mt-2">
                    <span className="font-poppins">Infected Area</span>
                    <span className="mx-2 text-gray-500 inline-flex items-center">
                        <ArrowRight size={11} />
                    </span>
                    <span>Represents visible damage on the plant.</span>
                </p>
            </Section>

            {/* SYSTEM BALANCE */}
            <Section title="Plant Stability & Recovery System">
                <ReactECharts option={systemRadar} style={{ height: 360 }} />
                <p className="text-gray-600 text-sm mt-2">
                    Multi-factor balance showing how different plant systems interact.
                </p>
            </Section>

            {/* INFECTION SPREAD */}
            <Section title="Infection Spread Coverage">
                <ReactECharts option={infectionRing} style={{ height: 260 }} />
                <p className="text-gray-600 text-sm mt-2">
                    Percentage of plant surface affected by disease or stress-related damage.
                </p>
            </Section>

            {/* STATUS STRIP */}
            <div className="grid md:grid-cols-3 gap-4">
                <Status label="Disease Stage" value={h.disease_stage} />
                <Status label="Life Expectancy Band" value={h.life_expectancy_band} />
                <Status label="Care Urgency" value={h.care_urgency} />
            </div>

        </div>
    );
}

/* ---------------- UI HELPERS ---------------- */

function Section({ title, children }) {
    return (
        <div className="bg-neutral-100 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-poppins-medium mb-3">{title}</h2>
            {children}
        </div>
    );
}

function Status({ label, value }) {
    return (
        <div className="bg-lime-50 rounded-3xl p-5 text-center">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="font-poppins-medium text-lg">{value}</p>
        </div>
    );
}
