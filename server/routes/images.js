const express = require('express');
const router = express.Router();
const { upload, cloudinary } = require('../config/cloudinary');

// @route   GET /api/images
// @desc    Get all images from Cloudinary (optional filter by public_id contains)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { contains } = req.query;
    // Get all resources from Cloudinary
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 500,
    });

    // Map Cloudinary resources to our format
    let images = result.resources.map((resource) => ({
      id: resource.public_id,
      publicId: resource.public_id,
      url: resource.secure_url,
      createdAt: resource.created_at,
    }));

    if (contains && typeof contains === 'string') {
      const search = contains.toLowerCase();
      images = images.filter((image) => image.publicId.toLowerCase().includes(search));
    }

    res.json({
      images,
      total: images.length,
    });
  } catch (error) {
    console.error('Cloudinary API Error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch images', 
      error: error.message 
    });
  }
});

// @route   GET /api/images/:id
// @desc    Get single image from Cloudinary
// @access  Public
// Note: Regex pattern allows forward slashes in public_id (e.g., bdflow-products/xxxxx)
router.get('/:id(*)', async (req, res) => {
  try {
    const publicId = req.params.id;
    const resource = await cloudinary.api.resource(publicId);
    
    if (!resource) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json({
      id: resource.public_id,
      publicId: resource.public_id,
      url: resource.secure_url,
      createdAt: resource.created_at,
    });
  } catch (error) {
    console.error('Cloudinary API Error:', error);
    res.status(404).json({ 
      message: 'Image not found', 
      error: error.message 
    });
  }
});

// @route   DELETE /api/images/:id
// @desc    Delete image from Cloudinary
// @access  Private (Admin)
// Note: Regex pattern allows forward slashes in public_id (e.g., bdflow-products/xxxxx)
router.delete('/:id(*)', async (req, res) => {
  try {
    const publicId = req.params.id;
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ message: 'Image not found', result });
    }
  } catch (error) {
    console.error('Cloudinary API Error:', error);
    res.status(500).json({ 
      message: 'Delete failed', 
      error: error.message 
    });
  }
});

// @route   POST /api/images/upload
// @desc    Upload image to Cloudinary
// @access  Private (Admin)
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const customPublicId = req.body?.publicId;
    const isPdf = req.file.mimetype === 'application/pdf';
    
    // Upload to Cloudinary from buffer
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'bdflow-products',
        public_id: customPublicId || undefined,
        resource_type: isPdf ? 'raw' : 'image',
        transformation: isPdf ? [] : [{ width: 800, height: 800, crop: 'limit' }],
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          return res.status(500).json({ 
            message: 'Upload failed', 
            error: error.message 
          });
        }

        res.json({
          message: 'File uploaded successfully',
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );

    // Pipe the buffer to Cloudinary
    const { Readable } = require('stream');
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);
    bufferStream.pipe(uploadStream);

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

module.exports = router;
