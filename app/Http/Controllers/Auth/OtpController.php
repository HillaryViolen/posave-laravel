<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\OtpMail;
use App\Models\Auth\OtpCode;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class OtpController extends Controller
{
    private const MAX_ATTEMPTS = 3;
    private const OTP_EXPIRY_MINUTES = 10;

    // Tampilkan halaman input OTP
    public function show(Request $request)
    {
        if (!$request->session()->has('otp_email')) {
            return redirect()->route('register');
        }

        return Inertia::render('auth/verify-otp', [
            'email' => $request->session()->get('otp_email'),
        ]);
    }

    // Verifikasi kode OTP yang diinput user
    public function verify(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $email = $request->session()->get('otp_email');

        if (!$email) {
            return redirect()->route('register');
        }

        // Cari OTP yang masih aktif untuk email ini
        $otp = OtpCode::active($email)->latest()->first();

        // Kalau nggak ada OTP aktif sama sekali
        if (!$otp) {
            return back()->withErrors([
                'code' => 'Kode OTP sudah kadaluarsa atau tidak valid. Silakan minta kode baru.',
            ]);
        }

        // Verifikasi kode pakai Hash::check (karena yang disimpan itu hash-nya)
        if (!Hash::check($request->code, $otp->code)) {
            // Increment attempts
            $otp->increment('attempts');

            $remainingAttempts = self::MAX_ATTEMPTS - $otp->attempts;

            if ($remainingAttempts <= 0) {
                // Attempts habis — hanguskan OTP ini
                $otp->update(['is_used' => true]);

                return back()->withErrors([
                    'code' => 'Kode OTP sudah tidak valid karena terlalu banyak percobaan. Silakan minta kode baru.',
                ]);
            }

            return back()->withErrors([
                'code' => "Kode OTP salah. Sisa percobaan: {$remainingAttempts}x.",
            ]);
        }

        // Kode benar — tandai sebagai sudah dipakai
        $otp->update(['is_used' => true]);

        // Tandai email user sebagai verified
        $user = User::where('email', $email)->firstOrFail();
        $user->markEmailAsVerified();

        // Hapus session OTP
        $request->session()->forget('otp_email');

        // Login dan redirect ke onboarding
        Auth::login($user);

        return redirect()->route('onboarding');
    }

    // Kirim ulang OTP
    public function resend(Request $request)
    {
        $email = $request->session()->get('otp_email');

        if (!$email) {
            return redirect()->route('register');
        }

        $user = User::where('email', $email)->firstOrFail();

        self::sendOtp($email, $user->name);

        return back()->with('success', 'Kode OTP baru telah dikirim ke email kamu.');
    }

    // Helper: generate, hash, dan kirim OTP
    public static function sendOtp(string $email, string $name): void
    {
        // Hapus semua OTP lama yang belum dipakai untuk email ini
        OtpCode::where('email', $email)->where('is_used', false)->delete();

        // Generate kode 6 digit (padded biar selalu 6 karakter, misal "007823")
        $plainCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        OtpCode::create([
            'email'      => $email,
            'code'       => Hash::make($plainCode), // simpan hash, bukan plain text
            'expires_at' => now()->addMinutes(self::OTP_EXPIRY_MINUTES),
            'attempts'   => 0,
        ]);

        // Kirim kode ASLI (plain) ke email user — bukan hash-nya
        Mail::to($email)->send(new OtpMail($plainCode, $name));
    }
}
