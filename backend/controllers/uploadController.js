// @desc    Upload video to Cloudinary
// @route   POST /api/upload/video
// @access  Private (Instructor only)
exports.uploadVideo = async (req, res) => {
  try {
    console.log('File received:', req.file); // Debug log

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a video file'
      });
    }

    let duration = req.file.duration || 0;

    // If duration is not provided by multer-storage-cloudinary, try to fetch it via Cloudinary API
    if (!duration) {
      try {
        const { cloudinary } = require('../utils/cloudinary');
        const result = await cloudinary.api.resource(req.file.filename, { resource_type: 'video' });
        duration = Math.round(result.duration || 0);
      } catch (error) {
        console.error('Error fetching video metadata from Cloudinary:', error);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Video uploaded successfully',
      data: {
        url: req.file.path,
        publicId: req.file.filename,
        duration: duration,
        format: req.file.format
      }
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading video',
      error: error.message
    });
  }
};

// @desc    Upload image to Cloudinary
// @route   POST /api/upload/image
// @access  Private (Instructor only)
exports.uploadImage = async (req, res) => {
  try {
    console.log('File received:', req.file); // Debug log

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: req.file.path,
        publicId: req.file.filename
      }
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
};
