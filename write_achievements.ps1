$c = [System.IO.File]::ReadAllText('d:\PROJECTS\levelx\achievements_src.txt', [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText('d:\PROJECTS\levelx\frontend\src\pages\AchievementsPage.tsx', $c, [System.Text.Encoding]::UTF8)
