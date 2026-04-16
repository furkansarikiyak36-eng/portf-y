$lines = Get-Content -Path "App.jsx" -Encoding UTF8
$keepBefore = $lines[0..14]
$keepAfter = $lines[146..($lines.Length - 1)]
$newContent = $keepBefore + $keepAfter
Set-Content -Path "App.jsx" -Value $newContent -Encoding UTF8
Write-Host "Done. Removed lines 16-147 (old inline data). New file has $($newContent.Length) lines."
