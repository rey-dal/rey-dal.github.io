# [Portfolio](https://rey-dal.github.io/)

## Features

- Clean, modern design with smooth animations
- Responsive layout that works on all devices
- Sections for introduction, projects, and resume
- Social media links

## Getting Started

1. Clone this repository
2. Open `index.html` in your browser to view the website
3. Customize the content in `index.html` to add your personal information
4. Modify the styles in `css/styles.css` to match your preferred color scheme

## Customization

### Personal Information

Edit the `index.html` file to replace the placeholder content with your information:

- Update your name in the hero section
- Change the description and subtitle to match your skills and experience
- Update the social media links with your profiles
- Add your own projects to the projects section

### Styling

The website uses CSS variables for easy customization. In the `css/styles.css` file, you can modify the following variables to change the color scheme:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --background-color: #f8fafc;
    --text-color: #1e293b;
    --light-gray: #e2e8f0;
    --dark-gray: #64748b;
    --card-bg: #ffffff;
    --highlight-color: #3b82f6;
}
```

## Adding Projects

To add a new project, copy the following HTML structure and add it to the projects grid in `index.html`:

```html
<div class="project-card">
    <div class="project-content">
        <h3>Project Title</h3>
        <p>Project description goes here.</p>
        <div class="project-links">
            <a href="#" class="project-link">View Project</a>
            <a href="#" class="project-link">GitHub</a>
        </div>
    </div>
</div>
```

## Author

rey-dal