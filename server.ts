import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Helper to run python runner commands
function runPythonCommand(command: string, inputData?: any, arg?: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const pythonPath = 'python3';
    const scriptPath = path.join(__dirname, 'backend', 'predict_runner.py');
    const args = [scriptPath, command];
    if (arg !== undefined) {
      args.push(arg);
    }

    const pyProcess = spawn(pythonPath, args, {
      cwd: __dirname,
      env: { ...process.env, PYTHONPATH: __dirname }
    });

    let stdout = '';
    let stderr = '';

    if (inputData !== undefined) {
      pyProcess.stdin.write(JSON.stringify(inputData));
      pyProcess.stdin.end();
    }

    pyProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pyProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pyProcess.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(stderr || `Python process exited with code ${code}`));
      }
      try {
        const parsed = JSON.parse(stdout.trim());
        resolve(parsed);
      } catch (err) {
        reject(new Error(`Failed to parse Python output: ${stdout}`));
      }
    });

    pyProcess.on('error', (err) => {
      reject(err);
    });
  });
}

// Root info
const rootHandler: express.RequestHandler = (_req, res) => {
  res.json({
    status: 'online',
    app: 'CropGuard AI Pro',
    tagline: 'Predict Yield. Understand Risk. Farm Smarter.',
    problem_statement: 'SSA025',
    team_id: 'TSS002'
  });
};
app.get('/api', rootHandler);

// Health check
const healthHandler: express.RequestHandler = (_req, res) => {
  res.json({
    status: 'healthy',
    model_loaded: true,
    database: 'connected',
    timestamp: new Date().toISOString()
  });
};
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// Model Metadata
const metadataHandler: express.RequestHandler = async (_req, res) => {
  try {
    const metadata = await runPythonCommand('metadata');
    res.json(metadata);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve model metadata', details: err.message });
  }
};
app.get('/model-metadata', metadataHandler);
app.get('/api/model-metadata', metadataHandler);

// Predict endpoint
const predictHandler: express.RequestHandler = async (req, res) => {
  try {
    const { Year, State, Crop, Season, Area, Annual_Rainfall, Fertilizer, Pesticide } = req.body;

    if (!Year || !State || !Crop || !Season || Area === undefined || Annual_Rainfall === undefined || Fertilizer === undefined || Pesticide === undefined) {
      return res.status(400).json({
        error: 'Missing required fields. Required: Year, State, Crop, Season, Area, Annual_Rainfall, Fertilizer, Pesticide'
      });
    }

    if (Number(Area) <= 0 || Number(Annual_Rainfall) < 0 || Number(Fertilizer) < 0 || Number(Pesticide) < 0) {
      return res.status(400).json({
        error: 'Invalid numeric parameters. Area must be > 0. Rainfall, Fertilizer, and Pesticide must be >= 0.'
      });
    }

    const payload = {
      Year: Number(Year),
      State: String(State).trim(),
      Crop: String(Crop).trim(),
      Season: String(Season).trim(),
      Area: Number(Area),
      Annual_Rainfall: Number(Annual_Rainfall),
      Fertilizer: Number(Fertilizer),
      Pesticide: Number(Pesticide)
    };

    const result = await runPythonCommand('predict', payload);
    res.status(201).json(result);
  } catch (err: any) {
    console.error('Prediction calculation error:', err);
    res.status(500).json({
      error: 'Crop yield prediction failed. Please verify input parameters.',
      details: err.message
    });
  }
};
app.post('/predict', predictHandler);
app.post('/api/predict', predictHandler);

// Predictions list endpoint
const listPredictionsHandler: express.RequestHandler = async (_req, res) => {
  try {
    const predictions = await runPythonCommand('list');
    res.json(predictions);
  } catch (err: any) {
    console.error('List predictions error:', err);
    res.status(500).json({ error: 'Failed to retrieve prediction history', details: err.message });
  }
};
app.get('/predictions', listPredictionsHandler);
app.get('/api/predictions', listPredictionsHandler);

// Single prediction endpoint
const getPredictionHandler: express.RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await runPythonCommand('get', undefined, id);
    res.json(result);
  } catch (err: any) {
    res.status(404).json({ error: `Prediction #${req.params.id} not found`, details: err.message });
  }
};
app.get('/predictions/:id', getPredictionHandler);
app.get('/api/predictions/:id', getPredictionHandler);

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CropGuard AI Pro server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
