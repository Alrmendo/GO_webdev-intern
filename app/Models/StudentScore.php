<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentScore extends Model
{
    protected $fillable = [
        'sbd',
        'toan',
        'ngu_van', 
        'ngoai_ngu',
        'vat_li',
        'hoa_hoc',
        'sinh_hoc',
        'lich_su',
        'dia_li',
        'gdcd',
        'ma_ngoai_ngu'
    ];

    protected $casts = [
        'toan' => 'decimal:2',
        'ngu_van' => 'decimal:2',
        'ngoai_ngu' => 'decimal:2',
        'vat_li' => 'decimal:2',
        'hoa_hoc' => 'decimal:2',
        'sinh_hoc' => 'decimal:2',
        'lich_su' => 'decimal:2',
        'dia_li' => 'decimal:2',
        'gdcd' => 'decimal:2',
    ];

    /**
     * DDiểm khối A (Toán + Lý + Hóa)
     */
    public function getTongKhoiAAttribute()
    {
        $toan = $this->toan ?? 0;
        $vat_li = $this->vat_li ?? 0;
        $hoa_hoc = $this->hoa_hoc ?? 0;
        
        if ($this->toan && $this->vat_li && $this->hoa_hoc) {
            return $toan + $vat_li + $hoa_hoc;
        }
        
        return null;
    }

    /**
     * Kiểm tra xem học sinh có thi đủ khối A không
     */
    public function hasKhoiAScores()
    {
        return $this->toan && $this->vat_li && $this->hoa_hoc;
    }

    public static function getScoreLevel($score)
    {
        if ($score === null || $score === '') return null;
        
        if ($score >= 8) return 'excellent';
        if ($score >= 6) return 'good';  
        if ($score >= 4) return 'average';  
        return 'poor';                       
    }
}
