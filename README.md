# 🚀 Chan Dinh - AI/ML Developer Portfolio (Next.js)

A modern, responsive portfolio website built with Next.js 14, showcasing expertise in Machine Learning, Artificial Intelligence, and Software Development.

## ✨ Features

* **Modern Design**: Clean white theme with blue accents and subtle patterns
* **Responsive Layout**: Optimized for all devices and screen sizes
* **Interactive Elements**: Smooth animations and transitions using Framer Motion
* **Project Showcase**: Featured ML/AI projects with live links and GitHub repositories
* **Professional Branding**: Personal logo and custom styling
* **Contact Form**: Interactive contact form for potential clients and collaborators
* **Performance Optimized**: Built with Next.js for optimal performance and SEO

## 🛠️ Technologies Used

* **Framework**: Next.js 14 with App Router
* **Frontend**: React 18, TypeScript
* **Styling**: Tailwind CSS with custom components
* **Animations**: Framer Motion for smooth interactions
* **Icons**: Lucide React for consistent iconography
* **Deployment**: Vercel (recommended) or any hosting platform

## 🎯 Featured Projects

1. **Project Pæmon - AI Web App**  
   * Pokémon-inspired AI companion generator  
   * Won Best Personal Project at Nosu AI Hackathon ($650)  
   * Technologies: Next.js, OpenAI GPT-3.5, Stable Diffusion

2. **MNIST Digit Classifier**  
   * Machine learning for digit recognition  
   * Neural network implementation and evaluation  
   * Technologies: Python, PyTorch, Neural Networks

3. **Bike Sharing Demand Prediction**  
   * Automated ML using AutoGluon  
   * Time series forecasting expertise  
   * Technologies: Python, AutoGluon, Time Series

4. **Dog Breed Classifier**  
   * Computer vision with PyTorch  
   * CNN architecture evaluation  
   * Technologies: Python, PyTorch, Computer Vision

5. **Medusa Bot - Discord Bot**  
   * Multi-API Discord bot  
   * REST API integration and event handling  
   * Technologies: JavaScript, Node.js, Discord.js

## 🚀 Getting Started

### Prerequisites

* Node.js 18+ 
* npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/chanadinh/portfolio.git

# Navigate to project directory
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Other Platforms

The project can be deployed to any hosting platform that supports Node.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📁 Project Structure

```
portfolio/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Homepage component
├── components/             # Reusable components
│   ├── Hero.tsx           # Hero section with animations
│   ├── About.tsx          # About section
│   ├── Skills.tsx         # Skills showcase
│   ├── Projects.tsx       # Projects grid
│   ├── Contact.tsx        # Contact form and info
│   └── Footer.tsx         # Footer component
├── public/                 # Static assets
├── tailwind.config.js      # Tailwind configuration
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## 🎨 Customization

### Colors and Theme

The portfolio uses a custom color scheme defined in `tailwind.config.js`:

* Primary: Blue (#3b82f6)
* Secondary: Dark Blue (#1e40af)
* Background: White with subtle patterns
* Accents: Blue gradients and shadows

### Adding New Projects

Edit `components/Projects.tsx` and add new projects to the `projects` array:

```typescript
{
  id: 6,
  title: "Your New Project",
  description: "Project description here",
  technologies: ["Tech1", "Tech2"],
  image: "image-url",
  github: "github-url",
  live: "live-url",
  featured: false
}
```

### Modifying Content

* **Personal Information**: Update content in each component file
* **Skills**: Modify the `skillCategories` array in `Skills.tsx`
* **Contact Info**: Update contact details in `Contact.tsx`
* **Social Links**: Update social media links throughout components

## 📱 Responsive Design

* **Mobile First**: Optimized for mobile devices
* **Tablet**: Responsive grid layouts
* **Desktop**: Full-featured experience with hover effects
* **Breakpoints**: Uses Tailwind's responsive utilities

## 🔧 Development

### Available Scripts

* `npm run dev` - Start development server
* `npm run build` - Build for production
* `npm start` - Start production server
* `npm run lint` - Run ESLint

### Code Quality

* ESLint configuration for code standards
* TypeScript for type safety
* Prettier for code formatting (recommended)

## 📞 Contact

* **GitHub**: [@chanadinh](https://github.com/chanadinh)
* **LinkedIn**: [Chan Dinh](https://linkedin.com/in/chandinh)
* **Email**: andinhc254@gmail.com
* **Website**: [chandinh.org](https://chandinh.org)

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

* Built with Next.js 14
* Styled with Tailwind CSS
* Icons from Lucide React
* Animations with Framer Motion
* Inspired by the original React portfolio

---

⭐ **Star this repository if you found it helpful!**

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you have any questions or need help customizing this portfolio, please open an issue on GitHub.
# next-portfolio
