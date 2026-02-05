# Contributing to Online Examination Management System

First off, thank you for considering contributing to our project! It's people like you that make this project such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, check the [issue list](https://github.com/Yashwantkashyap2005/Online-Exam-Management-System-/issues) to avoid duplicates.

When you are creating a bug report, include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots and animated GIFs if possible**
* **Include your environment details** (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and expected behavior**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Follow the JavaScript/React styleguides
* End all files with a newline
* Avoid platform-dependent code

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Example:
  ```
  Add user authentication with JWT
  
  - Implement JWT token generation
  - Add middleware for token verification
  - Create login endpoint
  
  Fixes #123
  ```

### JavaScript Styleguide

* Use 2 spaces for indentation
* Use semicolons at the end of statements
* Use camelCase for variable names
* Use PascalCase for component names
* Add comments for complex logic
* Example:
  ```javascript
  // Good
  const getUserData = async (userId) => {
    const user = await User.findById(userId);
    return user;
  };

  // Bad
  const get_user_data = async (user_id) => {
    const user = await User.find({_id: user_id});
    return user
  }
  ```

### React Styleguide

* Use functional components with hooks
* Use descriptive component names
* Keep components focused and single-responsibility
* Example:
  ```jsx
  // Good
  const UserProfileCard = ({ userId }) => {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
      fetchUser(userId);
    }, [userId]);

    return <div>{user?.name}</div>;
  };

  // Bad
  const U = ({id}) => {
    const [u, set_u] = useState(null);
    
    useEffect(() => {
      fetch(`/api/user/${id}`).then(r => set_u(r));
    }, [id]);

    return <div>{u && u.name}</div>;
  };
  ```

## Development Process

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Online-Exam-Management-System-.git
   cd Online-Exam-Management-System
   ```

3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes** and commit them:
   ```bash
   git add .
   git commit -m "Add your feature description"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** with detailed description

## Testing

Before submitting a pull request, make sure:

* [ ] Your code follows the style guidelines
* [ ] You have added tests for new features
* [ ] All tests pass (`npm test`)
* [ ] You have updated the documentation
* [ ] Your changes don't break existing functionality

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Documentation

* Use clear language
* Include code examples
* Update README.md if necessary
* Add comments to complex logic
* Keep documentation up-to-date

## Additional Notes

### Issue and Pull Request Labels

* `bug` - Something isn't working
* `enhancement` - New feature or request
* `documentation` - Improvements or additions to documentation
* `good first issue` - Good for newcomers
* `help wanted` - Extra attention is needed
* `wontfix` - This will not be worked on

## Recognition

Contributors will be recognized in:
* GitHub Contributors page
* Project README file
* Release notes

## Questions?

Don't hesitate to ask! You can:
* Open a GitHub issue
* Start a GitHub Discussion
* Email the maintainers

---

**Thank you for contributing!** 🎉
