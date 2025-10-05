# Air Pollution Dashboard

A modern, beautiful React-based dashboard for air quality monitoring and recommendations in Delhi-NCR. Built with Next.js 14, Tailwind CSS, and Radix UI for a premium user experience.

---

✨ **Features**

🎨 **Modern Design**
- Beautiful UI/UX: Clean, modern design with smooth transitions
- Responsive Design: Mobile-first approach
- Consistent branding and typography
- Interactive elements and hover effects

🔧 **Core Functionality**
- Real-Time AQI Monitoring: Live air quality data for Delhi-NCR
- AI Forecasts: 24-72 hour air quality predictions
- Source Mapping: Visualize pollution sources
- Safe Routes: Find cleaner paths for your journey
- Alerts & Notifications: Get notified of air quality changes
- Policy Feedback: Citizen engagement and feedback
- IoT Sensor Integration: Hyperlocal AQI from connected sensors

🚀 **Technical Features**
- Next.js 14: Latest React framework with app directory
- Tailwind CSS: Utility-first CSS framework
- Radix UI: Accessible, customizable UI components
- Lucide Icons: Beautiful icon set
- TypeScript: Type-safe codebase
- API Routes: Serverless backend endpoints

---

🛠️ **Installation**

**Prerequisites**
- Node.js 18.x or later
- pnpm (recommended) or npm/yarn

**Setup**
1. Install dependencies:
   ```
   pnpm install
   ```
2. Start the development server:
   ```
   pnpm dev
   ```
3. Open your browser: Navigate to `http://localhost:3000`

---

📁 **Project Structure**

```
Air-pollution-dashboard/
├── public/                # Static assets
├── app/
│   ├── api/               # API routes
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility and data functions
│   ├── styles/            # Global styles
│   ├── globals.css        # Main CSS
│   ├── layout.tsx         # App layout
│   └── page.tsx           # Home page
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── README.md
```

---

🎯 **Pages Overview**

1. **Home Page (/)**
   - Real-time AQI, health recommendations, quick actions
2. **Forecast Page (/forecast)**
   - AI-powered air quality predictions
3. **Source Map Page (/source-map)**
   - Pollution source visualization
4. **Mobile Page (/mobile)**
   - Location-based features, safe routes, hyperlocal AQI
5. **Citizen Page (/citizen)**
   - Alerts, notifications, feedback
6. **Policy Page (/policy)**
   - Policy dashboard and feedback

---

🔐 **User Roles & Features**
- Citizen: View AQI, get alerts, provide feedback
- Policy Maker: Analyze data, review feedback
- Mobile User: Location-based AQI, safe routes

---

🎨 **Design System**
- Colors: CleanAir branding (greens, blues, neutrals)
- Typography: Modern sans-serif fonts
- Components: Buttons, cards, forms, modals, charts

---

🚀 **Development**

Available Scripts:
- Development server: `pnpm dev`
- Build for production: `pnpm build`
- Start production: `pnpm start`
- Lint code: `pnpm lint`

---

📱 **Responsive Design**
- Mobile-first, touch-friendly interface
- Optimized for all screen sizes

---

🔧 **API Integration**
- Next.js API routes for backend logic
- Fetches AQI, forecasts, sensor data, etc.

---

🎭 **Animations & UX**
- Smooth transitions and loading states
- Interactive charts and cards

---

🔒 **Security & Performance**
- Input validation
- Error handling
- Optimized bundle size
- Fast load times

---

🧪 **Testing & Deployment**
- Ready for Vercel/Netlify deployment
- Unit and integration test setup

---

🤝 **Contributing**
- Fork the repository
- Create a feature branch
- Make your changes
- Test thoroughly
- Submit a pull request

---
 Future Enhancements

- Background real-time map for the Source Map page to visualize pollution sources dynamically

---

📄 **License**
MIT - See main project license

---

🆘 **Support**
- For issues and questions: Open an issue or contact the development team

---

Built with ❤️ for clean air and a healthier future.
