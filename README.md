# Hoops Commentary Crafter

An AI-powered web application that creates custom basketball commentary for short video clips.

## Overview

Hoops Commentary Crafter is a fun, interactive tool that allows basketball enthusiasts to upload short video clips of gameplay and receive AI-generated commentary that brings their plays to life with professional-sounding narration.

## Features

- **Video Upload**: Upload short (10-15 second) basketball clips
- **Style Selection**: Choose from multiple commentary styles (Excitable, Analytical, Old School)
- **Keyword Tagging**: Add keywords to guide the commentary tone and focus
- **AI Commentary Generation**: Generate custom play-by-play commentary using advanced AI models
- **Audio Integration**: Automatically merge the generated commentary with the original video
- **Share Functionality**: Easily share the commentated clips on social media

## Technical Architecture

### Frontend
- React.js with TypeScript for type safety
- Material UI for responsive component design
- Video.js for video playback and manipulation

### Backend
- Node.js/Express for the API server
- FFmpeg for video processing
- Cloud storage for temporary video files
- OpenAI API integration for commentary generation
- Text-to-speech service for voice generation

### Key Components

1. **Upload Component**: Handles video file submission and validation
2. **Style Selector**: Interface for choosing commentary style and keywords
3. **Processing Service**: Backend service that generates commentary and applies it to video
4. **Preview Player**: Video player that allows users to preview the result
5. **Export Module**: Handles the final video rendering and download/sharing options

## Usage Flow

1. User uploads a short basketball clip (max 15 seconds)
2. User selects a commentary style and adds relevant keywords
3. The system processes the video and generates appropriate commentary
4. An AI voice model converts the text to speech in the selected style
5. The audio is overlaid onto the original video
6. User can preview, download, and share the final product

## Development Roadmap

- [x] Initial project setup and repository creation
- [ ] Frontend UI design and implementation
- [ ] Video upload and processing functionality
- [ ] Commentary generation using AI models
- [ ] Text-to-speech integration
- [ ] Video and audio merging
- [ ] Download and sharing capabilities
- [ ] User testing and refinement
- [ ] Production deployment

## Installation & Setup

```bash
# Clone the repository
git clone https://github.com/dxaginfo/hoops-commentary-crafter.git

# Navigate to project directory
cd hoops-commentary-crafter

# Install dependencies
npm install

# Start development server
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.