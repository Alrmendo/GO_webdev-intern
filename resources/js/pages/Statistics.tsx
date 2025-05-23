import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';

interface SubjectStats {
    excellent: number;
    good: number;
    average: number;
    poor: number;
}

interface Statistics {
    [subjectName: string]: SubjectStats;
}

export default function Statistics() {
    const [statistics, setStatistics] = useState<Statistics>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            const response = await fetch('/api/statistics');
            const data = await response.json();
            setStatistics(data);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPercentage = (value: number, total: number) => {
        return total > 0 ? ((value / total) * 100).toFixed(1) : '0';
    };

    const getTotal = (stats: SubjectStats) => {
        return stats.excellent + stats.good + stats.average + stats.poor;
    };

    const formatNumber = (num: number) => {
        return num.toLocaleString('vi-VN');
    };

    return (
        <>
            <Head title="Thống kê điểm thi THPT 2024" />
            
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-gray-50 text-black flex items-center justify-center p-4">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="flex items-center justify-center text-2xl font-bold">G-Scores</h1>
                        <nav className="flex items-center justify-center mt-2">
                            <a href="/" className="mr-4 hover:underline">Tra cứu điểm</a>
                            <a href="/statistics" className="mr-4 hover:underline font-semibold">Thống kê</a>
                            <a href="/top-khoi-a" className="hover:underline">Top 10 Khối A</a>
                        </nav>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-6xl mx-auto p-4">
                    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                        <h2 className="text-xl font-semibold mb-6">Thống kê điểm thi theo từng môn</h2>
                        
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="text-gray-500">Đang tải dữ liệu...</div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-green-500 mr-2"></div>
                                        <span className="text-sm">≥ 8 điểm (Giỏi)</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                                        <span className="text-sm">6 - 8 điểm (Khá)</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
                                        <span className="text-sm">4 - 6 điểm (Trung bình)</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-red-500 mr-2"></div>
                                        <span className="text-sm">&lt; 4 điểm (Yếu)</span>
                                    </div>
                                </div>

                                {Object.entries(statistics).map(([subject, stats]) => {
                                    const total = getTotal(stats);
                                    
                                    return (
                                        <div key={subject} className="border-2 border-gray-200 rounded-lg p-4">
                                            <h3 className="font-semibold text-lg mb-3">{subject}</h3>
                                            
                                            {/* Bar Chart */}
                                            <div className="mb-4">
                                                <div className="flex h-8 bg-gray-200 rounded overflow-hidden">
                                                    <div 
                                                        className="bg-green-500" 
                                                        style={{ width: `${getPercentage(stats.excellent, total)}%` }}
                                                        title={`Giỏi: ${formatNumber(stats.excellent)} học sinh`}
                                                    ></div>
                                                    <div 
                                                        className="bg-blue-500" 
                                                        style={{ width: `${getPercentage(stats.good, total)}%` }}
                                                        title={`Khá: ${formatNumber(stats.good)} học sinh`}
                                                    ></div>
                                                    <div 
                                                        className="bg-yellow-500" 
                                                        style={{ width: `${getPercentage(stats.average, total)}%` }}
                                                        title={`Trung bình: ${formatNumber(stats.average)} học sinh`}
                                                    ></div>
                                                    <div 
                                                        className="bg-red-500" 
                                                        style={{ width: `${getPercentage(stats.poor, total)}%` }}
                                                        title={`Yếu: ${formatNumber(stats.poor)} học sinh`}
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* Numbers */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div className="bg-green-50 p-3 rounded">
                                                    <div className="font-medium text-green-700">≥ 8 điểm</div>
                                                    <div className="text-lg font-bold">{formatNumber(stats.excellent)}</div>
                                                    <div className="text-gray-600">{getPercentage(stats.excellent, total)}%</div>
                                                </div>
                                                <div className="bg-blue-50 p-3 rounded">
                                                    <div className="font-medium text-blue-700">6 - 8 điểm</div>
                                                    <div className="text-lg font-bold">{formatNumber(stats.good)}</div>
                                                    <div className="text-gray-600">{getPercentage(stats.good, total)}%</div>
                                                </div>
                                                <div className="bg-yellow-50 p-3 rounded">
                                                    <div className="font-medium text-yellow-700">4 - 6 điểm</div>
                                                    <div className="text-lg font-bold">{formatNumber(stats.average)}</div>
                                                    <div className="text-gray-600">{getPercentage(stats.average, total)}%</div>
                                                </div>
                                                <div className="bg-red-50 p-3 rounded">
                                                    <div className="font-medium text-red-700">&lt; 4 điểm</div>
                                                    <div className="text-lg font-bold">{formatNumber(stats.poor)}</div>
                                                    <div className="text-gray-600">{getPercentage(stats.poor, total)}%</div>
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