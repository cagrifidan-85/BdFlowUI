const express = require('express');
const SiteSettings = require('../models/SiteSettings');

const router = express.Router();

const ensureSettingsDocument = async () => {
  let doc = await SiteSettings.findOne();
  if (!doc) {
    doc = await SiteSettings.create({});
  }
  return doc;
};

router.get('/site', async (req, res) => {
  try {
    const doc = await ensureSettingsDocument();
    res.json(doc);
  } catch (error) {
    console.error('Error fetching site settings', error);
    res.status(500).json({ message: 'Site ayarları yüklenemedi.' });
  }
});

router.put('/site', async (req, res) => {
  try {
    const updated = await SiteSettings.findOneAndUpdate(
      {},
      { $set: req.body },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json(updated);
  } catch (error) {
    console.error('Error updating site settings', error);
    res.status(400).json({ message: 'Site ayarları güncellenemedi.' });
  }
});

module.exports = router;
