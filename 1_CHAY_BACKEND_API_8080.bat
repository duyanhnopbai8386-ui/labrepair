@echo off
chcp 65001 > nul
title [PORT 8080] LabRepair - Backend Spring Boot REST API
color 0B
echo ========================================================
echo   HE THONG LABREPAIR - KHOI DONG BACKEND API (PORT 8080)
echo   Sinh vien: Le Nguyen Ngoc Duy Anh - MSSV: 2124110340
echo ========================================================
echo.
echo [!] Luu y: Hay dam bao ban da bat Start MySQL trong XAMPP hoac Laragon!
echo.

cd /d "D:\labrepair\labrepair"

if exist "target\labrepair-0.0.1-SNAPSHOT.jar" (
    echo [*] Dang khoi chay file JAR tren cong 8080...
    java -jar target\labrepair-0.0.1-SNAPSHOT.jar
) else (
    echo [*] Dang khoi chay bang Maven Wrapper tren cong 8080...
    call .\mvnw.cmd spring-boot:run
)

pause
