echo.
echo Starting servers...
echo   Frontend: http://localhost:3000
echo   API:      http://localhost:8000/api
echo.

start "Psychological App - API" cmd /k "cd /d "%~dp0backend" && php artisan serve --host=127.0.0.1 --port=8000"
start "Psychological App - Web" cmd /k "cd /d "%~dp0" && bun run dev"
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
