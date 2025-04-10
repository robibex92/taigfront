<?php
$targetDir = "uploads/";
if (!file_exists($targetDir) && !is_dir($targetDir)) {
    mkdir($targetDir, 0755, true);
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES["fileToUpload"])) {
    $targetFile = $targetDir . basename($_FILES["fileToUpload"]["name"]);

    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $targetFile)) {
        echo "Файл успешно загружен: " . basename($_FILES["fileToUpload"]["name"]);
    } else {
        echo "Ошибка при загрузке файла.";
    }
}
?>