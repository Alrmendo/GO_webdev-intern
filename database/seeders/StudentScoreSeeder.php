<?php

namespace Database\Seeders;

use App\Models\StudentScore;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StudentScoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csvFile = base_path('./dataset/diem_thi_thpt_2024.csv');
        
        if (!file_exists($csvFile)) {
            $this->command->error('File CSV không tồn tại!');
            return;
        }

        $this->command->info('Bắt đầu import dữ liệu từ CSV...');
        
        DB::table('student_scores')->truncate();
        
        $handle = fopen($csvFile, 'r');
        $header = fgetcsv($handle);
        
        $imported = 0;
        $errors = 0;
        
        while (($row = fgetcsv($handle)) !== false) {
            try {
                if (count($row) < count($header)) {
                    $errors++;
                    continue;
                }
                
                $data = [
                    'sbd' => $row[0],
                    'toan' => $this->convertScore($row[1]),
                    'ngu_van' => $this->convertScore($row[2]),
                    'ngoai_ngu' => $this->convertScore($row[3]),
                    'vat_li' => $this->convertScore($row[4]),
                    'hoa_hoc' => $this->convertScore($row[5]),
                    'sinh_hoc' => $this->convertScore($row[6]),
                    'lich_su' => $this->convertScore($row[7]),
                    'dia_li' => $this->convertScore($row[8]),
                    'gdcd' => $this->convertScore($row[9]),
                    'ma_ngoai_ngu' => !empty($row[10]) ? $row[10] : null,
                ];
                
                StudentScore::create($data);
                $imported++;
                
                // Hiển thị mỗi 1000 bản ghi
                if ($imported % 1000 == 0) {
                    $this->command->info("Đã import: {$imported} học sinh");
                }
                
            } catch (\Exception $e) {
                $errors++;
            }
        }
        
        fclose($handle);
        
        $this->command->info("Import hoàn thành!");
        $this->command->info("Thành công: {$imported} học sinh");
        $this->command->info("Lỗi: {$errors} dòng");
    }
    
    private function convertScore($score)
    {
        if (empty($score) || $score === '') {
            return null;
        }
        
        $converted = (float) $score;
        
        if ($converted >= 0 && $converted <= 10) {
            return $converted;
        }
        
        return null;
    }
}
