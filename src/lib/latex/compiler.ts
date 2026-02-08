import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, readFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';

const execAsync = promisify(exec);

export interface LatexFile {
  filename: string;
  content: string;
}

export interface CompilationResult {
  success: boolean;
  pdf?: Buffer;
  error?: string;
  logs?: string;
}

/**
 * Compile LaTeX files to PDF using local Docker container (texlive/texlive:latest-basic)
 * Requires Docker to be running with texlive/texlive:latest-basic image pulled
 * 
 * @param files - Array of LaTeX files to compile
 * @param mainFile - Name of the main .tex file to compile
 * @returns Compilation result with PDF buffer
 */
export async function compileLatex(
  files: LatexFile[],
  mainFile: string = 'main.tex'
): Promise<CompilationResult> {
  let tempDir: string | null = null;
  
  try {
    if (files.length === 0) {
      return {
        success: false,
        error: 'No files provided for compilation',
      };
    }

    // Create temporary directory for LaTeX files
    const dirId = randomBytes(8).toString('hex');
    tempDir = join(tmpdir(), `latex-${dirId}`);
    await mkdir(tempDir, { recursive: true });

    // Write all LaTeX files to temp directory
    for (const file of files) {
      const filePath = join(tempDir, file.filename);
      await writeFile(filePath, file.content, 'utf-8');
      console.log(`  ✓ Written: ${file.filename} (${file.content.length} bytes)`);
    }

    console.log(`Compiling LaTeX with Docker in: ${tempDir}`);
    console.log(`Main file: ${mainFile}`);
    console.log(`Total files: ${files.length}`);

    // Run pdflatex in Docker container
    // Docker Desktop on Windows handles path conversion automatically
    // Just use forward slashes for the volume mount
    const tempDirForDocker = tempDir.replace(/\\/g, '/');
    
    // First, list files in the Docker container to verify they're all there
    const listCommand = `docker run --rm -v "${tempDirForDocker}:/data" texlive/texlive:latest ls -la /data`;
    console.log('Listing files in Docker container:');
    try {
      const { stdout: listOut } = await execAsync(listCommand, { timeout: 10000 });
      console.log(listOut);
    } catch (listErr) {
      console.warn('Could not list files:', listErr);
    }
    
    const dockerCommand = `docker run --rm -w /data -v "${tempDirForDocker}:/data" texlive/texlive:latest pdflatex -interaction=nonstopmode -output-directory=/data ${mainFile}`;
    
    console.log('Running Docker command:', dockerCommand);
    
    try {
      const { stdout, stderr } = await execAsync(dockerCommand, {
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer for logs
        timeout: 180000, // 3 minutes
      });

      console.log('LaTeX compilation stdout (last 1000 chars):', stdout.slice(-1000));
      if (stderr) {
        console.log('LaTeX compilation stderr:', stderr);
      }

      // Read the generated PDF
      const pdfFileName = mainFile.replace(/\.tex$/, '.pdf');
      const pdfPath = join(tempDir, pdfFileName);
      
      try {
        const pdfBuffer = await readFile(pdfPath);
        
        if (pdfBuffer.length < 1000) {
          return {
            success: false,
            error: 'Generated PDF is too small (compilation likely failed)',
            logs: stdout + '\n' + stderr,
          };
        }

        return {
          success: true,
          pdf: pdfBuffer,
        };
      } catch (readError: any) {
        // Check if .log file exists to get detailed error
        const logPath = pdfPath.replace('.pdf', '.log');
        let logContent = '';
        try {
          logContent = await readFile(logPath, 'utf-8');
          // Get last 2000 chars of log for error details
          logContent = logContent.slice(-2000);
        } catch {
          logContent = 'Log file not found';
        }
        
        return {
          success: false,
          error: `PDF file not generated: ${readError.message}. Log excerpt: ${logContent}`,
          logs: stdout + '\n' + stderr,
        };
      }
    } catch (execError: any) {
      // Compilation failed with error
      console.log('LaTeX compilation stdout (last 1000 chars):', execError.stdout?.slice(-1000) || 'No stdout');
      console.log('LaTeX compilation stderr:', execError.stderr || 'No stderr');
      
      // Try to read log file for detailed errors
      const logFileName = mainFile.replace(/\.tex$/, '.log');
      const logPath = join(tempDir, logFileName);
      let logContent = '';
      try {
        logContent = await readFile(logPath, 'utf-8');
        // Extract actual error from log (look for ! lines)
        const errorLines = logContent.split('\n').filter(line => line.startsWith('!'));
        if (errorLines.length > 0) {
          logContent = errorLines.join('\n') + '\n\n' + logContent.slice(-1000);
        } else {
          logContent = logContent.slice(-1500);
        }
      } catch {
        logContent = 'Log file not found';
      }
      
      return {
        success: false,
        error: `Compilation failed (exit code ${execError.code}): ${logContent}`,
        logs: (execError.stdout || '') + '\n' + (execError.stderr || ''),
      };
    }
  } catch (error: any) {
    console.error('LaTeX compilation error:', error);
    
    return {
      success: false,
      error: error?.message || 'Unknown compilation error',
      logs: error?.stdout ? error.stdout + '\n' + error.stderr : error?.message,
    };
  } finally {
    // Clean up temporary directory
    if (tempDir) {
      try {
        await rm(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Failed to clean up temp directory:', cleanupError);
      }
    }
  }
}

/**
 * Validate LaTeX files before compilation
 */
export function validateLatexFiles(files: LatexFile[], mainFile: string): {
  valid: boolean;
  error?: string;
} {
  if (files.length === 0) {
    return { valid: false, error: 'No files provided' };
  }

  // Check if main file exists in the file list
  const hasMainFile = files.some(file => file.filename === mainFile);
  if (!hasMainFile) {
    return {
      valid: false,
      error: `Main file '${mainFile}' not found in provided files`,
    };
  }

  // Check if all files have .tex or .cls extension
  const allTexFiles = files.every(file => 
    file.filename.endsWith('.tex') || file.filename.endsWith('.cls')
  );
  if (!allTexFiles) {
    return {
      valid: false,
      error: 'All files must have .tex or .cls extension',
    };
  }

  // Check for empty content
  const emptyFiles = files.filter((f) => !f.content || f.content.trim() === '');
  if (emptyFiles.length > 0) {
    return {
      valid: false,
      error: `Empty content in files: ${emptyFiles.map((f) => f.filename).join(', ')}`,
    };
  }

  return { valid: true };
}
