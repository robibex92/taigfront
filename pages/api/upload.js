import { promises as fs } from 'fs';
import path from 'path';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(process.cwd(), 'public', 'img-ads');
    form.keepExtensions = true;

    // Создаем директорию, если она не существует
    await fs.mkdir(form.uploadDir, { recursive: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Ошибка загрузки:', err);
        return res.status(500).json({ message: 'Ошибка загрузки файла' });
      }

      const file = files.file;
      if (!file) {
        return res.status(400).json({ message: 'Файл не найден' });
      }

      const fileName = path.basename(file.filepath);
      const imageUrl = `/img-ads/${fileName}`;

      res.status(200).json({ 
        message: 'Файл успешно загружен', 
        imageUrl: imageUrl 
      });
    });
  } else {
    res.status(405).json({ message: 'Метод не разрешен' });
  }
};
