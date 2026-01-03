# Robot Control Interface

A React-based Robot Control Interface with Gemini AI integration for generating robotic task execution plans.

## Features

- **Task Composer**: Create robot tasks with presets, target objects, task descriptions, expected outcomes, and exception scenarios
- **AI-Powered Plan Generation**: Uses Google Gemini API to generate detailed step-by-step execution plans
- **Plan Preview**: View generated plans in both JSON and human-readable text formats
- **Execution Control**: Start, pause, and stop robot execution with real-time progress tracking
- **Event Logging**: Timestamped event log showing all system actions and status changes
- **Safety Monitoring**: Real-time status indicators for Safety Supervisor, Tool, and Vision systems

## Project Structure

```
factorySpace/
├── src/
│   ├── components/
│   │   ├── Scene/              # Scene visualization component
│   │   ├── Events/              # Event log component
│   │   ├── TaskComposer/        # Task input form component
│   │   └── PlanPreview/         # Plan display and execution controls
│   ├── services/
│   │   └── geminiApi.ts         # Gemini API integration
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   ├── utils/
│   │   └── eventLogger.ts       # Event creation utilities
│   ├── styles/
│   │   └── globals.css          # Global styles
│   ├── App.tsx                  # Main application component
│   └── main.tsx                 # Application entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Setup Instructions

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd factorySpace
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Note**: For Vite projects, environment variables must be prefixed with `VITE_` to be accessible in the browser.

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key and add it to your `.env` file

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5174`

### Building for Production

Build the application:
```bash
npm run build
```

The production build will be in the `dist` directory.

Preview the production build:
```bash
npm run preview
```

## Usage

### Creating a Task

1. **Select a Preset**: Choose from "Weld a Part", "Pick and Place", "Quality Inspection", or "Custom Task"
2. **Describe Target Object**: Enter a description of the object the robot will interact with
3. **Define Task**: Describe what the robot should do in detail
4. **Expected Outcome**: Specify what the expected result should be
5. **Exception Scenarios**: List potential error scenarios (one per line)
6. Click **Generate Plan** to create an execution plan using Gemini AI

### Executing a Plan

1. Review the generated plan in the Plan Preview section
2. Toggle between **Text** and **JSON** views to see different formats
3. Check the confirmation checkbox: "I confirm the plan, tools, and safety checks"
4. Click **Start** to begin execution
5. Monitor progress in the progress bar
6. Use **Pause** to temporarily halt execution
7. Use **STOP** to immediately stop execution

### Event Log

All actions are logged in the Events section with:
- **Time**: Timestamp (HH:MM:SS format)
- **Type**: System, User, Success, or Error
- **Message**: Description of the event

## Technology Stack

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **CSS Modules**: Scoped styling
- **Google Gemini API**: AI plan generation

## Styling

The interface uses a clean, modern white theme with:
- Subtle shadows and borders
- Smooth transitions and hover effects
- Responsive design for different screen sizes
- Clear visual hierarchy
- Accessible color contrasts

## Environment Variables

- `VITE_GEMINI_API_KEY`: Your Google Gemini API key (required)

## Development

### Linting

```bash
npm run lint
```

### Project Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## Notes

- The execution simulation runs for demonstration purposes
- The Scene component currently shows a placeholder - you can add image support later
- All form fields except "Exception scenarios" are required
- The interface is responsive and works on different screen sizes

## License

This project is for demonstration purposes.

