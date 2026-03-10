const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

const REQUIRED_MAIL_ENV_VARS = [
  'PRICE_REQUEST_MAIL_HOST',
  'PRICE_REQUEST_MAIL_PORT',
  'PRICE_REQUEST_MAIL_USER',
  'PRICE_REQUEST_MAIL_PASS',
  'PRICE_REQUEST_MAIL_TO',
];

const hasMailConfig = () => REQUIRED_MAIL_ENV_VARS.every((key) => Boolean(process.env[key]));

const buildTransportOptions = () => ({
  host: process.env.PRICE_REQUEST_MAIL_HOST,
  port: Number(process.env.PRICE_REQUEST_MAIL_PORT || 587),
  secure: Number(process.env.PRICE_REQUEST_MAIL_PORT) === 465,
  auth: {
    user: process.env.PRICE_REQUEST_MAIL_USER,
    pass: process.env.PRICE_REQUEST_MAIL_PASS,
  },
});

const buildItemsMarkup = (items = []) => {
  if (!items.length) {
    return '<p>Sepet boş.</p>';
  }

  const rows = items
    .map((item, index) => {
      const priceText = item.price?.amount
        ? `${item.price.amount} ${item.price.currency || ''}`.trim()
        : 'Talep Üzerine';

      return `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">${index + 1}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.name || 'Ürün'}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.productNo || '-'}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.materialLabel || '-'}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.environmentLabel || '-'}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.quantity || 1}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">${priceText}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
      <thead>
        <tr style="background:#fafafa;">
          <th align="left" style="padding:8px 12px;">#</th>
          <th align="left" style="padding:8px 12px;">Ürün</th>
          <th align="left" style="padding:8px 12px;">Ürün No</th>
          <th align="left" style="padding:8px 12px;">Malzeme</th>
          <th align="left" style="padding:8px 12px;">Ortam</th>
          <th align="left" style="padding:8px 12px;">Adet</th>
          <th align="left" style="padding:8px 12px;">Fiyat</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
};

const buildQuestionAnswerHtml = (qaItems = []) => {
  if (!qaItems.length) {
    return '';
  }

  const rows = qaItems
    .map(
      ({ question, answer }) => `
        <li style="margin-bottom:8px;">
          <div><strong>Soru:</strong> ${question}</div>
          <div><strong>Cevap:</strong> ${answer}</div>
        </li>
      `,
    )
    .join('');

  return `<ul style="padding-left:18px;">${rows}</ul>`;
};

const buildQuestionAnswerText = (qaItems = []) =>
  qaItems
    .map(({ question, answer }) => `Soru: ${question}\nCevap: ${answer}`)
    .join('\n');

const buildPlainSummary = ({ items }) => {
  const itemBlock = items
    .map((item, index) => {
      const priceText = item.price?.amount
        ? `${item.price.amount} ${item.price.currency || ''}`.trim()
        : 'Talep Üzerine';
      const materialText = item.materialLabel ? ` | Malzeme: ${item.materialLabel}` : '';
      const environmentText = item.environmentLabel ? ` | Ortam: ${item.environmentLabel}` : '';
      return `${index + 1}) ${item.name} x${item.quantity || 1} (${priceText}${materialText}${environmentText})`;
    })
    .join('\n');

  return itemBlock;
};

router.post('/', async (req, res) => {
  try {
    const { items, requesterName, companyName, email, phone, note } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Sepet boş gönderilemez.' });
    }

    if (!email) {
      return res.status(400).json({ message: 'Lütfen bir iletişim e-postası ekleyin.' });
    }

    if (!hasMailConfig()) {
      return res.status(500).json({ message: 'Mail yapılandırması eksik. Lütfen sunucu ortam değişkenlerini kontrol edin.' });
    }

    const transporter = nodemailer.createTransport(buildTransportOptions());

    const qaItems = [
      { question: 'Ad Soyad', answer: requesterName || 'Belirtilmedi' },
      { question: 'Firma', answer: companyName || 'Belirtilmedi' },
      { question: 'E-posta', answer: email },
      { question: 'Telefon', answer: phone || 'Belirtilmedi' },
      { question: 'Not', answer: note || '-' },
    ];

    const subject = `BdFlow - Yeni Fiyat Talebi (${requesterName || 'İsimsiz'})`;
    const html = `
      <div style="font-family:Arial,sans-serif;">
        <h2>Yeni Fiyat Talebi</h2>
        <h3>Gerekli Bilgiler</h3>
        ${buildQuestionAnswerHtml(qaItems)}
        <h3>Talep Edilen Ürünler</h3>
        ${buildItemsMarkup(items)}
      </div>
    `;

    const text = [
      'Yeni Fiyat Talebi',
      buildQuestionAnswerText(qaItems),
      '',
      buildPlainSummary({ items }),
    ].join('\n');

    await transporter.sendMail({
      from: process.env.PRICE_REQUEST_MAIL_FROM || process.env.PRICE_REQUEST_MAIL_USER,
      to: process.env.PRICE_REQUEST_MAIL_TO,
      subject,
      text,
      html,
    });

    res.json({ message: 'Talebiniz alındı. Ekibimiz en kısa sürede iletişime geçecek.' });
  } catch (error) {
    console.error('Price request mail error:', error);
    res.status(500).json({ message: 'Fiyat talebi şu anda iletilemedi. Lütfen daha sonra tekrar deneyin.' });
  }
});

module.exports = router;
