<?php
header('Content-Type: text/plain; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$uploadsDir = $_SERVER['DOCUMENT_ROOT'] . '/uploads/';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $filename = $_POST['filename'] ?? '';
    
    if (empty($filename)) {
        echo "Ошибка: Не указано имя файла";
        exit;
    }

    $filepath = $uploadsDir . $filename;

    if (!file_exists($filepath)) {
        echo "Ошибка: Файл не найден";
        exit;
    }

    if (unlink($filepath)) {
        echo "Файл успешно удален: " . $filename;
    } else {
        echo "Ошибка при удалении файла";
    }
} else {
    echo "Неверный метод запроса";
}
?>
