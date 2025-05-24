<?php

namespace App\Console\Commands;

use App\Models\StudentScore;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ImportStudentData extends Command
{
    protected $signature = 'import:student-data {--force : Force import even if data exists}';
    protected $description = 'Import student score data from CSV file';

    public function handle()
    {
        $csvFile = base_path('./dataset/diem_thi_thpt_2024.csv');
        
        if (!file_exists($csvFile)) {
            $this->error('File CSV không tồn tại!');
            return 1;
        }

        // Check if data already exists
        $existingCount = StudentScore::count();
        if ($existingCount > 0 && !$this->option('force')) {
            $this->info("Dữ liệu đã tồn tại ({$existingCount} records). Sử dụng --force để import lại.");
            return 0;
        }

        $this->info('Bắt đầu import dữ liệu từ CSV...');
        
        if ($existingCount > 0) {
            $this->info('Xóa dữ liệu cũ...');
            DB::table('student_scores')->truncate();
        }
        
        $handle = fopen($csvFile, 'r');
        $header = fgetcsv($handle);
        
        $imported = 0;
        $errors = 0;
        $batchSize = 100;
        $batch = [];
        
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
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                
                $batch[] = $data;
                
                // Insert in batches for better performance
                if (count($batch) >= $batchSize) {
                    DB::table('student_scores')->insert($batch);
                    $imported += count($batch);
                    $batch = [];
                    
                    // Show progress
                    if ($imported % 1000 == 0) {
                        $this->info("Đã import: {$imported} học sinh");
                    }
                }
                
            } catch (\Exception $e) {
                $errors++;
                $this->warn("Lỗi tại dòng {$imported}: " . $e->getMessage());
            }
        }
        
        // Insert remaining batch
        if (!empty($batch)) {
            DB::table('student_scores')->insert($batch);
            $imported += count($batch);
        }
        
        fclose($handle);
        
        $this->info("Import hoàn thành!");
        $this->info("Thành công: {$imported} học sinh");
        $this->info("Lỗi: {$errors} dòng");
        
        return 0;
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