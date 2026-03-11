const express = require('express');
const router = express.Router();
const { Filters } = require('../models/Product');

const FILTER_GROUPS = [
  'sensors',
  'connectionTypes',
  'properties',
  'electronics',
  'categories',
  'materials',
  'environments',
];

const normalizeString = (value) => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
};

async function getOrCreateFiltersDoc() {
  let filtersDoc = await Filters.findOne();

  if (!filtersDoc) {
    const emptyPayload = FILTER_GROUPS.reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {});

    filtersDoc = new Filters(emptyPayload);
    await filtersDoc.save();
  }

  FILTER_GROUPS.forEach((group) => {
    if (!Array.isArray(filtersDoc[group])) {
      filtersDoc[group] = [];
    }
  });

  return filtersDoc;
}

router.get('/', async (_req, res) => {
  try {
    const filters = await getOrCreateFiltersDoc();
    res.json(filters);
  } catch (error) {
    console.error('[filters:get] failed', error);
    res.status(500).json({ message: 'Unable to fetch filters.' });
  }
});

router.post('/:group', async (req, res) => {
  const group = req.params.group;

  if (!FILTER_GROUPS.includes(group)) {
    return res.status(400).json({ message: 'Invalid filter group.' });
  }

  const code = normalizeString(req.body?.code);
  const tr = normalizeString(req.body?.tr);
  const en = normalizeString(req.body?.en);

  if (!code || !tr || !en) {
    return res.status(400).json({ message: 'Code, Turkish and English values are required.' });
  }

  try {
    const filtersDoc = await getOrCreateFiltersDoc();
    const groupEntries = filtersDoc[group] || [];
    const exists = groupEntries.some((entry) => entry.code === code);

    if (exists) {
      return res.status(409).json({ message: 'A filter with the same code already exists.' });
    }

    groupEntries.push({ code, tr, en });
    filtersDoc[group] = groupEntries;

    await filtersDoc.save();

    res.status(201).json({
      message: 'Filter option added successfully.',
      data: { code, tr, en },
    });
  } catch (error) {
    console.error('[filters:post] failed', error);
    res.status(500).json({ message: 'Unable to add filter option.' });
  }
});

router.delete('/:group/:code', async (req, res) => {
  const { group } = req.params;
  const code = normalizeString(req.params.code);

  if (!FILTER_GROUPS.includes(group)) {
    return res.status(400).json({ message: 'Invalid filter group.' });
  }

  if (!code) {
    return res.status(400).json({ message: 'Filter code is required.' });
  }

  try {
    const filtersDoc = await getOrCreateFiltersDoc();
    const groupEntries = filtersDoc[group] || [];
    const nextEntries = groupEntries.filter((entry) => entry.code !== code);

    if (nextEntries.length === groupEntries.length) {
      return res.status(404).json({ message: 'Filter option not found.' });
    }

    filtersDoc[group] = nextEntries;
    await filtersDoc.save();

    res.json({ message: 'Filter option removed successfully.' });
  } catch (error) {
    console.error('[filters:delete] failed', error);
    res.status(500).json({ message: 'Unable to remove filter option.' });
  }
});

module.exports = router;
