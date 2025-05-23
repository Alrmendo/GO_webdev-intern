import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface TopStudent {
    sbd: string;
    toan: number;
    vat_li: number;
    hoa_hoc: number;
    tong_khoi_a: number;
}

export default function TopKhoiA() {
    const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTopStudents();
    }, []);

    const fetchTopStudents = async () => {
        try {
            const response = await fetch('/api/top-khoi-a');
            const data = await response.json();
            setTopStudents(data);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRankMedal = (rank: number) => {
        return `#${rank}`;
    };

    return (
        <>
            <Head title="Top 10 Khối A - Điểm thi THPT 2024" />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="flex items-center justify-center bg-gray-50 p-4 text-black">
                    <div className="mx-auto max-w-6xl">
                        <h1 className="flex items-center justify-center text-2xl font-bold">G-Scores</h1>
                        <nav className="mt-2 flex items-center justify-center">
                            <a href="/" className="mr-4 hover:underline">
                                Tra cứu điểm
                            </a>
                            <a href="/statistics" className="mr-4 hover:underline">
                                Thống kê
                            </a>
                            <a href="/top-khoi-a" className="font-semibold hover:underline">
                                Top 10 Khối A
                            </a>
                        </nav>
                    </div>
                </header>

                {/* Main Content */}
                <main className="mx-auto max-w-6xl p-4">
                    <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
                        <h2 className="mb-6 text-xl font-semibold">Top 10 thí sinh khối A (Toán + Lý + Hóa)</h2>

                        {loading ? (
                            <div className="py-8 text-center">
                                <div className="text-gray-500">Đang tải dữ liệu...</div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Table Header */}
                                <div className="hidden grid-cols-6 gap-4 rounded bg-gray-50 p-4 font-semibold md:grid">
                                    <div>Hạng</div>
                                    <div>Số báo danh</div>
                                    <div className="text-center">Toán</div>
                                    <div className="text-center">Vật lý</div>
                                    <div className="text-center">Hóa học</div>
                                    <div className="text-center">Tổng điểm</div>
                                </div>

                                {/* Danh sách thí sinh */}
                                {topStudents.map((student, index) => {
                                    const rank = index + 1;
                                    const isTopThree = rank <= 3;

                                    return (
                                        <div
                                            key={student.sbd}
                                            className={`rounded-lg border-2 border-gray-200 ${
                                                isTopThree ? 'border-yellow-200 bg-yellow-50' : 'bg-white'
                                            }`}
                                        >
                                            {/* Desktop */}
                                            <div className="hidden grid-cols-6 items-center gap-4 p-4 md:grid">
                                                <div className="text-lg font-bold">{getRankMedal(rank)}</div>
                                                <div className="font-medium">{student.sbd}</div>
                                                <div className="text-center">{student.toan}</div>
                                                <div className="text-center">{student.vat_li}</div>
                                                <div className="text-center">{student.hoa_hoc}</div>
                                                <div className="text-center text-lg font-bold text-blue-600">{student.tong_khoi_a.toFixed(2)}</div>
                                            </div>

                                            {/* Mobile reponsive */}
                                            <div className="p-4 md:hidden">
                                                <div className="mb-2 flex items-center justify-between">
                                                    <div className="text-lg font-bold">{getRankMedal(rank)}</div>
                                                    <div className="text-lg font-bold text-blue-600">{student.tong_khoi_a.toFixed(2)} điểm</div>
                                                </div>
                                                <div className="mb-2">
                                                    <span className="font-medium">SBD:</span> {student.sbd}
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 text-sm">
                                                    <div>
                                                        <span className="font-medium">Toán:</span> {student.toan}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Lý:</span> {student.vat_li}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Hóa:</span> {student.hoa_hoc}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
