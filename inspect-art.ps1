Add-Type -AssemblyName System.Drawing
$artRoot = Join-Path $PSScriptRoot 'Erreur_de_Casting_V1_Alpha_corrigee\illustrations\brut'
$artFiles = Get-ChildItem -LiteralPath $artRoot -Filter '*.png' | Where-Object { $_.BaseName -ne 'bureau' } | Sort-Object Name
$sheet = [System.Drawing.Bitmap]::new(1000, 1400)
$graphics = [System.Drawing.Graphics]::FromImage($sheet)
$graphics.Clear([System.Drawing.Color]::White)
$font = [System.Drawing.Font]::new('Arial', 13)
$i = 0
foreach ($artFile in $artFiles) {
    $img = [System.Drawing.Image]::FromFile($artFile.FullName)
    $x = ($i % 4) * 250
    $y = [math]::Floor($i / 4) * 280
    $graphics.DrawImage($img, [int]$x, [int]$y, 250, 250)
    $graphics.DrawString($artFile.BaseName, $font, [System.Drawing.Brushes]::Black, [single]($x + 8), [single]($y + 252))
    $img.Dispose()
    $i++
}
$sheet.Save((Join-Path $PSScriptRoot 'contact-brut.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$font.Dispose()
$sheet.Dispose()
