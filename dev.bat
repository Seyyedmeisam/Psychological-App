@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo.
echo === Psychological App - Dev ===
echo.

if not exist ".env" (
  if not exist ".env.example" (
    echo Missing .env.example
    exit /b 1
  )
  copy /Y ".env.example" ".env" >nul
  echo Created .env
)

if not exist "backend\.env" (
  if not exist "backend\.env.example" (
    echo Missing backend\.env.example
    exit /b 1
  )
  copy /Y "backend\.env.example" "backend\.env" >nul
  echo Created backend\.env
)

if not exist "backend\database" mkdir "backend\database"
if not exist "backend\database\database.sqlite" (
  type nul > "backend\database\database.sqlite"
  echo Created backend\database\database.sqlite
)

echo.
echo Installing frontend dependencies...
call bun install
if errorlevel 1 goto error

echo.
echo Installing backend dependencies...
pushd backend
call composer install
if errorlevel 1 goto error_pop

findstr /R /C:"^APP_KEY=$" .env >nul
if not errorlevel 1 (
  echo Generating APP_KEY...
  call php artisan key:generate
  if errorlevel 1 goto error_pop
)

echo.
echo Running migrations...
call php artisan migrate --force
if errorlevel 1 goto error_pop

echo.
echo Seeding database...
call php artisan db:seed --force
if errorlevel 1 goto error_pop
popd

echo.
echo Compiling i18n...
call bun run i18n:compile
if errorlevel 1 goto error

if /I "%~1"=="setup" goto done

echo.
echo Starting servers...
echo   Frontend: http://localhost:3000
echo   API:      http://localhost:8000/api
echo.

start "Psychological App - API" cmd /k "cd /d "%~dp0backend" && php artisan serve --host=127.0.0.1 --port=8000"
start "Psychological App - Web" cmd /k "cd /d "%~dp0" && bun --bun vite dev --port 3000"
goto done

:error_pop
popd

:error
echo.
echo Dev setup failed.
exit /b 1

:done
echo.
echo Done.
exit /b 0
