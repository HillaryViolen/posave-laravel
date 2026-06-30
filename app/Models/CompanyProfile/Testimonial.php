<?php

namespace App\Models\CompanyProfile;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'name',
        'position',
        'company',
        'message',
        'photo',
        'logo',
    ];
}
