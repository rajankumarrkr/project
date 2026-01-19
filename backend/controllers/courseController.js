const Course = require('../models/Course');
const Section = require('../models/Section');
const Lecture = require('../models/Lecture');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Instructor only)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, level, thumbnail, promoVideo, price } = req.body;

    if (!title || !description || !category || !level) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, category, and level'
      });
    }

    const course = await Course.create({
      title,
      description,
      category,
      level,
      thumbnail,
      promoVideo,
      price: price || 0,
      instructor: req.user._id,
      status: 'draft'
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: { course }
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating course',
      error: error.message
    });
  }
};

// @desc    Get all published courses
// @route   GET /api/courses
// @access  Public
exports.getAllCourses = async (req, res) => {
  try {
    const { search, category, level } = req.query;

    let query = { status: 'published' };

    // Search by title or description
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by level
    if (level) {
      query.level = level;
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name profileImage')
      .select('-sections')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: { courses }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name bio profileImage expertise')
      .populate({
        path: 'sections',
        populate: {
          path: 'lectures',
          select: 'title duration order'
        }
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { course }
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course',
      error: error.message
    });
  }
};

// @desc    Get instructor's own courses
// @route   GET /api/courses/my-courses
// @access  Private (Instructor only)
exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .populate({
        path: 'sections',
        populate: {
          path: 'lectures'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: { courses }
    });
  } catch (error) {
    console.error('Get my courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your courses',
      error: error.message
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor only - own courses)
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is the course instructor
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    const { title, description, category, level, thumbnail, promoVideo } = req.body;

    course = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, category, level, thumbnail, promoVideo, price },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: { course }
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating course',
      error: error.message
    });
  }
};

// @desc    Publish/Unpublish course
// @route   PATCH /api/courses/:id/publish
// @access  Private (Instructor only - own courses)
exports.togglePublishCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('sections');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to publish this course'
      });
    }

    // Validation: Course must have at least one section with lectures
    if (course.sections.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot publish course without sections and lectures'
      });
    }

    // Toggle status
    if (course.status === 'draft') {
      course.status = 'published';
    } else if (course.status === 'published') {
      course.status = 'unpublished';
    } else {
      course.status = 'published';
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: `Course ${course.status} successfully`,
      data: { course }
    });
  } catch (error) {
    console.error('Publish course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error publishing course',
      error: error.message
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor only - own courses)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    // Delete all sections and lectures associated with this course
    await Section.deleteMany({ course: course._id });
    await Lecture.deleteMany({ section: { $in: course.sections } });

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting course',
      error: error.message
    });
  }
};
