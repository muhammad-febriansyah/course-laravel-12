<?php

namespace App\Http\Controllers;

use App\Models\KebijakanPrivasi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KebijakanPrivasiController extends Controller
{
    public function index()
    {
        $kebijakanPrivasi = KebijakanPrivasi::first();

        return Inertia::render('Admin/KebijakanPrivasi/Index', [
            'kebijakanPrivasi' => $kebijakanPrivasi
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        $kebijakanPrivasi = KebijakanPrivasi::first();

        if ($kebijakanPrivasi) {
            $kebijakanPrivasi->update([
                'title' => $request->title,
                'body' => $request->body,
            ]);
        } else {
            KebijakanPrivasi::create([
                'title' => $request->title,
                'body' => $request->body,
            ]);
        }

        return redirect()->back()->with('success', 'Kebijakan Privasi berhasil diperbarui!');
    }
}
