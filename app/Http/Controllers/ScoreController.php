<?php

namespace App\Http\Controllers;

use App\Models\StudentScore;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScoreController extends Controller
{
    /**
     * Trang chủ
     */
    public function index()
    {
        return Inertia::render('Home');
    }

    /**
     * Tra cứu điểm
     */
    public function lookup(Request $request)
    {
        $request->validate([
            'sbd' => 'required|string|max:20'
        ]);

        $student = StudentScore::where('sbd', $request->sbd)->first();

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy số báo danh này!'
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $student
        ]);
    }

    /**
     * Trang thống kê
     */
    public function statistics()
    {
        $subjects = [
            'toan' => 'Toán',
            'ngu_van' => 'Ngữ văn', 
            'ngoai_ngu' => 'Ngoại ngữ',
            'vat_li' => 'Vật lý',
            'hoa_hoc' => 'Hóa học',
            'sinh_hoc' => 'Sinh học',
            'lich_su' => 'Lịch sử',
            'dia_li' => 'Địa lý',
            'gdcd' => 'GDCD'
        ];

        $stats = [];
        
        foreach ($subjects as $column => $name) {
            $stats[$name] = [
                'excellent' => StudentScore::whereNotNull($column)->where($column, '>=', 8)->count(),
                'good' => StudentScore::whereNotNull($column)->where($column, '>=', 6)->where($column, '<', 8)->count(),
                'average' => StudentScore::whereNotNull($column)->where($column, '>=', 4)->where($column, '<', 6)->count(),
                'poor' => StudentScore::whereNotNull($column)->where($column, '<', 4)->count(),
            ];
        }

        return Inertia::render('Statistics', [
            'statistics' => $stats
        ]);
    }
    public function getStatistics()
    {
        $subjects = [
            'toan' => 'Toán',
            'ngu_van' => 'Ngữ văn', 
            'ngoai_ngu' => 'Ngoại ngữ',
            'vat_li' => 'Vật lý',
            'hoa_hoc' => 'Hóa học',
            'sinh_hoc' => 'Sinh học',
            'lich_su' => 'Lịch sử',
            'dia_li' => 'Địa lý',
            'gdcd' => 'GDCD'
        ];

        $stats = [];
        
        foreach ($subjects as $column => $name) {
            $stats[$name] = [
                'excellent' => StudentScore::whereNotNull($column)->where($column, '>=', 8)->count(),
                'good' => StudentScore::whereNotNull($column)->where($column, '>=', 6)->where($column, '<', 8)->count(),
                'average' => StudentScore::whereNotNull($column)->where($column, '>=', 4)->where($column, '<', 6)->count(),
                'poor' => StudentScore::whereNotNull($column)->where($column, '<', 4)->count(),
            ];
        }

        return response()->json($stats);
    }

    /**
     * Trang top 10 khối A
     */
    public function topKhoiA()
    {
        $topStudents = StudentScore::whereNotNull('toan')
            ->whereNotNull('vat_li')
            ->whereNotNull('hoa_hoc')
            ->selectRaw('*, (toan + vat_li + hoa_hoc) as tong_khoi_a')
            ->orderByDesc('tong_khoi_a')
            ->limit(10)
            ->get();

        return Inertia::render('TopKhoiA', [
            'topStudents' => $topStudents
        ]);
    }
    public function getTopKhoiA()
    {
        $topStudents = StudentScore::whereNotNull('toan')
            ->whereNotNull('vat_li')
            ->whereNotNull('hoa_hoc')
            ->selectRaw('*, (toan + vat_li + hoa_hoc) as tong_khoi_a')
            ->orderByDesc('tong_khoi_a')
            ->limit(10)
            ->get();

        return response()->json($topStudents);
    }
}
