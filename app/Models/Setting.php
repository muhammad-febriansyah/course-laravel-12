<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'site_name',
        'keyword',
        'email',
        'address',
        'maps_embed_url',
        'phone',
        'desc',
        'yt',
        'ig',
        'tiktok',
        'fb',
        'logo',
        'favicon',
        'thumbnail',
        'home_thumbnail',
        'hero_title',
        'hero_subtitle',
        'hero_stat1_number',
        'hero_stat1_label',
        'hero_stat2_number',
        'hero_stat2_label',
        'hero_stat3_number',
        'hero_stat3_label',
        'hero_badge_title',
        'hero_badge_subtitle',
        'hero_active_label',
        'hero_active_value',
        'stats_students_label',
        'stats_students_value',
        'stats_students_desc',
        'stats_courses_label',
        'stats_courses_value',
        'stats_courses_desc',
        'stats_instructors_label',
        'stats_instructors_value',
        'stats_instructors_desc',
        'stats_satisfaction_label',
        'stats_satisfaction_value',
        'stats_satisfaction_desc',
        'fee',
        'mentor_fee_percentage',
    ];
}
