import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 2999;

// Middleware
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Ensure database directory exists
const databaseDir = path.join(__dirname, 'database');
const csvFile = path.join(databaseDir, 'teklif.csv');

if (!fs.existsSync(databaseDir)) {
  fs.mkdirSync(databaseDir, { recursive: true });
}

// Initialize CSV file with headers if it doesn't exist
if (!fs.existsSync(csvFile)) {
  const headers = 'Tarih,Saat,İsim Soyisim,Firma Adı,E-posta,Telefon,Notlar,Ürün Adı,IP Adresi\n';
  fs.writeFileSync(csvFile, headers, 'utf8');
}

// Lock mechanism for concurrent access
let isWriting = false;
const writeQueue = [];

async function writeToCSV(data) {
  return new Promise((resolve, reject) => {
    writeQueue.push({ data, resolve, reject });
    processQueue();
  });
}

async function processQueue() {
  if (isWriting || writeQueue.length === 0) return;
  
  isWriting = true;
  
  while (writeQueue.length > 0) {
    const { data, resolve, reject } = writeQueue.shift();
    
    try {
      const timestamp = new Date();
      const date = timestamp.toLocaleDateString('tr-TR');
      const time = timestamp.toLocaleTimeString('tr-TR');
      
      // Escape CSV values
      const escapeCSV = (value) => {
        if (value === null || value === undefined) return '';
        const str = String(value);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };
      
      const csvRow = [
        escapeCSV(date),
        escapeCSV(time),
        escapeCSV(data.name),
        escapeCSV(data.company || ''),
        escapeCSV(data.email || ''),
        escapeCSV(data.phone || ''),
        escapeCSV(data.notes || ''),
        escapeCSV(data.productName || ''),
        escapeCSV(data.ipAddress || '')
      ].join(',') + '\n';
      
      // Append to CSV file
      fs.appendFileSync(csvFile, csvRow, 'utf8');
      
      console.log(`Form data saved: ${data.name} - ${data.productName}`);
      resolve({ success: true, timestamp });
      
    } catch (error) {
      console.error('Error writing to CSV:', error);
      reject(error);
    }
  }
  
  isWriting = false;
  
  // Continue processing queue if there are more items
  if (writeQueue.length > 0) {
    setTimeout(processQueue, 10);
  }
}

// API endpoint to save form data
app.post('/api/submit-quote', async (req, res) => {
  try {
    const { name, company, email, phone, notes, productName } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    
    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: 'İsim soyisim zorunludur' 
      });
    }
    
    // Validate email - REQUIRED
    if (!email || !email.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: 'E-posta adresi zorunludur' 
      });
    }
    
    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      return res.status(400).json({ 
        success: false, 
        error: 'Geçerli bir e-posta adresi giriniz' 
      });
    }
    
    const formData = {
      name: name.trim(),
      company: (company || '').trim(),
      email: email.trim(),
      phone: (phone || '').trim(),
      notes: (notes || '').trim(),
      productName: (productName || '').trim(),
      ipAddress: ipAddress
    };
    
    await writeToCSV(formData);
    
    res.json({ 
      success: true, 
      message: 'Teklif talebi başarıyla kaydedildi',
      timestamp: new Date()
    });
    
  } catch (error) {
    console.error('Error processing form submission:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Form gönderilirken bir hata oluştu' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend server is running',
    timestamp: new Date()
  });
});

// Get quote statistics (optional endpoint)
app.get('/api/quote-stats', (req, res) => {
  try {
    if (!fs.existsSync(csvFile)) {
      return res.json({ totalQuotes: 0, lastQuote: null });
    }
    
    const csvContent = fs.readFileSync(csvFile, 'utf8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    const totalQuotes = Math.max(0, lines.length - 1); // Subtract header row
    
    // Get last quote date
    let lastQuote = null;
    if (lines.length > 1) {
      const lastLine = lines[lines.length - 1];
      const lastDate = lastLine.split(',')[0];
      lastQuote = lastDate;
    }
    
    res.json({ totalQuotes, lastQuote });
  } catch (error) {
    console.error('Error getting quote stats:', error);
    res.status(500).json({ error: 'İstatistikler alınırken hata oluştu' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`CSV file location: ${csvFile}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Network access: http://[YOUR_IP]:${PORT}/api/health`);
  console.log(`\nTo find your IP address:`);
  console.log(`Windows: ipconfig`);
  console.log(`Mac/Linux: ifconfig`);
});