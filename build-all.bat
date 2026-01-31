@echo off
REM PRISM - Build All Plugins (Windows)
REM ====================================

echo ==================================================================
echo                     PRISM Build System
echo          Formally Verified Color Themes for Every Editor
echo ==================================================================
echo.

REM Create dist directory
if not exist dist mkdir dist

REM ============================================================================
REM 1. VSCode Static Themes
REM ============================================================================
echo.
echo ------------------------------------------------------------------
echo [1/3] Building: VSCode Static Themes
echo ------------------------------------------------------------------

cd prism-vscode-final
if not exist media\icon.png (
    echo [ERROR] media/icon.png missing!
    exit /b 1
)

call node node_modules\@vscode\vsce\vsce package -o ..\dist\prism-themes-vscode.vsix --no-dependencies
if errorlevel 1 (
    echo [info] Installing vsce...
    call npm install @vscode/vsce
    call node node_modules\@vscode\vsce\vsce package -o ..\dist\prism-themes-vscode.vsix --no-dependencies
)
echo [ok] Created: dist/prism-themes-vscode.vsix
cd ..

REM ============================================================================
REM 2. VSCode 211 Generator
REM ============================================================================
echo.
echo ------------------------------------------------------------------
echo [2/3] Building: VSCode 211 Generator
echo ------------------------------------------------------------------

cd vscode-prism\vscode-prism-theme-generator

if not exist node_modules (
    echo [info] Installing dependencies...
    call npm install
)

echo [info] Compiling TypeScript...
call node node_modules\typescript\bin\tsc -p ./

call node node_modules\@vscode\vsce\vsce package -o ..\..\dist\prism-generator-1.0.0.vsix --no-dependencies
echo [ok] Created: dist/prism-generator-1.0.0.vsix
cd ..\..

REM ============================================================================
REM 3. Cursor IDE
REM ============================================================================
echo.
echo ------------------------------------------------------------------
echo [3/3] Building: Cursor IDE Themes
echo ------------------------------------------------------------------

cd cursor-prism
if not exist media\icon.png (
    echo [ERROR] media/icon.png missing!
    exit /b 1
)

call node node_modules\@vscode\vsce\vsce package -o ..\dist\prism-themes-cursor.vsix --no-dependencies
if errorlevel 1 (
    call npm install @vscode/vsce
    call node node_modules\@vscode\vsce\vsce package -o ..\dist\prism-themes-cursor.vsix --no-dependencies
)
echo [ok] Created: dist/prism-themes-cursor.vsix
cd ..

REM ============================================================================
REM Summary
REM ============================================================================
echo.
echo ==================================================================
echo                       BUILD COMPLETE
echo ==================================================================
echo.
echo VSCode Extensions (dist/):
dir /b dist\*.vsix
echo.
echo To install:
echo    code --install-extension dist\prism-themes-vscode.vsix
echo    code --install-extension dist\prism-generator-1.0.0.vsix
echo    cursor --install-extension dist\prism-themes-cursor.vsix
echo.
