const userRepository = require('../repositories/userRepository');

class UserController {
  async getProfile(req, res, next) {
    try {
      // req.user is set by the authMiddleware
      const user = await userRepository.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { bio, location, github_url, leetcode_url } = req.body;
      
      const updatedUser = await userRepository.updateProfile(req.user.id, {
        bio,
        location,
        github_url,
        leetcode_url
      });

      res.status(200).json({
        message: 'Profile updated successfully',
        data: updatedUser
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
