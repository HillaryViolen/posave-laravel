<!DOCTYPE html>
<html>

<body style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1a1a1a;">

    <h2 style="margin-bottom: 4px;">Halo, {{ $name }}!</h2>
    <p style="color: #555; margin-top: 0;">Terima kasih sudah mendaftar di Posave.</p>

    <p>Gunakan kode verifikasi berikut untuk mengaktifkan akun kamu:</p>

    <div
        style="background: #f0f4ff; border: 1px solid #c7d7fd; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
        <span
            style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #2563eb;">{{ $otp }}</span>
    </div>

    <p style="color: #555; font-size: 14px;">
        Kode ini berlaku selama <strong>10 menit</strong>.<br>
        Jangan bagikan kode ini kepada siapapun.
    </p>

    <p style="color: #aaa; font-size: 12px; margin-top: 32px;">
        Jika kamu tidak merasa mendaftar di POSave, abaikan email ini.
    </p>

</body>

</html>
