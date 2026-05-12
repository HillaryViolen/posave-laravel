// 1. Taruh DUMMY DATA di sini
const FEATURES_DATA = [
    {
        id: 1,
        iconSrc: "/assets/services/chatbot.png",
        title: "AI Chatbot Assistant",
        description: "Kelola toko lewat percakapan",
    },
    {
        id: 2,
        iconSrc: "/assets/services/laporan.png",
        title: "Laporan Otomatis",
        description: "Insight bisnis otomatis",
    },
    {
        id: 3,
        iconSrc: "/assets/services/mode.png",
        title: "2 Versi Pengguna",
        description: "Sesuaikan sistem dengan kebutuhan",
        // Hapus mb-6 dan mt-5, cukup atur tingginya aja. Posisinya otomatis ke-tengah nanti.
        iconClassName: "h-14", 
    },
    {
        id: 4,
        iconSrc: "/assets/services/transaksi.png",
        title: "Transaksi",
        description: "Catat transaksi secara cepat",
    }
];

export const FeatureCard = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES_DATA.map((feature) => (
                <div 
                    key={feature.id}
                    className="bg-[var(--white)] min-h-[280px] rounded-[30px] p-6 flex flex-col items-center text-center shadow-sm drop-shadow-[2px_3px_6px_rgba(0,0,0,0.25)] h-full"
                >
                    <div className="h-24 flex items-center justify-center mb-4">
                        <img 
                            src={feature.iconSrc} 
                            alt={feature.title} 
                            className={feature.iconClassName || "h-20"} 
                        />
                    </div>
                    
                    <div className="min-h-[64px] flex items-start justify-center w-full">
                        <h4 className="font-medium text-[20px] lg:text-[22px] text-[var(--black)] leading-snug">
                            {feature.title}
                        </h4>
                    </div>

                    <p className="text-[16px] lg:text-[18px] text-[var(--black)] mt-2">
                        {feature.description}
                    </p>
                </div>
            ))}
        </div>
    );
};