# Hoops Commentary Crafter - Architecture

## System Architecture

The Hoops Commentary Crafter application follows a client-server architecture with the following components:

```
┌────────────────────────────────────────────┐
│                 Client Side                 │
│                                            │
│  ┌──────────────┐       ┌──────────────┐   │
│  │   Upload     │       │    Style     │   │
│  │  Component   │       │   Selector   │   │
│  └──────────────┘       └──────────────┘   │
│          │                     │           │
│          ▼                     ▼           │
│  ┌──────────────────────────────────────┐  │
│  │            Video Preview             │  │
│  │              Component               │  │
│  └──────────────────────────────────────┘  │
│                     │                      │
└─────────────────────┼──────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────┐
│                Server Side                  │
│                                            │
│  ┌──────────────┐       ┌──────────────┐   │
│  │   Video      │       │  Commentary  │   │
│  │  Processor   │──────▶│  Generator   │   │
│  └──────────────┘       └──────────────┘   │
│                               │            │
│                               ▼            │
│  ┌──────────────┐       ┌──────────────┐   │
│  │   Text-to-   │       │  Audio-Video │   │
│  │    Speech    │◀──────│    Merger    │   │
│  └──────────────┘       └──────────────┘   │
│          │                     ▲           │
│          └─────────────────────┘           │
│                                            │
└────────────────────────────────────────────┘
```

## Component Details

### Client Side

1. **Upload Component**
   - Handles video file upload (limited to 15 seconds)
   - Validates file format and size
   - Provides file preview functionality

2. **Style Selector**
   - Allows users to select commentary style
   - Provides keyword input for customization
   - Generates style parameters for AI

3. **Video Preview Component**
   - Displays original and processed videos
   - Controls for playback
   - Download and share options

### Server Side

1. **Video Processor**
   - Accepts uploaded video files
   - Extracts metadata (duration, resolution)
   - Prepares video for processing

2. **Commentary Generator**
   - Uses OpenAI API to generate commentary text
   - Processes style parameters and keywords
   - Creates contextually relevant commentary

3. **Text-to-Speech Module**
   - Converts generated text to speech audio
   - Applies voice style based on user selection
   - Optimizes audio for integration

4. **Audio-Video Merger**
   - Combines original video with generated audio
   - Handles timing synchronization
   - Outputs final video with commentary

## Data Flow

1. User uploads basketball video clip
2. User selects commentary style and provides keywords
3. Video is processed and metadata extracted
4. AI generates appropriate commentary based on style and keywords
5. Text is converted to speech with selected voice style
6. Audio commentary is merged with original video
7. Final video is made available for preview and download

## Technologies

- **Frontend**: React.js, TypeScript, Material UI, Video.js
- **Backend**: Node.js, Express, FFmpeg
- **AI/ML**: OpenAI API for text generation
- **Audio**: Text-to-speech APIs (e.g., Amazon Polly, Google TTS)
- **Storage**: Cloud storage (AWS S3 or similar)
- **Deployment**: Docker, AWS/Google Cloud