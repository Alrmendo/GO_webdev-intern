import { useState } from 'react';
import { Head } from '@inertiajs/react';

interface Student {
    sbd: string;
    toan: number | null;
    ngu_van: number | null;
    ngoai_ngu: number | null;
    vat_li: number | null;
    hoa_hoc: number | null;
    sinh_hoc: number | null;
    lich_su: number | null;
    dia_li: number | null;
    gdcd: number | null;
    ma_ngoai_ngu: string | null;
}

export default function Home() {
    const [sbd, setSbd] = useState('');
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!sbd.trim()) {
            setError('Vui lòng nhập số báo danh');
            return;
        }

        setLoading(true);
        setError('');
        setStudent(null);

        try {
            const response = await fetch('/lookup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ sbd: sbd.trim() }),
            });

            const data = await response.json();

            if (data.success) {
                setStudent(data.data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    const formatScore = (score: number | null) => {
        return score ? score.toString() : 'Không thi';
    };

    return (
        <>
            <Head title="G-Scores" />
            
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-gray-50 text-black p-4 flex items-center justify-center">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="flex items-center justify-center text-2xl font-bold">G-Scores</h1>
                        <nav className="flex items-center justify-center mt-2">
                            <a href="/" className="mr-4 hover:underline">Tra cứu điểm</a>
                            <a href="/statistics" className="mr-4 hover:underline">Thống kê</a>
                            <a href="/top-khoi-a" className="hover:underline">Top 10 Khối A</a>
                        </nav>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-6xl mx-auto p-4">
                    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                        <h2 className="text-xl font-semibold mb-4">Tra cứu điểm thi</h2>
                        
                        {/* Form tra cứu */}
                        <form onSubmit={handleLookup} className="mb-6">
                            <div className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-2">
                                        Số báo danh:
                                    </label>
                                    <input
                                        type="text"
                                        value={sbd}
                                        onChange={(e) => setSbd(e.target.value)}
                                        placeholder="Ví dụ: 01000001"
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? 'Đang tìm...' : 'Tra cứu'}
                                </button>
                            </div>
                        </form>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        {/* Kết quả */}
                        {student && (
                            <div className="bg-green-50 border border-green-200 rounded p-4">
                                <h3 className="text-lg font-medium mb-4">
                                    Kết quả cho SBD: {student.sbd}
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="bg-white p-3 rounded border">
                                        <span className="font-medium">Toán:</span> {formatScore(student.toan)}
                                    </div>
                                    <div className="bg-white p-3 rounded border">
                                        <span className="font-medium">Ngữ văn:</span> {formatScore(student.ngu_van)}
                                    </div>
                                    <div className="bg-white p-3 rounded border">
                                        <span className="font-medium">Ngoại ngữ:</span> {formatScore(student.ngoai_ngu)}
                                    </div>
                                    <div className="bg-white p-3 rounded border">
                                        <span className="font-medium">Vật lý:</span> {formatScore(student.vat_li)}
                                    </div>
                                    <div className="bg-white p-3 rounded border">
                                        <span className="font-medium">Hóa học:</span> {formatScore(student.hoa_hoc)}
                                    </div>
                                    <div className="bg-white p-3 rounded border">
                                        <span className="font-medium">Sinh học:</span> {formatScore(student.sinh_hoc)}
                                    </div>
                                    <div className="bg-white p-3 rounded border">
                                        <span className="font-medium">Lịch sử:</span> {formatScore(student.lich_su)}
                                    </div>
                                    <div className="bg-white p-3 rounded border">
                                        <span className="font-medium">Địa lý:</span> {formatScore(student.dia_li)}
                                    </div>
                                    <div className="bg-white p-3 rounded border">
                                        <span className="font-medium">GDCD:</span> {formatScore(student.gdcd)}
                                    </div>
                                </div>

                                {/* Điểm khối A */}
                                {student.toan !== null && student.vat_li !== null && student.hoa_hoc !== null && (
                                    <div className="mt-4 bg-blue-100 p-3 rounded">
                                        <span className="font-medium">Tổng điểm khối A:</span>{' '}
                                        {(Number(student.toan) + Number(student.vat_li) + Number(student.hoa_hoc)).toFixed(2)}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
} 