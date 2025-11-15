<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CertificateTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'background_image',
        'layout',
        'is_active',
    ];

    protected $casts = [
        'layout' => 'array',
        'is_active' => 'boolean',
    ];
}
