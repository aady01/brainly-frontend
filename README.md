# Brainly

Brainly is a modern content management and knowledge organization platform that helps you collect, organize, and share various types of content from across the web.

![Brainly Dashboard](![image](https://github.com/user-attachments/assets/93e8ab69-b589-4356-88ef-09e5e73ad368)


## Features

- **Multi-Content Support**: Save and organize different types of content:

  - YouTube videos
  - Twitter posts
  - Web links
  - Documents
  - Tags

- **Clean, Modern UI**: Beautiful and responsive interface built with React and Tailwind CSS

  - Collapsible sidebar for better space utilization
  - Responsive design for mobile and desktop
  - Dark/light mode support

- **Content Organization**:

  - Filter content by type
  - Search functionality
  - Visual indicators for different content types

- **Sharing Capabilities**:
  - Share your entire knowledge base with others
  - Individual content sharing

## Tech Stack

- **Frontend**:

  - React with TypeScript
  - Tailwind CSS for styling
  - Vite for build tooling

- **Backend**:
  - Node.js
  - Express
  - MongoDB

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/brainly.git
   cd brainly
   ```

2. Install frontend dependencies:

   ```bash
   cd brainly-fe
   npm install
   # or
   yarn install
   ```

3. Install backend dependencies:

   ```bash
   cd ../brainly-be
   npm install
   # or
   yarn install
   ```

4. Set up environment variables:

   - Create a `.env` file in the `brainly-be` directory

   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/brainly
   JWT_SECRET=your_jwt_secret
   ```

5. Start the development servers:

   Backend:

   ```bash
   cd brainly-be
   npm run dev
   # or
   yarn dev
   ```

   Frontend:

   ```bash
   cd brainly-fe
   npm run dev
   # or
   yarn dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

## Usage

### Adding Content

1. Click the "Add Content" button in the dashboard
2. Select the content type (YouTube, Twitter, Link, Document, Tag)
3. Enter a title and the URL/link for the content
4. Click "Add Content" to save

### Filtering Content

- Use the search bar to find specific content by title
- Click on the filter tabs to view content by type
- Use the sidebar navigation to access different content categories

### Sharing Your Brain

1. Click the "Share Brain" button in the dashboard
2. Copy the generated link
3. Share the link with others to give them access to your content collection

## Project Structure

```
brainly/
├── brainly-fe/           # Frontend codebase
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── icons/        # SVG icons as React components
│   │   ├── pages/        # Page components
│   │   ├── App.tsx       # Main application component
│   │   └── main.tsx      # Entry point
│   ├── index.html        # HTML template
│   └── package.json      # Frontend dependencies
│
└── brainly-be/           # Backend codebase
    ├── src/
    │   ├── controllers/  # Route controllers
    │   ├── models/       # Database models
    │   ├── routes/       # API routes
    │   └── index.ts      # Entry point
    └── package.json      # Backend dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
