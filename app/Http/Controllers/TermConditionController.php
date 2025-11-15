<?php

namespace App\Http\Controllers;

use App\Models\TermCondition;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TermConditionController extends Controller
{
    public function index()
    {
        $termCondition = TermCondition::first();

        return Inertia::render('Admin/TermCondition/Index', [
            'termCondition' => $termCondition
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        $termCondition = TermCondition::first();

        if ($termCondition) {
            $termCondition->update([
                'title' => $request->title,
                'body' => $request->body,
            ]);
        } else {
            TermCondition::create([
                'title' => $request->title,
                'body' => $request->body,
            ]);
        }

        return redirect()->back()->with('success', 'Syarat dan Ketentuan berhasil diperbarui!');
    }
}
